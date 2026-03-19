package main

import (
	"fmt"
	"os"
)

const version = "0.4.0"

func main() {
	if len(os.Args) < 2 {
		fmt.Println("Usage: rapidlynk [push|pull]")
		return
	}

	switch os.Args[1] {
	case "-v", "--version", "version":
		fmt.Printf("rapidlynk version %s\n", version)
	case "push":
		handlePush()
	case "pull":
		if len(os.Args) < 3 {
			fmt.Println("Usage: rapidlynk pull <secret>")
			return
		}
		handlePull(os.Args[2])
	default:
		fmt.Println("Unknown command")
	}
}
