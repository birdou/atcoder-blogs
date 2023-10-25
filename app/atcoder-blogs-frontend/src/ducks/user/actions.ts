import { Dispatch, AnyAction} from 'redux';
import Axios from '../../utils/CustomAxios';
import { BackendAPIURL } from '../../utils/BackendAPI';
import { UserActionTypes } from './actionTypes';
import { NavigateFunction } from 'react-router';
import { User } from './types';
import { clearUserIDError, updateUserIDError } from '../ui/actions';
import { clearUserIDResult, updateUserIDResult } from '../ui/actions';

export const updateUser = (userId: string, atcoderId: string) => {
    return (dispatch: Dispatch<any>) => {
        const body = {
            user_id: userId,
            atcoder_id: atcoderId,
        }
        return Axios.post(`${ BackendAPIURL }/users/update`, body)
        .then(response => {
            const payload: User = {
                UserID: userId,
                AtcoderID: atcoderId,
            }
            dispatch({
                type: UserActionTypes.UpdateUserID,
                payload: payload,
                error: false
            })
            dispatch(clearUserIDError())
            dispatch(updateUserIDResult("ユーザーIDの設定に成功しました。"))
            setTimeout(() => {
                dispatch(clearUserIDResult());
            }, 3000);
            return
        })
        .catch(error => {
            dispatch({
                type: UserActionTypes.UpdateUserID,
                payload: new Error(),
                error: true
            })
            dispatch(updateUserIDError('このユーザーIDは既に使用されています。'))
            dispatch(updateUserIDResult("ユーザーIDの設定に失敗しました。"))
            setTimeout(() => {
                dispatch(clearUserIDResult());
            }, 3000);
            return
        })
    }
}

export const signupLogin = (userId: string, atcoderId: string, navigate: NavigateFunction) => {
    return (dispatch: Dispatch<AnyAction>) => {
        try {
            const body = {
                user_id: userId,
                atcoder_id: atcoderId,
            };
            return Axios.post(`${BackendAPIURL}/auth/signuplogin`, body)
            .then(response => {
                const data = response.data;
                console.log(data);
                const login = data.login;
                if (login){
                    return Axios.get(`${BackendAPIURL}/users/myaccount`)
                    .then(response => {
                        const res = response.data;
                        const user = res.self;
                        dispatch({
                            type: UserActionTypes.Login,
                            payload: user,
                            error: false
                        })
                    }).catch(error => {
                        navigate('/myaccount');
                        dispatch({
                            type: UserActionTypes.Login,
                            payload: new Error(),
                            error: true
                        })
                    })
                } else {
                    const url = data.url
                    window.location.href = url
                }
            })
            .catch(error => {
                dispatch({
                    type: UserActionTypes.Login,
                    payload: new Error(),
                    error: true
                })
            })
        } catch (error) {
            return {
                type: UserActionTypes.Login,
                payload: new Error(),
                error: true
            }
        }
    }
}

export const login = () => {
    return (dispatch: Dispatch<AnyAction>) => {
        return Axios.post(`${BackendAPIURL}/auth/login`)
        .then(response => {
            return Axios.get(`${BackendAPIURL}/users/myaccount`)
            .then(response => {
                const res = response.data;
                const user = res.self;
                dispatch({
                    type: UserActionTypes.Login,
                    payload: user,
                    error: false
                })
            }).catch(error => {
                dispatch({
                    type: UserActionTypes.Login,
                    payload: new Error(),
                    error: true
                })
            })
        })
        .catch(error => {
            dispatch({
                type: UserActionTypes.Login,
                payload: new Error(),
                error: true
            })   
        })
    }
}