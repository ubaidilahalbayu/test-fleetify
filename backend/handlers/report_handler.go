package handlers

import (
	"fleetify-backend/config"
	"fleetify-backend/models"
	"fleetify-backend/services"

	"encoding/json"
	"fmt"
	"os"
	"strconv"
	"time"
	"log"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func CreateReport(c *fiber.Ctx) error {

	user := c.Locals("user").(models.User)

	vehicleID, _ := strconv.Atoi(c.FormValue("vehicle_id"),)

	odometer, _ :=strconv.Atoi(c.FormValue("odometer"),)
	complaint := c.FormValue("complaint")
	itemsJSON := c.FormValue("items")

	type RequestItem struct {
		ItemID  uint `json:"item_id"`
		Quantity int `json:"quantity"`
	}

	var items []RequestItem

	err := json.Unmarshal(
		[]byte(itemsJSON),
		&items,
	)

	if err != nil {

		return c.Status(400).JSON(
			fiber.Map{
				"message": "Invalid items",
			},
		)
	}

	photo, err := c.FormFile("photo")

	if err != nil {

		return c.Status(400).JSON(
			fiber.Map{
				"message": "Photo required",
			},
		)
	}

	// create folder
	if err := os.MkdirAll(
		"./uploads/initial_photos",
		os.ModePerm,
	); err != nil {

		return c.Status(500).JSON(
			fiber.Map{
				"message": err.Error(),
			},
		)
	}

	// unique filename
	filename := fmt.Sprintf(
		"%d_%s",
		time.Now().Unix(),
		photo.Filename,
	)

	savePath := "./uploads/initial_photos/" + filename

	// save file
	if err := c.SaveFile(photo, savePath); err != nil {

		return c.Status(500).JSON(
			fiber.Map{
				"message": err.Error(),
			},
		)
	}

	var report models.MaintenanceReport

	err = config.DB.Transaction(
		func(tx *gorm.DB) error {

			report = models.MaintenanceReport{
				VehicleID: uint(vehicleID),
				CreatedBy: user.ID,
				Odometer:  odometer,
				Complaint: complaint,

				InitialPhoto: "uploads/initial_photos/" + filename,

				Status:
					"PENDING_APPROVAL",
			}

			if err := tx.Create(&report).Error; err != nil {
				return err
			}

			for _, item := range items {

				var masterItem models.MasterItem

				if err := tx.First(
					&masterItem,
					item.ItemID,
				).Error; err != nil {

					return err
				}

				reportItem :=
					models.ReportItem{
						ReportID: report.ID,

						ItemID: item.ItemID,

						Quantity: item.Quantity,

						PriceSnapshot:
							masterItem.Price,
					}

				if err := tx.Create(
					&reportItem,
				).Error; err != nil {

					return err
				}
			}

			return nil
		},
	)

	if err != nil {
		// hapus uploaded file jika gagal transaction
		if report.InitialPhoto != "" {

			filePath := "./" + report.InitialPhoto

			if _, statErr := os.Stat(filePath); statErr == nil {

				removeErr := os.Remove(filePath)

				if removeErr != nil {
					log.Println(
						"failed remove file:",
						removeErr,
					)
				}
			}
		}

		return c.Status(500).JSON(
			fiber.Map{
				"message": err.Error(),
			},
		)
	}

	go services.SendWebhook(
		"report.created",
		report,
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

func CompleteReport(c *fiber.Ctx) error {

	id := c.Params("id")

	var report models.MaintenanceReport

	err := config.DB.First(&report, id).Error

	if err != nil {

		return c.Status(404).JSON(
			fiber.Map{
				"message": "Report not found",
			},
		)
	}

	if report.Status != "APPROVED" {

		return c.Status(400).JSON(
			fiber.Map{
				"message": "Report must be approved first",
			},
		)
	}

	photo, err := c.FormFile("proof_photo")

	if err != nil {

		return c.Status(400).JSON(
			fiber.Map{
				"message": "Photo required",
			},
		)
	}

	// create folder
	if err := os.MkdirAll(
		"./uploads/proof_photos",
		os.ModePerm,
	); err != nil {

		return c.Status(500).JSON(
			fiber.Map{
				"message": err.Error(),
			},
		)
	}

	filename := fmt.Sprintf(
		"%d_%s",
		time.Now().Unix(),
		photo.Filename,
	)

	savePath := "./uploads/proof_photos/" + filename

	// save file
	if err := c.SaveFile(photo, savePath,); err != nil {

		return c.Status(500).JSON(
			fiber.Map{
				"message": err.Error(),
			},
		)
	}
	report.Status = "COMPLETED"

	report.ProofPhoto = "uploads/proof_photos/" + filename

	if err := config.DB.Save(&report,).Error; err != nil {

		// cleanup file
		os.Remove(savePath)

		return c.Status(500).JSON(
			fiber.Map{
				"message": err.Error(),
			},
		)
	}

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