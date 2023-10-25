package controller

import (
	"atcoder-blogs/model"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetUserBlogs(c *gin.Context) {
	userID := c.Query("user_id")
	userBlogs := []model.UserBlogURL{}
	if user, ok := model.GetUserFromUserID(userID); ok {
		userBlogs = model.GetUserBlogs(user.GithubID)
	}
	c.JSON(http.StatusOK, gin.H{
		"blogs": userBlogs,
	})
}

func UpsertUserBlog(c *gin.Context, user model.User) {
	var body model.UserBlogURL
	if err := c.BindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "request body format error",
		})
		return
	}
	ok := model.UpsertOrDeleteUserBlog(user.GithubID, body.ProblemID, body.BlogURL)
	log.Println(user.GithubID, body.BlogURL)
	if ok {
		c.JSON(http.StatusOK, gin.H{
			"message": "success",
		})
	} else {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "request body format error",
		})
	}
}
