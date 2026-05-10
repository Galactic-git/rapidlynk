# Rapidlynk — Full Architecture

## Overview

Rapidlynk is a Go-based CLI tool for packaging and sharing project files. It bundles a directory into a tar.gz, optionally encrypts, uploads to a central server, and returns a shareable ID or channel name. Recipients pull by that ID/channel to download and extract.

**Stack:**
- **CLI**: Go (single module `go_cli`, Go 1.25, dependency: `golang.org/x/crypto`)
- **Server**: Go HTTP server on port 8080 (stdlib `net/http`)
- **Web**: React 18 + TypeScript + Vite 5 + Tailwind CSS 3 (static SPA)

**Version**: 0.5.50

---

## Directory Map

```
go_cli/
├── cli/                    # Go CLI source (7 files, ~350 lines total)
│   ├── main.go             # Entry point, command routing, version/usage
│   ├── push.go             # `push` command: archive → encrypt? → upload
│   ├── pull.go             # `pull` command: download → decrypt? → extract
│   ├── archive.go          # Creates tar.gz of current directory
│   ├── crypto.go           # AES-256-GCM encrypt/decrypt
│   ├── http.go             # HTTP client (multipart upload, download)
│   └── keys.go             # HKDF key derivation + env/file key resolution
├── server/                 # Go HTTP server (7 files)
│   ├── main.go             # Entry point, starts :8080
│   ├── routes.go           # Route table (mux)
│   ├── config/
│   │   └── config.go       # MaxUploadSize = 100MB (declared, not enforced)
│   ├── handlers/
│   │   ├── upload.go       # POST /upload — receives multipart file
│   │   ├── download.go     # GET /download/{id} — serves + deletes (one-shot)
│   │   └── download_by_channel.go  # GET /download/by-channel/{name} — serves, no delete
│   ├── storage/
│   │   ├── local.go        # Filesystem helpers (GetPath, Open, Stat)
│   │   └── channels.go     # Channel→ID mapping, persisted to JSON
│   └── utils/
│       └── id.go           # Generate 128-bit hex ID (crypto/rand)
├── web/                    # React SPA marketing site
│   ├── src/
│   │   ├── main.tsx        # React entry, BrowserRouter + StrictMode
│   │   ├── App.tsx         # Root component: SiteLayout + Routes
│   │   ├── styles/index.css # Tailwind + custom utility classes
│   │   ├── content/siteContent.ts  # Static data (blog posts, doc cards, etc.)
│   │   ├── layouts/SiteLayout.tsx  # Shared shell: Header + bg + Footer
│   │   ├── components/     # 8 components (Header, Footer, ButtonLink, FeatureCard, etc.)
│   │   └── pages/          # 5 active + 2 hidden pages
│   ├── public/
│   │   ├── images/logo.png
│   │   └── downloads/RapidLynk-Setup-latest-x64.exe
│   ├── vite.config.ts
│   ├── tailwind.config.cjs  # Custom theme (abyss/purple palette)
│   └── tsconfig.json
├── npm/                    # npm distribution package (v0.5.50)
│   ├── package.json        # bin → bin/rapidlynk.js, postinstall
│   ├── bin/rapidlynk.js    # Node.js launcher: detects platform, spawns Go binary
│   └── vendor/             # Populated at build time by scripts/
├── rapidlynk-npm/          # Older npm package (v0.4.2, alternative approach)
│   ├── package.json
│   ├── install.js          # Copies binary to global bin on postinstall
│   └── bin/                # Pre-built Go binaries per platform
├── installer/              # Windows Inno Setup
│   ├── rapidlynk.iss       # Inno Setup 6 script
│   └── Output/             # Generated setup exe
├── scripts/                # Build automation
│   ├── build-all.sh        # Cross-compile 6 platforms → dist/ + npm/vendor/
│   ├── build-all.ps1       # PowerShell version
│   └── build-installer.ps1 # Build Windows installer
├── storage/                # Server runtime data
│   ├── channels.json       # { "channels": { "name": "hexid", ... } }
│   └── *.tar.gz            # Uploaded bundles (named by 32-char hex ID)
├── bin/                    # Pre-built binaries (darwin-arm64/x64, linux-x64)
├── img/image.png           # Logo for README
├── dist/                   # Build output (6 platform binaries)
├── go.mod / go.sum
├── README.md
└── LICENSE (MIT)
```

