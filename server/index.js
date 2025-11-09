const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();

// Enable CORS for Express routes
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    // Allow all origins for development and production
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// GET "/" route
app.get('/', (req, res) => {
  res.send('Server running');
});

// Wrap express app in http server
const server = http.createServer(app);

// Initialize Socket.io with CORS - explicitly allow all origins
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins explicitly
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: false, // Set to false when using wildcard origin
    allowedHeaders: ['Content-Type', 'Authorization'],
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

  // Listen for chat messages (chatMessage event - used by frontend)
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

  // Listen for send-message event and broadcast receive-message
  socket.on('send-message', (msg) => {
    const username = users.get(socket.id);
    if (username && msg) {
      // Extract message text (handles both string and object formats)
      let messageText;
      if (typeof msg === 'string') {
        messageText = msg;
      } else if (msg.text) {
        messageText = msg.text;
      } else if (msg.message) {
        messageText = msg.message;
      } else {
        messageText = msg;
      }

      // Clear typing indicator for this user
      typingUsers.delete(socket.id);
      io.emit('typingUsers', Array.from(typingUsers.values()));
      
      // Broadcast receive-message to all other clients
      socket.broadcast.emit('receive-message', {
        username: username,
        text: messageText,
        timestamp: new Date().toISOString()
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
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// Export app for testing
module.exports = app;

