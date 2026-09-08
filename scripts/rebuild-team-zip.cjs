const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { execFileSync } = require('child_process');

const root = 'C:/Users/Pico/Documents/Projects-Reframe/fisheye';
const dir = path.join(root, 'public/images/team');
const stage = path.join(root, '.tmp-team-zip');
const team = JSON.parse(fs.readFileSync(path.join(root, 'src/content/team.json'), 'utf8'));

async function aHash(file, size = 8) {
  const { data } = await sharp(path.join(dir, file))
    .greyscale()
    .resize(size, size, { fit: 'fill' })
    .raw()
    .toBuffer({ resolveWithObject: true });
  const avg = data.reduce((a, b) => a + b, 0) / data.length;
  let bits = 0n;
  for (let i = 0; i < data.length; i++) if (data[i] >= avg) bits |= 1n << BigInt(i);
  return bits;
}

function hamming(a, b) {
  let x = a ^ b;
  let c = 0;
  while (x) {
    c += Number(x & 1n);
    x >>= 1n;
  }
  return c;
}

(async () => {
  const files = fs.readdirSync(dir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
  const meta = {};
  for (const f of files) {
    const abs = path.join(dir, f);
    const info = await sharp(abs).metadata();
    const w = info.width || 0;
    const h = info.height || 0;
    meta[f] = {
      bytes: fs.statSync(abs).size,
      w,
      h,
      px: w * h,
      hash: await aHash(f),
    };
  }

  const picks = [];
  for (let i = 0; i < team.length; i++) {
    const member = team[i];
    const canonical = path.basename(member.photo);
    const targetHash = meta[canonical]?.hash;
    if (!targetHash) throw new Error('missing ' + canonical);

    let best = canonical;
    let bestScore = { px: meta[canonical].px, bytes: meta[canonical].bytes };
    for (const f of files) {
      const dist = hamming(targetHash, meta[f].hash);
      if (dist > 10) continue;
      const s = meta[f];
      if (s.px > bestScore.px || (s.px === bestScore.px && s.bytes > bestScore.bytes)) {
        best = f;
        bestScore = { px: s.px, bytes: s.bytes };
      }
    }

    const slug = member.name
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const outName = String(i + 1).padStart(2, '0') + '-' + slug + '.jpg';
    picks.push({
      name: member.name,
      role: member.role,
      outName,
      source: best,
      dims: meta[best].w + 'x' + meta[best].h,
      bytes: meta[best].bytes,
      canonical,
      upgraded: best !== canonical,
    });
  }

  fs.rmSync(stage, { recursive: true, force: true });
  fs.mkdirSync(stage, { recursive: true });

  for (const p of picks) {
    const src = path.join(dir, p.source);
    fs.copyFileSync(src, path.join(stage, p.outName));
    const destSite = path.join(dir, p.canonical);
    if (path.resolve(src) !== path.resolve(destSite)) {
      fs.copyFileSync(src, destSite);
    }
    console.log(
      p.outName.padEnd(28),
      'from',
      p.source.padEnd(28),
      p.dims,
      p.bytes + 'B',
      p.upgraded ? '(upgraded site)' : ''
    );
  }

  const zipPaths = [
    'C:/Users/Pico/Desktop/fisheye-team-photos.zip',
    path.join(root, 'fisheye-team-photos.zip'),
    path.join(root, 'public/fisheye-team-photos.zip'),
  ];

  for (const zp of zipPaths) {
    if (fs.existsSync(zp)) fs.unlinkSync(zp);
    execFileSync(
      'powershell',
      ['-NoProfile', '-Command', `Compress-Archive -Path '${stage}\\*' -DestinationPath '${zp}' -Force`],
      { stdio: 'inherit' }
    );
    console.log('wrote', zp, fs.statSync(zp).size);
  }

  // Verify zip entry count
  const entries = execFileSync(
    'powershell',
    [
      '-NoProfile',
      '-Command',
      "Add-Type -AssemblyName System.IO.Compression.FileSystem; $z=[IO.Compression.ZipFile]::OpenRead('C:/Users/Pico/Desktop/fisheye-team-photos.zip'); $z.Entries | ForEach-Object { $_.FullName + ' ' + $_.Length }; Write-Host ('ENTRY_COUNT=' + $z.Entries.Count); $z.Dispose()",
    ],
    { encoding: 'utf8' }
  );
  console.log(entries);
  console.log('COUNT', picks.length);
  for (const p of picks) {
    console.log('-', p.outName, '|', p.name, '|', p.role, '|', p.dims);
  }
})();
