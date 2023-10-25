
export type ProblemState = {
    contestType: string;
    problemsByContest: ProblemsByContest; 
}

export interface Problem {
    ID:           string;
	contestId:    string;
	contestType:  string;
	problemIndex: string;
	name:         string;
	title:        string;
	difficulty:   number;
	point:        number;
	solverCount:  number;
}

export type ProblemsByContest = {
    [key: string]: { 
        [key: string]: Problem
    };
}