package main

import (
	"bytes"
	"mime/multipart"
	"net/http"
	"os"
)

// const serverBaseURL = "http://13.233.158.201:8080"

const serverBaseURL = "http://localhost:8080"

func uploadFile(path string) (string, error) {
	file, err := os.Open(path)
	if err != nil {
		return "", err
	}
	defer file.Close()

	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)

	part, err := writer.CreateFormFile("file", path)
	if err != nil {
		return "", err
	}

	if _, err := file.WriteTo(part); err != nil {
		return "", err
	}

	if err := writer.Close(); err != nil {
		return "", err
	}

	req, _ := http.NewRequest("POST", serverBaseURL+"/upload", body)
	req.Header.Set("Content-Type", writer.FormDataContentType())

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	buf := new(bytes.Buffer)
	buf.ReadFrom(resp.Body)

	return buf.String(), nil
}

func downloadFile(id string, output string) error {
	resp, err := http.Get(serverBaseURL + "/download/" + id)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	out, _ := os.Create(output)
	defer out.Close()

	_, err = out.ReadFrom(resp.Body)
	return err
}
