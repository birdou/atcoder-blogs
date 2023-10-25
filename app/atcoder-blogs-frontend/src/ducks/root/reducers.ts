import { combineReducers } from 'redux';
import { blogURLReducer } from '../blogs/reducers';
import { problemReducer } from '../problems/reducers';
import { uiReducer } from '../ui/reducers';
import { userReducer } from '../user/reducers';

export const rootReducer = combineReducers({
    blogs: blogURLReducer,
    problems: problemReducer,
    ui: uiReducer,
    user: userReducer,
});