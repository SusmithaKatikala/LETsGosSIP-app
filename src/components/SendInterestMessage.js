import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { refreshToken } from '../services/authService';

const SendInterestMessage = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { receiverId } = useParams(); // Get receiverId from URL params

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    const senderId = parseInt(localStorage.getItem('user_id'), 10); // Convert user_id to integer

    if (!senderId) {
      setError('Failed to retrieve sender ID. Please log in again.');
      return;
    }

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/users/interest-messages/',
        {
          sender: senderId,
          receiver: parseInt(receiverId, 10), // Ensure receiverId is an integer
          message: message,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Message sent:', response.data);
    } catch (error) {
      if (error.response && error.response.data.code === 'token_not_valid') {
        const newToken = await refreshToken();
        if (newToken) {
          try {
            const response = await axios.post(
              'http://127.0.0.1:8000/users/interest-messages/',
              {
                sender: senderId,
                receiver: parseInt(receiverId, 10),
                message: message,
              },
              {
                headers: {
                  Authorization: `Bearer ${newToken}`,
                  'Content-Type': 'application/json',
                },
              }
            );
            console.log('Message sent:', response.data);
          } catch (error) {
            setError('Failed to send message. Please try again.');
            console.error('API error after refreshing token:', error);
          }
        } else {
          setError('Failed to refresh token. Please log in again.');
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user_id');
          window.location.href = '/login';
        }
      } else {
        setError('Failed to send message. Please try again.');
        console.error('API error:', error);
      }
    }
  };

  return (
    <div>
      <h2>Send Interest Message</h2>
      <form onSubmit={handleSendMessage}>
        <textarea
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <button type="submit">Send</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default SendInterestMessage;