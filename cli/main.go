package main

import (
	"fmt"
	"os"
)

const version = "1.0.1"

func main() { //  0        ,   1
	if len(os.Args) < 2 { // rapidlynk push -> ["rapidlynk", "push"]
		printUsage()
		return
	}

	switch os.Args[1] {
	case "-v", "--version":
		fmt.Printf("rapidlynk version %s\n", version)

	case "push":
		handlePush()

	case "pull":
		if len(os.Args) < 3 {
			fmt.Println("Usage: rapidlynk pull <file_id>:<key>")
			return
		}
		handlePull(os.Args[2])

	case "--help", "-h":
		printUsage()

	default:
		fmt.Printf("❓ Unknown command: %s\n\n", os.Args[1])
		printUsage()
	}
}

func printUsage() {
	fmt.Println("RapidLynk - Instant Encrypted Project Sharing via Google Cloud")
	fmt.Println()
	fmt.Println("Usage:")
	fmt.Println("  rapidlynk push              Bundle, encrypt with AES-256-GCM, and upload to GCS")
	fmt.Println("  rapidlynk pull <id>:<key>   Download from GCS, decrypt, and extract bundle")
	fmt.Println("  rapidlynk --version         Show version information")
	fmt.Println("  rapidlynk --help            Show this help message")
}
