// AcceptRejectInterestMessage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AcceptRejectInterestMessage = () => {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get('http://127.0.0.1:8000/users/interest-messages/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMessages(response.data);
      } catch (error) {
        setError('Failed to fetch messages');
      }
    };

    fetchMessages();
  }, []);

  const handleAccept = async (id) => {
    const token = localStorage.getItem('access_token');
    try {
      await axios.post(`http://127.0.0.1:8000/users/interest-messages/${id}/accept/`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessages(messages.map(m => m.id === id ? { ...m, status: 'accepted' } : m));
    } catch (error) {
      console.error('Failed to accept message', error);
    }
  };

  const handleReject = async (id) => {
    const token = localStorage.getItem('access_token');
    try {
      await axios.post(`http://127.0.0.1:8000/users/interest-messages/${id}/reject/`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessages(messages.map(m => m.id === id ? { ...m, status: 'rejected' } : m));
    } catch (error) {
      console.error('Failed to reject message', error);
    }
  };

  return (
    <div>
      <h2>Interest Messages</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {messages.map(message => (
          <li key={message.id}>
            {message.message} from {message.sender}
            {message.status === 'pending' && (
              <>
                <button onClick={() => handleAccept(message.id)}>Accept</button>
                <button onClick={() => handleReject(message.id)}>Reject</button>
              </>
            )}
            {message.status !== 'pending' && <span>{message.status}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AcceptRejectInterestMessage;
