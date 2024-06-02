import classNames from 'classnames';
import React, { useContext, useState } from 'react';
import { PostContext } from '../services/PostContext';
import { Comment } from '../types/Comment';

export const NewCommentForm: React.FC = () => {
  const {
    setErrorMessage,
    setIsLoading,
    selectedPostId,
    addComment,
    isLoading,
  } = useContext(PostContext);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [body, setBody] = useState<string>('');

  const [showNameError, setShowNameError] = useState<boolean>(false);
  const [showEmailError, setShowEmailError] = useState<boolean>(false);
  const [showBodyError, setShowBodyError] = useState<boolean>(false);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
    setShowNameError(false);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    setShowEmailError(false);
  };

  const handleBodyChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBody(event.target.value);
    setShowBodyError(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const isNameValid = name.trim().length > 0;
    const isEmailValid = email.trim().length > 0;
    const isBodyValid = body.trim().length > 0;

    setShowNameError(!isNameValid);
    setShowEmailError(!isEmailValid);
    setShowBodyError(!isBodyValid);

    if (
      !isNameValid ||
      !isEmailValid ||
      !isBodyValid ||
      selectedPostId === null
    ) {
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const newComment: Comment = {
        id: 0,
        name,
        email,
        body,
        postId: selectedPostId,
      };
      const response = await addComment(newComment);

      if (response?.ok) {
        setBody('');
      }
    } catch (error) {
      setErrorMessage('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setBody('');
    setShowNameError(false);
    setShowEmailError(false);
    setShowBodyError(false);
  };

  return (
    <form data-cy="NewCommentForm" onSubmit={handleSubmit}>
      <div className="field" data-cy="NameField">
        <label className="label" htmlFor="comment-author-name">
          Author Name
        </label>
        <div className="control has-icons-left has-icons-right">
          <input
            type="text"
            name="name"
            id="comment-author-name"
            placeholder="Name Surname"
            value={name}
            onChange={handleNameChange}
            className={`input ${showNameError ? 'is-danger' : ''}`}
            onBlur={() => setShowNameError(name.trim().length === 0)}
          />
          <span className="icon is-small is-left">
            <i className="fas fa-user" />
          </span>
          {showNameError && (
            <span
              className="icon is-small is-right has-text-danger"
              data-cy="ErrorIcon"
            >
              <i className="fas fa-exclamation-triangle" />
            </span>
          )}
        </div>
        {showNameError && (
          <p className="help is-danger" data-cy="ErrorMessage">
            Name is required
          </p>
        )}
      </div>

      <div className="field" data-cy="EmailField">
        <label className="label" htmlFor="comment-author-email">
          Author Email
        </label>
        <div className="control has-icons-left has-icons-right">
          <input
            type="text"
            name="email"
            id="comment-author-email"
            placeholder="email@test.com"
            value={email}
            onChange={handleEmailChange}
            className={`input ${showEmailError ? 'is-danger' : ''}`}
            onBlur={() => setShowEmailError(email.trim().length === 0)}
          />
          <span className="icon is-small is-left">
            <i className="fas fa-envelope" />
          </span>
          {showEmailError && (
            <span
              className="icon is-small is-right has-text-danger"
              data-cy="ErrorIcon"
            >
              <i className="fas fa-exclamation-triangle" />
            </span>
          )}
        </div>
        {showEmailError && (
          <p className="help is-danger" data-cy="ErrorMessage">
            Email is required
          </p>
        )}
      </div>

      <div className="field" data-cy="BodyField">
        <label className="label" htmlFor="comment-body">
          Comment Text
        </label>
        <div className="control">
          <textarea
            id="comment-body"
            name="body"
            placeholder="Type comment here"
            value={body}
            onChange={handleBodyChange}
            className={`textarea ${showBodyError ? 'is-danger' : ''}`}
            onBlur={() => setShowBodyError(body.trim().length === 0)}
          />
        </div>
        {showBodyError && (
          <p className="help is-danger" data-cy="ErrorMessage">
            Enter some text
          </p>
        )}
      </div>

      <div className="field is-grouped">
        <div className="control">
          <button
            type="submit"
            className={classNames('button is-link', {
              'is-loading': isLoading,
            })}
          >
            Add
          </button>
        </div>
        <div className="control">
          <button
            type="reset"
            className="button is-link is-light"
            onClick={handleReset}
          >
            Clear
          </button>
        </div>
      </div>
    </form>
  );
};
