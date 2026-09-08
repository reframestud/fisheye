# Fisheye local

## Why you saw error 4058

Windows Node `ENOENT` (errno **-4058**) means a file or folder was missing. This project had content mirrors (`source-mirror/`) but **no Next.js app** yet, so `npm run dev` / `next` failed looking for `package.json` / app entry.

## Start the site (Windows)

```powershell
cd C:\Users\Pico\Documents\Projects-Reframe\fisheye
npm install
npm run dev
```

Open **http://localhost:3456** on the Windows PC.

## From your Mac

`3456` is already in your `my-pc` SSH forwards. Connect with `ssh my-pc`, then open **http://localhost:3456** in Chrome.
