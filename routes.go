package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/jamesshep11/GoWebService/backend/controllers"
)

func Routes(app *fiber.App) {
	// BE routes
	api := app.Group("/api")

	// Product routes
	api.Post("/product", controllers.CreateProduct)
	api.Post("/remove-products", controllers.DeleteProducts)
	api.Post("/products", controllers.GetAllProducts)
	api.Get("/product/:id", controllers.GetProduct)
	api.Put("/product/:id", controllers.UpdateProduct)
	// Order routes
	api.Post("/order", controllers.CreateOrder)
	api.Post("/orders", controllers.GetAllOrders)
	api.Get("/order/:id", controllers.GetOrder)
	api.Put("/order/:id", controllers.UpdateOrder)
	// Customer routes
	api.Post("/customer", controllers.CreateCustomer)
	api.Delete("/customer/:id", controllers.DeleteCustomer)

	// FE routes
	frontRoutes := []string{"/", "customers", "products", "orders", "product/:id"}

	for _, route := range frontRoutes {
		app.Get(route, func(c *fiber.Ctx) error {
			return c.Render("index", fiber.Map{})
		})
	}
}
