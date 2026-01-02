package main

import (
	"fmt"
	"os"
)

func main() {
	if len(os.Args) < 2 {
		fmt.Println("Usage: rapidlynk [push|pull]")
		return
	}

	switch os.Args[1] {
	case "push":
		handlePush()
	case "pull":
		if len(os.Args) < 3 {
			fmt.Println("Usage: rapidlynk pull <id>")
			return
		}
		handlePull(os.Args[2])
	default:
		fmt.Println("Unknown command")
	}
}
