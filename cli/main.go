package main

import (
	"flag"
	"fmt"
	"os"
)

const version = "0.5.50"

func main() {
	if len(os.Args) < 2 {
		printUsage()
		return
	}

	switch os.Args[1] {
	case "-v", "--version", "version":
		fmt.Printf("rapidlynk version %s\n", version)
	case "push":
		pushCmd := flag.NewFlagSet("push", flag.ExitOnError)
		channel := pushCmd.String("c", "", "channel name")
		_ = pushCmd.Parse(os.Args[2:])
		handlePush(*channel)

	case "pull":
		pullCmd := flag.NewFlagSet("pull", flag.ExitOnError)
		channel := pullCmd.String("c", "", "channel name")
		_ = pullCmd.Parse(os.Args[2:])
		args := pullCmd.Args()
		if *channel != "" {
			handlePullByChannel(*channel)
			return
		}
		if len(args) < 1 {
			fmt.Println("Usage: rapidlynk pull <id:key> or rapidlynk pull -c <channel>")
			return
		}
		handlePull(args[0])

	case "--help", "-h":
		printUsage()

	default:
		fmt.Println("? Unknown command:", os.Args[1])
		printUsage()
	}
}

func printUsage() {
	fmt.Println("Usage:")
	fmt.Println("  rapidlynk push [-c <channel>]")
	fmt.Println("  rapidlynk pull <id:key>")
	fmt.Println("  rapidlynk pull -c <channel>")
	fmt.Println("  rapidlynk --version")
}

