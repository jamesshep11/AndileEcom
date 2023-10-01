package models

import "gorm.io/gorm"

type Order struct {
	ID         uint           `json:"id" gorm:"primarykey"`
	Paid       bool           `json:"paid"`
	CustomerId string         `json:"customer_id"`
	Customer   Customer       `json:"customer"`
	Products   []Product      `json:"products" gorm:"many2many:order_items"`
	Total      float32        `json:"total"`
	CreatedAt  int64          `gorm:"autoCreateTime"`
	UpdatedAt  int64          `gorm:"autoUpdateTime"`
	DeletedAt  gorm.DeletedAt `gorm:"index"`
}
