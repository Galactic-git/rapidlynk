package main

import (
	"fmt"
	"os"
	"strings"
)

func handlePull(secret string) {
	parts := strings.SplitN(secret, ":", 2)
	if len(parts) != 2 || parts[0] == "" || parts[1] == "" {
		fmt.Println("❌ Invalid secret format. Expected <file_id>:<key>")
		return
	}
	fileID := parts[0]
	key := parts[1]

	encryptedFile := "rapidlynk_download.enc"
	archiveFile := "rapidlynk_download.tar.gz"

	// 1. Request download URL from Cloud Run
	fmt.Println("🔎 Resolving download URL from Cloud Run...")
	downloadURL, err := requestDownloadURL(fileID)
	if err != nil {
		fmt.Printf("❌ Failed to get download URL: %v\n", err)
		return
	}

	// 2. Download from Google Cloud Storage
	fmt.Println("⬇️ Downloading from Google Cloud Storage...")
	if err := downloadFromSignedURL(downloadURL, encryptedFile); err != nil {
		fmt.Printf("❌ Download failed: %v\n", err)
		return
	}
	defer os.Remove(encryptedFile)

	// 3. Decrypt with AES-256-GCM
	fmt.Println("🔐 Decrypting with AES-256-GCM...")
	if err := decryptFile(encryptedFile, archiveFile, key); err != nil {
		fmt.Printf("❌ Decryption failed: %v\n", err)
		return
	}
	defer os.Remove(archiveFile)

	// 4. Extract archive
	fmt.Println("📦 Extracting files...")
	destDir, _ := os.Getwd()
	if err := extractArchive(archiveFile, destDir); err != nil {
		fmt.Printf("❌ Extraction failed: %v\n", err)
		return
	}

	fmt.Println("✅ Project extracted successfully!")
}
