package controller

import (
	"log"
	"net/http"

	githubController "atcoder-blogs/controller/github"
	"atcoder-blogs/model"
	githubModel "atcoder-blogs/model/github"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func GetRouter() *gin.Engine {
	r := gin.Default()

	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost", "https://atcoder-blogs.jp"}
	config.AllowHeaders = []string{"Origin", "Content-Length", "Content-Type", "Cookie", "Set-Cookie", "Access-Control-Allow-Origin", "Access-Control-Allow-Headers", "Access-Control-Allow-Methods"}

	r.Use(cors.New(config))

	r.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "Access Test",
		})
	})

	r.GET("/problems/get", func(c *gin.Context) {
		GetProblemWithDifficulties(c)
	})

	r.GET("/blogs/get", func(c *gin.Context) {
		GetUserBlogs(c)
	})

	r.POST("/blog/upsert", func(c *gin.Context) {
		if user, ok := validatedUserOnly(c); ok {
			UpsertUserBlog(c, user)
		}
	})

	r.GET("/users/myaccount", func(c *gin.Context) {
		GetUserMe(c)
	})

	r.POST("/users/update", func(c *gin.Context) {
		UpdateUser(c)
	})

	r.GET("/auth/signup", func(c *gin.Context) {
		githubController.Signup(c)
	})

	r.POST("/auth/login", func(c *gin.Context) {
		githubController.Login(c)
	})

	r.POST("/auth/signuplogin", func(c *gin.Context) {
		githubController.SignupLogin(c)
	})

	r.GET("/auth/signup/callback", func(c *gin.Context) {
		githubController.SignupCallback(c)
	})
	return r
}

func validatedUserOnly(c *gin.Context) (model.User, bool) {
	accessToken, err := githubModel.GetAccessTokenFromCookie(c)
	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{
			"message": "Failed to login. Please try to login again.",
			"self":    nil,
		})
		log.Println("Error:", err)
		return model.User{}, false
	}
	user, ok := model.GetUserFromToken(accessToken)
	if !ok {
		c.JSON(http.StatusForbidden, gin.H{
			"message": "Failed to get user. Please register account",
			"self":    nil,
		})
		return model.User{}, false
	}
	return user, true
}
