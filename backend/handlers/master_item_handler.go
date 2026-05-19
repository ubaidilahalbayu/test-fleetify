package handlers

import (
	"fleetify-backend/config"
	"fleetify-backend/models"

	"github.com/gofiber/fiber/v2"
)

func GetMasterItems(c *fiber.Ctx) error {
	var items []models.MasterItem

	config.DB.Find(&items)

	return c.JSON(fiber.Map{
		"data": items,
	})
}