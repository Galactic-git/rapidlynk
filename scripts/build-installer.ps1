param(
  [switch]$BuildBinary,
  [string]$BinaryPath = "",
  [string]$IssPath = "installer\rapidlynk.iss"
)

$ErrorActionPreference = "Stop"

function Resolve-IsccPath {
  $command = Get-Command ISCC.exe -ErrorAction SilentlyContinue
  if ($command) {
    return $command.Source
  }

  $candidates = @(
    "${env:ProgramFiles(x86)}\Inno Setup 6\ISCC.exe",
    "${env:ProgramFiles}\Inno Setup 6\ISCC.exe"
  )

  foreach ($candidate in $candidates) {
    if (Test-Path $candidate) {
      return $candidate
    }
  }

  throw "ISCC.exe not found. Install Inno Setup 6 or add ISCC.exe to PATH."
}

function Get-ReleaseVersion {
  $mainGo = Get-Content "cli\main.go" -Raw
  $match = [regex]::Match($mainGo, 'const version = "([^"]+)"')
  if (-not $match.Success) {
    throw "Could not parse version from cli\main.go"
  }
  return $match.Groups[1].Value
}

$version = Get-ReleaseVersion

if (-not $BinaryPath) {
  $BinaryPath = "dist\rapidlynk-windows-amd64.exe"
}

if ($BuildBinary) {
  Write-Host "Building Windows x64 CLI binary..."
  $env:GOOS = "windows"
  $env:GOARCH = "amd64"
  go build -o $BinaryPath ./cli
}

if (-not (Test-Path $BinaryPath)) {
  throw "Installer input binary not found: $BinaryPath"
}

if (-not (Test-Path $IssPath)) {
  throw "Installer script not found: $IssPath"
}

$resolvedIscc = Resolve-IsccPath
$resolvedBinary = (Resolve-Path $BinaryPath).Path
$resolvedIss = (Resolve-Path $IssPath).Path
$outputBase = "Rapidlynk-Setup-$version-x64"

Write-Host "Compiling installer for Rapidlynk $version"
Write-Host "Binary: $resolvedBinary"
Write-Host "ISCC:   $resolvedIscc"

& $resolvedIscc "/DAppVersion=$version" "/DBinarySource=$resolvedBinary" "/DOutputBaseName=$outputBase" $resolvedIss

if ($LASTEXITCODE -ne 0) {
  throw "Inno Setup compilation failed with exit code $LASTEXITCODE"
}

Write-Host "Installer created under installer\Output\$outputBase.exe"
