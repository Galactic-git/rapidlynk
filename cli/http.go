package main

import (
	"bytes"
	"mime/multipart"
	"net/http"
	"os"
)

const serverURL = "http://localhost:8080"

func uploadFile(path string) (string, error) {
	file, _ := os.Open(path)
	defer file.Close()

	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)

	part, _ := writer.CreateFormFile("file", path)
	file.WriteTo(part)
	writer.Close()

	req, _ := http.NewRequest("POST", serverURL+"/upload", body)
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
	resp, err := http.Get(serverURL + "/download/" + id)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	out, _ := os.Create(output)
	defer out.Close()

	_, err = out.ReadFrom(resp.Body)
	return err
}
