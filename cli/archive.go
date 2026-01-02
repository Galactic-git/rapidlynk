package main

import (
	"archive/tar"
	"compress/gzip"
	"os"
	"path/filepath"
	"strings"
)

func createArchive(output string) error {
	file, err := os.Create(output)
	if err != nil {
		return err
	}
	defer file.Close()

	gw := gzip.NewWriter(file)
	defer gw.Close()

	tw := tar.NewWriter(gw)
	defer tw.Close()

	root, _ := os.Getwd()

	skipNames := map[string]struct{}{
		".git":                     {},
		output:                      {}, // the archive we are creating
		"rapidlynk_bundle.tar.gz":  {},
		"rapidlynk_download.tar.gz": {},
		"rapidlynk.exe":            {},
	}

	return filepath.Walk(root, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		name := info.Name()
		if _, found := skipNames[name]; found {
			if info.IsDir() {
				return filepath.SkipDir
			}
			return nil
		}

		// skip nested go build artifacts and tarballs
		if strings.HasSuffix(name, ".tar.gz") && name != output {
			return nil
		}

		header, err := tar.FileInfoHeader(info, "")
		if err != nil {
			return err
		}

		header.Name, _ = filepath.Rel(root, path)

		if err := tw.WriteHeader(header); err != nil {
			return err
		}

		if info.Mode().IsRegular() {
			f, err := os.Open(path)
			if err != nil {
				return err
			}
			defer f.Close()
			if _, err = f.WriteTo(tw); err != nil {
				return err
			}
		}

		return nil
	})
}