---

## CLI (`cli/`) — Deep Dive

### Entry Point: `main.go`

```go
const VERSION = "0.5.50"
```

Dispatches on `os.Args[1]`:
- `-v` / `--version` / `version` → prints version
- `push` → `handlePush(channel)` with optional `-c <channel>` flag
- `pull` → `handlePull(secret)` (legacy) or `handlePullByChannel(channel)` with `-c <channel>`
- `--help` / `-h` → usage
- default → "? Unknown command" + usage

### Push Flow (`push.go`)

1. `createArchive("rapidlynk_bundle.tar.gz")` — archives current directory
2. **Without `-c`** (legacy encrypted mode):
   - Encrypts the tar.gz via `encryptFile()` → `rapidlynk_bundle.enc`
   - Uploads `.enc` to server → gets back 32-char hex ID
   - Prints `id:base64key` for sharing
3. **With `-c <channel>`** (channel mode):
   - Uploads plain `.tar.gz` with channel form field
   - Server maps channel→ID automatically
4. Cleans up temp files

### Pull Flow (`pull.go`)

1. **Without `-c`**: Parses `<id:key>` string → downloads encrypted file → decrypts → extracts with `tar -xzf`
2. **With `-c <channel>`**: Downloads plain tar.gz by channel name → extracts directly
3. Cleans up temp files

### Archive (`archive.go`)

- Walks current directory, creates `.tar.gz`
- Skips: `.git/`, existing tarballs, `.enc` files, `rapidlynk.exe`

### Crypto (`crypto.go`)

- **Encryption**: AES-256-GCM with random 32-byte key + random nonce. Key returned base64-encoded. Ciphertext format: `nonce || ciphertext`
- **Decryption**: Base64-decodes key, extracts nonce from ciphertext prefix, decrypts with AES-256-GCM

### HTTP Client (`http.go`)

- **Default server**: `http://35.54.94.11:8080` (overridable via `RAPIDLYNK_SERVER` env var)
- `uploadFile(path, channel?)` → multipart POST to `/upload`
- `downloadFile(id, output)` → GET `/download/<id>`
- `downloadFileByChannel(channel, output)` → GET `/download/by-channel/<channel>`

### Key Management (`keys.go`)

Key resolution priority for channel-based operations:

1. `RAPIDLYNK_KEY_CHANNEL_<channel>` env var (per-channel override)
2. `RAPIDLYNK_KEY` env var (global override)
3. `~/.rapidlynk/keys.json` → `channels[channel]`
4. HKDF-derived key from master secret:
   - Master secret source: `RAPIDLYNK_MASTER` env var OR `~/.rapidlynk/config.json` → `master_secret`
   - HKDF-SHA-256 with channel name as salt, `"rapidlynk-hkdf-v1"` as info
5. If nothing works → error with setup instructions

### Build & Distribution

- **Cross-compilation**: `GOOS=windows/darwin/linux GOARCH=amd64/arm64 go build -o dist/rapidlynk-{os}-{arch}{.exe} cli/`
- Output goes to `dist/` → copied to `npm/vendor/` for npm publishing
- Windows installer: Inno Setup 6 via `scripts/build-installer.ps1`

---

## Server (`server/`) — Deep Dive

### Entry Point

`main.go` starts `http.ListenAndServe(":8080", mux)`. No middleware, no logging framework, no CORS.

### Routes (`routes.go`)

| Method | Path | Handler | File |
|--------|------|---------|------|
| POST | `/upload` | `UploadHandler` | `handlers/upload.go` |
| GET | `/download/{id}` | `DownloadHandler` | `handlers/download.go` |
| GET | `/download/by-channel/{name}` | `DownloadByChannelHandler` | `handlers/download_by_channel.go` |

Uses `http.ServeMux` (Go 1.22+ pattern syntax: `{id}` and `{name}`).

### Upload Handler

1. Only accepts POST (returns 405 otherwise)
2. Reads multipart form file from field `"file"`
3. Optionally reads `"channel"` form value → maps channel→ID via `SetChannel()`
4. Generates random 128-bit hex ID (32 chars) via `utils.GenerateID()`
5. Saves to `./storage/{id}.tar.gz`
6. Calls `out.Sync()` for durability
7. Returns ID as plain text response body

