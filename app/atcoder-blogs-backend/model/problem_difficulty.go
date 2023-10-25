package model

import (
	"time"

	"gorm.io/gorm"
)

type ProblemDifficulty struct {
	ID               string  `gorm:"type:varchar(255);primaryKey"`
	Slope            float64 `json:"slope"`
	Intercept        float64 `json:"intercept"`
	Variance         float64 `json:"variance"`
	Difficulty       int     `json:"difficulty"`
	Discrimination   float64 `json:"discrimination"`
	IrtLoglikelihood float64 `json:"irt_loglikelihood"`
	IrtUsers         int     `json:"irt_users"`
	IsExperimental   bool    `json:"is_experimental"`
	CreatedAt        time.Time
	UpdatedAt        time.Time
	DeletedAt        gorm.DeletedAt `gorm:"index"`
}

func (ProblemDifficulty) TableName() string {
	return ProblemDifficultyTableName
}
