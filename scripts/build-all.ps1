param(
  [string]$Version = "0.5.50"
)
$ErrorActionPreference='Stop'
$targets = @(
  @{GOOS='windows'; GOARCH='amd64'; SUF='.exe';  NAME='rapidlynk-windows-amd64.exe'},
  @{GOOS='windows'; GOARCH='arm64'; SUF='.exe';  NAME='rapidlynk-windows-arm64.exe'},
  @{GOOS='linux';   GOARCH='amd64'; SUF='';      NAME='rapidlynk-linux-amd64'},
  @{GOOS='linux';   GOARCH='arm64'; SUF='';      NAME='rapidlynk-linux-arm64'},
  @{GOOS='darwin';  GOARCH='amd64'; SUF='';      NAME='rapidlynk-darwin-amd64'},
  @{GOOS='darwin';  GOARCH='arm64'; SUF='';      NAME='rapidlynk-darwin-arm64'}
)
$dist = Join-Path (Get-Location) 'dist'
New-Item -Force -ItemType Directory $dist | Out-Null

foreach($t in $targets){
  Write-Host "Building $($t.GOOS)/$($t.GOARCH) ..."
  $env:GOOS=$t.GOOS; $env:GOARCH=$t.GOARCH
  $out = Join-Path $dist $t.NAME
  & go build -o $out ./cli
}

# Stage for npm vendor folder
$vendor = Join-Path (Get-Location) 'npm/vendor'
New-Item -Force -ItemType Directory $vendor | Out-Null
Copy-Item -Force $dist/* $vendor/
Write-Host "Builds in" $dist
