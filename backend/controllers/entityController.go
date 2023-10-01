package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/jamesshep11/GoWebService/backend/initializers"
)

type ids struct {
	IDs []string `json:"ids"`
}

func Create(entity interface{}, c *fiber.Ctx) error {
	// Get entity details from request payload
	if err := c.BodyParser(&entity); err != nil {
		return c.Status(400).JSON(err.Error())
	}

	// Create entity
	initializers.DB.Create(&entity)

	return c.Status(201).JSON(entity)
}

func GetAll[S ~[]E, E any](entities S, c *fiber.Ctx) error {
	// Get (optional) ids from request payload
	data := ids{}

	if err := c.BodyParser(&data); err != nil {
		return c.Status(400).JSON(err.Error())
	}

	// Get entities
	initializers.DB.Where(data.IDs).Find(&entities)

	return c.Status(200).JSON(entities)
}

func Get(entity interface{}, c *fiber.Ctx) error {
	id := c.Params("id")

	initializers.DB.First(&entity, id)

	return c.Status(200).JSON(entity)
}

func Update(entity interface{}, c *fiber.Ctx) error {
	// Get entity with id
	initializers.DB.First(&entity, c.Params("id"))

	// Map request body to entity
	if err := c.BodyParser(&entity); err != nil {
		return c.Status(400).JSON(err.Error())
	}

	// Save changes
	initializers.DB.Save(&entity)

	return c.Status(200).JSON(entity)
}

func Delete(entity interface{}, c *fiber.Ctx) error {
	// Get entity ids from request payload
	data := ids{}

	if err := c.BodyParser(&data); err != nil {
		return c.Status(400).JSON(err.Error())
	}

	// Delete entity
	result := initializers.DB.Where(data.IDs).Delete(&entity)

	if result.Error != nil {
		return c.Status(500).JSON(result.Error.Error())
	}

	return c.Status(200).JSON("Success")
}
