#!/usr/bin/env node
const { spawnSync } = require('node:child_process');
const { platform, arch } = require('node:process');
const path = require('node:path');
const fs = require('node:fs');

function pickBinary() {
  const plat = platform; // 'win32','linux','darwin'
  const cpu = arch; // 'x64','arm64'
  let file;
  if (plat === 'win32' && cpu === 'x64') file = 'rapidlynk-windows-amd64.exe';
  else if (plat === 'win32' && cpu === 'arm64') file = 'rapidlynk-windows-arm64.exe';
  else if (plat === 'linux' && cpu === 'x64') file = 'rapidlynk-linux-amd64';
  else if (plat === 'linux' && cpu === 'arm64') file = 'rapidlynk-linux-arm64';
  else if (plat === 'darwin' && cpu === 'x64') file = 'rapidlynk-darwin-amd64';
  else if (plat === 'darwin' && cpu === 'arm64') file = 'rapidlynk-darwin-arm64';
  else throw new Error(`Unsupported platform/cpu: ${plat}/${cpu}`);
  return path.join(__dirname, '..', 'vendor', file);
}

if (process.argv.includes('--postinstall')) {
  try { if (platform !== 'win32') fs.chmodSync(pickBinary(), 0o755); } catch {}
  process.exit(0);
}

const exe = pickBinary();
const args = process.argv.slice(2);
const r = spawnSync(exe, args, { stdio: 'inherit' });
process.exit(r.status ?? 1);
