package seeders

import (
	"log"

	"fleetify-backend/config"
	"fleetify-backend/models"
)

func RunSeeder() {
	db := config.DB

	var count int64

	db.Model(&models.User{}).Count(&count)

	if count > 0 {
		log.Println("Seeder already executed")
		return
	}

	users := []models.User{
		{
			Username: "serviceadvisor",
			Role:     "SA",
		},
		{
			Username: "manager",
			Role:     "APPROVAL",
		},
	}

	vehicles := []models.Vehicle{
		{
			LicensePlate: "BG1234AA",
			Model:        "Toyota Avanza",
		},
		{
			LicensePlate: "BG5678BB",
			Model:        "Honda Brio",
		},
		{
			LicensePlate: "BG9999CC",
			Model:        "Mitsubishi Xpander",
		},
	}

	items := []models.MasterItem{
		{
			ItemName: "Oli Mesin",
			Type:     "PART",
			Price:    350000,
		},
		{
			ItemName: "Filter Oli",
			Type:     "PART",
			Price:    50000,
		},
		{
			ItemName: "Kampas Rem",
			Type:     "PART",
			Price:    450000,
		},
		{
			ItemName: "Jasa Service Ringan",
			Type:     "SERVICE",
			Price:    250000,
		},
		{
			ItemName: "Spooring Balancing",
			Type:     "SERVICE",
			Price:    300000,
		},
	}

	db.Create(&users)
	db.Create(&vehicles)
	db.Create(&items)

	log.Println("Seeder success")
}