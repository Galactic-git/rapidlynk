package main

import (
	"golang.org/x/crypto/hkdf"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"os"
	"path/filepath"
)

type keysFile struct {
	Channels     map[string]string `json:"channels"`
	MasterSecret string            `json:"master_secret"`
}

func userHome() string {
	if h := os.Getenv("USERPROFILE"); h != "" { // Windows
		return h
	}
	if h := os.Getenv("HOME"); h != "" {
		return h
	}
	return "."
}

func getKeyForChannel(channel string) (string, error) {
	// Legacy overrides first
	envName := "RAPIDLYNK_KEY_CHANNEL_" + channel
	if v := os.Getenv(envName); v != "" {
		return v, nil
	}
	if v := os.Getenv("RAPIDLYNK_KEY"); v != "" {
		return v, nil
	}
	// keys.json may contain per-channel overrides
	dir := filepath.Join(userHome(), ".rapidlynk")
	path := filepath.Join(dir, "keys.json")
	if b, err := os.ReadFile(path); err == nil {
		var k keysFile
		if json.Unmarshal(b, &k) == nil && k.Channels != nil {
			if key, ok := k.Channels[channel]; ok && key != "" {
				return key, nil
			}
		}
	}
	// Derive from master secret if present
	keyBytes, derr := deriveKeyFromMaster(channel)
	if derr == nil {
		return base64.URLEncoding.EncodeToString(keyBytes), nil
	}
	return "", errors.New("no key or master secret configured for channel")
}

func deriveKeyFromMaster(channel string) ([]byte, error) {
	var master []byte
	if v := os.Getenv("RAPIDLYNK_MASTER"); v != "" {
		// Accept raw text or base64
		if mb, err := base64.URLEncoding.DecodeString(v); err == nil {
			master = mb
		} else {
			master = []byte(v)
		}
	} else {
		dir := filepath.Join(userHome(), ".rapidlynk")
		cfg := filepath.Join(dir, "config.json")
		if b, err := os.ReadFile(cfg); err == nil {
			var k keysFile
			if json.Unmarshal(b, &k) == nil && k.MasterSecret != "" {
				if mb, err := base64.URLEncoding.DecodeString(k.MasterSecret); err == nil {
					master = mb
				} else {
					master = []byte(k.MasterSecret)
				}
			}
		}
	}
	if len(master) == 0 {
		return nil, errors.New("master secret not found")
	}
	r := hkdf.New(sha256.New, master, []byte(channel), []byte("rapidlynk-hkdf-v1"))
	key := make([]byte, 32)
	if _, err := io.ReadFull(r, key); err != nil {
		return nil, err
	}
	return key, nil
}

func exampleKeysJSON() string {
	return `{
  "channels": {
    "neon123": "<paste-key-here>"
  },
  "master_secret": "<org-master-secret-optional>"
}`
}

func printKeyNotFoundHelp(channel string) {
	fmt.Println("No key found for channel:", channel)
	fmt.Println("Set one of these and retry:")
	fmt.Printf("  setx RAPIDLYNK_KEY_CHANNEL_%s <key>   (Windows)\n", channel)
	fmt.Printf("  export RAPIDLYNK_KEY_CHANNEL_%s=<key> (macOS/Linux)\n", channel)
	fmt.Println("Or set a single master secret once for all channels:")
	fmt.Println("  setx RAPIDLYNK_MASTER <org-master-secret>   (Windows)")
	fmt.Println("  export RAPIDLYNK_MASTER=<org-master-secret> (macOS/Linux)")
	fmt.Println("Or create ~/.rapidlynk/config.json with:")
	fmt.Println(`{"master_secret":"<org-master-secret>"}`)
}

