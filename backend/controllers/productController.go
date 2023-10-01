package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/jamesshep11/GoWebService/backend/initializers"
	"github.com/jamesshep11/GoWebService/backend/models"
)

func CreateProduct(c *fiber.Ctx) error {
	// Get product details from request payload
	product := models.Product{}

	if err := c.BodyParser(&product); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	// Create product
	initializers.DB.Create(&product)

	return c.Status(201).JSON(product)
}

func GetAllProducts(c *fiber.Ctx) error {
	// Get (optional) ids from request payload
	data := ids{}

	if err := c.BodyParser(&data); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	// Get products
	products := []models.Product{}
	initializers.DB.Find(&products, data.IDs)

	return c.Status(fiber.StatusOK).JSON(products)
}

func GetProduct(c *fiber.Ctx) error {
	product := models.Product{}
	initializers.DB.First(&product, c.Params("id"))

	return c.Status(fiber.StatusOK).JSON(product)
}

func UpdateProduct(c *fiber.Ctx) error {
	// Get product with id
	product := models.Product{}
	initializers.DB.First(&product, c.Params("id"))

	// Map request body to product
	if err := c.BodyParser(&product); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	// Save changes
	initializers.DB.Save(&product)

	return c.Status(fiber.StatusOK).JSON(product)
}

func DeleteProducts(c *fiber.Ctx) error {
	// Get product ids from request payload
	data := ids{}

	if err := c.BodyParser(&data); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	// Delete products
	result := initializers.DB.Delete(&models.Product{}, data.IDs)

	if result.Error != nil {
		return c.Status(500).JSON(result.Error.Error())
	}

	return c.Status(fiber.StatusOK).JSON("Success")
}
