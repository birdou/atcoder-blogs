import { Dispatch, AnyAction} from 'redux';
import { ProblemActionTypes } from './actionTypes';
import { Problem } from './types';
import Axios from '../../utils/CustomAxios'
import { BackendAPIURL } from '../../utils/BackendAPI';

export const fetchProblems = (contestType: string) => {
    return (dispatch: Dispatch<AnyAction>) => {
        try{
            return Axios.get(`${BackendAPIURL}/problems/get?contest_type=${contestType}`)
            .then(response => {
                const problemsByContest = response.data.problems.reduce((acc: any, problem: Problem) => {
                    if (!acc[problem.contestId]) {
                    acc[problem.contestId] = {};
                    }
                    if (problem.problemIndex === "Ex") {
                    acc[problem.contestId]["H"] = problem;
                    } else {
                    acc[problem.contestId][problem.problemIndex] = problem;
                    }
                    return acc;
                }, {});
                dispatch({
                    type: ProblemActionTypes.FetchProblems,
                    payload: {
                        problemsByContest,
                    },
                    error: false
                });
            })
        } catch (error) {
            console.error("Error sending GET request:", error);
            return {
                type: ProblemActionTypes.FetchProblems,
                payload: new Error(),
                error: true
            };
        }
    }
}