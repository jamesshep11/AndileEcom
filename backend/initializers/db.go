package initializers

import (
	"fmt"
	"os"

	"github.com/jamesshep11/GoWebService/backend/models"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectToDB() *gorm.DB {
	var err error

	// Get env vars
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	name := os.Getenv("DB_NAME")
	user := os.Getenv("DB_USER")
	pass := os.Getenv("DB_PASS")

	// Build dns
	dns := fmt.Sprintf("%v:%v@tcp(%v:%v)/%v", user, pass, host, port, name)

	// Try to connect
	DB, err = gorm.Open(mysql.Open(dns), &gorm.Config{})

	// Handle errors
	if err != nil {
		panic("Failed to connect to")
	}

	return DB
}

func SyncDb() {
	DB.AutoMigrate(&models.Product{}, &models.Customer{}, &models.Order{})
}
