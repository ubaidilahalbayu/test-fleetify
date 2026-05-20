package handlers

import (
	"fleetify-backend/config"
	"fleetify-backend/models"
	"fleetify-backend/services"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func CreateReport(c *fiber.Ctx) error {

	var req models.CreateReportRequest

	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"message": "Invalid request",
		})
	}

	user := c.Locals("user").(models.User)

	err := config.DB.Transaction(func(tx *gorm.DB) error {

		report := models.MaintenanceReport{
			VehicleID:    req.VehicleID,
			CreatedBy:    user.ID,
			Odometer:     req.Odometer,
			Complaint:    req.Complaint,
			InitialPhoto: req.InitialPhoto,
			Status:       "PENDING_APPROVAL",
		}

		if err := tx.Create(&report).Error; err != nil {
			return err
		}

		for _, item := range req.Items {

			var masterItem models.MasterItem

			if err := tx.First(&masterItem, item.ItemID).Error; err != nil {
				return err
			}

			reportItem := models.ReportItem{
				ReportID:      report.ID,
				ItemID:        item.ItemID,
				Quantity:      item.Quantity,
				PriceSnapshot: masterItem.Price,
			}

			if err := tx.Create(&reportItem).Error; err != nil {
				return err
			}
		}

		return nil
	})

	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	go services.SendWebhook(
		"report.created",
		req,
	)

	return c.JSON(fiber.Map{
		"message": "Report created successfully",
	})
}

func ApproveReport(c *fiber.Ctx) error {

	id := c.Params("id")

	var report models.MaintenanceReport

	err := config.DB.First(&report, id).Error

	if err != nil {
		return c.Status(404).JSON(fiber.Map{
			"message": "Report not found",
		})
	}

	if report.Status != "PENDING_APPROVAL" {
		return c.Status(400).JSON(fiber.Map{
			"message": "Report already processed",
		})
	}

	report.Status = "APPROVED"

	config.DB.Save(&report)

	go services.SendWebhook(
		"report.approved",
		report,
	)

	return c.JSON(fiber.Map{
		"message": "Report approved",
	})
}

type CompleteReportRequest struct {
	ProofPhoto string `json:"proof_photo"`
}

func CompleteReport(c *fiber.Ctx) error {

	id := c.Params("id")

	var req CompleteReportRequest

	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"message": "Invalid request",
		})
	}

	var report models.MaintenanceReport

	err := config.DB.First(&report, id).Error

	if err != nil {
		return c.Status(404).JSON(fiber.Map{
			"message": "Report not found",
		})
	}

	if report.Status != "APPROVED" {
		return c.Status(400).JSON(fiber.Map{
			"message": "Report must be approved first",
		})
	}

	report.Status = "COMPLETED"
	report.ProofPhoto = req.ProofPhoto

	config.DB.Save(&report)

	go services.SendWebhook(
		"report.completed",
		report,
	)

	return c.JSON(fiber.Map{
		"message": "Report completed",
	})
}

func GetReports(c *fiber.Ctx) error {

	var reports []models.MaintenanceReport

	config.DB.
		Preload("Vehicle").
		Preload("User").
		Preload("Items").
		Preload("Items.Item").
		Order("created_at desc").
		Find(&reports)

	return c.JSON(fiber.Map{
		"data": reports,
	})
}