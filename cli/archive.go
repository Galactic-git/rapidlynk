package main

import (
	"archive/tar"
	"compress/gzip"
	"fmt"
	"io"
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
		".git":                      {},
		output:                      {}, // the archive we are creating
		"rapidlynk_bundle.tar.gz":   {},
		"rapidlynk_download.tar.gz": {},
		"rapidlynk_bundle.enc":      {},
		"rapidlynk_download.enc":    {},
		"project.enc":               {},
		"project.tar.gz":            {},
		"rapidlynk.exe":             {},
		"rapidlynk":                 {},
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

		// skip nested tarballs and enc files
		if (strings.HasSuffix(name, ".tar.gz") || strings.HasSuffix(name, ".enc")) && name != output {
			return nil
		}

		header, err := tar.FileInfoHeader(info, "")
		if err != nil {
			return err
		}

		relPath, err := filepath.Rel(root, path)
		if err != nil {
			return err
		}

		// Ensure forward slashes in tar headers for cross-platform compatibility
		header.Name = filepath.ToSlash(relPath)

		if err := tw.WriteHeader(header); err != nil {
			return err
		}

		if info.Mode().IsRegular() {
			f, err := os.Open(path)
			if err != nil {
				return err
			}
			defer f.Close()
			if _, err = io.Copy(tw, f); err != nil {
				return err
			}
		}

		return nil
	})
}

func extractArchive(archiveFile string, destDir string) error {
	file, err := os.Open(archiveFile)
	if err != nil {
		return fmt.Errorf("failed to open archive: %w", err)
	}
	defer file.Close()

	gr, err := gzip.NewReader(file)
	if err != nil {
		return fmt.Errorf("failed to create gzip reader: %w", err)
	}
	defer gr.Close()

	tr := tar.NewReader(gr)

	for {
		header, err := tr.Next()
		if err == io.EOF {
			break
		}
		if err != nil {
			return fmt.Errorf("tar read error: %w", err)
		}

		// Clean path to prevent directory traversal
		target := filepath.Join(destDir, filepath.FromSlash(header.Name))
		if !strings.HasPrefix(filepath.Clean(target), filepath.Clean(destDir)) {
			return fmt.Errorf("illegal file path in archive: %s", header.Name)
		}

		switch header.Typeflag {
		case tar.TypeDir:
			if err := os.MkdirAll(target, 0755); err != nil {
				return fmt.Errorf("failed to create directory %s: %w", target, err)
			}
		case tar.TypeReg, tar.TypeRegA:
			if err := os.MkdirAll(filepath.Dir(target), 0755); err != nil {
				return fmt.Errorf("failed to create parent directory for %s: %w", target, err)
			}
			outFile, err := os.OpenFile(target, os.O_CREATE|os.O_RDWR|os.O_TRUNC, header.FileInfo().Mode().Perm())
			if err != nil {
				return fmt.Errorf("failed to create file %s: %w", target, err)
			}
			if _, err := io.Copy(outFile, tr); err != nil {
				outFile.Close()
				return fmt.Errorf("failed to write file %s: %w", target, err)
			}
			outFile.Close()
		}
	}

	return nil
}
