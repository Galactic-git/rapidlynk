package main

import (
	"fmt"
	"os"
	"path/filepath"
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

	// Get encrypted file information
	fileInfo, err := os.Stat(encryptedArchive)
	if err != nil {
		fmt.Printf("❌ Failed to get encrypted file information: %v\n", err)
		return
	}

	// 3. Ask AWS Lambda for an S3 upload URL
	fmt.Println("☁️ We save nothing regarding your project data...")

	resp, err := requestUploadURL(
		filepath.Base(encryptedArchive),
		fileInfo.Size(),
	)
	if err != nil {
		fmt.Printf("❌ Failed to get upload URL: %v\n", err)
		return
	}

	// 4. Upload directly to Amazon S3 using the presigned POST
	fmt.Println("Save the below secret to access your project ...")

	if err := uploadToSignedURL(
		resp.URL,
		resp.Fields,
		encryptedArchive,
	); err != nil {
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
