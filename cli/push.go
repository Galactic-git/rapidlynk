package main

import (
	"fmt"
	"os"
	"strings"
)

func handlePush() {
	archive := "rapidlynk_bundle.tar.gz"

	fmt.Println("📦 Bundling project...")
	createArchive(archive)

	fmt.Println("☁️ Uploading...")
	id, err := uploadFile(archive)
	if err != nil {
		fmt.Println("Upload failed:", err)
		_ = os.Remove(archive)
		return
	}

	id = strings.TrimSpace(id)

	fmt.Println("✅ Share this id:")
	fmt.Println(id)

	// cleanup local archive; server keeps copy
	_ = os.Remove(archive)
}
