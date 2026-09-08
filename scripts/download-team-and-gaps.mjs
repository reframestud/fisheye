import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

const root = 'C:/Users/Pico/Documents/Projects-Reframe/fisheye';
const imgDir = path.join(root, 'source-mirror/images');
const pagesDir = path.join(root, 'source-mirror/pages');
const teamPublic = path.join(root, 'public/images/team');
const projectPublic = path.join(root, 'public/images/projects');
fs.mkdirSync(imgDir, { recursive: true });
fs.mkdirSync(teamPublic, { recursive: true });
fs.mkdirSync(projectPublic, { recursive: true });

function fetchBuf(url, redirects = 0) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    const req = lib.get(
      url,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
          Accept: '*/*',
          'Accept-Language': 'en-US,en;q=0.9',
        },
      },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && redirects < 8) {
          return fetchBuf(new URL(res.headers.location, url).href, redirects + 1).then(resolve, reject);
        }
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () =>
          resolve({ status: res.statusCode, buf: Buffer.concat(chunks), type: res.headers['content-type'] || '' })
        );
      }
    );
    req.on('error', reject);
    req.setTimeout(60000, () => req.destroy(new Error('timeout')));
  });
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

function slugify(u) {
  return u.replace(/^https?:\/\//, '').replace(/[^\w.-]+/g, '_').slice(0, 160);
}

async function saveImage(url, destDir, preferredName) {
  const clean = cleanImgUrl(url);
  const m = clean.match(/\.(jpe?g|png|webp|gif)/i);
  const ext = (m ? m[1] : 'jpg').toLowerCase().replace('jpeg', 'jpg');
  const name = preferredName || `${slugify(clean)}.${ext}`;
  const mirrorName = `${slugify(clean)}.${ext}`;
  const mirrorPath = path.join(imgDir, mirrorName);
  const destPath = path.join(destDir, name);

  if (!fs.existsSync(mirrorPath) || fs.statSync(mirrorPath).size < 3000) {
    const r = await fetchBuf(clean);
    if (r.status !== 200 || r.buf.length < 2000) {
      console.log('FAIL img', r.status, clean.slice(0, 80));
      return null;
    }
    fs.writeFileSync(mirrorPath, r.buf);
  }
  fs.copyFileSync(mirrorPath, destPath);
  return { publicPath: `/images/${path.basename(destDir)}/${name}`, mirror: mirrorName, bytes: fs.statSync(mirrorPath).size };
}

function extractImages(html) {
  const set = new Set();
  for (const m of html.matchAll(/https?:\/\/(?:static|thb|up|optim)\.tildacdn\.(?:com|pro)\/[^"' )\s]+/gi)) {
    set.add(cleanImgUrl(m[0]));
  }
  const re2 = /(?:data-original|data-img|data-original-image|data-content-cover-bg)=["']([^"']+)["']/gi;
  let mm;
  while ((mm = re2.exec(html))) {
    let u = mm[1].replace(/&amp;/g, '&');
    if (u.startsWith('//')) u = `https:${u}`;
    if (u.startsWith('http')) set.add(cleanImgUrl(u));
  }
  return [...set];
}

function cleanText(s) {
  return s.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}

// --- ABOUT / TEAM ---
console.log('=== ABOUT / TEAM ===');
const aboutRes = await fetchBuf('https://fisheye-interior.com/about');
const aboutHtml = aboutRes.buf.toString('utf8');
fs.writeFileSync(path.join(pagesDir, 'about.html'), aboutHtml);
console.log('about status', aboutRes.status, 'len', aboutHtml.length);

const aboutImgs = extractImages(aboutHtml).filter(
  (u) => !/logo|icon|pngwing|favicon|\.svg$/i.test(u)
);
console.log('about images found', aboutImgs.length);

// Heuristic: team photos are often portrait-ish files near person blocks.
// Parse t-col blocks with img + name text.
const teamMembers = [];
const blockRe =
  /<(?:div|li)[^>]*(?:t-col|t396|t-item|t-card)[^>]*>[\s\S]*?<\/(?:div|li)>/gi;
// Simpler: find img data-original followed within 800 chars by a name-like heading
const pairRe =
  /data-original=["'](https:\/\/[^"']+)["'][\s\S]{0,1200}?<div[^>]*class="[^"]*t-name[^"]*"[^>]*>([\s\S]*?)<\/div>[\s\S]{0,400}?<div[^>]*class="[^"]*t-descr[^"]*"[^>]*>([\s\S]*?)<\/div>/gi;

let pm;
while ((pm = pairRe.exec(aboutHtml))) {
  const img = cleanImgUrl(pm[1]);
  const name = cleanText(pm[2]);
  const role = cleanText(pm[3]);
  if (!name || name.length < 2 || name.length > 60) continue;
  if (/logo|WE ARE|FISHEYE/i.test(name)) continue;
  teamMembers.push({ name, role: role.slice(0, 120), img });
}

// Fallback pairs: img then nearby text fields
if (teamMembers.length < 3) {
  const loose =
    /(?:data-original|src)=["'](https:\/\/static\.tildacdn\.com\/tild[^"']+\.(?:jpe?g|png|webp))["'][\s\S]{0,2000}?(?:t-name|t-title)[^>]*>([\s\S]*?)<\/(?:div|h[1-6]|span)>/gi;
  let lm;
  while ((lm = loose.exec(aboutHtml))) {
    const img = cleanImgUrl(lm[1]);
    const name = cleanText(lm[2]);
    if (!name || name.length < 2 || name.length > 40) continue;
    if (/logo|about|team|fisheye|we are|customers/i.test(name)) continue;
    if (teamMembers.some((t) => t.name === name)) continue;
    teamMembers.push({ name, role: '', img });
  }
}

console.log('team parsed', teamMembers.length);
for (const t of teamMembers) console.log(' -', t.name, '|', t.role.slice(0, 50), '|', t.img.split('/').pop());

const teamOut = [];
let i = 0;
for (const t of teamMembers) {
  i += 1;
  const slug = t.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const saved = await saveImage(t.img, teamPublic, `${String(i).padStart(2, '0')}-${slug}.jpg`);
  if (!saved) continue;
  teamOut.push({
    name: t.name,
    role: t.role || 'Team',
    note: t.role || '',
    photo: saved.publicPath,
  });
}

// Also dump all non-logo about images as team-pool for manual mapping
const pool = [];
let p = 0;
for (const u of aboutImgs) {
  p += 1;
  const saved = await saveImage(u, teamPublic, `pool-${String(p).padStart(2, '0')}.jpg`);
  if (saved) pool.push({ url: u, photo: saved.publicPath });
}

fs.writeFileSync(
  path.join(root, 'source-mirror/data/team.json'),
  JSON.stringify({ team: teamOut, pool, aboutImgCount: aboutImgs.length }, null, 2)
);
console.log('team saved', teamOut.length, 'pool', pool.length);

// --- HOMEPAGE images too ---
console.log('\n=== HOME ===');
const homeRes = await fetchBuf('https://fisheye-interior.com/');
fs.writeFileSync(path.join(pagesDir, 'index.html'), homeRes.buf.toString('utf8'));
const homeImgs = extractImages(homeRes.buf.toString('utf8')).filter((u) => !/logo|icon|pngwing|favicon|\.svg$/i.test(u));
console.log('home images', homeImgs.length);
const homePublic = path.join(root, 'public/images/home');
fs.mkdirSync(homePublic, { recursive: true });
let h = 0;
for (const u of homeImgs.slice(0, 40)) {
  h += 1;
  await saveImage(u, homePublic, `home-${String(h).padStart(2, '0')}.jpg`);
}

// --- Thin project pages: try alternate hosts / paths ---
console.log('\n=== THIN PROJECTS ===');
const projects = JSON.parse(fs.readFileSync(path.join(root, 'src/content/projects.json'), 'utf8'));
const thin = projects.filter((p) => !p.gallery || p.gallery.length <= 1);
console.log('thin projects', thin.length);

for (const proj of thin) {
  const slug = proj.sourceSlug || proj.slug.replace(/-/g, '_');
  const urls = [
    `https://fisheye-interior.com/${slug}`,
    `https://www.fisheye-interior.com/${slug}`,
    `https://fisheye-interior.ru/${slug}`,
  ];
  let html = null;
  for (const u of urls) {
    try {
      const r = await fetchBuf(u);
      const text = r.buf.toString('utf8');
      const h1 = cleanText((text.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1] || '');
      if (r.status === 200 && !/404/i.test(h1) && text.length > 8000) {
        html = text;
        console.log('  got', proj.slug, 'via', u, 'len', text.length);
        fs.writeFileSync(path.join(pagesDir, `${slug}.html`), text);
        break;
      }
    } catch (e) {
      /* continue */
    }
  }
  if (!html) {
    console.log('  still missing page', proj.slug);
    continue;
  }
  const imgs = extractImages(html).filter((u) => !/logo|icon|pngwing|favicon|\.svg$/i.test(u));
  const gallery = [...(proj.gallery || [])];
  let n = gallery.length;
  for (const u of imgs) {
    const extMatch = u.match(/\.(jpe?g|png|webp)/i);
    const ext = (extMatch ? extMatch[1] : 'jpg').toLowerCase().replace('jpeg', 'jpg');
    n += 1;
    const name = `${proj.slug}-${String(n).padStart(2, '0')}.${ext}`;
    const saved = await saveImage(u, projectPublic, name);
    if (saved) gallery.push(saved.publicPath.replace('/images/projects/', '/images/projects/'));
    // saveImage already wrote to projectPublic with preferred name
    if (saved && !gallery.includes(`/images/projects/${name}`)) {
      gallery.push(`/images/projects/${name}`);
    } else if (saved) {
      /* already */
    }
  }
  // rebuild gallery uniquely
  const uniq = [...new Set(gallery.filter(Boolean))];
  proj.gallery = uniq;
  proj.cover = uniq[0] || proj.cover;
  proj.hasFullPage = true;
  proj.description =
    cleanText(
      (html.match(/name=["']description["'][^>]*content=["']([^"']+)/i) || [])[1] || proj.description || ''
    ).slice(0, 500) || proj.description;
  console.log('  gallery now', proj.slug, uniq.length);
}

fs.writeFileSync(path.join(root, 'src/content/projects.json'), JSON.stringify(projects, null, 2));
console.log('\nDONE projects', projects.length, 'avg gallery', Math.round(projects.reduce((a, p) => a + (p.gallery?.length || 0), 0) / projects.length));
