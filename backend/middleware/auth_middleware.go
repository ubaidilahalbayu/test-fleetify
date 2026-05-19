package middleware

import (
	"strconv"

	"fleetify-backend/config"
	"fleetify-backend/models"

	"github.com/gofiber/fiber/v2"
)

func RequireRole(roles ...string) fiber.Handler {
	return func(c *fiber.Ctx) error {

		userID := c.Get("X-User-ID")

		if userID == "" {
			return c.Status(401).JSON(fiber.Map{
				"message": "X-User-ID header required",
			})
		}

		id, err := strconv.Atoi(userID)

		if err != nil {
			return c.Status(400).JSON(fiber.Map{
				"message": "Invalid user id",
			})
		}

		var user models.User

		err = config.DB.First(&user, id).Error

		if err != nil {
			return c.Status(404).JSON(fiber.Map{
				"message": "User not found",
			})
		}

		allowed := false

		for _, role := range roles {
			if user.Role == role {
				allowed = true
				break
			}
		}

		if !allowed {
			return c.Status(403).JSON(fiber.Map{
				"message": "Forbidden",
			})
		}

		c.Locals("user", user)

		return c.Next()
	}
}