

// File: App.tsx
import React, { useState } from 'react';
import Sidebar from './layouts/Chat-side';
import ChatWindow from './Pages/ChatPage';
import './App.css';

const users = [
  { id: 'user1', name: 'Arun' },
  { id: 'user2', name: 'Akhil' },
  { id: 'user3', name: 'Baby' },
  { id: 'user4', name: 'Pravalika' },
  { id: 'user5', name: 'Saveri' },
    { id: 'user5', name: 'Rakesh' },  
    { id: 'user5', name: 'Yagna' },
];

const currentUser = { id: 'me', name: 'You' };

function App() {
  const [selectedUser, setSelectedUser] = useState(users[0]);

  return (
    <div className="app-container">
      <Sidebar users={users} selectedUser={selectedUser} onSelectUser={setSelectedUser} />
      <ChatWindow selectedUser={selectedUser} currentUser={currentUser} />
    </div>
  );
}

export default App;
