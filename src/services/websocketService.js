// src/services/websocketService.js

export const connectWebSocket = (onMessageReceived) => {
  const ws = new WebSocket('ws://127.0.0.1:8000/ws/chat/');

  ws.onopen = () => {
    console.log('WebSocket connection established');
  };

  ws.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data);
      onMessageReceived(message);
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  ws.onclose = (event) => {
    console.log('WebSocket connection closed:', event);
  };

  return ws;
};

export const sendMessage = (ws, message) => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  } else {
    console.error('WebSocket is not open. Ready state:', ws.readyState);
  }
};
