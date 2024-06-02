import '@fortawesome/fontawesome-free/css/all.css';
import 'bulma/bulma.sass';
import React, { useContext, useEffect, useState } from 'react';
import './App.scss';

import classNames from 'classnames';
import * as api from './api/data';
import { Loader } from './components/Loader';

import { PostDetails } from './components/PostDetails';
import { PostsList } from './components/PostsList';
import { UserSelector } from './components/UserSelector';
import { PostContext } from './services/PostContext';
import { User } from './types/User';

export const App: React.FC = () => {
  const {
    setIsLoading,
    isLoading,
    setErrorMessage,
    setSelectedUserId,
    selectedPostId,
    setSelectedPostId,
    setPosts,
    selectedUserId,
    errorMessage,
    posts,
    setComments,
    setPost,
  } = useContext(PostContext);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (selectedPostId !== null) {
      setIsLoading(true);
      setErrorMessage('');
      api
        .getComments(selectedPostId)
        .then(setComments)
        .catch(() => {
          setErrorMessage('Something went wrong');
        })
        .finally(() => setIsLoading(false));
    }
  }, [selectedPostId]);

  useEffect(() => {
    if (selectedUserId !== null) {
      setIsLoading(true);
      setErrorMessage('');
      api
        .getPosts(selectedUserId)
        .then(setPosts)
        .catch(() => {
          setErrorMessage('Something went wrong');
        })
        .finally(() => setIsLoading(false));
    }
  }, [selectedUserId]);

  useEffect(() => {
    setIsLoading(true);
    api
      .getUsers()
      .then(setUsers)
      .catch(() => {
        setErrorMessage('Unable to load users');
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleUserSelect = (userId: number | null) => {
    if (userId !== selectedUserId) {
      setIsLoading(true);
      setSelectedUserId(userId);
      setSelectedPostId(null);
      setPosts([]);
      setIsSidebarOpen(false);
    }
  };

  const handleOpenPost = (postId: number | null) => {
    const selectedPost = posts.find(post => post.id === postId);
    if (selectedPost) {
      setPost(selectedPost);
    }
    setSelectedPostId(postId);
    setIsSidebarOpen(true);
  };

  const handleClosePost = () => {
    setSelectedPostId(null);
    setIsSidebarOpen(false);
  };

  return (
    <main className="section">
      <div className="container">
        <div className="tile is-ancestor">
          <div className="tile is-parent">
            <div className="tile is-child box is-success">
              <div className="block">
                <UserSelector
                  selectedUser={selectedUser}
                  setSelectedUser={setSelectedUser}
                  users={users}
                  onSelectUser={handleUserSelect}
                />
              </div>

              <div className="block" data-cy="MainContent">
                {!selectedUserId && !isLoading && (
                  <p data-cy="NoSelectedUser">No user selected</p>
                )}

                {!isSidebarOpen && isLoading && selectedUserId && <Loader />}

                {errorMessage && (
                  <div
                    className="notification is-danger"
                    data-cy="PostsLoadingError"
                  >
                    {errorMessage}
                  </div>
                )}

                {posts.length === 0 &&
                  selectedUserId &&
                  !isLoading &&
                  !errorMessage && (
                    <div
                      className="notification is-warning"
                      data-cy="NoPostsYet"
                    >
                      No posts yet
                    </div>
                  )}

                {selectedUserId && (
                  <PostsList
                    onClosePost={handleClosePost}
                    onSelectPost={handleOpenPost}
                  />
                )}
              </div>
            </div>
          </div>

          <div
            data-cy="Sidebar"
            className={classNames(
              'tile',
              'is-parent',
              'is-8-desktop',
              'Sidebar',
              isSidebarOpen && 'Sidebar--open',
            )}
          >
            {selectedPostId && (
              <div className="tile is-child box is-success">
                <PostDetails />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
