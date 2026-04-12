package handlers

import (
	"net/http"
	"strings"
	"go_cli/server/storage"
)

func DownloadByChannelHandler(w http.ResponseWriter, r *http.Request) {
	name := strings.TrimPrefix(r.URL.Path, "/download/by-channel/")
	if name == "" {
		http.Error(w, "channel required", http.StatusBadRequest)
		return
	}
	id, ok := storage.GetChannelID(name)
	if !ok || id == "" {
		http.Error(w, "channel not found", http.StatusNotFound)
		return
	}
	// Delegate to existing id-based streaming without deletion
	// Use storage helpers directly to avoid one-shot delete behavior in DownloadHandler
	path := storage.GetPath(id)
	info, err := storage.Stat(path)
	if err != nil {
		http.Error(w, "file not found", http.StatusNotFound)
		return
	}
	file, err := storage.Open(path)
	if err != nil {
		http.Error(w, "failed to open file", http.StatusInternalServerError)
		return
	}
	defer file.Close()
	// stream without deleting
	http.ServeContent(w, r, info.Name(), info.ModTime(), file)
}
