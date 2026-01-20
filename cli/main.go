package main

import (
	"fmt"
	"os"
)

const version = "0.2.0"

func main() {
	if len(os.Args) < 2 {
		printUsage()
		return
	}

	switch os.Args[1] {
	case "push":
		handlePush()

	case "pull":
		if len(os.Args) < 3 {
			fmt.Println("❌ Missing id")
			fmt.Println("Usage: rapidlynk pull <id>")
			return
		}
		handlePull(os.Args[2])

	case "--version", "-v":
		fmt.Println("rapidlynk v" + version)

	case "--help", "-h":
		printUsage()

	default:
		fmt.Println("❌ Unknown command:", os.Args[1])
		printUsage()
	}
}

func printUsage() {
	fmt.Println("Usage:")
	fmt.Println("  rapidlynk push")
	fmt.Println("  rapidlynk pull <id>")
	fmt.Println("  rapidlynk --version")
}
