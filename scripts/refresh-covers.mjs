import fs from 'fs';
import path from 'path';
import https from 'https';

const root = 'C:/Users/Pico/Documents/Projects-Reframe/fisheye';
const projects = JSON.parse(fs.readFileSync(path.join(root, 'src/content/projects.json'), 'utf8'));
const portfolio = JSON.parse(fs.readFileSync(path.join(root, 'source-mirror/data/portfolio-live.json'), 'utf8'));
const imgDir = path.join(root, 'source-mirror/images');
const projectPublic = path.join(root, 'public/images/projects');

function fetchBuf(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return fetchBuf(res.headers.location).then(resolve, reject);
        }
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => resolve({ status: res.statusCode, buf: Buffer.concat(chunks) }));
      })
      .on('error', reject);
  });
}

function clean(u) {
  return u
    .replace(/\/-\/[^/]+\//g, '/')
    .replace(/\/\d+x\//g, '/')
    .replace('thb.tildacdn.com', 'static.tildacdn.com')
    .split('?')[0];
}

const byPath = new Map(portfolio.projects.map((p) => [p.path, p]));

for (const proj of projects) {
  const srcSlug = proj.sourceSlug || proj.slug.replace(/-/g, '_');
  const live = byPath.get(srcSlug);
  if (!live?.src) continue;
  const url = clean(live.src);
  const ext = (url.match(/\.(jpe?g|png|webp)/i) || ['', 'jpg'])[1].toLowerCase().replace('jpeg', 'jpg');
  const name = `${proj.slug}-cover.${ext}`;
  const dest = path.join(projectPublic, name);
  const mirror = path.join(imgDir, name);
  try {
    if (!fs.existsSync(dest) || fs.statSync(dest).size < 8000) {
      const r = await fetchBuf(url);
      if (r.status === 200 && r.buf.length > 5000) {
        fs.writeFileSync(dest, r.buf);
        fs.writeFileSync(mirror, r.buf);
        console.log('cover', proj.slug, r.buf.length);
      }
    }
    const coverPath = `/images/projects/${name}`;
    // Put high-quality cover first
    const gallery = [coverPath, ...(proj.gallery || []).filter((g) => g !== coverPath)];
    proj.cover = coverPath;
    proj.gallery = [...new Set(gallery)];
    // Prefer live listing titles
    const lines = (live.text || '').split('\n').map((s) => s.trim()).filter(Boolean);
    if (lines[0]) proj.title = lines[0].replace(/:.*/, '').trim() || lines[0];
    if (lines[1]) proj.summary = lines[1].slice(0, 280);
  } catch (e) {
    console.log('fail cover', proj.slug, e.message);
  }
}

fs.writeFileSync(path.join(root, 'src/content/projects.json'), JSON.stringify(projects, null, 2));
console.log(
  'projects',
  projects.length,
  'full',
  projects.filter((p) => p.gallery.length > 1).length,
  'cover-only',
  projects.filter((p) => p.gallery.length <= 1).length
);
