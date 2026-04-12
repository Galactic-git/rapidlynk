package main

import (
	"fmt"
	"os"
)

func handlePush(channel string) {
	archive := "rapidlynk_bundle.tar.gz"
	encryptedArchive := "rapidlynk_bundle.enc"

	fmt.Println("📦 Bundling project...")
	if err := createArchive(archive); err != nil {
		fmt.Println("Bundle failed:", err)
		return
	}

	if channel != "" {
		// Channel-based flow: NO encryption, upload plain tar.gz
		fmt.Printf("☁️ Uploading to channel '%s' (no encryption)...\n", channel)
		if _, err := uploadFile(archive, channel); err != nil {
			fmt.Println("Upload failed:", err)
			_ = os.Remove(archive)
			return
		}
		fmt.Println("✅ Pushed to channel:", channel)
	} else {
		// Legacy secure flow: encrypt + upload
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
		fmt.Println("✅ Share this secret:")
		fmt.Printf("%s:%s\n", id, key)
		_ = os.Remove(encryptedArchive)
	}

	_ = os.Remove(archive)
}
