import React from 'react';
import './Sidebar.css';

type UserType = {
  id: string;
  name: string;
};

interface Props {
  users: UserType[];
  selectedUser: UserType;
  onSelectUser: (user: UserType) => void;
}

const Sidebar: React.FC<Props> = ({ users, selectedUser, onSelectUser }) => {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Chats</h2>
      {users.map((user) => (
        <div
          key={user.id}
          className={`sidebar-user ${selectedUser.id === user.id ? 'selected' : ''}`}
          onClick={() => onSelectUser(user)}
        >
          <div className="user-icon">{user.name.charAt(0)}</div>
          <span>{user.name}</span>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
