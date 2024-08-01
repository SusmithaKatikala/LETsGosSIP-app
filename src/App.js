// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import Chat from './components/Chat';
import SendInterestMessage from './components/SendInterestMessage';
import AcceptRejectInterestMessage from './components/AcceptRejectInterestMessage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/chat/:chatUserId" element={<PrivateRoute><Chat /></PrivateRoute>} />
        <Route path="/send-interest/:receiverId" element={<PrivateRoute><SendInterestMessage /></PrivateRoute>} />
        <Route path="/accept-reject-messages" element={<PrivateRoute><AcceptRejectInterestMessage /></PrivateRoute>} />
      </Routes>
    </Router>
  );
};

export default App;