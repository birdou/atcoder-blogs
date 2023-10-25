import { UIActionTypes } from "./actionTypes";

export const startEditingBlog = () => ({
    type: UIActionTypes.StartEditingBlog,
    payload: {},
});

export const stopEditingBlog = () => ({
    type: UIActionTypes.StopEditingBlog,
    payload: {},
});

export const toggleEditingBlog = () => ({
    type: UIActionTypes.ToggleEditingBlog,
    payload: {},
});

export const updateUserIDError = (error: string) => ({
    type: UIActionTypes.UpdateUserIDError,
    payload: { error },
});

export const clearUserIDError = () => ({
    type: UIActionTypes.ClearUserIDError,
    payload: {},
});

export const updateUserIDResult = (result: string) => ({
    type: UIActionTypes.UpdateUserIDResult,
    payload: { result },
});

export const clearUserIDResult = () => ({
    type: UIActionTypes.ClearUserIDResult,
    payload: {},
});