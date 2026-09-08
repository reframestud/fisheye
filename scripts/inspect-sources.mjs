import fs from "fs";
import path from "path";

function detect(buf) {
  if (!buf.length) return "empty";
  if (buf[0] === 0xff && buf[1] === 0xd8) return "jpeg";
  if (buf[0] === 0x89 && buf[1] === 0x50) return "png";
  if (buf[0] === 0x47 && buf[1] === 0x49) return "gif";
  if (buf[0] === 0x52 && buf[1] === 0x49) return "webp";
  return "bad";
}

const underscore = fs
  .readdirSync("public/images/projects")
  .filter((f) => f.includes("_"))
  .map((f) => {
    const buf = fs.readFileSync(path.join("public/images/projects", f));
    return { f, kind: detect(buf), kb: +(buf.length / 1024).toFixed(1) };
  });

const byKind = {};
for (const x of underscore) byKind[x.kind] = (byKind[x.kind] || 0) + 1;
console.log("underscore files", underscore.length, byKind);
console.log(underscore.slice(0, 40));

// sample: how many valid images in source-mirror?
const mirror = fs.readdirSync("source-mirror/images");
let mOk = 0,
  mBad = 0,
  mLarge = 0;
for (const f of mirror) {
  const buf = fs.readFileSync(path.join("source-mirror/images", f));
  const k = detect(buf);
  if (k === "bad" || k === "empty") mBad++;
  else {
    mOk++;
    if (buf.length > 40000) mLarge++;
  }
}
console.log("mirror images ok", mOk, "bad", mBad, "large>40k", mLarge);

// Check HTML pages for image URL counts
const pages = fs.readdirSync("source-mirror/pages").filter((f) => f.endsWith(".html"));
for (const p of pages.filter((x) =>
  /marbesa|altos|alzambra|cosiness|miradores|clinic|quinta/i.test(x)
)) {
  const html = fs.readFileSync(path.join("source-mirror/pages", p), "utf8");
  const urls = [
    ...html.matchAll(
      /https:\/\/(?:static|thb)\.tildacdn\.com\/tild[a-z0-9-]+\/(?:-\/[^/"']+\/)*[A-Za-z0-9_.-]+\.(?:jpe?g|png|webp)/gi
    ),
  ].map((m) =>
    m[0]
      .replace(/\/-\/resize[^/]*\//, "/")
      .replace(/\/-\/format[^/]*\//, "/")
      .replace(/\/-\/empty\//, "/")
      .replace("thb.tildacdn.com", "static.tildacdn.com")
      .split("?")[0]
  );
  const unique = [...new Set(urls)].filter((u) => !/logo|icon|favicon|pngwing|\.svg/i.test(u));
  console.log(p, "img urls", unique.length);
}
