import fs from 'fs';
import path from 'path';

const imgDir = 'C:/Users/Pico/Documents/Projects-Reframe/fisheye/source-mirror/images';
const publicDir = 'C:/Users/Pico/Documents/Projects-Reframe/fisheye/public/images';
fs.mkdirSync(publicDir, { recursive: true });
fs.mkdirSync(path.join(publicDir, 'projects'), { recursive: true });
fs.mkdirSync(path.join(publicDir, 'brand'), { recursive: true });

const files = fs.readdirSync(imgDir);
const large = files
  .map((f) => {
    const p = path.join(imgDir, f);
    const st = fs.statSync(p);
    return { f, size: st.size };
  })
  .filter((x) => x.size > 80000 && /\.(jpe?g|png|webp)$/i.test(x.f))
  .sort((a, b) => b.size - a.size);

console.log('large images', large.length);
console.log(large.slice(0, 25).map((x) => `${(x.size / 1e6).toFixed(2)}MB ${x.f}`).join('\n'));

// Copy logo candidates
const logos = files.filter((f) => /logo/i.test(f));
for (const l of logos) {
  fs.copyFileSync(path.join(imgDir, l), path.join(publicDir, 'brand', l.replace(/^.*?logo/i, 'logo').slice(0, 80)));
}
console.log('logos', logos);

// Copy top large images as pool
let i = 0;
for (const x of large.slice(0, 80)) {
  i += 1;
  const ext = path.extname(x.f);
  const dest = path.join(publicDir, 'projects', `plate-${String(i).padStart(2, '0')}${ext}`);
  fs.copyFileSync(path.join(imgDir, x.f), dest);
}
console.log('copied plates', i);