### Download Handler (Legacy / One-shot)

1. Extracts ID from `/download/{id}` path
2. Looks up `./storage/{id}.tar.gz`
3. Returns 404 if not found
4. Uses `http.ServeContent` (supports range requests)
5. **After serving, closes and DELETES the file** — one-shot behavior

### Download By Channel Handler

1. Extracts channel name from `/download/by-channel/{name}`
2. Resolves channel→ID via `storage.GetChannelID()`
3. Returns 400 if no channel name, 404 if unknown
4. Streams file via `http.ServeContent`
5. **Does NOT delete** — supports repeated pulls

### Storage Layer

**`local.go`** — Simple filesystem abstraction:
- `StorageDir = "./storage"`
- `GetPath(id)` → `./storage/{id}.tar.gz`
- `Open(path)` / `Stat(path)` wrappers over `os.Open` / `os.Stat`

**`channels.go`** — Channel name ↔ ID mapping:
- Persisted to `./storage/channels.json` as `{"channels": {"name": "hexid"}}`
- Uses `sync.RWMutex` for concurrent access
- `SetChannel(name, id)` → maps + writes JSON
- `GetChannelID(name)` → returns ID + bool
- Note: double-checked locking pattern reads `loaded` boolean outside lock (potential race)

### ID Generation

`utils.GenerateID()` → `crypto/rand` reads 16 bytes → hex-encodes to 32-character string.

---

## Web (`web/`) — Deep Dive

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 |
| Language | TypeScript (strict mode) |
| Bundler | Vite 5 |
| Routing | React Router v6 |
| CSS | Tailwind CSS 3 + PostCSS + Autoprefixer |

### Architecture

- **`main.tsx`**: Mounts React into `index.html`'s `<div id="root">`, wrapped in `<BrowserRouter>` + `<StrictMode>`
- **`App.tsx`**: Root component with `<SiteLayout>` + `<Routes>`
- **`SiteLayout.tsx`**: Shared shell: dark abyss background with grid/hero overlays, `<Header>` + `<main>` + `<Footer>`
- **Static SPA**: No backend API calls, all content hardcoded in TypeScript files

### Routing Table

| Path | Component | Status |
|------|-----------|--------|
| `/` | `HomePage` | Active |
| `/download` | `DownloadPage` | Active |
| `/docs` | `DocsPage` | Hidden (code exists, commented out) |
| `/learn` | `LearnPage` | Active |
| `/about` | `AboutPage` | Active |
| `/blog` | `BlogPage` | Hidden (code exists, commented out) |
| `/contribute` | `ContributePage` | Active |
| `*` | Redirect to `/` | Active |

### Component Catalog (8 components)

| Component | Role |
|-----------|------|
| `Header` | Sticky navbar: logo, nav links, Download CTA |
| `Footer` | Minimal footer with About/Contribute links |
| `ButtonLink` | Styled `<Link>` with variant system (primary/secondary/light) |
| `FeatureCard` | Rounded card for feature blurbs |
| `PageHero` | Consistent page header (pill label + h1 + description) |
| `Section` | Scroll-anchored section container |
| `CodePanel` | Terminal-like panel with macOS traffic lights + code lines |
| `TerminalDemo` | Rich terminal demo with colored output lines |

### Pages Detail

- **HomePage** (151 lines): Hero, terminal demos (push/pull), feature cards grid, channels section
- **DownloadPage** (42 lines): Direct download link to exe + install checklist
- **LearnPage** (352 lines): Most complex — left sidebar nav (10 items), client-side tab switching via `useState`/`useMemo`, covers overview, channels, encryption, CI/CD, etc.
- **AboutPage** (217 lines): Full pipeline explanation, comparison tables, design philosophy
- **ContributePage** (46 lines): GitHub link + contribution ideas

### Design System (Tailwind)

