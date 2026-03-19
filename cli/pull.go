package main

import (
	"fmt"
	"os"
	"os/exec"
	"strings"
)

func handlePull(secret string) {
	parts := strings.SplitN(secret, ":", 2)
	if len(parts) != 2 {
		fmt.Println("Invalid secret format. Expected <id>:<key>")
		return
	}
	id := parts[0]
	key := parts[1]

	encryptedFile := "rapidlynk_download.enc"
	archiveFile := "rapidlynk_download.tar.gz"

	fmt.Println("⬇️ Downloading...")
	if err := downloadFile(id, encryptedFile); err != nil {
		fmt.Println("Download failed:", err)
		return
	}

	fmt.Println("🔓 Decrypting...")
	if err := decryptFile(encryptedFile, archiveFile, key); err != nil {
		fmt.Println("Decryption failed:", err)
		_ = os.Remove(encryptedFile)
		return
	}

	fmt.Println("📂 Extracting...")
	if err := exec.Command("tar", "-xzf", archiveFile).Run(); err != nil {
		fmt.Println("Extraction failed:", err)
		_ = os.Remove(encryptedFile)
		_ = os.Remove(archiveFile)
		return
	}

	// cleanup
	_ = os.Remove(encryptedFile)
	_ = os.Remove(archiveFile)

	fmt.Println("✅ Project ready")
}
