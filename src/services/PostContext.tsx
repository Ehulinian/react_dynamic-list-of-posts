import React, { createContext, useMemo, useReducer } from 'react';
import * as api from '../api/data';
import { Comment } from '../types/Comment';
import { Post } from '../types/Post';

type State = {
  post: Post | null;
  errorMessage: string;
  selectedPostId: number | null;
  isLoading: boolean;
  selectedUserId: number | null;
  posts: Post[];
  comments: Comment[];
  comment: Comment | null;
};

type Action =
  | { type: 'setPost'; payload: Post | null }
  | { type: 'setPosts'; payload: Post[] }
  | { type: 'setComments'; payload: Comment[] }
  | { type: 'setSelectedUserId'; payload: number | null }
  | { type: 'setIsLoading'; payload: boolean }
  | { type: 'setSelectedPostId'; payload: number | null }
  | { type: 'setErrorMessage'; payload: string }
  | { type: 'setComment'; payload: Comment | null }
  | { type: 'addComment'; payload: Comment }
  | { type: 'deleteComment'; payload: number | null };

type PostContextType = State & {
  setPost: (post: Post | null) => void;
  setPosts: (posts: Post[]) => void;
  setComments: (comments: Comment[]) => void;
  setSelectedUserId: (userId: number | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setSelectedPostId: (postId: number | null) => void;
  setErrorMessage: (errorMessage: string) => void;
  setComment: (comment: Comment | null) => void;
  addComment: (
    comment: Omit<Comment, 'id'>,
  ) => Promise<{ ok: boolean } | undefined>;
  deleteComment: (commentId: number) => Promise<void>;
};

export const PostContext = createContext<PostContextType>({
  post: null,
  errorMessage: '',
  selectedPostId: null,
  isLoading: false,
  selectedUserId: null,
  posts: [],
  comments: [],
  comment: null,
  setPost: () => {},
  setPosts: () => {},
  setComments: () => {},
  setSelectedUserId: () => {},
  setIsLoading: () => {},
  setSelectedPostId: () => {},
  setErrorMessage: () => {},
  setComment: () => {},
  addComment: () => new Promise(() => {}),
  deleteComment: () => new Promise(() => {}),
});

const initialState: State = {
  post: null,
  errorMessage: '',
  selectedPostId: null,
  isLoading: false,
  selectedUserId: null,
  posts: [],
  comments: [],
  comment: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'setPost':
      return { ...state, post: action.payload };
    case 'setPosts':
      return { ...state, posts: action.payload };
    case 'setComments':
      return { ...state, comments: action.payload };
    case 'setSelectedUserId':
      return { ...state, selectedUserId: action.payload };
    case 'setIsLoading':
      return { ...state, isLoading: action.payload };
    case 'setSelectedPostId':
      return { ...state, selectedPostId: action.payload };
    case 'setErrorMessage':
      return { ...state, errorMessage: action.payload };
    case 'setComment':
      return { ...state, comment: action.payload };
    case 'addComment':
      return {
        ...state,
        comments: [...(state.comments || []), action.payload],
      };
    case 'deleteComment':
      return {
        ...state,
        comments: state.comments.filter(
          comment => comment.id !== action.payload,
        ),
      };
    default:
      return state;
  }
}

type PostProviderProps = {
  children: React.ReactNode;
};

export const PostProvider: React.FC<PostProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setPost = (post: Post | null) => {
    dispatch({ type: 'setPost', payload: post });
  };

  const setPosts = (posts: Post[]) => {
    dispatch({ type: 'setPosts', payload: posts });
  };

  const setComments = (comments: Comment[]) => {
    dispatch({ type: 'setComments', payload: comments });
  };

  const setSelectedUserId = (userId: number | null) => {
    dispatch({ type: 'setSelectedUserId', payload: userId });
  };

  const setIsLoading = (isLoading: boolean) => {
    dispatch({ type: 'setIsLoading', payload: isLoading });
  };

  const setSelectedPostId = (postId: number | null) => {
    dispatch({ type: 'setSelectedPostId', payload: postId });
  };

  const setErrorMessage = (errorMessage: string) => {
    dispatch({ type: 'setErrorMessage', payload: errorMessage });
  };

  const setComment = (comment: Comment | null) => {
    dispatch({ type: 'setComment', payload: comment });
  };

  const addComment = async (comment: Omit<Comment, 'id'>) => {
    setComment({
      id: 0,
      postId: comment.postId,
      name: comment.name,
      body: comment.body,
      email: comment.email,
    });

    try {
      const response = await api.addComment(comment);
      dispatch({ type: 'addComment', payload: response });
      return { ok: true };
    } catch (error) {
      setErrorMessage('Something went wrong');
      throw error;
    } finally {
      setComment(null);
    }
  };

  const deleteComment = async (commentId: number) => {
    setErrorMessage('');

    try {
      await api.deleteComment(commentId);
      dispatch({ type: 'deleteComment', payload: commentId });
    } catch (error) {
      setErrorMessage('Something went wrong');
      throw error;
    }
  };

  const value = useMemo(
    () => ({
      ...state,
      setPost,
      setPosts,
      setComments,
      setSelectedUserId,
      setIsLoading,
      setSelectedPostId,
      setErrorMessage,
      setComment,
      addComment,
      deleteComment,
    }),
    [state],
  );

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};
