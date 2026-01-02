package handlers

import (
	"net/http"
	"os"
	"strings"

	"go_cli/server/storage"
)

func DownloadHandler(w http.ResponseWriter, r *http.Request) {
	id := strings.TrimPrefix(r.URL.Path, "/download/")
	path := storage.GetPath(id)

	if _, err := os.Stat(path); os.IsNotExist(err) {
		http.Error(w, "File not found", http.StatusNotFound)
		return
	}

	http.ServeFile(w, r, path)
}
