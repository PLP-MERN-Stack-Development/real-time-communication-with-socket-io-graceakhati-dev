const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();

// Enable CORS for Express routes
app.use(cors());

// GET "/" route
app.get('/', (req, res) => {
  res.send('Server running');
});

// Wrap express app in http server
const server = http.createServer(app);

// Initialize Socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
    allowedHeaders: ['Content-Type'],
  },
});

// Track connected users count and usernames
let userCount = 0;
const users = new Map(); // Map socket.id to username
const typingUsers = new Map(); // Map socket.id to username (for typing indicators)

// Helper function to get array of online usernames
const getOnlineUsers = () => {
  return Array.from(users.values());
};

// Helper function to broadcast online users to all clients
const broadcastOnlineUsers = () => {
  io.emit('onlineUsers', getOnlineUsers());
};

// Socket.io connection handler
io.on('connection', (socket) => {
  userCount++;
  console.log('Client connected:', socket.id);

  // Listen for user joining with username
  socket.on('joinChat', (username) => {
    users.set(socket.id, username);
    // Broadcast user joined event to all clients
    io.emit('userJoined', username);
    // Broadcast updated online users list
    broadcastOnlineUsers();
  });

  // Listen for chat messages
  socket.on('chatMessage', (messageData) => {
    const username = users.get(socket.id);
    if (username && messageData) {
      // Extract text from messageData (handles both object and string formats)
      let messageText;
      if (typeof messageData === 'string') {
        messageText = messageData;
      } else if (messageData.text) {
        messageText = messageData.text;
      } else {
        messageText = messageData;
      }

      // Clear typing indicator for this user
      typingUsers.delete(socket.id);
      io.emit('typingUsers', Array.from(typingUsers.values()));
      
      // Broadcast message to all clients with username and text
      io.emit('chatMessage', {
        username: username,
        text: messageText
      });
    }
  });

  // Listen for typing events
  socket.on('typing', (isTyping) => {
    const username = users.get(socket.id);
    if (username) {
      if (isTyping) {
        typingUsers.set(socket.id, username);
      } else {
        typingUsers.delete(socket.id);
      }
      // Broadcast typing users to all clients (excluding the sender)
      socket.broadcast.emit('typingUsers', Array.from(typingUsers.values()));
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    userCount--;
    const username = users.get(socket.id);
    if (username) {
      // Broadcast user left event to all clients
      io.emit('userLeft', username);
      users.delete(socket.id);
      typingUsers.delete(socket.id);
      // Broadcast updated online users list
      broadcastOnlineUsers();
    }
  });
});

// Start server
const PORT = 5000;
server.listen(PORT, () => {
  console.log('Server listening on port 5000');
});

// Export app for testing
module.exports = app;

