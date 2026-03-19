package main

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/base64"
	"io"
	"os"
)

func encryptFile(inputFile, outputFile string) (string, error) {
	// Generate 32-byte key for AES-256
	key := make([]byte, 32)
	if _, err := io.ReadFull(rand.Reader, key); err != nil {
		return "", err
	}

	plaintext, err := os.ReadFile(inputFile)
	if err != nil {
		return "", err
	}

	block, err := aes.NewCipher(key)
	if err != nil {
		return "", err
	}

	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return "", err
	}

	nonce := make([]byte, gcm.NonceSize())
	if _, err := io.ReadFull(rand.Reader, nonce); err != nil {
		return "", err
	}

	ciphertext := gcm.Seal(nonce, nonce, plaintext, nil)

	if err := os.WriteFile(outputFile, ciphertext, 0644); err != nil {
		return "", err
	}

	return base64.URLEncoding.EncodeToString(key), nil
}

func decryptFile(inputFile, outputFile, keyBase64 string) error {
	key, err := base64.URLEncoding.DecodeString(keyBase64)
	if err != nil {
		return err
	}

	ciphertext, err := os.ReadFile(inputFile)
	if err != nil {
		return err
	}

	block, err := aes.NewCipher(key)
	if err != nil {
		return err
	}

	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return err
	}

	nonceSize := gcm.NonceSize()
	if len(ciphertext) < nonceSize {
		return io.ErrUnexpectedEOF
	}

	nonce, ciphertextBytes := ciphertext[:nonceSize], ciphertext[nonceSize:]
	plaintext, err := gcm.Open(nil, nonce, ciphertextBytes, nil)
	if err != nil {
		return err
	}

	return os.WriteFile(outputFile, plaintext, 0644)
}
