import fs from "fs";
import path from "path";
import crypto from "crypto";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const projectsPath = path.join(ROOT, "src/content/projects.json");
const projectsDir = path.join(ROOT, "public/images/projects");
const brandDir = path.join(ROOT, "public/images/brand");

const LOGO_PATH_RE = /logo(?:_2023)?|logo_2023_fin|\/images\/brand\//i;

function md5(buf) {
  return crypto.createHash("md5").update(buf).digest("hex");
}

function isImage(buf) {
  return (
    (buf[0] === 0x89 && buf[1] === 0x50) ||
    (buf[0] === 0xff && buf[1] === 0xd8)
  );
}

const logoHashes = new Set();
const logoPaths = new Set();

for (const f of fs.readdirSync(brandDir)) {
  const p = path.join(brandDir, f);
  if (fs.statSync(p).isFile()) logoHashes.add(md5(fs.readFileSync(p)));
}

for (const f of fs.readdirSync(projectsDir)) {
  const p = path.join(projectsDir, f);
  if (!fs.statSync(p).isFile()) continue;
  const buf = fs.readFileSync(p);
  if (!isImage(buf)) continue;

  let meta;
  try {
    meta = await sharp(p).metadata();
  } catch {
    continue;
  }

  const max = Math.max(meta.width ?? 0, meta.height ?? 0);
  const ar = (meta.width ?? 1) / (meta.height ?? 1);
  const nameHit = LOGO_PATH_RE.test(f);
  const smallSquare = max <= 220 && Math.abs(ar - 1) < 0.15;
  const hash = md5(buf);

  if (nameHit || smallSquare || logoHashes.has(hash)) {
    logoHashes.add(hash);
    logoPaths.add(`/images/projects/${f}`);
  }
}

function isLogoSrc(src) {
  return logoPaths.has(src) || LOGO_PATH_RE.test(src);
}

const projects = JSON.parse(fs.readFileSync(projectsPath, "utf8"));
let removed = 0;
const examples = [];

for (const proj of projects) {
  const before = proj.gallery.length;
  proj.gallery = proj.gallery.filter((src) => {
    if (!isLogoSrc(src)) return true;
    removed += 1;
    if (examples.length < 10) examples.push(src);
    return false;
  });

  if (isLogoSrc(proj.cover)) {
    removed += 1;
    if (examples.length < 10) examples.push(`COVER:${proj.cover}`);
    const next = proj.gallery.find((s) => s !== proj.cover) ?? proj.gallery[0];
    if (next) proj.cover = next;
  }

  console.log(`${proj.slug}: gallery ${before} → ${proj.gallery.length}`);
}

fs.writeFileSync(projectsPath, `${JSON.stringify(projects, null, 2)}\n`);

console.log("REMOVED", removed);
console.log("LOGO_PATHS", [...logoPaths].sort().join("\n"));
console.log("EXAMPLES", examples.join("\n"));
console.log("LOGO_HASHES", [...logoHashes].sort().join("\n"));
