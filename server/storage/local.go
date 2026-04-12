package storage

import (
	"os"
	"path/filepath"
)

const StorageDir = "./storage"

func GetPath(id string) string {
	return filepath.Join(StorageDir, id+".tar.gz")
}

// Simple wrappers to mock/abstract filesystem in handlers
func Open(path string) (*os.File, error) { return os.Open(path) }
func Stat(path string) (os.FileInfo, error) { return os.Stat(path) }
