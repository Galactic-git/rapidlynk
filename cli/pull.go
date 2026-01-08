package main

import (
	"fmt"
	"os/exec"
)

func handlePull(id string) {
	file := "rapidlynk_download.tar.gz"

	fmt.Println("⬇️ Downloading...")
	downloadFile(id, file)

	fmt.Println("📂 Extracting...")
	exec.Command("tar", "-xzf", file).Run()

	fmt.Println("✅ Project ready")
}
