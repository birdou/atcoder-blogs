import { UserState } from './types'
import { UserActionTypes } from './actionTypes'
import { User } from './types'

const initState: UserState = {
    login: false,
    userId: '',
    atcoderId: '',
}

export const userReducer = (state = initState, action: any) => {
    switch (action.type){
        case UserActionTypes.UpdateUserID:
            if (!action.error){
                const user: User = action.payload
                var new_state: UserState = {...state}
                new_state.userId = user.UserID
                new_state.atcoderId = user.AtcoderID
                return new_state
            }
            return state
        case UserActionTypes.Login:
            var new_state: UserState = {...state}
            if (!action.error){
                const user: User = action.payload
                if (user !== null){
                    new_state.login = true
                    new_state.userId = user.UserID
                    new_state.atcoderId = user.AtcoderID
                    return new_state
                }
            }
            new_state.login = false
            return new_state
        default:
            return state
    }
}