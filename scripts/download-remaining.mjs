import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

const root = 'C:/Users/Pico/Documents/Projects-Reframe/fisheye';
const imgDir = path.join(root, 'source-mirror/images');
const pagesDir = path.join(root, 'source-mirror/pages');
const publicDir = path.join(root, 'public/images/projects');
const dataDir = path.join(root, 'source-mirror/data');
fs.mkdirSync(imgDir, { recursive: true });
fs.mkdirSync(pagesDir, { recursive: true });
fs.mkdirSync(publicDir, { recursive: true });
fs.mkdirSync(dataDir, { recursive: true });

const portfolio = JSON.parse(
  fs.readFileSync(path.join(dataDir, 'portfolio-live.json'), 'utf8')
);

function fetchBuf(url, redirects = 0) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    const req = lib.get(
      url,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        },
      },
      (res) => {
        if (
          res.statusCode >= 300 &&
          res.statusCode < 400 &&
          res.headers.location &&
          redirects < 8
        ) {
          const next = new URL(res.headers.location, url).href;
          return fetchBuf(next, redirects + 1).then(resolve, reject);
        }
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () =>
          resolve({
            status: res.statusCode,
            buf: Buffer.concat(chunks),
            type: res.headers['content-type'] || '',
            finalUrl: url,
          })
        );
      }
    );
    req.on('error', reject);
    req.setTimeout(60000, () => req.destroy(new Error('timeout')));
  });
}

