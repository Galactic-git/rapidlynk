package main

import (
	"fmt"
	"os/exec"
)

func handlePull(id string) {
	file := "rapidlynk_download.tar.gz"

	fmt.Println("⬇️ Downloading...")
	if err := downloadFile(id, file); err != nil {
		fmt.Println("Download failed:", err)
		return
	}

	fmt.Println("📂 Extracting...")
	if err := exec.Command("tar", "-xzf", file).Run(); err != nil {
		fmt.Println("Extraction failed:", err)
		return
	}

	fmt.Println("✅ Project ready")
}
