package main

import (
	"log"

    "fleetify-backend/config"
    "fleetify-backend/models"

	"github.com/gofiber/fiber/v2"
)

func main() {
	config.ConnectDatabase()

	config.DB.AutoMigrate(
		&models.User{},
		&models.Vehicle{},
		&models.MasterItem{},
		&models.MaintenanceReport{},
		&models.ReportItem{},
	)

	app := fiber.New()

	app.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"message": "Fleetify API Running",
		})
	})

	log.Fatal(app.Listen(":8080"))
}