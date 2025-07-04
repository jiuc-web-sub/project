package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Username  string `gorm:"size:50;not null;unique"`
	Password  string `gorm:"size:255;not null"`
	Email     string `gorm:"size:100;not null;unique"`
	AvatarURL string `gorm:"size:255"`
}

type Task struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	DueDate     time.Time `json:"dueDate"`
	UserID      uint      `json:"userId"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

type TaskResource struct {
	gorm.Model
	TaskID   uint   `gorm:"not null"`
	FileName string `gorm:"size:255;not null"`
	FilePath string `gorm:"size:255;not null"`
	FileSize int64  `gorm:"not null"`
	Task     Task   `gorm:"foreignKey:TaskID"`
}

type UserSetting struct {
	gorm.Model
	UserID          uint   `gorm:"not null;unique"`
	FontFamily      string `gorm:"size:50;default:'Arial'"`
	FontSize        int    `gorm:"default:14"`
	BackgroundImage string `gorm:"size:255"`
	Theme           string `gorm:"size:20;default:'light'"`
	User            User   `gorm:"foreignKey:UserID"`
}
