export type Blog = {
  id: string;
  blogUrl: string;
  problemId: string;
  userId: string;
}

export interface BlogState {
  blogUserId: string;
  blogURLs: { [key: string]: string };
}
