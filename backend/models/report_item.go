package models

type ReportItem struct {
	ID            uint `gorm:"primaryKey"`
	ReportID      uint `gorm:"not null"`
	ItemID        uint `gorm:"not null"`
	Quantity      int
	PriceSnapshot float64

	Item   MasterItem       `gorm:"foreignKey:ItemID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
}