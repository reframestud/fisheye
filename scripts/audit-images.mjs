import fs from "fs";
import path from "path";

const projects = JSON.parse(fs.readFileSync("src/content/projects.json", "utf8"));
const team = JSON.parse(fs.readFileSync("src/content/team.json", "utf8"));

function exists(p) {
  const rel = p.replace(/^\//, "");
  return fs.existsSync(path.join("public", rel));
}

function findSimilar(missingPath) {
  const base = path.basename(missingPath);
  const dir = path.join("public", path.dirname(missingPath.replace(/^\//, "")));
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir);
  const stem = base.replace(/\.[^.]+$/, "").toLowerCase();
  const variants = [
    base,
    base.replace(/_/g, "-"),
    base.replace(/-/g, "_"),
    stem.replace(/_/g, "-"),
    stem.replace(/-/g, "_"),
  ];
  const hits = files.filter((f) => {
    const fl = f.toLowerCase();
    return variants.some(
      (v) =>
        fl === v.toLowerCase() ||
        fl.startsWith(stem.replace(/_/g, "-")) ||
        fl.startsWith(stem.replace(/-/g, "_")) ||
        fl.replace(/\.[^.]+$/, "") === stem.replace(/_/g, "-") ||
        fl.replace(/\.[^.]+$/, "") === stem.replace(/-/g, "_")
    );
  });
  // also try alt extensions
  const noExt = stem.replace(/_/g, "-");
  const noExt2 = stem.replace(/-/g, "_");
  for (const f of files) {
    const stemF = f.replace(/\.[^.]+$/, "").toLowerCase();
    if (stemF === noExt || stemF === noExt2 || stemF === stem) {
      if (!hits.includes(f)) hits.push(f);
    }
  }
  return [...new Set(hits)].slice(0, 8);
}

const missing = [];
const ok = [];

for (const p of projects) {
  const cover = p.cover || p.image;
  if (cover) {
    if (!exists(cover))
      missing.push({
        slug: p.slug || p.id,
        type: "cover",
        path: cover,
        similar: findSimilar(cover),
      });
    else ok.push(cover);
  }
  for (const g of p.gallery || []) {
    if (!exists(g))
      missing.push({
        slug: p.slug || p.id,
        type: "gallery",
        path: g,
        similar: findSimilar(g),
      });
    else ok.push(g);
  }
}

for (const t of team) {
  const img = t.image || t.photo || t.src;
  if (img) {
    if (!exists(img))
      missing.push({
        slug: t.name || t.id,
        type: "team",
        path: img,
        similar: findSimilar(img),
      });
    else ok.push(img);
  }
}

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory() && !["node_modules", ".next", "source-mirror"].includes(e.name))
      walk(f, acc);
    else if (/\.(tsx?|jsx?|json|mdx?|css)$/.test(e.name)) acc.push(f);
  }
  return acc;
}

const imgRe = /["'`](\/images\/[^"'`]+)["'`]/g;
const codeRefs = new Map();
for (const f of walk("src")) {
  const txt = fs.readFileSync(f, "utf8");
  let m;
  while ((m = imgRe.exec(txt))) {
    if (!codeRefs.has(m[1])) codeRefs.set(m[1], []);
    codeRefs.get(m[1]).push(f);
  }
}

const codeMissing = [];
for (const [img, locs] of codeRefs) {
  if (!exists(img) && !img.includes("${")) {
    codeMissing.push({ path: img, locs, similar: findSimilar(img) });
  }
}

// size stats for existing referenced images
const sizes = [];
for (const p of ok) {
  const file = path.join("public", p.replace(/^\//, ""));
  const st = fs.statSync(file);
  sizes.push({ path: p, bytes: st.size });
}
sizes.sort((a, b) => b.bytes - a.bytes);

console.log(
  JSON.stringify(
    {
      projects: projects.length,
      okCount: ok.length,
      missingCount: missing.length,
      missing,
      codeMissingCount: codeMissing.length,
      codeMissing,
      largest20: sizes.slice(0, 20).map((s) => ({
        path: s.path,
        mb: +(s.bytes / 1024 / 1024).toFixed(2),
      })),
      totalOkMb: +(sizes.reduce((a, s) => a + s.bytes, 0) / 1024 / 1024).toFixed(2),
    },
    null,
    2
  )
);
