package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/jamesshep11/GoWebService/backend/initializers"
	"github.com/jamesshep11/GoWebService/backend/models"
)

func CreateCustomer(c *fiber.Ctx) error {
	// Get customer details from request payload
	customer := models.Customer{}

	if err := c.BodyParser(&customer); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	// Create customer
	initializers.DB.Create(&customer)

	return c.Status(fiber.StatusOK).JSON("Success")
}

func DeleteCustomer(c *fiber.Ctx) error {
	// Delete customer
	result := initializers.DB.Delete(&models.Customer{}, c.Params("id"))

	if result.Error != nil {
		return c.Status(500).JSON(result.Error.Error())
	}

	return c.Status(fiber.StatusOK).JSON("Success")
}
