package handlers

import (
	"fleetify-backend/config"
	"fleetify-backend/models"

	"github.com/gofiber/fiber/v2"
)

func GetVehicles(c *fiber.Ctx) error {
	var vehicles []models.Vehicle

	config.DB.Find(&vehicles)

	return c.JSON(fiber.Map{
		"data": vehicles,
	})
}