function slugify(u) {
  return u.replace(/^https?:\/\//, '').replace(/[^\w.-]+/g, '_').slice(0, 180);
}

function cleanImgUrl(u) {
  return u
    .replace(/&amp;/g, '&')
    .replace(/\/-\/resize[^/]*\//, '/')
    .replace(/\/-\/format[^/]*\//, '/')
    .replace(/\/-\/empty\//, '/')
    .replace(/\/-\/resizeb\/[^/]+\//, '/')
    .replace('thb.tildacdn.com', 'static.tildacdn.com')
    .split('?')[0];
}

async function saveImage(url) {
  const clean = cleanImgUrl(url);
  if (!/tildacdn\.(com|pro)/i.test(clean)) return null;
  if (/logo|icon|pngwing|favicon|svg/i.test(clean) && !/project|interior|fisheye_/i.test(clean)) {
    // still allow logos separately
  }
  const m = clean.match(/\.(jpe?g|png|webp|gif|JPG|JPEG|PNG|WEBP)$/);
  const ext = (m ? m[1] : 'jpg').toLowerCase().replace('jpeg', 'jpg');
  const name = `${slugify(clean)}.${ext}`;
  const dest = path.join(imgDir, name);
  if (fs.existsSync(dest) && fs.statSync(dest).size > 5000) {
    return { file: name, path: dest, url: clean, cached: true };
  }
  try {
    const r = await fetchBuf(clean);
    if (r.status !== 200 || r.buf.length < 2000) return null;
    fs.writeFileSync(dest, r.buf);
    return { file: name, path: dest, url: clean, bytes: r.buf.length };
  } catch {
    return null;
  }
}

function extractImages(html) {
  const set = new Set();
  const re =
    /https?:\/\/(?:static|thb|up|optim)\.tildacdn\.(?:com|pro)\/[^"' )\s]+/gi;
  for (const m of html.matchAll(re)) set.add(cleanImgUrl(m[0]));
  const re2 =
    /(?:data-original|data-img|data-original-image|data-content-cover-bg)=["']([^"']+)["']/gi;
  let mm;
  while ((mm = re2.exec(html))) {
    let u = mm[1].replace(/&amp;/g, '&');
    if (u.startsWith('//')) u = `https:${u}`;
    if (u.startsWith('http')) set.add(cleanImgUrl(u));
  }
  return [...set];
}

function cleanText(s) {
  return s
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const projects = [];
let imgOk = 0;
let imgFail = 0;

for (const item of portfolio.projects) {
  console.log('\n===', item.path);
  const pageUrls = [
    `https://fisheye-interior.com/${item.path}`,
    `https://www.fisheye-interior.com/${item.path}`,
  ];
  let html = null;
  let okUrl = null;
  for (const u of pageUrls) {
    try {
      const r = await fetchBuf(u);
      const text = r.buf.toString('utf8');
      const h1 = cleanText((text.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1] || '');
      if (r.status === 200 && !/404 not found/i.test(h1) && text.length > 5000) {
        html = text;
        okUrl = u;
        break;
      }
      console.log('  page status', r.status, h1.slice(0, 40), u);
    } catch (e) {
      console.log('  page fail', e.message, u);
    }
  }

  const lines = (item.text || '').split('\n').map((s) => s.trim()).filter(Boolean);
  const title = lines[0] || item.path;
  const summary = lines[1] || lines[0] || '';

  const imageUrls = new Set();
  if (item.src) imageUrls.add(cleanImgUrl(item.src));
  if (html) {
    fs.writeFileSync(path.join(pagesDir, `${item.path}.html`), html);
    for (const u of extractImages(html)) imageUrls.add(u);
    console.log('  saved page', okUrl, 'imgs in html', imageUrls.size);
  } else {
    console.log('  NO PAGE: using cover only');
  }

  const gallery = [];
  let n = 0;
  for (const u of imageUrls) {
    if (/logo|icon|pngwing|favicon|\.svg$/i.test(u)) continue;
    const saved = await saveImage(u);
    if (!saved) {
      imgFail += 1;
      continue;
    }
    imgOk += 1;
    n += 1;
    const ext = path.extname(saved.file);
    const pubName = `${item.path.replace(/_/g, '-')}-${String(n).padStart(2, '0')}${ext}`;
    const pubPath = path.join(publicDir, pubName);
    fs.copyFileSync(saved.path, pubPath);
    gallery.push(`/images/projects/${pubName}`);
  }

  // ensure cover from listing even if page missing
  if (!gallery.length && item.src) {
    const saved = await saveImage(item.src);
    if (saved) {
      const ext = path.extname(saved.file);
      const pubName = `${item.path.replace(/_/g, '-')}-01${ext}`;
      fs.copyFileSync(saved.path, path.join(publicDir, pubName));
      gallery.push(`/images/projects/${pubName}`);
      imgOk += 1;
    }
  }

  let description = summary;
  if (html) {
    description =
      cleanText(
        (html.match(/name=["']description["'][^>]*content=["']([^"']+)/i) ||
          html.match(/content=["']([^"']+)["'][^>]*name=["']description["']/i) ||
          [])[1] || summary
      ).slice(0, 500) || summary;
  }

  const locGuess = /marbella|malaga|málaga/i.test(item.path + title + summary)
    ? /malaga|málaga|miradores/i.test(item.path + title)
      ? 'Málaga'
      : 'Marbella'
    : /moskow|moscow/i.test(item.path)
      ? 'Moscow'
      : /odessa/i.test(item.path)
        ? 'Odessa'
        : /clinic/i.test(item.path)
          ? 'Studio project'
          : 'Saint Petersburg';

  projects.push({
    slug: item.path.replace(/_/g, '-'),
    sourceSlug: item.path,
    title: title.replace(/:.*/, '').trim() || title,
    location: locGuess,
    summary: summary.slice(0, 280),
    description,
    cover: gallery[0] || null,
    gallery,
    hasFullPage: Boolean(html),
  });
  console.log('  gallery', gallery.length);
}

fs.writeFileSync(
  path.join(root, 'src/content/projects.json'),
  JSON.stringify(projects, null, 2)
);
fs.writeFileSync(
  path.join(dataDir, 'projects-full.json'),
  JSON.stringify(projects, null, 2)
);
console.log('\nDONE projects', projects.length, 'imgOk', imgOk, 'imgFail', imgFail);
console.log(
  'with pages',
  projects.filter((p) => p.hasFullPage).length,
  'cover-only',
  projects.filter((p) => !p.hasFullPage).length
);
