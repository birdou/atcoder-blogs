package controller

import (
	"log"
	"net/http"

	"atcoder-blogs/model/github"

	"atcoder-blogs/model"

	"github.com/gin-gonic/gin"
)

type UpdateUserIdRequest struct {
	UserID    string `json:"user_id"`
	AtcoderID string `json:"atcoder_id"`
}

func UpdateUser(c *gin.Context) {
	//POSTリクエストから、userID, atcoderIDを取得. CookieからaccessTokenを取得
	var req UpdateUserIdRequest
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request"})
		log.Println("Error:", err)
		return
	}

	userID := req.UserID
	atcoderID := req.AtcoderID
	accessToken, err := github.GetAccessTokenFromCookie(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Failed to login. Please try to login again."})
		log.Println("Error:", err)
		return
	}

	ok := model.UpdateUserIDs(userID, atcoderID, accessToken)

	if ok {
		c.JSON(http.StatusOK, gin.H{"message": "Success"})
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Failed to register"})
	}
}

func GetUserMe(c *gin.Context) {
	accessToken, err := github.GetAccessTokenFromCookie(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "Failed to login. Please try to login again.",
			"self":    nil,
		})
		log.Println("Error:", err)
		return
	}
	user, ok := model.GetUserFromToken(accessToken)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Plese setup your account.",
			"self":    nil,
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"self": user,
	})
}
