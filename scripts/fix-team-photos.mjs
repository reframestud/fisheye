import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

const root = 'C:/Users/Pico/Documents/Projects-Reframe/fisheye';
const aboutHtml = fs.readFileSync(path.join(root, 'source-mirror/pages/about.html'), 'utf8');
const imgDir = path.join(root, 'source-mirror/images');
const teamPublic = path.join(root, 'public/images/team');
fs.mkdirSync(teamPublic, { recursive: true });

function fetchBuf(url, redirects = 0) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    const req = lib.get(
      url,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        },
      },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && redirects < 8) {
          return fetchBuf(new URL(res.headers.location, url).href, redirects + 1).then(resolve, reject);
        }
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => resolve({ status: res.statusCode, buf: Buffer.concat(chunks) }));
      }
    );
    req.on('error', reject);
    req.setTimeout(45000, () => req.destroy(new Error('timeout')));
  });
}

function cleanImgUrl(u) {
  return u
    .replace(/&amp;/g, '&')
    .replace(/\/-\/[^/]+\//g, '/') // remove ALL tilda transform segments
    .replace(/\/\d+x\//g, '/')
    .replace('thb.tildacdn.com', 'static.tildacdn.com')
    .split('?')[0];
}

function cleanText(s) {
  return s.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
}

function slugifyName(n) {
  return n
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function download(url, destAbs) {
  const clean = cleanImgUrl(url);
  const r = await fetchBuf(clean);
  if (r.status !== 200 || r.buf.length < 1500) {
    console.log('FAIL', r.status, clean);
    return false;
  }
  // skip css/js mistaken as images
  const head = r.buf.slice(0, 20).toString('utf8');
  if (/^(var |function|\.|@|\/\*|<|\{)/.test(head) || head.includes('{')) {
    // might still be png binary - check magic
  }
  const isJpeg = r.buf[0] === 0xff && r.buf[1] === 0xd8;
  const isPng = r.buf[0] === 0x89 && r.buf[1] === 0x50;
  const isWebp = r.buf.slice(0, 4).toString() === 'RIFF';
  if (!isJpeg && !isPng && !isWebp) {
    console.log('SKIP non-image', clean.slice(-40));
    return false;
  }
  fs.writeFileSync(destAbs, r.buf);
  const mirror = path.join(imgDir, path.basename(destAbs));
  fs.copyFileSync(destAbs, mirror);
  console.log('OK', path.basename(destAbs), r.buf.length);
  return true;
}

// Split about into person cards: t545 blocks and t-card/img+name patterns
const people = [];

// Founder block (t545)
const founderMatch = aboutHtml.match(
  /itemprop="image"\s+content="(https:\/\/[^"]+)"[\s\S]{0,800}?Aleksandr Kuznetsov[\s\S]{0,400}?Head and founder([\s\S]{0,600}?)<\/div>/i
);
if (founderMatch) {
  people.push({
    name: 'Aleksandr Kuznetsov',
    role: 'Head and founder',
    note: 'Politecnico di Milano · 15+ years · 200+ completed projects',
    img: founderMatch[1],
  });
} else {
  // fallback known path from earlier scrape
  people.push({
    name: 'Aleksandr Kuznetsov',
    role: 'Head and founder',
    note: 'Politecnico di Milano · 15+ years · 200+ completed projects',
    img: 'https://static.tildacdn.com/tild6135-3330-4339-b735-386161616361/noroot.png',
  });
}

// Card pattern: data-original image then t-name then t-descr nearby
const cardRe =
  /(?:data-original|itemprop="image"\s+content)=["'](https:\/\/static\.tildacdn\.com\/tild[^"']+\.(?:jpe?g|png|webp))["'][\s\S]{0,1500}?(?:t-name|t545__title|t-heading)[^>]*>[\s\S]*?(?:<div[^>]*>)?\s*([A-Za-z][A-Za-z .'-]{1,40})\s*(?:<\/div>)?[\s\S]{0,500}?(?:t-descr|t545__descr)[^>]*>[\s\S]*?(?:<div[^>]*>)?\s*([\s\S]*?)\s*(?:<\/div>)/gi;

let m;
while ((m = cardRe.exec(aboutHtml))) {
  const img = cleanImgUrl(m[1]);
  const name = cleanText(m[2]);
  const roleRaw = cleanText(m[3]);
  if (!name || /fisheye|customers|we are|about/i.test(name)) continue;
  if (people.some((p) => p.name.toLowerCase() === name.toLowerCase() && p.img === img)) continue;
  // skip duplicate names with same role prefix unless different person entries intended
  const role = roleRaw
    .replace(/\s+/g, ' ')
    .replace(/(\d+)-year experience/i, '· $1 years')
    .slice(0, 140);
  people.push({ name, role: role.split(' ').slice(0, 8).join(' '), note: role, img });
}

console.log('people', people.length);
for (const p of people) console.log('-', p.name, p.role.slice(0, 40));

const team = [];
let i = 0;
for (const p of people) {
  i += 1;
  const slug = slugifyName(p.name);
  const ext = (p.img.match(/\.(jpe?g|png|webp)/i) || ['', 'jpg'])[1].toLowerCase().replace('jpeg', 'jpg');
  const file = `${String(i).padStart(2, '0')}-${slug}.${ext}`;
  const dest = path.join(teamPublic, file);
  const ok = await download(p.img, dest);
  if (!ok) continue;
  team.push({
    name: p.name,
    role: p.role.includes('founder') ? 'Head and founder' : p.role.replace(/Environmental Design|Architecture|Interior Design|Interiors and Equipment|Civil enineering/gi, (x) => x).slice(0, 80),
    note: p.note || p.role,
    photo: `/images/team/${file}`,
  });
}

// Deduplicate by name keeping first (founder first)
const seen = new Set();
const deduped = [];
for (const t of team) {
  const key = t.name.toLowerCase();
  if (seen.has(key)) {
    // allow second Julie/Alina with different photos - use name+role
    const key2 = `${key}|${t.role}`;
    if (seen.has(key2)) continue;
    seen.add(key2);
    deduped.push({ ...t, name: t.name }); // keep both Julies with same name as live site
  } else {
    seen.add(key);
    seen.add(`${key}|${t.role}`);
    deduped.push(t);
  }
}

fs.writeFileSync(path.join(root, 'src/content/team.json'), JSON.stringify(deduped, null, 2));
fs.writeFileSync(path.join(root, 'source-mirror/data/team.json'), JSON.stringify({ team: deduped }, null, 2));
console.log('wrote team.json', deduped.length);
