import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import type { UserType } from '../App';
import './Sidebar.css';

interface Props {
  users: UserType[];
  selectedUser: UserType | null;
  onSelectUser: (user: UserType) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const Sidebar: React.FC<Props> = ({ users, selectedUser, onSelectUser, theme, setTheme }) => {
  return (
    <div className={`sidebar ${theme}`}>
      <div className="sidebar-header">
        <h2 className="sidebar-title">Chats</h2>
        <button
          className="theme-icon-btn"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
          {theme === 'light' ? <FaMoon /> : <FaSun />}
        </button>
      </div>

      <div className="sidebar-users">
        {users.map(user => (
          <div
            key={user.id}
            className={`sidebar-user ${selectedUser?.id === user.id ? 'selected' : ''}`}
            onClick={() => onSelectUser(user)}
          >
            <div className="user-icon">
              {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
            <span>{user.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
