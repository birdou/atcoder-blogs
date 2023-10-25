package model

import (
	"atcoder-blogs/model/github"
	"log"

	"regexp"
)

type User struct {
	GithubID  string `gorm:"type:varchar(255);primaryKey"`
	UserID    string `gorm:"type:varchar(255);unique"`
	AtcoderID string `gorm:"type:varchar(255)"`
}

func (User) TableName() string {
	return UserTableName
}

func GetUserFromUserID(userID string) (User, bool) {
	var user User
	result := DB.Where("user_id = ?", userID).First(&user)
	if result.Error != nil {
		log.Println("Unable to fetch user", result.Error)
		return user, false
	}
	return user, true
}

func GetUserFromGithubID(githubID string) (User, bool) {
	var user User
	result := DB.Where("github_id = ?", githubID).First(&user)
	if result.Error != nil {
		log.Println("Unable to fetch user", result.Error)
		return user, false
	}
	return user, true
}

func upsertUser(userID string, githubID string, atcoderID string) bool {
	tx := DB.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	var user User
	if err := tx.Where("github_id = ?", githubID).FirstOrInit(&user).Error; err != nil {
		log.Println("Unable to find or init user", err)
		tx.Rollback()
		return false
	}

	user.UserID = userID
	user.GithubID = githubID
	user.AtcoderID = atcoderID

	if err := tx.Save(&user).Error; err != nil {
		log.Println("Unable to upsert user", err)
		tx.Rollback()
		return false
	}

	tx.Commit()
	return true
}

func UpdateUserIDs(newUserID string, newAtcoderID string, accessToken string) bool {
	upsertMutex.Lock()
	defer upsertMutex.Unlock()

	if prevUser, ok := GetUserFromToken(accessToken); ok {
		if prevUser.UserID != newUserID {
			if !IsValidUserId(newUserID) {
				log.Println("Invalid userID", newUserID)
				return false
			}
			if !IsUniqueUserId(newUserID) {
				log.Println("Not unique userID", newUserID)
				return false
			}
		}
	}

	result := github.GetGithubClient().VerifyUser(accessToken)
	if result.Success {
		githubID := result.UserId
		ok := upsertUser(newUserID, githubID, newAtcoderID)
		if !ok {
			log.Println("Failed to upserted user", newUserID, newAtcoderID, result.UserId)
		}
		return ok
	}
	log.Println("Failed to upserted user", newUserID, newAtcoderID, result.UserId)
	return false
}

func GetUserFromToken(acccessToken string) (User, bool) {
	user := User{}
	result := github.GetGithubClient().VerifyUser(acccessToken)
	if result.Success {
		githubID := result.UserId
		user.GithubID = githubID
		result := DB.Where("github_id = ?", githubID).First(&user)
		if result.Error != nil {
			log.Println("Unable to fetch user", result.Error)
			user.GithubID = github.FailedUserID
			return user, false
		} else {
			return user, true
		}
	} else {
		return user, false
	}
}

func IsValidUserId(userId string) bool {
	// 長さが3以上16以下であるかチェック
	if len(userId) < 3 || 16 < len(userId) {
		return false
	}

	// 半角英数字のみであるかチェック
	matched, _ := regexp.MatchString("^[a-zA-Z0-9]+$", userId)
	return matched
}

func IsUniqueUserId(userId string) bool {
	var count int64
	DB.Model(&User{}).Where("user_id = ?", userId).Count(&count)
	return count == 0
}

func IsAlreadyRegistered(githubId string) bool {
	var count int64
	DB.Model(&User{}).Where("github_id = ?", githubId).Count(&count)
	return count > 0
}
