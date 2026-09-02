package main

import (
	"os"
	"path/filepath"
	"testing"
)

func TestArchiveExtractRoundTrip(t *testing.T) {
	origDir, err := os.Getwd()
	if err != nil {
		t.Fatalf("failed to get wd: %v", err)
	}

	srcDir := t.TempDir()
	destDir := t.TempDir()

	// Create sample test files
	subDir := filepath.Join(srcDir, "pkg", "sub")
	if err := os.MkdirAll(subDir, 0755); err != nil {
		t.Fatalf("mkdir failed: %v", err)
	}

	f1 := filepath.Join(srcDir, "hello.txt")
	f2 := filepath.Join(subDir, "code.go")
	if err := os.WriteFile(f1, []byte("Hello World"), 0644); err != nil {
		t.Fatalf("write failed: %v", err)
	}
	if err := os.WriteFile(f2, []byte("package sub\n"), 0644); err != nil {
		t.Fatalf("write failed: %v", err)
	}

	archiveFile := filepath.Join(t.TempDir(), "test_bundle.tar.gz")

	// Change to srcDir to archive
	if err := os.Chdir(srcDir); err != nil {
		t.Fatalf("chdir failed: %v", err)
	}
	defer os.Chdir(origDir)

	if err := createArchive(archiveFile); err != nil {
		t.Fatalf("createArchive failed: %v", err)
	}

	// Extract to destDir
	if err := extractArchive(archiveFile, destDir); err != nil {
		t.Fatalf("extractArchive failed: %v", err)
	}

	// Verify extracted files
	res1, err := os.ReadFile(filepath.Join(destDir, "hello.txt"))
	if err != nil || string(res1) != "Hello World" {
		t.Fatalf("unexpected content for hello.txt: %s, err: %v", string(res1), err)
	}

	res2, err := os.ReadFile(filepath.Join(destDir, "pkg", "sub", "code.go"))
	if err != nil || string(res2) != "package sub\n" {
		t.Fatalf("unexpected content for code.go: %s, err: %v", string(res2), err)
	}
}
