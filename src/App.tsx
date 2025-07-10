// File: frontend/src/App.tsx
import React, { useState, useEffect } from 'react';
import Sidebar from './layouts/Chat-side';
import ChatWindow from './Pages/ChatPage';
import './App.css';
import './index.css';
export type UserType = {
  id: string;
  name: string;
};

const App: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const currentUser: UserType = { id: 'me', name: 'You' };

  const users: UserType[] = [
    { id: 'user1', name: 'Akhil Ar' },
    { id: 'user2', name: 'Arun Neelam' },
    { id: 'user3', name: 'Baby Prabha' },
    { id: 'user4', name: 'Pravalika Maraju' },
    { id: 'user5', name: 'Rakesh Kothi' },
    { id: 'user6', name: 'Saveri Gavvala' },
    { id: 'user7', name: 'Yagna Sree' },
  ];

  useEffect(() => {
    if (!selectedUser) {
      setSelectedUser(users[0]);
    }
  }, [selectedUser]);

  return (
    <div className={`app-container ${theme}-theme`}>
      <div className="sidebar-wrapper">
        <Sidebar
          users={users.filter((u) => u.id !== currentUser.id)}
          onSelectUser={setSelectedUser}
          selectedUser={selectedUser}
          theme={theme}
          setTheme={setTheme}
        />
      </div>

      <div className="divider"></div>

      <div className="chat-wrapper">
        {selectedUser ? (
          <ChatWindow selectedUser={selectedUser} currentUser={currentUser} theme={theme} />
        ) : (
          <div className="chat-placeholder">Select a user to start chatting</div>
        )}
      </div>
    </div>
  );
};

export default App;
