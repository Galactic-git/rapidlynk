

---

# RapidLynk 

**RapidLynk** is a minimal, terminal-first tool to **privately share entire project folders** with a single command — no Git, no cloud accounts, no UI.

Push a project.
Get a code.
Pull it anywhere.

---

##  What RapidLynk Does

*  Bundles your project into a single archive
*  Uploads it to a server
*  Returns a private, unguessable ID
* Lets others download and extract the project using that ID
*  Private by default
*  Designed for developers, not filesharing UIs

---

##  Why RapidLynk?

Sometimes you just want to:

* Share a project quickly
* Send code to a teammate
* Move a project between machines
* Avoid Git history, remotes, and permissions

RapidLynk focuses on **speed, simplicity, and privacy**.

---

##  Installation

### Using npm (Recommended)

```bash
npm install -g rapidlynk
```

Verify:

```bash
rapidlynk --help
```

> Node.js is required **only for installation**.
> RapidLynk runs as a native Go binary at runtime.

---

##  Usage

### Push a project

From inside any project directory:

```bash
rapidlynk push
```

Output:

```
✅ Share this id:
abcd1234efgh5678
```

---

### Pull a project

From any directory:

```bash
rapidlynk pull abcd1234efgh5678
```

This downloads and extracts the project into the current directory.

---

## 📁 What Gets Included

* All files in the current directory
* Folder structure preserved
* File permissions preserved

### Automatically excluded

* `.git/`

> More ignore rules coming soon.

---

## 🔐 Security Model (MVP)

* Files are **private by default**
* Access is controlled via long, random IDs
* No authentication required (for now)
* HTTPS assumed (TLS handled externally)

> Client-side encryption: **Coming Soon**

---

##  Architecture Overview

* **CLI**: Go (single static binary)
* **Server**: Go (simple HTTP server)
* **Archive format**: `.tar.gz` (streaming-friendly)

> Server setup documentation: **Coming Soon**

---

##  Platform Support

* ✅ Windows (stable)
* 🕒 macOS (Coming Soon)
* 🕒 Linux (Coming Soon)

---

## 📜 License

MIT License
See `LICENSE` for details.

---

##  Roadmap (High Level)

* `.rapidlynkignore` support
* Client-side encryption
* macOS & Linux binaries
* Self-hosted server guide
* PowerShell / shell installers
* CI-based releases

---

##  Contributing

RapidLynk is open source and contributions are welcome.

Contribution guide: **Coming Soon**

---

## 💬 Feedback

If RapidLynk saves you time or you have ideas to improve it — feedback is always welcome.

---


