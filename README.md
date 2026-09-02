# Rapidlynk

![Rapidlynk](img/image.png)

Rapidlynk is a high-performance, zero-knowledge CLI and server for instant, encrypted project bundling and sharing powered by **Google Cloud Run** and **Google Cloud Storage (GCS)**.

## How it Works

```
rapidlynk push
      │
      ▼
Bundle project (tar.gz)
      │
      ▼
Encrypt with AES-256-GCM (project.enc)
      │
      ▼
Ask Cloud Run for upload URL (POST /api/upload-url)
      │
      ▼
Cloud Run generates:
  • File ID
  • Signed Upload URL (HTTP PUT)
      │
      ▼
CLI receives URL
      │
      ▼
CLI automatically uploads project.enc
      │
      ▼
Google Cloud Storage
      │
      ▼
CLI displays secret (<file_id>:<key>)
```

## Setup & Usage

### Prerequisites
- [Go](https://golang.org/doc/install) (version 1.22+)
- Google Cloud Project with a GCS bucket

### 1. Build the CLI
```bash
go build -o rapidlynk.exe ./cli
```

### 2. Push a Project
Run `rapidlynk push` from any project root directory:
```bash
./rapidlynk.exe push
```
Output:
```
📦 Bundling project...
🔒 Encrypting with AES-256-GCM...
☁️ Requesting upload URL from Cloud Run...
🚀 Uploading project.enc to Google Cloud Storage...

✅ Upload complete! Share this secret:
----------------------------------------
9a8b7c6d5e4f...:u_4a9x8F...
----------------------------------------
```

### 3. Pull a Project
Recipients pull and extract with the generated secret:
```bash
./rapidlynk.exe pull 9a8b7c6d5e4f...:u_4a9x8F...
```

---

## Server Deployment (Google Cloud Run)

### 1. Build and Deploy with Cloud Build
```bash
gcloud run deploy rapidlynk-server \
  --source . \
  --region asia-south1 \
  --service-account rapidlynk-sa@rapidlynk-504704.iam.gserviceaccount.com \
  --set-env-vars GCS_BUCKET=rapidlynk-storage,GCS_SERVICE_ACCOUNT=rapidlynk-sa@rapidlynk-504704.iam.gserviceaccount.com \
  --allow-unauthenticated
```

### 2. Configure CLI Server Endpoint
Point your CLI to your deployed Cloud Run URL:
```bash
# Windows PowerShell
$env:RAPIDLYNK_SERVER="https://rapidlynk-server-xxxxxx.a.run.app"

# Linux / macOS
export RAPIDLYNK_SERVER="https://rapidlynk-server-xxxxxx.a.run.app"
```
