package handlers

import (
	"io"
	"net/http"
	"os"

	"go_cli/server/storage"
	"go_cli/server/utils"
)

func UploadHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	file, _, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "Invalid file upload", http.StatusBadRequest)
		return
	}
	defer file.Close()

	id := utils.GenerateID()
	path := storage.GetPath(id)

	out, err := os.Create(path)
	if err != nil {
		http.Error(w, "Failed to save file", http.StatusInternalServerError)
		return
	}
	defer out.Close()

	io.Copy(out, file)

	w.Write([]byte(id))
}
