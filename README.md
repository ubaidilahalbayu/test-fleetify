# Fleetify Maintenance App

Fleetify adalah aplikasi sederhana management maintenance kendaraan berbasis:

- Golang
- Fiber
- GORM
- MySQL
- Vanilla JavaScript
- Bootstrap 5
- Docker

Project ini dibuat menggunakan architecture sederhana namun clean:
- REST API Backend
- SPA Feel Frontend
- Component Based Vanilla JS
- Dockerized Development

---

# Features

## Authentication Simulation
- Login as Service Advisor
- Login as Approval / Manager

## Maintenance Report
- Create report
- Upload initial photo
- Dynamic maintenance items
- Complaint input
- Odometer input

## Approval Flow
- Manager approve report
- Service advisor complete report
- Upload completion proof photo

## History
- Report history
- Detail modal
- Item detail
- Initial photo & proof photo preview

## Export
- Export CSV

---

# Tech Stack

## Backend
- Golang
- Fiber
- GORM
- MySQL

## Frontend
- Vanilla JS
- Bootstrap 5

## Infra
- Docker
- Docker Compose

---

# Project Structure

```txt
backend/
├── config/
├── handlers/
├── middleware/
├── models/
├── routes/
├── seeders/
├── Dockerfile
├── go.mod
├── go.sum
└── main.go

frontend/
├── js/
│   ├── components/
│   ├── pages/
│   ├── utils/
│   ├── api.js
│   ├── app.js
│   └── state.js
├── Dockerfile
└── index.html

.env
docker-compose.yml
```

---

# Setup Project

## 1. Clone Repository

```bash
git clone https://github.com/ubaidilahalbayu/test-fleetify.git

or with ssh

git clone git@github.com:ubaidilahalbayu/test-fleetify.git

cd test-fleetify
```

---

# Create env

## 2. Buat file .env

```env
DB_HOST=mysql
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=fleetify

WEBHOOK_URL=<Your Webhook Url>
# ex. "https://webhook.site/fdfce492-5f2c-4b0c-beb3-270d2d724b6a"
```

---

# Docker Setup

## 3. Run Docker

```bash
docker compose up --build
```

---

# Service Port

| Service | Port |
|---|---|
| Frontend | 3000 |
| Backend API | 8080 |
| MySQL | 3306 |

---

# Access Application

## Frontend

```txt
http://localhost:3000
```

## Backend API

```txt
http://localhost:8080
```

---

# API Documentation

---

# Base URL

```txt
http://localhost:8080/api
```

---

# Headers

## Required Header

```txt
X-User-ID: <IdUser>
```

## User Role

| ID | Role |
|---|---|
| 1 | Service Advisor |
| 2 | Approval / Manager |

---

# API Endpoints

---

# Get Vehicles

## Request

```http
GET /vehicles
```

## Response

```json
{
  "data": [
    {
      "ID": 1,
      "LicensePlate": "BG1234AA",
      "Model": "Toyota Avanza"
    }
  ]
}
```

---

# Get Master Items

## Request

```http
GET /master-items
```

## Response

```json
{
  "data": [
    {
      "ID": 1,
      "ItemName": "Engine Oil",
      "Type": "SPAREPART",
      "Price": 100000
    }
  ]
}
```

---

# Create Report

## Request

```http
POST /reports
```

## Content-Type

```txt
multipart/form-data
```

## Form Data

| Key | Type |
|---|---|
| vehicle_id | number |
| odometer | number |
| complaint | string |
| photo | file |
| items | JSON string |

---

## Example Items

```json
[
  {
    "item_id": 1,
    "quantity": 2
  }
]
```

---

## Response

```json
{
  "message": "Report created"
}
```

---

# Get Reports

## Request

```http
GET /reports
```

## Response

```json
{
  "data": [
    {
      "ID": 1,
      "Status": "PENDING_APPROVAL",
      "Vehicle": {},
      "User": {},
      "Items": []
    }
  ]
}
```

---

# Approve Report

## Request

```http
PUT /reports/:id/approve
```

## Response

```json
{
  "message": "Report approved"
}
```

---

# Complete Report

## Request

```http
PUT /reports/:id/complete
```

## Content-Type

```txt
multipart/form-data
```

## Form Data

| Key | Type |
|---|---|
| proof_photo | file |

---

## Response

```json
{
  "message": "Report completed"
}
```

---

# Status Flow

```txt
PENDING_APPROVAL
        ↓
APPROVED
        ↓
COMPLETED
```

---

# Frontend Architecture

Project menggunakan:
- Component Based Vanilla JS
- Reusable Component
- Global State
- Simple SPA Router

---

# Main Components

| Component | Description |
|---|---|
| NavbarComponent | Navbar & Login |
| ReportFormComponent | Create report form |
| ItemRowComponent | Dynamic item form |
| ReportTableComponent | Report table |
| HistoryPage | Report history |
| HomePage | Main page |

---

# Docker Commands

## Start

```bash
docker compose up
```

## Rebuild

```bash
docker compose up --build
```

## Stop

```bash
docker compose down
```

## Remove Volume

```bash
docker compose down -v
```

---

# Development Notes

## Backend
- Menggunakan GORM AutoMigrate
- Menggunakan middleware Fiber
- Mendukung static file serving untuk upload foto
- Sudah terintegrasi Docker
- Auto seed data saat pertama kali menjalankan docker
- Relasi database menggunakan GORM association
- REST API architecture

## Frontend
- Menggunakan Vanilla JavaScript
- Tidak menggunakan framework frontend
- Tidak menggunakan innerHTML
- Rendering menggunakan DOM API
- Component based architecture
- SPA feel tanpa reload halaman
- Reusable component structure
- Dynamic form rendering

## Webhook

Application supports webhook notification.

Triggered events:
- report.created
- report.approved
- report.completed

Webhook payload sent using HTTP POST JSON.

---