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

const projects = JSON.parse(fs.readFileSync("src/content/projects.json", "utf8"));
const team = JSON.parse(fs.readFileSync("src/content/team.json", "utf8"));
const refs = new Set();
for (const p of projects) {
  refs.add(p.cover);
  for (const g of p.gallery || []) refs.add(g);
}
for (const t of team) {
  if (t.photo) refs.add(t.photo);
  if (t.image) refs.add(t.image);
}

for (const f of ["src/app/page.tsx", "src/app/studio/page.tsx", "src/app/projects/page.tsx"]) {
  if (!fs.existsSync(f)) continue;
  const txt = fs.readFileSync(f, "utf8");
  const re = /["'](\/images\/[^"']+)["']/g;
  let m;
  while ((m = re.exec(txt))) refs.add(m[1]);
}

const referencedBad = [];
let ok = 0;
for (const r of refs) {
  const f = path.join("public", r.replace(/^\//, ""));
  if (!fs.existsSync(f)) {
    referencedBad.push({ r, reason: "missing" });
    continue;
  }
  const buf = fs.readFileSync(f);
  const k = detect(buf);
  if (k === "bad") referencedBad.push({ r, size: buf.length });
  else ok++;
}

console.log("referenced", refs.size, "ok", ok, "bad", referencedBad.length);
fs.writeFileSync("scripts/referenced-bad.json", JSON.stringify(referencedBad, null, 2));
console.log("wrote scripts/referenced-bad.json");

console.log("\nCOVERS:");
for (const p of projects) {
  const f = path.join("public", p.cover.replace(/^\//, ""));
  const buf = fs.existsSync(f) ? fs.readFileSync(f) : null;
  const galleryBad = (p.gallery || []).filter((g) => {
    const gf = path.join("public", g.replace(/^\//, ""));
    if (!fs.existsSync(gf)) return true;
    return detect(fs.readFileSync(gf)) === "bad";
  });
  console.log(
    p.slug,
    buf ? detect(buf) + " " + (buf.length / 1024).toFixed(0) + "kb" : "MISSING",
    "gallery",
    (p.gallery || []).length,
    "badInGallery",
    galleryBad.length,
    "hasFull",
    p.hasFullPage
  );
}

// home images
console.log("\nHOME:");
const homeDir = "public/images/home";
if (fs.existsSync(homeDir)) {
  for (const name of fs.readdirSync(homeDir).sort()) {
    const buf = fs.readFileSync(path.join(homeDir, name));
    console.log(name, detect(buf), (buf.length / 1024).toFixed(1) + "kb");
  }
}

console.log("\nTEAM:");
for (const t of team) {
  const f = path.join("public", (t.photo || "").replace(/^\//, ""));
  const buf = fs.existsSync(f) ? fs.readFileSync(f) : null;
  console.log(t.name || t.id, buf ? detect(buf) + " " + (buf.length / 1024).toFixed(0) + "kb" : "MISSING");
}
