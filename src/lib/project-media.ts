import crypto from "crypto";
import fs from "fs";
import path from "path";

/** Filename / path patterns for FISHEYE brand logos (incl. logo_2023). */
const LOGO_PATH_RE =
  /logo(?:[_-]?\d{4})?|logo_2023_fin|\/images\/brand\//i;

/**
 * MD5 hashes of known FISHEYE logo assets:
 * - scraped 180×180 wordmark + 100×100 mark (renamed into project galleries)
 * - files under public/images/brand/
 */
const KNOWN_LOGO_MD5 = new Set([
  "0d19e815c8d8464ec16ad50c1228e8e7",
  "50b552fd820f0dd3b494910918848df0",
  "197383aa44700354ddc42120ef07504f",
  "614a6db27cc3184816b68e981b604059",
  "9f85e7a4d706834fd7325010d6810fc9",
  "a2be505a969642d6acc9b0eb4ce261a8",
  "fd2668475ec67dac5c118542770e7b12",
  "ae0a9faf341b05e025bb73c517ade168",
]);

function publicFilePath(src: string): string {
  const rel = src.replace(/^\//, "");
  return path.join(process.cwd(), "public", rel);
}

/** True when `src` is a company logo, not a project photo. */
export function isProjectLogoAsset(src: string): boolean {
  if (!src) return false;
  if (LOGO_PATH_RE.test(src)) return true;

  try {
    const file = publicFilePath(src);
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) return false;
    const buf = fs.readFileSync(file);
    const hash = crypto.createHash("md5").update(buf).digest("hex");
    return KNOWN_LOGO_MD5.has(hash);
  } catch {
    return false;
  }
}

/** Drop logo assets from a gallery list (render-time safety net). */
export function filterProjectGallery(gallery: string[]): string[] {
  return gallery.filter((src) => !isProjectLogoAsset(src));
}

/** Prefer a non-logo cover; fall back to the first remaining gallery photo. */
export function resolveProjectCover(
  cover: string,
  gallery: string[]
): string {
  if (!isProjectLogoAsset(cover)) return cover;
  return gallery.find((src) => !isProjectLogoAsset(src)) ?? cover;
}
