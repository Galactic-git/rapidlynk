# RapidLynk

RapidLynk is a high-performance, zero-knowledge CLI for instant, encrypted project bundling and sharing powered by Google Cloud Run and Google Cloud Storage (GCS).

## Installation

Install globally via npm:

```bash
npm install -g rapidlynk
```

Or execute directly without installing:

```bash
npx rapidlynk --help
```

Supported Platforms:
- **Windows** (x64, ARM64)
- **Linux** (x64, ARM64)
- **macOS** (Intel x64, Apple Silicon ARM64)

## Usage

### 1. Push (Bundle & Share)
From any project directory:

```bash
rapidlynk push
```

This will:
1. Archive your project (`.tar.gz`).
2. Encrypt it locally using AES-256-GCM.
3. Upload to secure Google Cloud Storage via signed URL.
4. Provide a secret key (`<file_id>:<key>`).

### 2. Pull (Download & Decrypt)
On another machine:

```bash
rapidlynk pull <file_id>:<key>
```

This will download the encrypted bundle from GCS, decrypt it locally with the key, and extract the project files into your current directory.

## License
MIT
