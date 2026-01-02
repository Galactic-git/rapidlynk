package storage

import "path/filepath"

const StorageDir = "./storage"

func GetPath(id string) string {
	return filepath.Join(StorageDir, id+".tar.gz")
}
