#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const binDir = path.dirname(process.argv[1]);
// process.argv[1] points to the npm shim location

const src = path.join(__dirname, "bin", "rapidlynk-win-x64.exe");
const dest = path.join(binDir, "rapidlynk.exe");

if (!fs.existsSync(src)) {
  console.error("❌ Binary not found:", src);
  process.exit(1);
}

fs.copyFileSync(src, dest);
fs.chmodSync(dest, 0o755);

console.log("✅ RapidLynk installed successfully");
