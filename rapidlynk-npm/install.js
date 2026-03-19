#!/usr/bin/env node

const os = require("os");
const fs = require("fs");
const path = require("path");

const platform = os.platform(); // win32, linux, darwin
const arch = os.arch();         // x64, arm64

let binaryName;
console.log(
  "▶ install.js running on",
  process.platform,
  process.arch
);


if (platform === "win32" && arch === "x64") {
  binaryName = "rapidlynk-win-x64.exe";
} else if (platform === "linux" && arch === "x64") {
  binaryName = "rapidlynk-linux-x64";
} else if (platform === "darwin" && arch === "x64") {
  binaryName = "rapidlynk-darwin-x64";
} else if (platform === "darwin" && arch === "arm64") {
  binaryName = "rapidlynk-darwin-arm64";
} else {
  console.error(`❌ RapidLynk not supported on ${platform} (${arch})`);
  process.exit(1);
}

const src = path.join(__dirname, "bin", binaryName);

// ✅ Correct npm global bin directory
const prefix = process.env.npm_config_prefix;
if (!prefix) {
  console.error("❌ npm prefix not found");
  process.exit(1);
}

const binDir =
  platform === "win32"
    ? prefix
    : path.join(prefix, "bin");

const dest = path.join(
  binDir,
  platform === "win32" ? "rapidlynk.exe" : "rapidlynk"
);

if (!fs.existsSync(src)) {
  console.error("❌ Binary not found:", src);
  process.exit(1);
}

fs.copyFileSync(src, dest);
fs.chmodSync(dest, 0o755);

console.log(`✅ RapidLynk installed (${platform}-${arch})`);
