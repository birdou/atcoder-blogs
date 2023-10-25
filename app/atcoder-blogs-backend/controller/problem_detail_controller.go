package controller

import (
	"atcoder-blogs/model"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetProblemWithDifficulties(c *gin.Context) {
	contestType := c.DefaultQuery("contest_type", "abc")
	if contestType != "abc" && contestType != "arc" && contestType != "agc" {
		contestType = "abc"
	}
	problems, ok := model.GetProblemWithDifficulties(c, contestType)

	if ok {
		c.JSON(http.StatusOK, gin.H{
			"problems": problems,
		})
	} else {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "internal server error",
		})
	}
}
