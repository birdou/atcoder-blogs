import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { UserState } from '../../ducks/user/types';
import { RootState } from '../../ducks/root/types';
import { updateUser } from '../../ducks/user/actions'
import { clearUserIDError } from '../../ducks/ui/actions';
import { useNavigate } from 'react-router-dom';

export const UserAccountPage: React.FC = () => {
  const loginUserId = useSelector((state: RootState) => state.user.userId);
  const loginAtcoderId = useSelector((state: RootState) => state.user.atcoderId);
  const isLoggedIn = useSelector((state: RootState) => state.user.login);
  const updateUserIdError = useSelector((state: RootState) => state.ui.updateUserIDError);
  const updateUserIdResult = useSelector((state: RootState) => state.ui.updateUserIDResult);

  const [username, setUsername] = useState(loginUserId);
  const [atcoderUsername, setAtcoderUsername] = useState(loginAtcoderId);
  const [usernameError, setUsernameError] = useState('');
  const [atcoderUsernameError, setAtcoderUsernameError] = useState('');
  
  const dispatch = useDispatch<ThunkDispatch<UserState, {}, any>>();
  const navigate = useNavigate();
  
  useEffect(() => {
    setUsername(loginUserId);
    setAtcoderUsername(loginAtcoderId);
  }, [isLoggedIn, loginAtcoderId, loginUserId]);

  useEffect(() => {
    dispatch(clearUserIDError());
  }, [dispatch]);

  const handleChangeUserId = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
    validateUsername(event.target.value);
  }
 
  const handleChangeAtcoderId = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAtcoderUsername(event.target.value)
    validateAtcoderUsername(event.target.value);
  }

  const handleSubmitButton = () => {
    if (validateAtcoderUsername(atcoderUsername) && validateUsername(username)) {
      dispatch(updateUser(username, atcoderUsername))
    }
  }

  const handleBackButton = () => {
    navigate('/blogs')
  }

  const validateUsername = (username: string): boolean => {
    const usernamePattern = /^[a-zA-Z0-9]{3,16}$/;
    if (!usernamePattern.test(username)) {
      setUsernameError('AtcoderBlogIDは半角英数字で3文字以上16文字以下の文字列である必要があります。');
      return false;
    } else {
      setUsernameError('');
      return true;
    }
  };

  const validateAtcoderUsername = (atcoderUsername: string): boolean => {
    if (atcoderUsername === '') {
      setAtcoderUsernameError('');
      return true;
    } else {
      const atcoderUsernamePattern = /^[a-zA-Z0-9]{3,16}$/;
      if (!atcoderUsernamePattern.test(atcoderUsername)) {
        setAtcoderUsernameError('AtCoderIDは、空白または、半角英数字で3文字以上16文字以下の文字列である必要があります。');
        return false;
      } else {
        setAtcoderUsernameError('');
        return true;
      }
    }
  };

  return (
    <div className="user-setup-page">
      <h1>アカウント設定</h1>
      <form>
        <div className="input-group">
          <label htmlFor="blogs-id">AtCoderBlogsID</label>
          <input
            id="blogs-id"
            className="soft-edge-input"
            type="text"
            value={username}
            onChange={handleChangeUserId}
            required
          />
          {usernameError && <span className="error-message">{usernameError}</span>}
          {updateUserIdError && <span className="error-message">{updateUserIdError}</span>}
        </div>
        <p className="atcoder-note">
          後から変更は可能ですが、ログインするためにはAtCoderBlogsIDが設定されている必要があります。
        </p>

        <div className="input-group">
          <label htmlFor="atcoder-id">AtCoderID</label>
          <input
            id="atcoder-id"
            className="soft-edge-input"
            type="text"
            value={atcoderUsername}
            onChange={handleChangeAtcoderId}
            required
          />
          {atcoderUsernameError && <span className="error-message">{atcoderUsernameError}</span>}
        </div>

        <p className="atcoder-note">
          AtCoderIDは、AC済みの問題を検索する際に使用予定です。
        </p>
        <button type="button" className="blue-button" onClick={handleSubmitButton}>
          確定する
        </button>

        <br/>
        {updateUserIdResult && <div className="result-message">{updateUserIdResult}</div>}
        <button type="button" className='atcoder-blogs-button' onClick={handleBackButton}>
          ブログ一覧画面に戻る
        </button>
      </form>
    </div>
  );
};

export default UserAccountPage;