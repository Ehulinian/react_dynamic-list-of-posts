import { Comment } from '../types/Comment';
import { Post } from '../types/Post';
import { User } from '../types/User';
import { client } from '../utils/fetchClient';

export const getUsers = async (): Promise<User[]> => {
  return client.get<User[]>('/users');
};

export const getComments = async (postId: number): Promise<Comment[]> => {
  return client.get<Comment[]>(`/comments?postId=${postId}`);
};

export const getPosts = async (userId: number): Promise<Post[]> => {
  return client.get<Post[]>(`/posts?userId=${userId}`);
};

export const addComment = async (
  comment: Omit<Comment, 'id'>,
): Promise<Comment> => {
  return client.post<Comment>('/comments', comment);
};

export const deleteComment = (commentId: number) => {
  return client.delete(`/comments/${commentId}`);
};
