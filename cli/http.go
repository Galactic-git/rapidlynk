package main

import (
	"bytes"
	"mime/multipart"
	"net/http"
	"os"
)

const defaultServerBaseURL = "http://35.154.94.11:8080"

func serverBaseURL() string {
	if v := os.Getenv("RAPIDLYNK_SERVER"); v != "" {
		return v
	}
	return defaultServerBaseURL
}

func uploadFile(path string, channelOpt ...string) (string, error) {
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
	if len(channelOpt) > 0 && channelOpt[0] != "" {
		_ = writer.WriteField("channel", channelOpt[0])
	}

	if err := writer.Close(); err != nil {
		return "", err
	}

	req, _ := http.NewRequest("POST", serverBaseURL()+"/upload", body)
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
	resp, err := http.Get(serverBaseURL() + "/download/" + id)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	out, _ := os.Create(output)
	defer out.Close()

	_, err = out.ReadFrom(resp.Body)
	return err
}

func downloadFileByChannel(channel, output string) error {
	resp, err := http.Get(serverBaseURL() + "/download/by-channel/" + channel)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	out, _ := os.Create(output)
	defer out.Close()
	_, err = out.ReadFrom(resp.Body)
	return err
}


