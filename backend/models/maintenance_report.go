package models

import "time"

type MaintenanceReport struct {
	ID           uint      `gorm:"primaryKey"`
	VehicleID    uint      `gorm:"not null"`
	CreatedBy    uint      `gorm:"not null"`
	Odometer     int       `gorm:"not null"`
	Complaint    string    `gorm:"type:text"`
	Status       string    `gorm:"default:PENDING_APPROVAL"`
	InitialPhoto string
	ProofPhoto   string
	CreatedAt    time.Time

	Vehicle Vehicle `gorm:"foreignKey:VehicleID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	User    User    `gorm:"foreignKey:CreatedBy;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`

	Items []ReportItem `gorm:"foreignKey:ReportID"`
}