package scraping

import (
	"atcoder-blogs/model"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"gorm.io/gorm"
)

const GetDifficultiesURL = "https://kenkoooo.com/atcoder/resources/problem-models.json"
const GetProblemDetailsURL = "https://kenkoooo.com/atcoder/resources/merged-problems.json"

func UpdateProblems() {
	UpdateProblemDifficultiessList()
	time.Sleep(5 * time.Second)
	UpdateProblemDetailsList()
}

func UpdateProblemDifficultiessList() {
	resp, err := http.Get(GetDifficultiesURL)
	if err != nil {
		log.Printf("failed to get JSON data: %v\n", err)
		return
	}
	defer resp.Body.Close()

	var difficultiesMap map[string]model.ProblemDifficulty
	if err := json.NewDecoder(resp.Body).Decode(&difficultiesMap); err != nil {
		log.Printf("failed to decode JSON data: %v\n", err)
		return
	}

	var difficultiesSlice []model.ProblemDifficulty
	for problemId, difficulty := range difficultiesMap {
		difficulty.ID = problemId
		difficultiesSlice = append(difficultiesSlice, difficulty)
	}

	model.BatchUpsert(model.DB, difficultiesSlice, 1000)
}

func UpdateProblemDetailsList() {
	resp, err := http.Get(GetProblemDetailsURL)
	if err != nil {
		log.Printf("failed to get JSON data: %v\n", err)
		return
	}
	defer resp.Body.Close()

	var problems []model.ProblemDetail
	if err := json.NewDecoder(resp.Body).Decode(&problems); err != nil {
		log.Printf("failed to decode JSON data: %v\n", err)
		return
	}

	for i := range problems {
		problem := &problems[i]
		cid := problem.ContestID
		if len(cid) >= 3 && cid[:3] == "abc" {
			problem.ContestType = "abc"
		} else if len(cid) >= 3 && cid[:3] == "arc" {
			problem.ContestType = "arc"
		} else if len(cid) >= 3 && cid[:3] == "agc" {
			problem.ContestType = "agc"
		} else {
			problem.ContestType = ""
		}
		problem.CreatedAt = time.Now()
		problem.UpdatedAt = time.Now()

		result := model.DB.First(&model.ProblemDifficulty{}, "id = ?", problem.ID)

		if result.Error == nil {
			problem.ProblemDifficultyID = problem.ID
		} else {
			if result.Error == gorm.ErrRecordNotFound {
				problem.ProblemDifficultyID = ""
			} else {
				log.Printf("failed to get ProblemDifficulty: %v\n", result.Error)
				return
			}
		}
	}

	model.BatchUpsert(model.DB, problems, 1000)
}

func StartUpdateProblemsTicker() {
	UpdateProblems()
	ticker := time.NewTicker(1 * time.Hour)
	go func() {
		for range ticker.C {
			UpdateProblems()
		}
	}()
}