Custom theme tokens: `abyss` (#07070b), `panel` (#0f1020), `panelSoft` (#16172b), `border` (#262843), `purple-300..600`. Custom CSS component classes: `.container-shell`, `.section-title`, `.section-copy`, `.card-surface`, `.pill-label`. Dark-only theme (`color-scheme: dark`).

### Static Content

`siteContent.ts` exports: `posts` (3 blog entries), `docsCards`, `learnCards`, `aboutCards` — all hardcoded data.

---

## Sharing Modes

### Mode 1: Legacy (Encrypted, One-shot)

```
SENDER:
  push → archive → AES-256-GCM encrypt → upload .enc → receive id
  Share: "id:base64key"

RECIPIENT:
  pull id:key → download .enc by id → decrypt → extract
  File DELETED from server after download
```

### Mode 2: Channel (Unencrypted, Reusable)

```
SENDER:
  push -c channelname → archive → upload tar.gz + channel name
  Server maps channel → id in channels.json

RECIPIENT:
  pull -c channelname → server resolves channel → id → serves tar.gz
  File NOT deleted — reusable
```

---

## Distribution Channels

### npm (`npm/`)
- Version 0.5.50
- Node.js launcher (`bin/rapidlynk.js`) detects platform/arch, spawns correct Go binary from `vendor/`
- `postinstall` script runs `chmod +x`
- Built via `scripts/build-all.*` → copies binaries from `dist/` to `npm/vendor/`

### Legacy npm (`rapidlynk-npm/`)
- Version 0.4.2
- Postinstall script (`install.js`) copies binary from `bin/` to global npm bin
- Pre-built binaries included directly in `bin/`

### Windows Installer (`installer/`)
- Inno Setup 6
- Installs to `%LocalAppData%\Programs\Rapidlynk\`
- Adds to user PATH (cleans up on uninstall)
- Built via `scripts/build-installer.ps1`

### Web Download
- `web/public/downloads/RapidLynk-Setup-latest-x64.exe` served statically

---

## Build Pipeline

```
cli/*.go (source)
  │
  ├─[scripts/build-all.sh|ps1]──► dist/
  │   rapidlynk-windows-amd64.exe
  │   rapidlynk-windows-arm64.exe
  │   rapidlynk-linux-amd64
  │   rapidlynk-linux-arm64
  │   rapidlynk-darwin-amd64
  │   rapidlynk-darwin-arm64
  │
  ├─► npm/vendor/ (copied from dist/)
  │       └─► npm publish
  │
  └─[scripts/build-installer.ps1]──► installer/Output/
          RapidLynk-Setup-{version}-x64.exe

web/ (React source)
  │
  └─► tsc + vite build → web/dist/
```

---

## Key Design Decisions & Gotchas

1. **No server-side encryption** — all crypto happens on CLI. Server is encryption-agnostic.
2. **One-shot legacy downloads** — `/download/{id}` deletes file after first serve. No replay.
3. **Persistent channel downloads** — `/download/by-channel/{name}` never deletes. Channel always returns latest upload.
4. **MaxUploadSize (100MB) is declared but never enforced** — `config/config.go` sets `MaxUploadSize = 100 << 20` but no `http.MaxBytesReader` or similar check exists.
5. **Potential race condition** in `storage/channels.go` — `loaded` boolean read outside mutex lock in double-checked locking pattern.
6. **No orphan cleanup** — legacy-mode uploads only deleted on download. If never downloaded, they accumulate forever in `storage/`.
7. **No middleware** — no auth, rate limiting, CORS, logging middleware, or health endpoint on server.
8. **Key derivation flexibility** — supports env vars, JSON config files, and HKDF from master secret with 4 levels of priority.
9. **Web is totally static** — no API calls, no SSR, purely client-side React SPA.
10. **Two npm packages** — `npm/` (v0.5.50, JS launcher) and `rapidlynk-npm/` (v0.4.2, postinstall copy) represent different distribution strategies.

---

## Network Architecture

```
┌──────────────┐     HTTP (multipart/GET)      ┌──────────────────┐
│   CLI (Go)   │ ──────────────────────────────│  Server (Go)     │
│   push/pull  │                                │  :8080           │
│   encrypt    │  Default: 35.54.94.11:8080     │  /upload         │
│   decrypt    │  Override: RAPIDLYNK_SERVER     │  /download/{id}  │
└──────────────┘                                └────────┬─────────┘
                                                         │
                                              ┌──────────▼─────────┐
                                              │  storage/          │
                                              │  channels.json     │
                                              │  {id}.tar.gz       │
                                              └────────────────────┘

┌──────────────┐
│  Web (React) │   Static SPA — no server dependency
│  Marketing   │   Serves Windows installer binary
│  Site        │
└──────────────┘
```
