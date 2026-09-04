# Web Download & GitHub Releases Integration Guide

This guide explains how the website download button works, how GitHub Releases is connected to the website, and how to update the binary in future releases.

---

## 1. How It Works Under the Hood

### What Happens When a User Clicks "Download"?

```text
User Clicks "Download" Button
              │
              ▼
GET https://github.com/Galactic-git/rapidlynk/releases/latest/download/RapidLynk-Setup-latest-x64.exe
              │
              ▼
GitHub Resolves the "latest" Release (e.g., v1.0.1)
              │
              ▼
GitHub Returns HTTP 302 Redirect to CDN (objects.githubusercontent.com)
              │
              ▼
User's Browser Downloads the Real 6.05 MB Installer from GitHub's CDN
```

### Why Use GitHub's `/releases/latest/download/` Endpoint?

1. **Auto-Updating Link (No Code Changes Needed)**:
   - The URL `https://github.com/Galactic-git/rapidlynk/releases/latest/download/<filename>` is dynamic.
   - GitHub automatically resolves `latest` to whatever release is marked as the latest in your repo.
   - Whenever you publish a new version (e.g., `v1.0.2`), you **do not need to modify the website code or redeploy Vercel**. The button automatically downloads the newest version!

2. **Trusted Reputation (No Chrome "Suspicious Blocked" Alerts)**:
   - Directly downloading raw `.exe` files from dynamic hosting services like `*.vercel.app` triggers Google Safe Browsing warnings.
   - Hosting the binary on `github.com` eliminates this because GitHub is recognized worldwide by browsers and operating systems as a trusted software distribution source.

3. **High Performance**:
   - Downloads are delivered via GitHub's global CDN, keeping file transfers off Vercel's serverless bandwidth limits.

---

## 2. Where the Code Is Connected

In [`web/src/pages/DownloadPage.tsx`](file:///c:/projects/go/go_cli/web/src/pages/DownloadPage.tsx):

```tsx
<a
  href="https://github.com/Galactic-git/rapidlynk/releases/latest/download/RapidLynk-Setup-latest-x64.exe"
  className="inline-flex items-center justify-center rounded-full border border-purple-400/20 bg-purple-900 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-purple-800"
>
  Download RapidLynk for Windows (x64)
</a>
```

Notice the filename in the URL is `RapidLynk-Setup-latest-x64.exe`. As long as your GitHub release contains an asset with this exact name, the link works perpetually.

---

## 3. How to Update the Binary in Future Releases

When you make changes to the Go CLI and want to release a new installer version (e.g., `1.0.2`):

### Step 1: Update the Version Number
In [`cli/main.go`](file:///c:/projects/go/go_cli/cli/main.go):
```go
const version = "1.0.2"
```

### Step 2: Build the New Windows Installer
Run the installer build script in PowerShell from the project root:
```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\build-installer.ps1 -BuildBinary
```
This compiles the new Go binary and runs Inno Setup to create:
```
installer\Output\Rapidlynk-Setup-1.0.2-x64.exe
```

---

### Step 3: Publish to GitHub Releases

You have two easy ways to upload the new installer to GitHub:

#### Option A: Using the GitHub CLI (`gh`) (Fastest)

Create the new release and attach the installer under the standardized name `RapidLynk-Setup-latest-x64.exe`:

```powershell
gh release create v1.0.2 "installer\Output\Rapidlynk-Setup-1.0.2-x64.exe#RapidLynk-Setup-latest-x64.exe" --title "RapidLynk v1.0.2" --generate-notes
```

*(Note: The `#RapidLynk-Setup-latest-x64.exe` at the end ensures the uploaded asset name matches the link on the website).*

#### Option B: Updating an Existing Release

If you just want to update the binary on an existing release tag (like `v1.0.1`):
```powershell
gh release upload v1.0.1 "installer\Output\Rapidlynk-Setup-1.0.1-x64.exe#RapidLynk-Setup-latest-x64.exe" --clobber
```

#### Option C: Using the GitHub Website (Browser)

1. Open [https://github.com/Galactic-git/rapidlynk/releases/new](https://github.com/Galactic-git/rapidlynk/releases/new).
2. Set the tag (e.g. `v1.0.2`).
3. Set the release title and description.
4. Rename `installer\Output\Rapidlynk-Setup-1.0.2-x64.exe` to `RapidLynk-Setup-latest-x64.exe`.
5. Drag and drop `RapidLynk-Setup-latest-x64.exe` into the **Attach binaries** section.
6. Click **Publish release**.

---

### Step 4: Verification (That's It!)

Because the website link points to `/releases/latest/download/RapidLynk-Setup-latest-x64.exe`:
- You **do not** need to edit the website code.
- You **do not** need to redeploy to Vercel.
- Anyone clicking the download button on the site will instantly download the new installer!
