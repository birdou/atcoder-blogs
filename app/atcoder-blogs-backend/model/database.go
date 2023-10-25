package model

import (
	"fmt"
	"log"
	"os"
	"reflect"
	"sync"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

const ProblemTableName = "problems"
const ProblemDifficultyTableName = "problem_difficulties"
const ProblemDetailTableName = "problem_details"
const UserBlogURLTableName = "blog_urls"
const UserTableName = "users"

var upsertMutex sync.Mutex

func InitDBConnection() {
	password, ok := os.LookupEnv("DB_PASSWORD")
	if !ok {
		fmt.Println("Invalid .env file found")
		return
	}
	dsn := fmt.Sprintf("root:%s@tcp(db:3306)/atcoder-blogs?charset=utf8mb4&parseTime=True&loc=Local", password)
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	})
	if err != nil {
		panic("Failed to connect to database: " + err.Error())
	}
	DB = db
}

func Upsert(db *gorm.DB, data interface{}) {
	result := db.Clauses(clause.OnConflict{UpdateAll: true}).Create(data)
	if result.Error != nil {
		log.Printf("Error: %v\n The above error occurred.\n\n", result.Error)
	}
}

func BatchUpsert(db *gorm.DB, data interface{}, batchSize int) {
	rv := reflect.ValueOf(data)
	if rv.Kind() != reflect.Slice {
		log.Printf("BatchUpsert requires a slice, but got: %T", data)
		return
	}

	for i := 0; i < rv.Len(); i += batchSize {
		end := i + batchSize
		if end > rv.Len() {
			end = rv.Len()
		}
		batch := rv.Slice(i, end).Interface()
		result := db.Clauses(clause.OnConflict{UpdateAll: true}).Create(batch)
		if result.Error != nil {
			log.Printf("Error: %v\n The above error occurred.\n\n", result.Error)
		}
	}
}
