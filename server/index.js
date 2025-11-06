const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();

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

// Track connected users count
let userCount = 0;

// Socket.io connection handler
io.on('connection', (socket) => {
  userCount++;
  console.log(`User connected. Total users: ${userCount}`);
  console.log(`Socket ID: ${socket.id}`);

  // Handle disconnection
  socket.on('disconnect', () => {
    userCount--;
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

