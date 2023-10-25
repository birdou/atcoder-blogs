import React, { useState, ChangeEvent, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';

import { updateBlogURL } from '../../ducks/blogs/actions';
import { BlogState } from '../../ducks/blogs/types';
import { Problem } from '../../ducks/problems/types';

import { getRatingColorClass } from "../../utils/index";

import { BlogTableColor } from '../../components/TableColor';
import { TopcoderLikeCircle } from "../../components/TopCoderLikeCircle";

export const EditBlogTableElement: React.FC<{ problem: Problem, initBlogURL: string}> = React.memo(({ problem, initBlogURL }) => {
  const [blogURL, setBlogURL] = useState<string>(initBlogURL);
  
  useEffect(() => {
    setBlogURL(initBlogURL);
  }, [initBlogURL]);

  const dispatch = useDispatch<ThunkDispatch<BlogState, {}, any>>();

  const handleChangeEvent = (event: ChangeEvent<HTMLInputElement>): void => {
      setBlogURL(event.target.value);
  };

  const handleKeyDownEvent = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
      dispatch(updateBlogURL(problem.ID, blogURL));
    } else if (e.key === 'Escape') {
      e.currentTarget.blur();
    }
  };

  const handleBlurEvent = (e: React.FocusEvent<HTMLInputElement>) => {
    dispatch(updateBlogURL(problem.ID, blogURL));
  };
  const ratingColorClass =
    problem.difficulty === undefined ? undefined : getRatingColorClass(problem.difficulty);
  const tableColorClass = blogURL ? BlogTableColor.Uploaded : BlogTableColor.None;
  return (
    <td className={`${ tableColorClass}`}>
      <div className='problem-title-container'>
        <TopcoderLikeCircle
          rating={problem.difficulty}
        />
        <a className={`${ratingColorClass} no-text-decoration`}
          href={`https://atcoder.jp/contests/${problem.contestId}/tasks/${problem.contestId.toLowerCase()}_${problem.problemIndex.toLowerCase()}`}
          target="_blank"
          rel="noopener noreferrer">
            {problem.title.length > 10 ?
            `${problem.title.substring(0, 10)}...` :
            problem.title}
        </a>
      </div>
      
      <br/>
      
      <div>
        <input
          type="text"
          value={blogURL}
          onChange={handleChangeEvent}
          onKeyDown={handleKeyDownEvent}
          onBlur={handleBlurEvent}
          className="input-field"
          placeholder="Blog URLを入力"
          />
      </div>
    </td>
  );
});
