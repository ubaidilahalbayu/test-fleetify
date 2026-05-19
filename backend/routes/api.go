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

	api.Post(
		"/reports",
		middleware.RequireRole("SA"),
		handlers.CreateReport,
	)
	api.Put(
		"/reports/:id/approve",
		middleware.RequireRole("APPROVAL"),
		handlers.ApproveReport,
	)

	api.Put(
		"/reports/:id/complete",
		middleware.RequireRole("SA"),
		handlers.CompleteReport,
	)

	api.Get(
		"/reports",
		middleware.RequireRole("SA", "APPROVAL"),
		handlers.GetReports,
	)
}