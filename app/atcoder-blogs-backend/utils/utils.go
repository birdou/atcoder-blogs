package utils

import (
	"os"
)

func GetBaseURL() string {
	if os.Getenv("GIN_MODE") == "release" {
		return "https://atcoder-blogs.jp"
	}
	return "http://localhost"
}
