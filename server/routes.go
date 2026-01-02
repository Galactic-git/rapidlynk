package main

import (
	"net/http"

	"go_cli/server/handlers"
)

func setupRoutes() http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("/upload", handlers.UploadHandler)
	mux.HandleFunc("/download/", handlers.DownloadHandler)

	return mux
}
