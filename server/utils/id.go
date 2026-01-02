package utils

import (
	"crypto/rand"
	"encoding/hex"
)

func GenerateID() string {
	b := make([]byte, 16) // 128-bit
	rand.Read(b)
	return hex.EncodeToString(b)
}
