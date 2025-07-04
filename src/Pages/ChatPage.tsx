import React, { useState, useEffect } from 'react';
import socket from '../socket';
import './ChatPage.css';

type User = {
  id: string;
  name: string;
};

interface Props {
  selectedUser: User;
  currentUser: User;
}

const ChatWindow: React.FC<Props> = ({ selectedUser, currentUser }) => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<{ message: string; sender: string }[]>([]);

  useEffect(() => {
    socket.on('receive_message', (data) => {
      if (data.room === selectedUser.id || data.sender === selectedUser.name) {
        setChat((prev) => [...prev, data]);
      }
    });

    return () => {
      socket.off('receive_message');
    };
  }, [selectedUser]);

  const sendMessage = () => {
    const msgData = {
      sender: currentUser.name,
      message,
      room: selectedUser.id,
    };
    socket.emit('send_message', msgData);
    setChat((prev) => [...prev, msgData]);
    setMessage('');
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h3>{selectedUser.name}</h3>
        <span>⋮</span>
      </div>
      <div className="chat-body">
        {chat.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${msg.sender === currentUser.name ? 'sent' : 'received'}`}
          >
            <div className="chat-sender">{msg.sender}</div>
            <div className="chat-text">{msg.message}</div>
          </div>
        ))}
      </div>
      <div className="chat-footer">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;
