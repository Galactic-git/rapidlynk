package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"
)

const defaultServerBaseURL = "https://plit6sl6b8.execute-api.ap-south-1.amazonaws.com"

var httpClient = &http.Client{
	Timeout: 5 * time.Minute,
}

func serverBaseURL() string {
	if v := os.Getenv("RAPIDLYNK_SERVER"); v != "" {
		return strings.TrimRight(v, "/")
	}
	return defaultServerBaseURL
}

// --------------------
// Upload
// --------------------

type UploadURLRequest struct {
	Filename string `json:"filename"`
	Size     int64  `json:"size"`
}

type UploadURLResponse struct {
	Message string            `json:"message"`
	URL     string            `json:"url"`
	FileID  string            `json:"fileId"`
	Fields  map[string]string `json:"fields"`
}

func requestUploadURL(filename string, size int64) (*UploadURLResponse, error) {
	url := serverBaseURL() + "/api/upload-url"

	payload := UploadURLRequest{
		Filename: filename,
		Size:     size,
	}

	body, err := json.Marshal(payload)
	if err != nil {
		return nil, fmt.Errorf("failed to encode upload request: %w", err)
	}

	req, err := http.NewRequest(
		http.MethodPost,
		url,
		bytes.NewReader(body),
	)
	if err != nil {
		return nil, fmt.Errorf("failed to create upload request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")

	resp, err := httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to server (%s): %w", url, err)
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		responseBody, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf(
			"server error (%d): %s",
			resp.StatusCode,
			string(responseBody),
		)
	}

	var res UploadURLResponse

	if err := json.NewDecoder(resp.Body).Decode(&res); err != nil {
		return nil, fmt.Errorf("invalid server response: %w", err)
	}

	if res.URL == "" || res.FileID == "" {
		return nil, fmt.Errorf("server returned empty upload URL or file ID")
	}

	if len(res.Fields) == 0 {
		return nil, fmt.Errorf("server returned empty upload fields")
	}

	return &res, nil
}

// uploadToSignedURL uploads the file to S3 using the
// presigned POST returned by the backend.
func uploadToSignedURL(
	signedURL string,
	fields map[string]string,
	filePath string,
) error {

	file, err := os.Open(filePath)
	if err != nil {
		return fmt.Errorf("failed to open file for upload: %w", err)
	}
	defer file.Close()

	// Create multipart body.
	var body bytes.Buffer

	writer := multipart.NewWriter(&body)

	// Add all fields returned by S3 presigned POST.
	for key, value := range fields {
		if err := writer.WriteField(key, value); err != nil {
			return fmt.Errorf(
				"failed to write upload field %q: %w",
				key,
				err,
			)
		}
	}

	// Add the actual file.
	fileName := filepath.Base(filePath)

	part, err := writer.CreateFormFile("file", fileName)
	if err != nil {
		return fmt.Errorf("failed to create file form field: %w", err)
	}

	if _, err := io.Copy(part, file); err != nil {
		return fmt.Errorf("failed to read file for upload: %w", err)
	}

	if err := writer.Close(); err != nil {
		return fmt.Errorf("failed to finalize multipart upload: %w", err)
	}

	// Send multipart POST to S3.
	req, err := http.NewRequest(
		http.MethodPost,
		signedURL,
		&body,
	)
	if err != nil {
		return fmt.Errorf("failed to create S3 upload request: %w", err)
	}

	req.Header.Set(
		"Content-Type",
		writer.FormDataContentType(),
	)

	resp, err := httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("failed to upload to S3: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		responseBody, _ := io.ReadAll(resp.Body)

		return fmt.Errorf(
			"S3 upload failed (status %d): %s",
			resp.StatusCode,
			string(responseBody),
		)
	}

	return nil
}

// --------------------
// Download
// --------------------

type DownloadURLResponse struct {
	Message string `json:"message"`
	URL     string `json:"url"`
}

func requestDownloadURL(fileID string) (string, error) {
	url := fmt.Sprintf(
		"%s/api/download-url/%s",
		serverBaseURL(),
		fileID,
	)

	req, err := http.NewRequest(
		http.MethodGet,
		url,
		nil,
	)
	if err != nil {
		return "", fmt.Errorf(
			"failed to create download request: %w",
			err,
		)
	}

	resp, err := httpClient.Do(req)
	if err != nil {
		return "", fmt.Errorf(
			"failed to connect to server: %w",
			err,
		)
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		responseBody, _ := io.ReadAll(resp.Body)

		return "", fmt.Errorf(
			"server error (%d): %s",
			resp.StatusCode,
			string(responseBody),
		)
	}

	var res DownloadURLResponse

	if err := json.NewDecoder(resp.Body).Decode(&res); err != nil {
		return "", fmt.Errorf(
			"invalid server response: %w",
			err,
		)
	}

	if res.URL == "" {
		return "", fmt.Errorf(
			"server returned empty download URL",
		)
	}

	return res.URL, nil
}

// --------------------
// S3 Download
// --------------------

func downloadFromSignedURL(
	signedURL string,
	outputPath string,
) error {

	req, err := http.NewRequest(
		http.MethodGet,
		signedURL,
		nil,
	)
	if err != nil {
		return fmt.Errorf(
			"failed to create download request: %w",
			err,
		)
	}

	resp, err := httpClient.Do(req)
	if err != nil {
		return fmt.Errorf(
			"failed to download from S3: %w",
			err,
		)
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		responseBody, _ := io.ReadAll(resp.Body)

		return fmt.Errorf(
			"S3 download failed (status %d): %s",
			resp.StatusCode,
			string(responseBody),
		)
	}

	out, err := os.Create(outputPath)
	if err != nil {
		return fmt.Errorf(
			"failed to create output file: %w",
			err,
		)
	}
	defer out.Close()

	if _, err := io.Copy(out, resp.Body); err != nil {
		return fmt.Errorf(
			"failed to write downloaded content: %w",
			err,
		)
	}

	return nil
}
