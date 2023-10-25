package controller

import (
	"atcoder-blogs/model/scraping"
	"net/http"

	"github.com/gin-gonic/gin"
)

func UpdateProblems(c *gin.Context) {
	scraping.UpdateProblems()

	c.JSON(http.StatusOK, gin.H{
		"message": "update problems",
	})
}

func UpdateProblemsList(c *gin.Context) {
	scraping.UpdateProblemDifficultiessList()

	c.JSON(http.StatusOK, gin.H{
		"message": "update problems list",
	})
}

func UpdateProblemDetailsList(c *gin.Context) {
	scraping.UpdateProblemDetailsList()

	c.JSON(http.StatusOK, gin.H{
		"message": "update problem details list",
	})
}
