// src/components/Chat.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { connectWebSocket, sendMessage } from '../services/websocketService'; // Import the WebSocket functions

const Chat = () => {
  const { chatUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const username = localStorage.getItem('username');  // Retrieve the username from localStorage

  useEffect(() => {
    // Initialize WebSocket connection
    const ws = connectWebSocket((message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
    setSocket(ws);

    // Cleanup on component unmount
    return () => {
      ws.close();
    };
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim() && username) {
      const message = { message: newMessage, username, receiver: chatUserId };
      if (socket) {
        sendMessage(socket, message);
        setNewMessage('');
      } else {
        console.error('Socket connection is not established');
      }
    } else {
      console.error('Message or username is missing');
    }
  };

  return (
    <div>
      <h1>Chat</h1>
      <div style={{ maxHeight: '400px', overflowY: 'scroll' }}>
        {messages.map((message, index) => (
          <div key={index}>
            <strong>{message.username || 'Unknown User'}:</strong> {message.message}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default Chat;
