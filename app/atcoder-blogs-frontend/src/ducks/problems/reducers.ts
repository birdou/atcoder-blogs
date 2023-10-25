
import { ProblemState } from './types'
import { ProblemActionTypes } from './actionTypes'

const initialState: ProblemState = {
    contestType: '',
    problemsByContest: {},
}

export const problemReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case ProblemActionTypes.FetchProblems:
            if (!action.error) {
                const { problemsByContest } = action.payload
                var newState = { ...initialState }
                newState.problemsByContest = { ...problemsByContest }
                return newState
            } else {
                return state
            }
        default:
            return state
    }
}