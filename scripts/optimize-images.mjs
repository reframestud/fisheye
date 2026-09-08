/**
 * Optimize referenced images via sharp using temp files (Windows-safe).
 */
import fs from "fs";
import path from "path";
import crypto from "crypto";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const projects = JSON.parse(
  fs.readFileSync(path.join(ROOT, "src/content/projects.json"), "utf8")
);
const team = JSON.parse(
  fs.readFileSync(path.join(ROOT, "src/content/team.json"), "utf8")
);

function imageKind(buf) {
  if (!buf?.length) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8) return "jpeg";
  if (buf[0] === 0x89 && buf[1] === 0x50) return "png";
  if (buf[0] === 0x47 && buf[1] === 0x49) return "gif";
  if (buf[0] === 0x52 && buf[1] === 0x49) return "webp";
  return null;
}

function publicPath(rel) {
  return path.join(ROOT, "public", rel.replace(/^\//, ""));
}

const refs = new Set();
for (const p of projects) {
  refs.add(p.cover);
  for (const g of p.gallery || []) refs.add(g);
}
for (const t of team) if (t.photo) refs.add(t.photo);

const renameMap = new Map();
let optimized = 0;
let bytesBefore = 0;
let bytesAfter = 0;
let failed = 0;

async function optimizeOne(src) {
  const abs = publicPath(src);
  if (!fs.existsSync(abs)) return;
  const input = fs.readFileSync(abs);
  const kind = imageKind(input);
  if (!kind) return;

  bytesBefore += input.length;
  const isCover = projects.some((p) => p.cover === src);
  const isTeam = src.includes("/team/");
  const maxEdge = isTeam ? 1200 : isCover ? 2200 : 2000;
  const quality = isTeam ? 82 : 85;

  try {
    const meta = await sharp(input, { failOn: "none" }).metadata();
    const w = meta.width || 0;
    const h = meta.height || 0;
    const needsResize = Math.max(w, h) > maxEdge;

    let pipeline = sharp(input, { failOn: "none" }).rotate();
    if (needsResize) {
      pipeline = pipeline.resize({
        width: w >= h ? maxEdge : undefined,
        height: h > w ? maxEdge : undefined,
        fit: "inside",
        withoutEnlargement: true,
      });
    }

    let outBuf;
    let outAbs = abs;
    let outSrc = src;

    if (kind === "png") {
      // Convert large photo PNGs to JPEG; keep small/logo-ish PNGs
      const max = Math.max(w, h);
      if (max > 400) {
        outBuf = await pipeline.jpeg({ quality, mozjpeg: true }).toBuffer();
        outAbs = abs.replace(/\.png$/i, ".jpg");
        outSrc = src.replace(/\.png$/i, ".jpg");
      } else {
        outBuf = await pipeline.png({ compressionLevel: 9 }).toBuffer();
      }
    } else {
      outBuf = await pipeline.jpeg({ quality, mozjpeg: true }).toBuffer();
    }

    const shouldWrite = outBuf.length < input.length * 0.98 || needsResize || outAbs !== abs;
    if (!shouldWrite) {
      bytesAfter += input.length;
      return;
    }

    const tmp = `${outAbs}.${crypto.randomBytes(4).toString("hex")}.tmp`;
    fs.writeFileSync(tmp, outBuf);
    // Replace destination
    if (fs.existsSync(outAbs)) {
      try {
        fs.unlinkSync(outAbs);
      } catch {
        /* locked: try overwrite via rename after unlink fail */
      }
    }
    fs.renameSync(tmp, outAbs);
    if (outAbs !== abs && fs.existsSync(abs)) {
      try {
        fs.unlinkSync(abs);
      } catch {
        /* ignore */
      }
    }

    if (outSrc !== src) renameMap.set(src, outSrc);
    optimized += 1;
    bytesAfter += outBuf.length;
  } catch (e) {
    failed += 1;
    bytesAfter += input.length;
    console.warn("fail", src, e.message);
  }
}

for (const src of [...refs].sort()) {
  await optimizeOne(src);
}

if (renameMap.size) {
  for (const p of projects) {
    if (renameMap.has(p.cover)) p.cover = renameMap.get(p.cover);
    p.gallery = (p.gallery || []).map((g) => renameMap.get(g) || g);
  }
  for (const t of team) {
    if (t.photo && renameMap.has(t.photo)) t.photo = renameMap.get(t.photo);
  }
  fs.writeFileSync(
    path.join(ROOT, "src/content/projects.json"),
    JSON.stringify(projects, null, 2) + "\n"
  );
  fs.writeFileSync(
    path.join(ROOT, "src/content/team.json"),
    JSON.stringify(team, null, 2) + "\n"
  );
}

const savedMb = ((bytesBefore - bytesAfter) / 1024 / 1024).toFixed(2);
console.log(
  JSON.stringify(
    {
      optimized,
      failed,
      refs: refs.size,
      savedMb: Number(savedMb),
      bytesBefore,
      bytesAfter,
      renameMap: Object.fromEntries(renameMap),
    },
    null,
    2
  )
);
