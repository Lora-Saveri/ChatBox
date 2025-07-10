// File: frontend/src/layouts/Chat-side.tsx
import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';

import './Sidebar.css';
import { type  UserType } from '../App';

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
      <h2 className="sidebar-title">Chats</h2>

      <div className="theme-toggle">
        <button
    onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    className="theme-icon-btn"
      style={{ color: theme === 'light' ? '#333' : '#fff' }}

    
  >
    {theme === 'light' ? <FaMoon size={20} /> : <FaSun size={20} />}
  </button>
      </div>

      {users.map((user) => (
        <div
          key={user.id}
          className={`sidebar-user ${selectedUser?.id === user.id ? 'selected' : ''}`}
          onClick={() => onSelectUser(user)}
        >
          <div className="user-icon">{user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()}</div>
          <span>{user.name}</span>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
