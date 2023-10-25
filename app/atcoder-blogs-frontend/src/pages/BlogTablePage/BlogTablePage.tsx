import React, { useState, ChangeEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';

import { updateBlogUser, fetchBlogURLs} from '../../ducks/blogs/actions';
import { BlogState } from '../../ducks/blogs/types';
import { ProblemState, ProblemsByContest, Problem } from '../../ducks/problems/types';
import { fetchProblems } from '../../ducks/problems/actions';
import { RootState } from '../../ducks/root/types';
import { toggleEditingBlog } from '../../ducks/ui/actions';

import { EditBlogTableElement } from './EditBlogTableElement';
import { ViewBlogTableElement } from './ViewBlogTableElement';

interface BlogTablePageBaseProps {
  BlogTableElementComponent: React.FC<{ problem: Problem, initBlogURL: string }>;
}

export const BlogTablePage: React.FC = () => {
  const dispatch = useDispatch<ThunkDispatch<BlogState, {}, any>>();
  const [isMyBlogs, setIsMyBlogs] = useState(false);
  const userId = useSelector((state: RootState) => state.user.userId);
  const login = useSelector((state: RootState) => state.user.login);

  useEffect(() => {
    if (isMyBlogs && login) {
      dispatch(updateBlogUser(userId))
      dispatch(fetchBlogURLs(userId));
    }
  }, [isMyBlogs])

  return (
    <div className="button-container">
      <div className="button-group">
        <button 
          className={isMyBlogs ? "selected-button" : "unselected-button"}
          onClick={e => setIsMyBlogs(true)}>
          自分のブログ
        </button>
        <button 
          className={isMyBlogs ? "unselected-button" : "selected-button"}
          onClick={e => setIsMyBlogs(false)}>
          みんなのブログ(閲覧専用)
        </button>
      </div>
      <br/>
      {isMyBlogs ? <MyBlogTablePageComposent /> : <EveryoneBlogTableComponent />}
    </div>
  );
}

export const MyBlogTablePageComposent: React.FC = () => {
  const isLoggedIn = useSelector((state: RootState) => state.user.login);

  var BlogTableElementComponent: React.FC<{ problem: Problem, initBlogURL: string }>;
  const isEditing = useSelector((state: RootState) => state.ui.isEditingBlog);

  if (isEditing) {
      BlogTableElementComponent = EditBlogTableElement;
  } else {
      BlogTableElementComponent = ViewBlogTableElement;
  }

  return (
    <div>
      {isLoggedIn ? 
        <div>
          <MyBlogHeader/>
          <BlogTablePageBase BlogTableElementComponent={BlogTableElementComponent} />
        </div>
      : 
        <div>
          ログインしてください
        </div>}
    </div>
  );
}

export const EveryoneBlogTableComponent: React.FC = () => {
  return (
    <div>
        <EveryoneBlogHeader/>
        <BlogTablePageBase BlogTableElementComponent={ViewBlogTableElement} />
    </div>
  );
}

export const BlogTablePageBase: React.FC<BlogTablePageBaseProps> = ({ BlogTableElementComponent }) => {
    const dispatch = useDispatch<ThunkDispatch<ProblemState, {}, any>>();
    const blogUserId = useSelector((state: RootState) => state.blogs.blogUserId);

    useEffect(() => {
      dispatch(fetchProblems('abc'));
      dispatch(fetchBlogURLs(blogUserId));
    }, [blogUserId]);

    const blogUrls = useSelector((state: RootState) => state.blogs.blogURLs);

    const problems: ProblemsByContest = useSelector((state: RootState) => {
    return state.problems.problemsByContest
    });
    const sortedContestIds = problems ? Object.keys(problems).sort((a, b) => (a < b ? 1 : -1)) : [];

    return (
        <div className='main-content'>
            <h1>AtCoder Beginner Contest</h1>
                <table className='react-bs-table-bordered'>
                    <thead>
                        <tr>
                            <th>Contest</th>
                            <th>A</th><th>B</th><th>C</th><th>D</th><th>E</th><th>F</th><th>G</th><th>H/Ex</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedContestIds.map(contestId => (
                            <tr key={contestId}>
                                <td key={contestId}>{contestId.toUpperCase()}</td>
                                {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map(problemIndex => (
                                    problems[contestId][problemIndex] ?
                                        <BlogTableElementComponent
                                            key={contestId+problemIndex}
                                            problem={problems[contestId][problemIndex]}
                                            initBlogURL={blogUrls[problems[contestId][problemIndex].ID] || ''} /> 
                                    : <td key={contestId+problemIndex}/>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
      );   
};
  
const MyBlogHeader: React.FC = () => {
  const dispatch = useDispatch<ThunkDispatch<BlogState, {}, any>>();
  const initIsEditing = useSelector((state: RootState) => state.ui.isEditingBlog);
  const [isEditing, setIsEditing] = useState<boolean>(initIsEditing);

  const userID = useSelector((state: RootState) => state.user.userId);
  const handleEditButtonDown = () => {
      dispatch(toggleEditingBlog());
      setIsEditing(!isEditing);
  };

  return (
    <div className="horizontal-center-align">
      <input
          className="soft-edge-input"
          type="text"
          value={userID}
          readOnly={true}
          placeholder="Your AtCoderBlogsID"
      />
      <div className="button-wrapper">
          <button 
              className="edit-toggle-button"
              onClick={handleEditButtonDown}>
                  {isEditing ? "終了": "ブログ一括編集"}
          </button>
      </div>
    </div>
  );
}

const EveryoneBlogHeader: React.FC = () => {
  const blogUserId = useSelector((state: RootState) => state.blogs.blogUserId);
  const [userID, setAtcoderBlogsUserID] = useState<string>(blogUserId);
  const dispatch = useDispatch<ThunkDispatch<BlogState, {}, any>>();

  const handleChangeEvent = (event: ChangeEvent<HTMLInputElement>): void => {
    setAtcoderBlogsUserID(event.target.value);
  };

  const handleKeyDownEvent = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter') {
      event.preventDefault();
      dispatch(updateBlogUser(userID))
      dispatch(fetchBlogURLs(userID))
      event.currentTarget.blur();
    } else if (event.key === 'Escape') {
      event.currentTarget.blur();
    }
  }

  const handleBlurEvent = (e: React.FocusEvent<HTMLInputElement>) => {
    dispatch(updateBlogUser(userID));
  }

  return (
    <div className="horizontal-center-align">
      <input
        className="soft-edge-input"
        type="text"
        value={userID}
        onChange={handleChangeEvent}
        onKeyDown={handleKeyDownEvent}
        onBlur = {handleBlurEvent}
        placeholder="AtCoderBlogsID"
      />
    </div>
  );
}