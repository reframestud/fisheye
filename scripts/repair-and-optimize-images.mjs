/**
 * Repair corrupt project/home images and rebuild galleries from validated assets.
 * Then optimize referenced images with sharp (high-quality web sizes).
 */
import fs from "fs";
import path from "path";
import https from "https";
import http from "http";
import crypto from "crypto";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const projectsPath = path.join(ROOT, "src/content/projects.json");
const pagesDir = path.join(ROOT, "source-mirror/pages");
const mirrorDir = path.join(ROOT, "source-mirror/images");
const projectPublic = path.join(ROOT, "public/images/projects");
const homePublic = path.join(ROOT, "public/images/home");
const brandDir = path.join(ROOT, "public/images/brand");

const LOGO_PATH_RE = /logo(?:[_-]?\d{4})?|logo_2023_fin|\/images\/brand\//i;
const KNOWN_LOGO_MD5 = new Set([
  "0d19e815c8d8464ec16ad50c1228e8e7",
  "50b552fd820f0dd3b494910918848df0",
  "197383aa44700354ddc42120ef07504f",
  "614a6db27cc3184816b68e981b604059",
  "9f85e7a4d706834fd7325010d6810fc9",
  "a2be505a969642d6acc9b0eb4ce261a8",
]);

function md5(buf) {
  return crypto.createHash("md5").update(buf).digest("hex");
}

function imageKind(buf) {
  if (!buf?.length) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpeg";
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47)
    return "png";
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) return "gif";
  if (
    buf[0] === 0x52 &&
    buf[1] === 0x49 &&
    buf[2] === 0x46 &&
    buf[3] === 0x46 &&
    buf.toString("ascii", 8, 12) === "WEBP"
  )
    return "webp";
  return null;
}

function isValidImageFile(filePath) {
  if (!fs.existsSync(filePath)) return false;
  const buf = fs.readFileSync(filePath);
  return Boolean(imageKind(buf)) && buf.length >= 1500;
}

function fetchBuf(url, redirects = 0) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith("https") ? https : http;
    const req = lib.get(
      url,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
          Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
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
        res.on("data", (c) => chunks.push(c));
        res.on("end", () =>
          resolve({
            status: res.statusCode,
            buf: Buffer.concat(chunks),
            type: res.headers["content-type"] || "",
          })
        );
      }
    );
    req.on("error", reject);
    req.setTimeout(60000, () => req.destroy(new Error("timeout")));
  });
}

