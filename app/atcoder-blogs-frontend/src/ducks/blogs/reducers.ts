import BlogActionTypes from "./actionTypes";
import { BlogState } from "./types";

const initialState: BlogState = {
    blogUserId: '',
    blogURLs: {},
}

export const blogURLReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case BlogActionTypes.UpdateBlogUser:
            const { userId } = action.payload
            var newState = { ...state }
            newState.blogUserId = userId
            return newState
        case BlogActionTypes.UpdateBlogURL:
            if (!action.error) {
                const { problemId, blogURL } = action.payload
                var newState = { ...state }
                newState.blogURLs[problemId] = blogURL
                return newState
            } else {
                return state
            }
        case BlogActionTypes.FetchBlogURLs:
            if (!action.error) {
                const { problemBlogMap } = action.payload
                var newState = { ...initialState }
                newState.blogURLs = { ...problemBlogMap }
                newState.blogUserId = state.blogUserId
            return newState
            } else {
                return state
            }
        default:
            return state
    }
}