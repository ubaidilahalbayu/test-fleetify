package models

type MasterItem struct {
	ID       uint    `gorm:"primaryKey"`
	ItemName string  `gorm:"not null"`
	Type     string  `gorm:"type:enum('PART','SERVICE');not null"`
	Price    float64 `gorm:"not null"`
}