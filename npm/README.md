# RapidLynk

RapidLynk is a high-performance, zero-knowledge CLI for bundling, encrypting, and sharing project directories securely

## Installation

Install globally via npm:

```bash
npm install -g rapidlynk
```

Or execute directly without installing:

```bash
npx rapidlynk --help
```

### Supported Platforms:
- **Windows** (x64, ARM64)
- **Linux** (x64, ARM64)
- **macOS** (Intel x64, Apple Silicon ARM64)

---

## Usage

### 1. Push (Bundle & Share)
From any project directory:

```bash
rapidlynk push
```

This will:
1. Archive your project (`.tar.gz`).
2. Encrypt it locally using AES-256-GCM.
3. Request a presigned URL from AWS Lambda.
4. Upload directly to Amazon S3.
5. Display a secret key (`<file_id>:<key>`).

### 2. Pull (Download & Decrypt)
On another machine:

```bash
rapidlynk pull <file_id>:<key>
```

This will download the encrypted bundle directly from Amazon S3 via a short-lived presigned GET URL, decrypt it locally with the key, and extract the project files into your current directory.

---

## Security Model
- Zero-knowledge encryption on the client machine using AES-256-GCM.
- Encryption key is never sent to the backend server.
- Files stored on Amazon S3 in encrypted format.

## License
MIT
