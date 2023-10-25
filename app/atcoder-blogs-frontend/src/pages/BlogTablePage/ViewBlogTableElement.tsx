import React, { useState, useEffect } from 'react';
import { Problem } from '../../ducks/problems/types';

import { getRatingColorClass } from "../../utils/index";

import { BlogTableColor } from "../../components/TableColor";
import { TopcoderLikeCircle } from "../../components/TopCoderLikeCircle";

export const ViewBlogTableElement: React.FC<{ problem: Problem, initBlogURL: string}> = ({ problem, initBlogURL }) => {
  const [blogURL, setBlogURL] = useState<string>(initBlogURL);
  const ratingColorClass =
    problem.difficulty === undefined ? undefined : getRatingColorClass(problem.difficulty);
  useEffect(() => {
    setBlogURL(initBlogURL);
  }, [initBlogURL]);

  const tableColorClass = blogURL ? BlogTableColor.Uploaded : BlogTableColor.None;
  return (
    <td className={`table-problem ${ tableColorClass}`}>
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
        
        { blogURL ?
            <a className='blog-url-container'
            href={ blogURL }
            target="_blank" 
            rel="noopener noreferrer"
            >
                {blogURL}
            </a>
            : <br/>
        }
    </td>
  );
}