function cleanImgUrl(u) {
  return u
    .replace(/&amp;/g, "&")
    .replace(/\/-\/resize[^/]*\//g, "/")
    .replace(/\/-\/format[^/]*\//g, "/")
    .replace(/\/-\/empty\//g, "/")
    .replace(/\/-\/resizeb\/[^/]+\//g, "/")
    .replace(/\/-\/[^/]+\//g, "/")
    .replace("thb.tildacdn.com", "static.tildacdn.com")
    .replace("optim.tildacdn.com", "static.tildacdn.com")
    .split("?")[0];
}

function slugify(u) {
  return u.replace(/^https?:\/\//, "").replace(/[^\w.-]+/g, "_").slice(0, 180);
}

function extractImageUrls(html) {
  const set = new Set();
  const re =
    /https?:\/\/(?:static|thb|up|optim)\.tildacdn\.(?:com|pro)\/[^"' )\s]+\.(?:jpe?g|png|webp)/gi;
  for (const m of html.matchAll(re)) set.add(cleanImgUrl(m[0]));

  const re2 =
    /(?:data-original|data-img|data-original-image|data-content-cover-bg)=["']([^"']+)["']/gi;
  let mm;
  while ((mm = re2.exec(html))) {
    let u = mm[1].replace(/&amp;/g, "&");
    if (u.startsWith("//")) u = `https:${u}`;
    if (/tildacdn\.(com|pro)/i.test(u) && /\.(jpe?g|png|webp)(\?|$)/i.test(u)) {
      set.add(cleanImgUrl(u));
    }
  }
  return [...set].filter((u) => !/logo|icon|pngwing|favicon|\.svg$/i.test(u));
}

const mirrorFiles = fs.existsSync(mirrorDir) ? fs.readdirSync(mirrorDir) : [];

function findMirror(url) {
  const clean = cleanImgUrl(url);
  const base = slugify(clean);
  const hit = mirrorFiles.find(
    (n) => n.startsWith(base) || n.includes(base.slice(0, 60))
  );
  if (!hit) return null;
  const full = path.join(mirrorDir, hit);
  return isValidImageFile(full) ? full : null;
}

async function downloadValid(url) {
  const clean = cleanImgUrl(url);
  const local = findMirror(clean);
  if (local) return { path: local, url: clean, cached: true };

  try {
    const r = await fetchBuf(clean);
    if (r.status !== 200 || !imageKind(r.buf) || r.buf.length < 3000) return null;
    const ext = (imageKind(r.buf) === "png" ? "png" : "jpg");
    const name = `${slugify(clean)}.${ext}`;
    const dest = path.join(mirrorDir, name);
    fs.writeFileSync(dest, r.buf);
    if (!mirrorFiles.includes(name)) mirrorFiles.push(name);
    return { path: dest, url: clean, cached: false, bytes: r.buf.length };
  } catch {
    return null;
  }
}

async function isLogoBuffer(buf, nameHint = "") {
  if (LOGO_PATH_RE.test(nameHint)) return true;
  if (KNOWN_LOGO_MD5.has(md5(buf))) return true;
  try {
    const meta = await sharp(buf).metadata();
    const max = Math.max(meta.width ?? 0, meta.height ?? 0);
    const ar = (meta.width ?? 1) / (meta.height ?? 1);
    if (max <= 220 && Math.abs(ar - 1) < 0.15) return true;
  } catch {
    /* ignore */
  }
  return false;
}

function publicPath(rel) {
  return path.join(ROOT, "public", rel.replace(/^\//, ""));
}

const stats = {
  prunedCorrupt: 0,
  repaired: 0,
  downloaded: 0,
  deletedCorrupt: 0,
  optimized: 0,
  bytesBefore: 0,
  bytesAfter: 0,
};

const projects = JSON.parse(fs.readFileSync(projectsPath, "utf8"));

for (const proj of projects) {
  const beforeGallery = [...(proj.gallery || [])];
  const coverWas = proj.cover;

  // Drop corrupt gallery entries
  const kept = [];
  for (const src of beforeGallery) {
    const file = publicPath(src);
    if (isValidImageFile(file)) {
      kept.push(src);
    } else {
      stats.prunedCorrupt += 1;
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
        stats.deletedCorrupt += 1;
      }
    }
  }

  // Ensure cover is valid
  let cover = coverWas;
  if (!isValidImageFile(publicPath(cover))) {
    cover = kept[0] || null;
  }

  // Rebuild from HTML when full page exists and gallery is thin / was heavily corrupt
  const sourceSlug = proj.sourceSlug || proj.slug.replace(/-/g, "_");
  const htmlPath = path.join(pagesDir, `${sourceSlug}.html`);
  const corruptRatio =
    beforeGallery.length > 0
      ? (beforeGallery.length - kept.length) / beforeGallery.length
      : 1;

  const shouldRebuild =
    proj.hasFullPage &&
    fs.existsSync(htmlPath) &&
    (kept.length < 8 || corruptRatio >= 0.25);

  if (shouldRebuild) {
    const html = fs.readFileSync(htmlPath, "utf8");
    const urls = extractImageUrls(html);
    const rebuilt = [];

    // Prefer existing valid cover file
    if (cover && isValidImageFile(publicPath(cover))) {
      rebuilt.push(cover);
    }

    let n = 0;
    for (const url of urls) {
      const saved = await downloadValid(url);
      if (!saved) continue;
      const buf = fs.readFileSync(saved.path);
      if (await isLogoBuffer(buf, url)) continue;

      const kind = imageKind(buf);
      const ext = kind === "png" ? ".png" : ".jpg";
      n += 1;
      const name = `${proj.slug}-${String(n).padStart(2, "0")}${ext}`;
      const dest = path.join(projectPublic, name);
      fs.copyFileSync(saved.path, dest);
      if (!saved.cached) stats.downloaded += 1;
      const pub = `/images/projects/${name}`;
      if (!rebuilt.includes(pub)) rebuilt.push(pub);
      stats.repaired += 1;
    }

    // Also harvest any leftover valid underscore copies for this source slug
    const underscorePrefix = `${sourceSlug}-`;
    for (const f of fs.readdirSync(projectPublic)) {
      if (!f.startsWith(underscorePrefix)) continue;
      const srcFile = path.join(projectPublic, f);
      if (!isValidImageFile(srcFile)) continue;
      const buf = fs.readFileSync(srcFile);
      if (await isLogoBuffer(buf, f)) continue;
      n += 1;
      const ext = path.extname(f).toLowerCase().replace("jpeg", "jpg");
      const name = `${proj.slug}-u${String(n).padStart(2, "0")}${ext}`;
      const dest = path.join(projectPublic, name);
      if (!fs.existsSync(dest)) fs.copyFileSync(srcFile, dest);
      const pub = `/images/projects/${name}`;
      if (!rebuilt.includes(pub)) rebuilt.push(pub);
    }

    // Deduplicate by content hash
    const seenHash = new Set();
    const unique = [];
    for (const src of rebuilt) {
      const file = publicPath(src);
      if (!isValidImageFile(file)) continue;
      const hash = md5(fs.readFileSync(file));
      if (seenHash.has(hash)) continue;
      seenHash.add(hash);
      unique.push(src);
    }

    if (unique.length) {
      // Prefer existing cover path if still in set, else first
      if (cover && unique.includes(cover)) {
        proj.cover = cover;
        proj.gallery = [cover, ...unique.filter((s) => s !== cover)];
      } else {
        // Keep dedicated *-cover.* if present and valid
        const coverName = `${proj.slug}-cover.jpg`;
        const coverPath = `/images/projects/${coverName}`;
        if (isValidImageFile(path.join(projectPublic, coverName))) {
          proj.cover = coverPath;
          proj.gallery = [coverPath, ...unique.filter((s) => s !== coverPath)];
        } else {
          proj.cover = unique[0];
          proj.gallery = unique;
        }
      }
    } else {
      proj.gallery = kept;
      if (cover) proj.cover = cover;
    }
  } else {
    // Light prune only
    proj.gallery = kept.length ? kept : cover ? [cover] : [];
    if (cover) {
      proj.cover = cover;
      if (!proj.gallery.includes(cover)) proj.gallery = [cover, ...proj.gallery];
    }
  }

  // Final logo filter on gallery paths
  proj.gallery = proj.gallery.filter((src) => {
    if (LOGO_PATH_RE.test(src)) return false;
    const file = publicPath(src);
    if (!isValidImageFile(file)) return false;
    const hash = md5(fs.readFileSync(file));
    return !KNOWN_LOGO_MD5.has(hash);
  });

  if (LOGO_PATH_RE.test(proj.cover) || !isValidImageFile(publicPath(proj.cover))) {
    proj.cover = proj.gallery[0] || proj.cover;
  }

  console.log(
    `${proj.slug}: gallery ${beforeGallery.length} → ${proj.gallery.length} (cover ok=${isValidImageFile(publicPath(proj.cover))})`
  );
}

fs.writeFileSync(projectsPath, JSON.stringify(projects, null, 2) + "\n");

// Delete remaining unreferenced corrupt project/home files
function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) walk(f, acc);
    else acc.push(f);
  }
  return acc;
}

const referenced = new Set();
for (const p of projects) {
  referenced.add(p.cover);
  for (const g of p.gallery) referenced.add(g);
}

for (const file of walk(path.join(ROOT, "public/images"))) {
  const rel = "/" + path.relative(path.join(ROOT, "public"), file).replace(/\\/g, "/");
  if (isValidImageFile(file)) continue;
  // delete corrupt always
  fs.unlinkSync(file);
  stats.deletedCorrupt += 1;
  console.log("deleted corrupt", rel);
}

// --- Optimize referenced images ---
async function optimizeFile(abs, { maxEdge, quality }) {
  const before = fs.statSync(abs).size;
  stats.bytesBefore += before;
  try {
    const img = sharp(abs, { failOn: "none" });
    const meta = await img.metadata();
    const w = meta.width || 0;
    const h = meta.height || 0;
    const needsResize = Math.max(w, h) > maxEdge;
    const kind = imageKind(fs.readFileSync(abs));

    let pipeline = sharp(abs, { failOn: "none" }).rotate();
    if (needsResize) {
      pipeline = pipeline.resize({
        width: w >= h ? maxEdge : undefined,
        height: h > w ? maxEdge : undefined,
        fit: "inside",
        withoutEnlargement: true,
      });
    }

    let out;
    const ext = path.extname(abs).toLowerCase();
    if (kind === "png" || ext === ".png") {
      // Keep PNG for logos/transparency; compress
      out = await pipeline.png({ compressionLevel: 9, palette: false }).toBuffer();
      // If photo-like large PNG, convert to jpeg
      if ((meta.width || 0) > 400 && !(await isLogoBuffer(out, abs))) {
        out = await sharp(abs, { failOn: "none" })
          .rotate()
          .resize({
            width: w >= h ? maxEdge : undefined,
            height: h > w ? maxEdge : undefined,
            fit: "inside",
            withoutEnlargement: true,
          })
          .jpeg({ quality, mozjpeg: true })
          .toBuffer();
        const jpegPath = abs.replace(/\.png$/i, ".jpg");
        if (jpegPath !== abs) {
          fs.writeFileSync(jpegPath, out);
          fs.unlinkSync(abs);
          stats.optimized += 1;
          stats.bytesAfter += out.length;
          return { newPath: jpegPath, renamed: true };
        }
      }
    } else {
      out = await pipeline.jpeg({ quality, mozjpeg: true }).toBuffer();
    }

    // Only write if smaller (or resized)
    if (out.length < before * 0.98 || needsResize) {
      fs.writeFileSync(abs, out);
      stats.optimized += 1;
      stats.bytesAfter += out.length;
    } else {
      stats.bytesAfter += before;
    }
  } catch (e) {
    console.warn("optimize fail", abs, e.message);
    stats.bytesAfter += before;
  }
  return { newPath: abs, renamed: false };
}

// Collect all referenced public images + team
const team = JSON.parse(fs.readFileSync(path.join(ROOT, "src/content/team.json"), "utf8"));
const toOptimize = new Set();
for (const p of projects) {
  toOptimize.add(p.cover);
  for (const g of p.gallery) toOptimize.add(g);
}
for (const t of team) {
  if (t.photo) toOptimize.add(t.photo);
}

const renameMap = new Map();
for (const src of toOptimize) {
  const abs = publicPath(src);
  if (!isValidImageFile(abs)) continue;
  const isCover = projects.some((p) => p.cover === src);
  const isTeam = src.includes("/team/");
  const maxEdge = isTeam ? 1200 : isCover ? 2200 : 2000;
  const quality = isTeam ? 82 : 85;
  const result = await optimizeFile(abs, { maxEdge, quality });
  if (result.renamed) {
    const newRel =
      "/" +
      path.relative(path.join(ROOT, "public"), result.newPath).replace(/\\/g, "/");
    renameMap.set(src, newRel);
  }
}

if (renameMap.size) {
  for (const p of projects) {
    if (renameMap.has(p.cover)) p.cover = renameMap.get(p.cover);
    p.gallery = p.gallery.map((g) => renameMap.get(g) || g);
  }
  for (const t of team) {
    if (t.photo && renameMap.has(t.photo)) t.photo = renameMap.get(t.photo);
  }
  fs.writeFileSync(projectsPath, JSON.stringify(projects, null, 2) + "\n");
  fs.writeFileSync(
    path.join(ROOT, "src/content/team.json"),
    JSON.stringify(team, null, 2) + "\n"
  );
}

const savedMb = ((stats.bytesBefore - stats.bytesAfter) / 1024 / 1024).toFixed(2);
console.log("\nSTATS", {
  ...stats,
  savedMb,
  renameCount: renameMap.size,
});

fs.writeFileSync(
  path.join(ROOT, "scripts/repair-optimize-report.json"),
  JSON.stringify(
    {
      ...stats,
      savedMb: Number(savedMb),
      renameMap: Object.fromEntries(renameMap),
      projects: projects.map((p) => ({
        slug: p.slug,
        cover: p.cover,
        gallery: p.gallery.length,
        hasFullPage: p.hasFullPage,
      })),
    },
    null,
    2
  )
);
