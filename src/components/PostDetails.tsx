import React, { useContext, useEffect, useState } from 'react';
import { PostContext } from '../services/PostContext';
import { Loader } from './Loader';
import { NewCommentForm } from './NewCommentForm';

export const PostDetails: React.FC = () => {
  const {
    post,
    isLoading,
    selectedPostId,
    comments,
    errorMessage,
    setErrorMessage,
    deleteComment,
    setIsLoading,
  } = useContext(PostContext);
  const [isFormShow, setIsFormShow] = useState<boolean>(false);

  useEffect(() => {
    setIsFormShow(false);
  }, [selectedPostId]);

  const handleFormShow = () => {
    setIsFormShow(true);
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await deleteComment(commentId);
    } catch (error) {
      setErrorMessage('Something went wrong');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="content" data-cy="PostDetails">
      {selectedPostId && (
        <div className="block">
          <h2 data-cy="PostTitle">
            #{post?.id}: {post?.title}
          </h2>
          <p data-cy="PostBody">{post?.body}</p>
        </div>
      )}

      {isLoading && <Loader />}

      <div className="block">
        {errorMessage && (
          <div className="notification is-danger" data-cy="CommentsError">
            {errorMessage}
          </div>
        )}

        {comments.length === 0 && !isLoading && !errorMessage && (
          <p className="title is-4" data-cy="NoCommentsMessage">
            No comments yet
          </p>
        )}

        {comments.length !== 0 && !isLoading && (
          <p className="title is-4">Comments:</p>
        )}

        {!isLoading &&
          comments.map(comment => (
            <article
              className="message is-small"
              data-cy="Comment"
              key={comment.id}
            >
              <div className="message-header">
                <a href={`mailto:${comment.email}`} data-cy="CommentAuthor">
                  {comment.name}
                </a>

                <button
                  data-cy="CommentDelete"
                  type="button"
                  className="delete is-small"
                  aria-label="delete"
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  delete button
                </button>
              </div>

              <div className="message-body" data-cy="CommentBody">
                {comment.body}
              </div>
            </article>
          ))}

        {!isFormShow && !isLoading && !errorMessage && (
          <button
            data-cy="WriteCommentButton"
            type="button"
            className="button is-link"
            onClick={handleFormShow}
          >
            Write a comment
          </button>
        )}
      </div>

      {isFormShow && <NewCommentForm />}
    </div>
  );
};
