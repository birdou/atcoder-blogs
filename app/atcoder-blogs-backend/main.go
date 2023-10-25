package main

import (
	"atcoder-blogs/controller"
	"atcoder-blogs/model"
	"atcoder-blogs/model/scraping"
	"io"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()
	model.InitDBConnection()

	scraping.StartUpdateProblemsTicker()

	f, _ := os.Create("server.log")
	gin.DefaultWriter = io.MultiWriter(os.Stdout, f)

	router := controller.GetRouter()
	router.Run(":3001")
}
