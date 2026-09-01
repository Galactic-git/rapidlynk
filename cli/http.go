package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
	"time"
)

const defaultServerBaseURL = "http://localhost:8080"

var httpClient = &http.Client{
	Timeout: 5 * time.Minute,
}

func serverBaseURL() string {
	if v := os.Getenv("RAPIDLYNK_SERVER"); v != "" {
		return strings.TrimRight(v, "/")
	}
	return defaultServerBaseURL
}

type UploadURLResponse struct {
	FileID    string `json:"file_id"`
	UploadURL string `json:"upload_url"`
	Method    string `json:"method"`
	ExpiresIn int64  `json:"expires_in"`
}

type DownloadURLResponse struct {
	FileID      string `json:"file_id"`
	DownloadURL string `json:"download_url"`
	Method      string `json:"method"`
	ExpiresIn   int64  `json:"expires_in"`
}

func requestUploadURL() (*UploadURLResponse, error) {
	url := serverBaseURL() + "/api/upload-url"
	req, err := http.NewRequest(http.MethodPost, url, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	resp, err := httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to server (%s): %w", url, err)
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("server error (%d): %s", resp.StatusCode, string(body))
	}

	var res UploadURLResponse
	if err := json.NewDecoder(resp.Body).Decode(&res); err != nil {
		return nil, fmt.Errorf("invalid server response: %w", err)
	}

	if res.UploadURL == "" || res.FileID == "" {
		return nil, fmt.Errorf("server returned empty upload URL or file ID")
	}

	return &res, nil
}

func uploadToSignedURL(signedURL string, filePath string) error {
	file, err := os.Open(filePath)
	if err != nil {
		return fmt.Errorf("failed to open file for upload: %w", err)
	}
	defer file.Close()

	fileInfo, err := file.Stat()
	if err != nil {
		return fmt.Errorf("failed to stat file: %w", err)
	}

	req, err := http.NewRequest(http.MethodPut, signedURL, file)
	if err != nil {
		return fmt.Errorf("failed to create upload request: %w", err)
	}

	req.ContentLength = fileInfo.Size()
	req.Header.Set("Content-Type", "application/octet-stream")

	resp, err := httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("failed to upload to Google Cloud Storage: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("GCS upload failed (status %d): %s", resp.StatusCode, string(body))
	}

	return nil
}

func requestDownloadURL(fileID string) (string, error) {
	url := fmt.Sprintf("%s/api/download-url/%s", serverBaseURL(), fileID)
	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		return "", fmt.Errorf("failed to create download request: %w", err)
	}

	resp, err := httpClient.Do(req)
	if err != nil {
		return "", fmt.Errorf("failed to connect to server: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		body, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("server error (%d): %s", resp.StatusCode, string(body))
	}

	var res DownloadURLResponse
	if err := json.NewDecoder(resp.Body).Decode(&res); err != nil {
		return "", fmt.Errorf("invalid server response: %w", err)
	}

	if res.DownloadURL == "" {
		return "", fmt.Errorf("server returned empty download URL")
	}

	return res.DownloadURL, nil
}

func downloadFromSignedURL(signedURL string, outputPath string) error {
	req, err := http.NewRequest(http.MethodGet, signedURL, nil)
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}

	resp, err := httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("failed to download from Google Cloud Storage: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("GCS download failed (status %d): %s", resp.StatusCode, string(body))
	}

	out, err := os.Create(outputPath)
	if err != nil {
		return fmt.Errorf("failed to create output file: %w", err)
	}
	defer out.Close()

	if _, err := io.Copy(out, resp.Body); err != nil {
		return fmt.Errorf("failed to write downloaded content: %w", err)
	}

	return nil
}
