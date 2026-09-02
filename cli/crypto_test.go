package main

import (
	"os"
	"path/filepath"
	"testing"
)

func TestAES256GCMRoundTrip(t *testing.T) {
	tmpDir := t.TempDir()
	plainFile := filepath.Join(tmpDir, "plain.txt")
	encFile := filepath.Join(tmpDir, "file.enc")
	decFile := filepath.Join(tmpDir, "decrypted.txt")

	originalContent := "RapidLynk Google Cloud Storage AES-256-GCM Test Data 12345"
	if err := os.WriteFile(plainFile, []byte(originalContent), 0644); err != nil {
		t.Fatalf("failed to write test file: %v", err)
	}

	key, err := encryptFile(plainFile, encFile)
	if err != nil {
		t.Fatalf("encryptFile failed: %v", err)
	}

	if key == "" {
		t.Fatal("expected non-empty encryption key")
	}

	if err := decryptFile(encFile, decFile, key); err != nil {
		t.Fatalf("decryptFile failed: %v", err)
	}

	decryptedContent, err := os.ReadFile(decFile)
	if err != nil {
		t.Fatalf("failed to read decrypted file: %v", err)
	}

	if string(decryptedContent) != originalContent {
		t.Fatalf("expected '%s', got '%s'", originalContent, string(decryptedContent))
	}
}
