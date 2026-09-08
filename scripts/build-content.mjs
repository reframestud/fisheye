import fs from 'fs';
import path from 'path';

const pagesDir = 'C:/Users/Pico/Documents/Projects-Reframe/fisheye/source-mirror/pages';
const imgDir = 'C:/Users/Pico/Documents/Projects-Reframe/fisheye/source-mirror/images';
const outDir = 'C:/Users/Pico/Documents/Projects-Reframe/fisheye/public/images/projects';
const dataOut = 'C:/Users/Pico/Documents/Projects-Reframe/fisheye/src/content';

fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(dataOut, { recursive: true });

function slugify(u) {
  return u.replace(/^https?:\/\//, '').replace(/[^\w.-]+/g, '_').slice(0, 180);
}

function clean(s) {
  return s
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const working = [
  {
    slug: 'marbesa',
    title: 'Marbesa Villa',
    location: 'Marbella',
    summary:
      'Minimalist villa interiors with natural materials and timeless elegance.',
  },
  {
    slug: 'altos_puente_romano',
    title: 'Altos de Puente Romano',
    location: 'Marbella',
    summary:
      'Soft, stylish modern villa, functional and market-ready.',
  },
  {
    slug: 'apartment_interior_design_in_marbella_la_alzambra',
    title: 'La Alzambra Apartment',
    location: 'Marbella',
    summary:
      'Modern minimalist apartment with natural materials and accent colour.',
  },
  {
    slug: 'apartment_interior_design_in_marbella_real_de_la_quinta',
    title: 'Dominanta Apartment',
    location: 'Marbella',
    summary:
      'Elegant modern apartment in light tones with carefully selected furnishings.',
  },
  {
    slug: 'apartment_interior_design_in_marbella_modern_cosiness',
    title: 'Modern Cosiness',
    location: 'Marbella',
    summary:
      'Bright, functional apartment designed for comfortable adult living.',
  },
  {
    slug: 'private_house_interior_design_in_malaga_miradores_del_sol',
    title: 'Miradores Del Sol',
    location: 'Málaga',
    summary:
      'Modern minimalist family home with lifestyle-led planning.',
  },
  {
    slug: 'clinic_interior_design',
    title: 'Clinic Interior',
    location: 'Studio project',
    summary:
      'Calming clinical interior with warm shades and natural textures.',
  },
];

const imageFiles = fs.readdirSync(imgDir);

function findLocal(url) {
  if (!url) return null;
  const cleanUrl = url
    .replace(/\/-\/resize[^/]*\//, '/')
    .replace(/\/-\/format[^/]*\//, '/')
    .replace(/\/-\/empty\//, '/')
    .replace('thb.tildacdn.com', 'static.tildacdn.com')
    .split('?')[0];
  const base = slugify(cleanUrl);
  const hit = imageFiles.find(
    (n) => n.startsWith(base) || n.includes(base.slice(0, 50))
  );
  return hit ? path.join(imgDir, hit) : null;
}

const projects = [];

for (const meta of working) {
  const htmlPath = path.join(pagesDir, `${meta.slug}.html`);
  if (!fs.existsSync(htmlPath)) continue;
  const html = fs.readFileSync(htmlPath, 'utf8');
  if (/404 not found/i.test(clean((html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1] || ''))) {
    console.log('skip 404', meta.slug);
    continue;
  }

  const h1 = clean((html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1] || meta.title);
  const desc = clean(
    (html.match(/name=["']description["'][^>]*content=["']([^"']+)/i) ||
      html.match(/content=["']([^"']+)["'][^>]*name=["']description["']/i) ||
      [])[1] || meta.summary
  );

  const urls = [
    ...new Set(
      [
        ...html.matchAll(
          /https:\/\/(?:static|thb)\.tildacdn\.com\/tild[a-z0-9-]+\/(?:-\/[^/"']+\/)*[A-Za-z0-9_.-]+\.(?:jpe?g|png|webp)/gi
        ),
      ].map((m) =>
        m[0]
          .replace(/\/-\/resize[^/]*\//, '/')
          .replace(/\/-\/format[^/]*\//, '/')
          .replace(/\/-\/empty\//, '/')
          .replace('thb.tildacdn.com', 'static.tildacdn.com')
          .split('?')[0]
      )
    ),
  ].filter((u) => !/logo|icon|svg|pngwing|favicon/i.test(u));

  const gallery = [];
  let n = 0;
  for (const u of urls) {
    const local = findLocal(u);
    if (!local) continue;
    const st = fs.statSync(local);
    if (st.size < 40000) continue;
    n += 1;
    const ext = path.extname(local).replace(/\.+/g, '.').replace(/\.(jpe?g|png|webp)\.\1$/i, '.$1');
    const name = `${meta.slug}-${String(n).padStart(2, '0')}${path.extname(local).toLowerCase().replace(/\.+/g, '.').split('.').filter(Boolean).slice(-1)[0] ? '.' + path.extname(local).toLowerCase().replace(/\./g, '').replace(/(jpe?g|png|webp).*/i, '$1') : '.jpg'}`;
    // simpler naming
    const simpleExt = (local.match(/\.(jpe?g|png|webp)/i) || ['.jpg'])[0].toLowerCase().replace('jpeg', 'jpg');
    const fileName = `${meta.slug}-${String(n).padStart(2, '0')}${simpleExt.startsWith('.') ? simpleExt : '.' + simpleExt}`;
    const dest = path.join(outDir, fileName);
    fs.copyFileSync(local, dest);
    gallery.push(`/images/projects/${fileName}`);
    if (gallery.length >= 8) break;
  }

  if (!gallery.length) {
    console.log('no gallery', meta.slug);
    continue;
  }

  projects.push({
    slug: meta.slug.replace(/_/g, '-'),
    sourceSlug: meta.slug,
    title: meta.title,
    location: meta.location,
    summary: meta.summary,
    description: desc.slice(0, 400) || meta.summary,
    cover: gallery[0],
    gallery,
  });
  console.log(meta.slug, 'images', gallery.length);
}

fs.writeFileSync(
  path.join(dataOut, 'projects.json'),
  JSON.stringify(projects, null, 2)
);
console.log('projects written', projects.length);
