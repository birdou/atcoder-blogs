import { Dispatch, AnyAction} from 'redux';
import { RootState } from "../root/types";
import BlogActionTypes from "./actionTypes";
import { Blog } from "./types";
import Axios from "../../utils/CustomAxios";
import { BackendAPIURL } from '../../utils/BackendAPI';

export const updateBlogUser = (userId: string) => ({
    type: BlogActionTypes.UpdateBlogUser,
    payload: {
        userId,
    }
})

export const updateBlogURL = (problemId: string, blogURL: string) => {
    return (dispatch: Dispatch<AnyAction>, getState: () => RootState) => {
        const body = {
            problem_id: problemId,
            blog_url: blogURL,
        };

        try {
            return Axios.post(`${BackendAPIURL}/blog/upsert`, body)
            .then(() => dispatch({
                type: BlogActionTypes.UpdateBlogURL,
                payload: {
                    problemId,
                    blogURL,
                    err: false
                }
            }))
        } catch (error) {
            console.error("Error sending POST request:", error);
            return {
                type: BlogActionTypes.UpdateBlogURL,
                payload: new Error(),
                error: true
            };
        };
    }
}

export const fetchBlogURLs = (userId: string) => {
    return (dispatch: Dispatch<AnyAction>) => {
        try {
            return Axios.get(`${BackendAPIURL}/blogs/get?user_id=${userId}`)
            .then(response => {
                const blogs: Blog[] = response.data.blogs;
                const problemBlogMap: { [key: string]: string } = {};
                for (const blog of blogs) {
                    problemBlogMap[blog.problemId] = blog.blogUrl;
                }
                dispatch({
                    type: BlogActionTypes.FetchBlogURLs,
                    payload: {
                        problemBlogMap,
                    },
                    error: false
                })
            })
        } catch (error) {
            console.error("Error fetching data:", error);
            return {
                type: BlogActionTypes.FetchBlogURLs,
                payload: new Error(),
                error: true
            }
        }
    }
}