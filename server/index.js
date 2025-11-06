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
  },
});

// Track connected users count and usernames
let userCount = 0;
const users = new Map(); // Map socket.id to username

// Socket.io connection handler
io.on('connection', (socket) => {
  userCount++;
  console.log(`User connected. Total users: ${userCount}`);
  console.log(`Socket ID: ${socket.id}`);

  // Listen for user joining with username
  socket.on('joinChat', (username) => {
    users.set(socket.id, username);
    console.log(`${username} joined the chat`);
    // Broadcast user joined event to all clients
    io.emit('userJoined', username);
  });

  // Listen for chat messages
  socket.on('chatMessage', (message) => {
    console.log(`Message received: ${message}`);
    // Broadcast message to all clients
    io.emit('chatMessage', message);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    userCount--;
    const username = users.get(socket.id);
    if (username) {
      console.log(`${username} left the chat`);
      // Broadcast user left event to all clients
      io.emit('userLeft', username);
      users.delete(socket.id);
    }
    console.log(`User disconnected. Total users: ${userCount}`);
  });
});

// Start server
const PORT = 5000;
server.listen(PORT, () => {
  console.log('Server listening on port 5000');
});

// Export app for testing
module.exports = app;

