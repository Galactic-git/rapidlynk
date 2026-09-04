# RapidLynk Multi-Platform Build & NPM Publishing Guide

This guide details how to version, cross-compile, verify, and publish the RapidLynk CLI binaries across all supported operating systems (Windows, Linux, macOS).

---

## 1. Directory Overview: `npm/` vs `rapidlynk-npm/`

| Directory | Status | Purpose |
| :--- | :--- | :--- |
| **`npm/`** | **Active & Production** | Contains the modern, reliable npm distribution. It uses a lightweight Node.js launcher ([`npm/bin/rapidlynk.js`](file:///c:/projects/go/go_cli/npm/bin/rapidlynk.js)) that automatically detects the host OS/architecture (`process.platform`, `process.arch`) at runtime and executes the corresponding native binary from [`npm/vendor/`](file:///c:/projects/go/go_cli/npm/vendor/). |
| **`rapidlynk-npm/`** | **Legacy / Deprecated** | An older experimental approach using an `install.js` postinstall script that tried to manually copy files to `process.env.npm_config_prefix`. This approach is brittle (fails in many CI environments, yarn/pnpm, non-standard prefixes, and `npx`). **Do not use this directory for publishing.** It can be safely deleted or archived. |

---

## 2. Files Involved When Changing the Version

When cutting a new release (e.g., bumping to `1.0.0`), ensure the version is synchronized across these files:

1. **[`cli/main.go`](file:///c:/projects/go/go_cli/cli/main.go)**:
   ```go
   const version = "1.0.0"
   ```
   *Controls the output of `rapidlynk --version`.*

2. **[`npm/package.json`](file:///c:/projects/go/go_cli/npm/package.json)**:
   ```json
   "version": "1.0.0",
   ```
   *Controls the npm registry package version.*

3. **[`scripts/build-all.ps1`](file:///c:/projects/go/go_cli/scripts/build-all.ps1)** (PowerShell) & **[`scripts/build-all.sh`](file:///c:/projects/go/go_cli/scripts/build-all.sh)** (Bash):
   ```powershell
   param(
     [string]$Version = "1.0.0"
   )
   ```
   *Sets the default build script version.*

4. *(Optional - Windows InnoSetup installer)* **[`installer/rapidlynk.iss`](file:///c:/projects/go/go_cli/installer/rapidlynk.iss)**:
   ```iss
   #define AppVersion "1.0.0"
   ```

---

## 3. Step-by-Step Build & Publish Process

### Step 1: Update Version Numbers
Update the version string in the files listed in Section 2 above.

---

### Step 2: Build Binaries for All 3 OSes (6 Architectures)

From the project root (`c:\projects\go\go_cli`):

- **On Windows (PowerShell)**:
  ```powershell
  powershell -ExecutionPolicy Bypass -File .\scripts\build-all.ps1
  ```
- **On macOS / Linux (Bash)**:
  ```bash
  chmod +x ./scripts/build-all.sh
  ./scripts/build-all.sh
  ```

#### What this command does:
1. Cross-compiles Go binaries for 6 platform targets:
   - `windows/amd64` &rarr; `dist/rapidlynk-windows-amd64.exe`
   - `windows/arm64` &rarr; `dist/rapidlynk-windows-arm64.exe`
   - `linux/amd64`   &rarr; `dist/rapidlynk-linux-amd64`
   - `linux/arm64`   &rarr; `dist/rapidlynk-linux-arm64`
   - `darwin/amd64`  &rarr; `dist/rapidlynk-darwin-amd64` (macOS Intel)
   - `darwin/arm64`  &rarr; `dist/rapidlynk-darwin-arm64` (macOS Apple Silicon)
2. Copies all 6 compiled executables into the [`npm/vendor/`](file:///c:/projects/go/go_cli/npm/vendor/) directory ready for npm packaging.

---

### Step 3: Verify Binaries Locally

Before publishing, verify the local builds to prevent publishing broken packages:

1. **Verify the direct binary output**:
   ```powershell
   & .\npm\vendor\rapidlynk-windows-amd64.exe --version
   # Expected output: rapidlynk version 1.0.0
   ```

2. **Verify the Node launcher wrapper**:
   ```powershell
   node .\npm\bin\rapidlynk.js --version
   # Expected output: rapidlynk version 1.0.0
   ```

3. **Verify CLI help / usage**:
   ```powershell
   node .\npm\bin\rapidlynk.js --help
   ```

4. **Verify npm package contents (Dry Run)**:
   ```powershell
   cd npm
   npm pack --dry-run
   ```
   *Verify that all 6 target binaries, `bin/rapidlynk.js`, `README.md`, `LICENSE`, and `package.json` are listed in the tarball contents.*

---

### Step 4: Publish to NPM

Once verified, publish the package from the `npm/` directory:

```powershell
# 1. Navigate to the npm package directory
cd c:\projects\go\go_cli\npm

# 2. Authenticate with your npm account (if not already logged in)
npm login

# 3. Publish public package
npm publish --access public
```

---

## 4. End-User Installation

Once published, users across Windows, Linux, and macOS can install and run RapidLynk immediately:

```bash
# Global install via npm
npm install -g rapidlynk

# Or run directly via npx without manual installation
npx rapidlynk --help
```

---

## 5. Website Installer Downloads

For details on how the website download button connects to GitHub Releases and how to update future installer binaries, see [WEB_RELEASES.md](WEB_RELEASES.md).

