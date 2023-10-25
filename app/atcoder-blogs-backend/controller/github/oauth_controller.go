package github

import (
	"atcoder-blogs/model/github"
	"atcoder-blogs/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

func Signup(c *gin.Context) {
	signup(c)
}

func Login(c *gin.Context) {
	login(c, false)
}

func SignupLogin(c *gin.Context) {
	login(c, true)
}

func signup(c *gin.Context) {
	redirectUrl := github.GetGithubClient().GetAuthorizeRedirectURL(c)
	c.JSON(http.StatusOK, gin.H{
		"message": "Redirect to Github",
		"url":     redirectUrl,
		"login":   false,
	})
}

func login(c *gin.Context, isAllowSignup bool) {
	githubClient := github.GetGithubClient()
	code, err := github.GetAccessTokenFromCookie(c)
	isOk := true

	if err != nil {
		isOk = false
	} else {
		isVerified := githubClient.VerifyUser(code)
		if !isVerified.Success {
			isOk = false
		}
	}

	if isOk {
		c.JSON(http.StatusOK, gin.H{
			"message": "Success",
			"login":   true,
		})
	} else {
		if isAllowSignup {
			signup(c)
		} else {
			c.JSON(http.StatusUnauthorized, gin.H{
				"message": "Failed to login",
				"login":   false,
			})
		}
	}
}

func SignupCallback(c *gin.Context) {
	githubClient := github.GetGithubClient()
	code, ok := githubClient.AuthorizeResult(c)
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to authorize"})
		return
	}
	accessToken, ok := githubClient.GetAndSaveAccessToken(c, code)

	if !ok {
		c.String(http.StatusUnauthorized, "Github Authorization failed")
		return
	}

	r := githubClient.VerifyUser(accessToken)
	if !r.Success {
		c.String(http.StatusUnauthorized, "Github Authorization failed")
		return
	}
	host := utils.GetBaseURL()
	c.Redirect(http.StatusFound, host+"/myaccount")
}
