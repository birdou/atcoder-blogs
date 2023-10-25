package main

import (
	"atcoder-blogs/model"
	"fmt"
	"os"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

// データベース接続
func connectDB() *gorm.DB {
	password, ok := os.LookupEnv("DB_PASSWORD")
	if !ok {
		fmt.Println("Invalid .env file found")
	}
	dsn := fmt.Sprintf("root:%s@tcp(db:3306)/atcoder-blogs?charset=utf8mb4&parseTime=True&loc=Local", password)
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("Failed to connect to database: " + err.Error())
	}
	return db
}

// initDatabase - データベース初期化
func initDatabase(db *gorm.DB) {
	// ALTER USER
	alterUserSQL := "ALTER USER 'admin'@'%' IDENTIFIED WITH 'mysql_native_password' BY 'password'"
	if err := db.Exec(alterUserSQL).Error; err != nil {
		fmt.Println("Failed to alter user:", err)
		return
	}

	// FLUSH PRIVILEGES
	flushPrivilegesSQL := "FLUSH PRIVILEGES"
	if err := db.Exec(flushPrivilegesSQL).Error; err != nil {
		fmt.Println("Failed to flush privileges:", err)
		return
	}

	fmt.Println("Successfully altered user and flushed privileges.")
}

func createProblemDifficultiesTable(db *gorm.DB) {
	db.AutoMigrate(&model.ProblemDifficulty{})
	fmt.Println("Table migrated successfully!")
}

func createProblemDetailsTable(db *gorm.DB) {
	db.AutoMigrate(&model.ProblemDetail{})
	fmt.Println("Table migrated successfully!")
}

func createUserBlogsTable(db *gorm.DB) {
	db.AutoMigrate(&model.UserBlogURL{})
	fmt.Println("Table migrated successfully!")
}

func createUsersTable(db *gorm.DB) {
	db.AutoMigrate(&model.User{})
	fmt.Println("Table migrated successfully!")
}

func main() {
	db := connectDB()

	// マイグレーション関数を順に呼び出す
	initDatabase(db)
	createProblemDifficultiesTable(db)
	createProblemDetailsTable(db)
	createUserBlogsTable(db)
	createUsersTable(db)

	fmt.Println("Migration completed.")
}
