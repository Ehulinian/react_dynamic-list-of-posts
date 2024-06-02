import classNames from 'classnames';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { PostContext } from '../services/PostContext';
import { User } from '../types/User';

type UserSelectorProps = {
  users: User[];
  onSelectUser: (userId: number | null) => void;
  selectedUser: User | null;
  setSelectedUser: (selectedUser: User) => void;
};

export const UserSelector: React.FC<UserSelectorProps> = ({
  users,
  onSelectUser,
  selectedUser,
  setSelectedUser,
}) => {
  const { selectedUserId } = useContext(PostContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    onSelectUser(user.id);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div
      data-cy="UserSelector"
      className={classNames('dropdown', { 'is-active': isDropdownOpen })}
      ref={dropdownRef}
    >
      <div className="dropdown-trigger">
        <button
          type="button"
          className="button"
          aria-haspopup="true"
          aria-controls="dropdown-menu"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <span>{selectedUser ? selectedUser.name : 'Choose a user'}</span>
          <span className="icon is-small">
            <i className="fas fa-angle-down" aria-hidden="true" />
          </span>
        </button>
      </div>
      <div className="dropdown-menu" id="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {users.map(user => (
            <a
              href="#"
              className={classNames('dropdown-item', {
                'is-active': user.id === selectedUserId,
              })}
              key={user.id}
              onClick={() => handleUserClick(user)}
            >
              {user.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
