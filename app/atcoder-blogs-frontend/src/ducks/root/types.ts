import { BlogState } from '../blogs/types';
import { ProblemState } from '../problems/types';
import { UIState } from '../ui/types';
import { UserState } from '../user/types';

export interface RootState {
    blogs: BlogState;
    problems: ProblemState;
    ui: UIState;
    user: UserState;
}