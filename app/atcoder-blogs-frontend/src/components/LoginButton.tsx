import { useDispatch } from "react-redux";
import { ThunkDispatch } from 'redux-thunk';
import { UserState } from "../ducks/user/types";
import { RootState } from "../ducks/root/types";
import { login, signupLogin} from "../ducks/user/actions";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";

export const LoginComponent: React.FC = () => {
    const dispatch = useDispatch<ThunkDispatch<UserState, {}, any>>();
    const navigate = useNavigate();

    const isLoggedIn = useSelector((state: RootState) => state.user.login);
    const userId = useSelector((state: RootState) => state.user.userId);
    const atcoderId = useSelector((state: RootState) => state.user.atcoderId);

    const handleLoginClick = () => {
        dispatch(signupLogin(userId, atcoderId, navigate));
    }
    const handleUserClick = () => {
        navigate('/myaccount')
    }

    useEffect(() => {
        dispatch(login());
    }, []);
    return (
        <div>
            {isLoggedIn ? 
                <button onClick={handleUserClick}>account ({userId})</button> :
                <button onClick={handleLoginClick}>ログイン</button>
            }
        </div>
    )
}