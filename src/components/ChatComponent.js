import React, { useEffect, useState } from 'react';
import { connectWebSocket, sendMessage } from './websocketService';

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [inputMessage, setInputMessage] = useState('');
  const username = localStorage.getItem('username');  // Retrieve the username from localStorage

  useEffect(() => {
    const ws = connectWebSocket((newMessage) => {
      if (newMessage && typeof newMessage === 'object') {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      } else {
        console.error('Received invalid message format:', newMessage);
      }
    });

    setSocket(ws);

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  const handleSendMessage = () => {
    if (inputMessage.trim() && username) {
      const message = {
        message: inputMessage,
        username,  // Use the actual username
      };
      if (socket) {
        sendMessage(socket, message);
        setInputMessage('');
      } else {
        console.error('Socket connection is not established');
      }
    } else {
      console.error('Message or username is missing');
    }
  };

  return (
    <div>
      <div>
        {messages.length === 0 ? (
          <div>No messages</div>
        ) : (
          messages.map((msg, index) => (
            <div key={index}>
              <strong>{msg.username || 'Unknown User'}:</strong> {msg.message}
            </div>
          ))
        )}
      </div>
      <input
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default ChatComponent;
