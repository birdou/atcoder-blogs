package model

import (
	"log"
	"math"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"github.com/patrickmn/go-cache"
)

type ProblemDetail struct {
	ID                   string  `gorm:"type:varchar(255);primaryKey"`
	ContestID            string  `json:"contest_id"`
	ContestType          string  `json:"contest_type"`
	ProblemIndex         string  `json:"problem_index"`
	Name                 string  `json:"name"`
	Title                string  `json:"title"`
	ProblemDifficultyID  string  `gorm:"type:varchar(255)" json:"problem_difficulty_id"`
	ShortestSubmissionID int     `json:"shortest_submission_id"`
	ShortestContestID    string  `json:"shortest_contest_id"`
	ShortestUserID       string  `json:"shortest_user_id"`
	FastestSubmissionID  int     `json:"fastest_submission_id"`
	FastestContestID     string  `json:"fastest_contest_id"`
	FastestUserID        string  `json:"fastest_user_id"`
	FirstSubmissionID    int     `json:"first_submission_id"`
	FirstContestID       string  `json:"first_contest_id"`
	FirstUserID          string  `json:"first_user_id"`
	SourceCodeLength     int     `json:"source_code_length"`
	ExecutionTime        int     `json:"execution_time"`
	Point                float64 `json:"point"`
	SolverCount          int     `json:"solver_count"`
	CreatedAt            time.Time
	UpdatedAt            time.Time
	DeletedAt            gorm.DeletedAt `gorm:"index"`
}

type ProblemWithDifficulty struct {
	ID           string  `gorm:"type:varchar(255);primaryKey"`
	ContestID    string  `json:"contest_id"`
	ContestType  string  `json:"contest_type"`
	ProblemIndex string  `json:"problem_index"`
	Name         string  `json:"name"`
	Title        string  `json:"title"`
	Difficulty   int     `json:"difficulty"`
	Point        float64 `json:"point"`
	SolverCount  int     `json:"solver_count"`
}

var (
	cacheInstance = cache.New(5*time.Minute, 10*time.Minute)
)

func (ProblemDetail) TableName() string {
	return ProblemDetailTableName
}

func GetProblemWithDifficulties(c *gin.Context, contestType string) ([]ProblemWithDifficulty, bool) {
	cacheKey := "problems:" + contestType
	if x, found := cacheInstance.Get(cacheKey); found {
		return x.([]ProblemWithDifficulty), true
	}

	var problemDetails []ProblemDetail
	var problemWithDifficulties []ProblemWithDifficulty

	result := DB.Where("contest_type = ?", contestType).Find(&problemDetails)
	if result.Error != nil {
		log.Println("Error fetching problem details:", result.Error)
		return problemWithDifficulties, false
	}

	var problemDifficulties []ProblemDifficulty
	var id2difficulty map[string]int = make(map[string]int)

	result = DB.Find(&problemDifficulties)
	if result.Error != nil {
		return problemWithDifficulties, false
	}

	for _, difficulty := range problemDifficulties {
		diff := difficulty.Difficulty
		if diff <= 400 {
			diff = int(math.Floor(400/(math.Exp(float64(400-diff)/400.0)) + 0.5))
		}
		id2difficulty[difficulty.ID] = diff
	}

	for _, problemDetail := range problemDetails {
		problemWithDifficulty := ProblemWithDifficulty{
			ID:           problemDetail.ID,
			ContestID:    problemDetail.ContestID,
			ContestType:  problemDetail.ContestType,
			ProblemIndex: problemDetail.ProblemIndex,
			Name:         problemDetail.Name,
			Title:        problemDetail.Title,
			Difficulty:   id2difficulty[problemDetail.ProblemDifficultyID],
			Point:        problemDetail.Point,
			SolverCount:  problemDetail.SolverCount,
		}
		problemWithDifficulties = append(problemWithDifficulties, problemWithDifficulty)
		cacheInstance.Set(cacheKey, problemWithDifficulties, 5*time.Minute)
	}

	return problemWithDifficulties, true
}
