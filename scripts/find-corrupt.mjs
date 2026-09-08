import fs from "fs";
import path from "path";
import zlib from "zlib";

function walk(d, a = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const f = path.join(d, e.name);
    if (e.isDirectory()) walk(f, a);
    else a.push(f);
  }
  return a;
}

function detect(buf) {
  if (buf.length === 0) return "empty";
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpeg";
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47)
    return "png";
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) return "gif";
  if (buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46)
    return "webp-ish";
  if (buf[0] === 0x1f && buf[1] === 0x8b) {
    try {
      const out = zlib.gunzipSync(buf).subarray(0, 80).toString("utf8");
      if (out.includes("{") || out.includes("function") || out.includes("@font"))
        return "gzip-text";
      return "gzip-other";
    } catch {
      return "gzip";
    }
  }
  const head = buf.subarray(0, 64).toString("utf8");
  if (
    head.startsWith("<!") ||
    head.startsWith("<html") ||
    head.startsWith(".css") ||
    head.startsWith("window.") ||
    head.startsWith("function") ||
    head.startsWith("@font")
  )
    return "text";
  return "unknown";
}

const files = walk("public/images");
const byKind = {};
const bad = [];
for (const f of files) {
  const buf = fs.readFileSync(f);
  const kind = detect(buf);
  byKind[kind] = (byKind[kind] || 0) + 1;
  if (!["jpeg", "png", "gif", "webp-ish"].includes(kind)) {
    bad.push({
      path: f.replace(/\\/g, "/"),
      kind,
      size: buf.length,
    });
  }
}

fs.writeFileSync(
  "scripts/corrupt-images.json",
  JSON.stringify({ byKind, badCount: bad.length, bad }, null, 2)
);
console.log(JSON.stringify(byKind, null, 2));
console.log("bad", bad.length);
