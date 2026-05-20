package services

import (
	"bytes"
	"encoding/json"
	"log"
	"net/http"
	"time"
	"os"
)

var WEBHOOK_URL = os.Getenv("WEBHOOK_URL")

type WebhookPayload struct {
	Event     string      `json:"event"`
	Data      interface{} `json:"data"`
	Timestamp int64       `json:"timestamp"`
}

func SendWebhook(event string, data interface{}) {

	payload := WebhookPayload{
		Event: event,
		Data:  data,
		Timestamp: time.Now().Unix(),
	}

	jsonData, err := json.Marshal(payload)

	if err != nil {
		log.Println("Webhook marshal error:", err)
		return
	}

	req, err := http.NewRequest(
		"POST",
		WEBHOOK_URL,
		bytes.NewBuffer(jsonData),
	)

	if err != nil {
		log.Println("Webhook request error:", err)
		return
	}

	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}

	resp, err := client.Do(req)

	if err != nil {
		log.Println("Webhook send error:", err)
		return
	}

	defer resp.Body.Close()

	log.Println("Webhook sent:", event)
}