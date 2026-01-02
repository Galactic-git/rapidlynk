package main

import (
	"log"
	"net/http"
)

func main() {
	router := setupRoutes()

	log.Println("go_cli server running on :8080")
	if err := http.ListenAndServe(":8080", router); err != nil {
		log.Fatalf("server error: %v", err)
	}
}
