package github

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/patrickmn/go-cache"
)

const FailedUserID = "-1"

func GetAccessTokenFromCookie(c *gin.Context) (string, error) {
	cookieCode, err := c.Request.Cookie("code")
	if err != nil {
		fmt.Println("Error getting cookie:", err)
		return "", err
	}
	return cookieCode.Value, err
}

type GithubClient struct {
	ClientID     string
	ClientSecret string
}

func GetGithubClient() *GithubClient {
	once.Do(func() {
		clientID, _ := os.LookupEnv("GITHUB_CLIENT_ID")
		clientSecret, _ := os.LookupEnv("GITHUB_CLIENT_SECRET")
		instance = &GithubClient{
			ClientID:     clientID,
			ClientSecret: clientSecret,
		}
	})

	return instance
}

func (client *GithubClient) GetAuthorizeRedirectURL(c *gin.Context) string {
	authURL := fmt.Sprintf("https://github.com/login/oauth/authorize?client_id=%s", client.ClientID)
	return authURL
}

func (client *GithubClient) AuthorizeResult(c *gin.Context) (string, bool) {
	code := c.DefaultQuery("code", "")
	ok := code != ""
	return code, ok
}

func (client *GithubClient) GetAndSaveAccessToken(c *gin.Context, code string) (string, bool) {
	authURL := fmt.Sprintf("https://github.com/login/oauth/access_token?code=%s&client_id=%s&client_secret=%s", code, client.ClientID, client.ClientSecret)

	resp, err := http.Post(authURL, "application/json", bytes.NewBuffer([]byte{}))
	if err != nil {
		log.Println("Error on getting the access_token:", err)
		return "", false
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Println("Error:", err)
		return "", false
	}
	values, err := url.ParseQuery(string(body))
	if err != nil {
		log.Println("Parse error:", err)
		return "", false
	}

	accessToken := values.Get("access_token")
	ok := accessToken != ""
	if ok {
		c.SetCookie("code", accessToken, 0, "/", "atcoder-blogs.jp", false, true)
	}
	return accessToken, ok
}

type VerificationResult struct {
	UserId  string
	Success bool
}

var FailedVerificationResult = VerificationResult{UserId: FailedUserID, Success: false}
var veryfyUserCache = cache.New(1*time.Hour, 2*time.Hour)

func (client *GithubClient) VerifyUser(accessToken string) VerificationResult {
	if vrc, exists := veryfyUserCache.Get(accessToken); exists {
		vr := vrc.(VerificationResult)
		return vr
	}

	c := &http.Client{}
	req, err := http.NewRequest("GET", "https://api.github.com/user", nil)
	if err != nil {
		log.Println("Error creating request:", err, req)
		return FailedVerificationResult
	}
	req.Header.Set("Authorization", "token "+accessToken)

	resp, err := c.Do(req)
	if err != nil {
		log.Println("Error sending request:", err, req)
		return FailedVerificationResult
	}
	defer resp.Body.Close()

	oauthClientID := resp.Header.Get("x-oauth-client-id")

	if oauthClientID != client.ClientID {
		log.Println("Error: oauthClientID is not valid:", oauthClientID, client.ClientID)
		return FailedVerificationResult
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Println("Error reading response body:", err, resp.Body)
		return FailedVerificationResult
	}

	var result map[string]interface{}
	err = json.Unmarshal(body, &result)
	if err != nil {
		log.Println("Error unmarshalling JSON:", err, body)
		return FailedVerificationResult
	}

	id, ok := result["id"]
	if !ok {
		log.Println("Error: id is not vaild key", result)
		return FailedVerificationResult
	}
	strID := fmt.Sprintf("%.0f", id)

	vresult := VerificationResult{UserId: strID, Success: true}
	veryfyUserCache.Set(accessToken, vresult, 1*time.Hour)

	return vresult
}

var instance *GithubClient
var once sync.Once
