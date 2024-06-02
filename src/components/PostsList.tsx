import classNames from 'classnames';
import React, { useContext } from 'react';
import { PostContext } from '../services/PostContext';

type PostListProps = {
  onSelectPost: (postId: number | null) => void;
  onClosePost: () => void;
};

export const PostsList: React.FC<PostListProps> = ({
  onClosePost,
  onSelectPost,
}) => {
  const { posts, selectedPostId } = useContext(PostContext);
  if (posts.length === 0) {
    return null;
  }

  return (
    <div data-cy="PostsList">
      <p className="title">Posts:</p>
      <table className="table is-fullwidth is-striped is-hoverable is-narrow">
        <thead>
          <tr className="has-background-link-light">
            <th>#</th>
            <th>Title</th>
            <th> </th>
          </tr>
        </thead>

        <tbody>
          {posts.map(post => (
            <tr data-cy="Post" key={post.id}>
              <td data-cy="PostId">{post.id}</td>
              <td data-cy="PostTitle">{post.title}</td>
              <td className="has-text-right is-vcentered">
                <button
                  type="button"
                  data-cy="PostButton"
                  className={classNames(
                    'button',
                    post.id === selectedPostId ? 'is-link' : 'is-light',
                  )}
                  onClick={() =>
                    post.id === selectedPostId
                      ? onClosePost()
                      : onSelectPost(post.id)
                  }
                >
                  {post.id === selectedPostId ? 'Close' : 'Open'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
