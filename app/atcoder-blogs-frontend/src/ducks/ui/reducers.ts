import { UIActionTypes } from './actionTypes';
import { UIState } from './types';

const initialState: UIState = {
    isEditingBlog: false,
    updateUserIDError: '',
    updateUserIDResult: '',
}

export const uiReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case UIActionTypes.StartEditingBlog:
            var newState = { ...state }
            newState.isEditingBlog = false
            return newState
        case UIActionTypes.StopEditingBlog:
            var newState = { ...state }
            newState.isEditingBlog = false
            return newState
        case UIActionTypes.ToggleEditingBlog:
            var newState = { ...state }
            newState.isEditingBlog = !state.isEditingBlog
            return newState
        case UIActionTypes.UpdateUserIDError:
            var newState = { ...state }
            newState.updateUserIDError = action.payload.error
            return newState
        case UIActionTypes.ClearUserIDError:
            var newState = { ...state }
            newState.updateUserIDError = ''
            return newState
        case UIActionTypes.UpdateUserIDResult:
            var newState = { ...state }
            newState.updateUserIDResult = action.payload.result
            return newState
        case UIActionTypes.ClearUserIDResult:
            var newState = { ...state }
            newState.updateUserIDResult = ''
            return newState
        default:
            return state
    }
}