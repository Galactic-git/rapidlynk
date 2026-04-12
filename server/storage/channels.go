package storage

import (
	"encoding/json"
	"os"
	"path/filepath"
	"sync"
)

var (
	channelsPath = filepath.Join(StorageDir, "channels.json")
	mu            sync.RWMutex
	channels      = map[string]string{}
	loaded        = false
)

type channelFile struct {
	Channels map[string]string `json:"channels"`
}

func ensureLoaded() {
	if loaded {
		return
	}
	mu.Lock()
	defer mu.Unlock()
	if loaded {
		return
	}
	_ = os.MkdirAll(StorageDir, 0o755)
	f, err := os.Open(channelsPath)
	if err != nil {
		channels = map[string]string{}
		loaded = true
		return
	}
	defer f.Close()
	var cf channelFile
	if err := json.NewDecoder(f).Decode(&cf); err == nil && cf.Channels != nil {
		channels = cf.Channels
	} else {
		channels = map[string]string{}
	}
	loaded = true
}

func save() error {
	mu.RLock()
	data := channelFile{Channels: channels}
	mu.RUnlock()
	_ = os.MkdirAll(StorageDir, 0o755)
	f, err := os.Create(channelsPath)
	if err != nil {
		return err
	}
	defer f.Close()
	enc := json.NewEncoder(f)
	enc.SetIndent("", "  ")
	return enc.Encode(&data)
}

func SetChannel(name, id string) error {
	ensureLoaded()
	mu.Lock()
	channels[name] = id
	mu.Unlock()
	return save()
}

func GetChannelID(name string) (string, bool) {
	ensureLoaded()
	mu.RLock()
	defer mu.RUnlock()
	id, ok := channels[name]
	return id, ok
}
