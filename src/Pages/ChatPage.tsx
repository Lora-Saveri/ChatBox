import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { type UserType } from '../App';
import '../index.css';
import { PhoneCall, Video, MoreVertical, Edit2, Trash2 } from 'lucide-react';

const socket = io('http://localhost:3001');

type ChatMessage = {
  id: string;
  sender: string;
  receiver: string;
  message: string;
};

type Props = {
  selectedUser: UserType;
  currentUser: UserType;
  theme: 'light' | 'dark';
};

const ChatWindow: React.FC<Props> = ({ selectedUser, currentUser, theme }) => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Record<string, ChatMessage[]>>({});
  const [dropdownIndex, setDropdownIndex] = useState<string | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const chatBodyRef = useRef<HTMLDivElement | null>(null);

  // Receive messages
  useEffect(() => {
    const handleReceive = (data: ChatMessage) => {
      const partner = data.sender === currentUser.name ? data.receiver : data.sender;
      setChatHistory(prev => ({
        ...prev,
        [partner]: [...(prev[partner] || []), data],
      }));
    };

    socket.emit('join_room', currentUser.id);
    socket.on('receive_message', handleReceive);

    return () => {
      socket.off('receive_message', handleReceive);
    };
  }, [currentUser]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownIndex(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll to bottom when chat updates
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chatHistory, selectedUser]);

  const chat = chatHistory[selectedUser.name] || [];

  const sendMessage = () => {
    if (!message.trim()) return;

    const msg: ChatMessage = {
      id: Date.now().toString(),
      sender: currentUser.name,
      receiver: selectedUser.name,
      message,
    };

    if (editIndex !== null) {
      const updated = [...chat];
      updated[editIndex] = msg;
      setChatHistory(prev => ({ ...prev, [selectedUser.name]: updated }));
    } else {
      socket.emit('send_message', { ...msg, room: selectedUser.id });
      setChatHistory(prev => ({
        ...prev,
        [selectedUser.name]: [...(prev[selectedUser.name] || []), msg],
      }));
    }

    setMessage('');
    setEditIndex(null);
  };

  const handleEdit = (index: number) => {
    setMessage(chat[index].message);
    setEditIndex(index);
    setDropdownIndex(null);
  };

  const handleDelete = (index: number) => {
    const updated = [...chat];
    updated.splice(index, 1);
    setChatHistory(prev => ({ ...prev, [selectedUser.name]: updated }));
    setDropdownIndex(null);
  };

  return (
    <div className={`chat-window-container ${theme}-theme`}>
      {/* Header */}
      <div className="chat-header">
        <div className="header-left">
          <div className="chat-avatar">
            {selectedUser.name
              .split(' ')
              .map(w => w[0])
              .join('')
              .toUpperCase()}
          </div>
          <div className="chat-name">{selectedUser.name}</div>
        </div>

        <div className="header-right">
          <PhoneCall className="call-icon" onClick={() => alert('Voice Call')} />
          <Video className="video-icon" onClick={() => alert('Video Call')} />
          <MoreVertical className="chat-menu" onClick={() => alert('More options')} />
        </div>
      </div>

      {/* Body */}
      <div className="chat-body" ref={chatBodyRef}>
        {chat.map((msg, idx) => (
          <div
            key={msg.id}
            className={`chat-bubble ${msg.sender === currentUser.name ? 'sent' : 'received'}`}
          >
            <div className="message-with-options">
              <div>
                <div className="sender-name">{msg.sender}</div>
                <div>{msg.message}</div>
              </div>
              {msg.sender === currentUser.name && (
                <div className="msg-menu" ref={dropdownRef}>
                  <MoreVertical
                    size={18}
                    className="msg-dots"
                    onClick={e => {
                      e.stopPropagation();
                      setDropdownIndex(dropdownIndex === msg.id ? null : msg.id);
                    }}
                  />
                  {dropdownIndex === msg.id && (
                    <div className="dropdown-options">
                      <div onClick={() => handleEdit(idx)}>
                        <Edit2 size={14} /> Edit
                      </div>
                      <div onClick={() => handleDelete(idx)}>
                        <Trash2 size={14} /> Delete
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing Indicator (Example) */}
        {/* <div className="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div> */}
      </div>

      {/* Input */}
      <div className="chat-input-box">
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>{editIndex !== null ? 'Update' : 'Send'}</button>
      </div>
    </div>
  );
};

export default ChatWindow;
