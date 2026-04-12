#!/usr/bin/env bash
set -euo pipefail
VERSION="${1:-0.5.50}"
DIST="$(pwd)/dist"
mkdir -p "$DIST"

build(){
  local os="$1"; local arch="$2"; local name="$3";
  echo "Building ${os}/${arch} ..."
  GOOS="$os" GOARCH="$arch" go build -o "$DIST/$name" ./cli
}

build windows amd64 rapidlynk-windows-amd64.exe
build windows arm64 rapidlynk-windows-arm64.exe
build linux   amd64 rapidlynk-linux-amd64
build linux   arm64 rapidlynk-linux-arm64
build darwin  amd64 rapidlynk-darwin-amd64
build darwin  arm64 rapidlynk-darwin-arm64

mkdir -p npm/vendor
cp -f "$DIST"/* npm/vendor/
echo "Builds in $DIST"
