package main

import (
	"log"

	"fleetify-backend/config"
	"fleetify-backend/models"
	"fleetify-backend/seeders"
	"fleetify-backend/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
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

	seeders.RunSeeder()

	app := fiber.New()

	app.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"message": "Fleetify API Running",
		})
	})
	app.Use(cors.New())
	routes.SetupRoutes(app)

	log.Fatal(app.Listen(":8080"))
}