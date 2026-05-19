package models

type CreateReportRequest struct {
	VehicleID    uint              `json:"vehicle_id"`
	Odometer     int               `json:"odometer"`
	Complaint    string            `json:"complaint"`
	InitialPhoto string            `json:"initial_photo"`
	Items        []ReportItemInput `json:"items"`
}

type ReportItemInput struct {
	ItemID  uint `json:"item_id"`
	Quantity int `json:"quantity"`
}