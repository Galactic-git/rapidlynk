package main

import (
	"fmt"
	"os"
)

func handlePush() {
	archive := "rapidlynk_bundle.tar.gz"
	encryptedArchive := "project.enc"

	// 1. Bundle project
	fmt.Println("📦 Bundling project...")
	if err := createArchive(archive); err != nil {
		fmt.Printf("❌ Bundle failed: %v\n", err)
		return
	}
	defer os.Remove(archive)

	// 2. Encrypt with AES-256-GCM
	fmt.Println("🔒 Encrypting with AES-256-GCM...")
	key, err := encryptFile(archive, encryptedArchive)
	if err != nil {
		fmt.Printf("❌ Encryption failed: %v\n", err)
		return
	}
	defer os.Remove(encryptedArchive)

	// 3. Ask Cloud Run for upload URL
	fmt.Println("☁️ Requesting upload URL from Cloud Run...")
	resp, err := requestUploadURL()
	if err != nil {
		fmt.Printf("❌ Failed to get upload URL: %v\n", err)
		return
	}

	// 4. Automatically upload project.enc directly to Google Cloud Storage
	fmt.Println("🚀 Uploading project.enc to Google Cloud Storage...")
	if err := uploadToSignedURL(resp.UploadURL, encryptedArchive); err != nil {
		fmt.Printf("❌ Upload failed: %v\n", err)
		return
	}

	// 5. Display secret
	fmt.Println()
	fmt.Println("✅ Upload complete! Share this secret:")
	fmt.Println("----------------------------------------")
	fmt.Printf("%s:%s\n", resp.FileID, key)
	fmt.Println("----------------------------------------")
}
