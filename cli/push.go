package main

import (
	"fmt"
	"os"
	"strings"
)

func handlePush() {
	archive := "rapidlynk_bundle.tar.gz"
	encryptedArchive := "rapidlynk_bundle.enc"

	fmt.Println("📦 Bundling project...")
	if err := createArchive(archive); err != nil {
		fmt.Println("Bundle failed:", err)
		return
	}

	fmt.Println("🔒 Encrypting...")
	key, err := encryptFile(archive, encryptedArchive)
	if err != nil {
		fmt.Println("Encryption failed:", err)
		_ = os.Remove(archive)
		return
	}

	fmt.Println("☁️ Uploading...")
	id, err := uploadFile(encryptedArchive)
	if err != nil {
		fmt.Println("Upload failed:", err)
		_ = os.Remove(archive)
		_ = os.Remove(encryptedArchive)
		return
	}

	id = strings.TrimSpace(id)

	fmt.Println("✅ Share this secret:")
	fmt.Printf("%s:%s\n", id, key)

	// cleanup local archive; server keeps copy
	_ = os.Remove(archive)
	_ = os.Remove(encryptedArchive)
}
