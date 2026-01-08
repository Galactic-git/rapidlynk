package handlers

import (
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"go_cli/server/storage"
)

func DownloadHandler(w http.ResponseWriter, r *http.Request) {
	id := strings.TrimPrefix(r.URL.Path, "/download/")
	path := storage.GetPath(id)

	info, err := os.Stat(path)
	if os.IsNotExist(err) {
		http.Error(w, "File not found", http.StatusNotFound)
		return
	}
	if err != nil {
		http.Error(w, "Unable to access file", http.StatusInternalServerError)
		return
	}

	file, err := os.Open(path)
	if err != nil {
		http.Error(w, "Failed to open file", http.StatusInternalServerError)
		return
	}

	// Serve the content, then delete the archive to clean up storage
	http.ServeContent(w, r, filepath.Base(path), info.ModTime(), file)

	// On Windows the file must be closed before removal
	if err := file.Close(); err != nil {
		log.Printf("cleanup: failed to close %s: %v", path, err)
		return
	}

	if err := os.Remove(path); err != nil {
		log.Printf("cleanup: failed to delete %s: %v", path, err)
	}
}
