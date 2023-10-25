package model

import (
	"log"

	"gorm.io/gorm"
)

type UserBlogURL struct {
	ID           int    `gorm:"primaryKey"`
	BlogURL      string `gorm:"type:varchar(255)" json:"blog_url"`
	ProblemID    string `gorm:"type:varchar(255)" json:"problem_id"`
	UserGithubID string `gorm:"type:varchar(255)" json:"user_github_id"`
}

func (UserBlogURL) TableName() string {
	return UserBlogURLTableName
}

func GetUserBlogs(githubID string) []UserBlogURL {
	user, ok := GetUserFromGithubID(githubID)
	if !ok {
		return []UserBlogURL{}
	}
	return getUserBlogsByGithubID(user.GithubID)
}

func getUserBlogsByGithubID(githubUserID string) []UserBlogURL {
	var blogURLs []UserBlogURL
	result := DB.Where("user_github_id = ?", githubUserID).Find(&blogURLs)
	if result.Error != nil {
		log.Println("Unable to fetch records", result.Error)
	}
	return blogURLs
}

func UpsertOrDeleteUserBlog(githubUserID string, problemID string, blogURLStr string) bool {
	upsertMutex.Lock()
	defer upsertMutex.Unlock()
	if githubUserID == "" || problemID == "" {
		return false
	}

	tx := DB.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	if blogURLStr == "" {
		DeleteBlogURL(githubUserID, problemID)
		tx.Commit()
		return true
	}

	var userBlogURL UserBlogURL

	if err := tx.Set("gorm:query_option", "FOR UPDATE").Where(UserBlogURL{
		UserGithubID: githubUserID,
		ProblemID:    problemID,
	}).First(&userBlogURL).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			userBlogURL = UserBlogURL{
				UserGithubID: githubUserID,
				ProblemID:    problemID,
				BlogURL:      blogURLStr,
			}
			if err := tx.Create(&userBlogURL).Error; err != nil {
				log.Println("Unable to create record:", err)
				tx.Rollback()
				return false
			}
		} else {
			log.Println("Error during fetching the record:", err)
			tx.Rollback()
			return false
		}
	} else {
		userBlogURL.BlogURL = blogURLStr
		if err := tx.Save(&userBlogURL).Error; err != nil {
			log.Println("Unable to update record:", err)
			tx.Rollback()
			return false
		}
	}

	tx.Commit()
	return true
}

func DeleteBlogURL(githubUserID string, problemID string) {
	DB.Delete(&UserBlogURL{}, "user_github_id = ? AND problem_id = ?", githubUserID, problemID)
}
