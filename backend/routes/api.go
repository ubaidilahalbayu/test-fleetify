package routes

import (
	"fleetify-backend/handlers"
	"fleetify-backend/middleware"

	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {

	api := app.Group("/api")

	api.Get(
		"/vehicles",
		middleware.RequireRole("SA", "APPROVAL"),
		handlers.GetVehicles,
	)

	api.Get(
		"/master-items",
		middleware.RequireRole("SA", "APPROVAL"),
		handlers.GetMasterItems,
	)
}