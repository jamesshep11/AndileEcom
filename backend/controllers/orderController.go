package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/jamesshep11/GoWebService/backend/initializers"
	"github.com/jamesshep11/GoWebService/backend/models"
)

func CreateOrder(c *fiber.Ctx) error {
	// Define a struct to represent the JSON data for creating an order
	type params struct {
		Paid       bool     `json:"paid"`
		CustomerID string   `json:"customerId"`
		ProductIDs []string `json:"products"`
		Total      float32  `json:"total"`
	}

	// Get order details from request payload
	var requestBody params

	if err := c.BodyParser(&requestBody); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	// Check if the customer with the given ID exists
	var customer models.Customer

	if result := initializers.DB.First(&customer, requestBody.CustomerID); result.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "Customer not found",
		})
	}

	// Check if the products with the given IDs exist
	var products []models.Product

	if result := initializers.DB.Find(&products, requestBody.ProductIDs); result.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "One or more products not found",
		})
	}

	// Create order object
	order := models.Order{
		Paid:       requestBody.Paid,
		CustomerId: requestBody.CustomerID,
		Products:   products,
		Total:      requestBody.Total,
	}

	// Insert the order into the database
	if result := initializers.DB.Create(&order); result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to create order",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(order)
}

func GetAllOrders(c *fiber.Ctx) error {
	type params struct {
		IDs        []string `json:"ids"`
		CustomerId string   `json:"customerId"`
	}

	// Get (optional) params from request payload
	data := params{}

	if err := c.BodyParser(&data); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	// Compile query
	query := initializers.DB

	if data.CustomerId != "" {
		query = query.Where("customer_id = ?", data.CustomerId)
	}

	// Get orders
	orders := []models.Order{}
	query.Preload("Customer").Preload("Products").Find(&orders, data.IDs)

	return c.Status(fiber.StatusOK).JSON(orders)
}

func GetOrder(c *fiber.Ctx) error {
	order := models.Order{}
	initializers.DB.Preload("Customer").Preload("Products").First(&order, c.Params("id"))

	return c.Status(fiber.StatusOK).JSON(order)
}

func UpdateOrder(c *fiber.Ctx) error {
	// Get order with id
	order := models.Order{}
	initializers.DB.Preload("Customer").Preload("Products").First(&order, c.Params("id"))

	// Map request body to order
	if err := c.BodyParser(&order); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	// Save changes
	initializers.DB.Save(&order)

	return c.Status(fiber.StatusOK).JSON(order)
}
