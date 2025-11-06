// Simple test script to verify Socket.io connection/disconnection logging
const { io } = require('socket.io-client');

const socket = io('http://localhost:5000', {
  transports: ['websocket'],
});

socket.on('connect', () => {
  console.log('✅ Test client connected to server');
  console.log('Socket ID:', socket.id);
  
  // Wait 2 seconds then disconnect
  setTimeout(() => {
    console.log('Disconnecting test client...');
    socket.disconnect();
    process.exit(0);
  }, 2000);
});

socket.on('disconnect', () => {
  console.log('✅ Test client disconnected from server');
});

socket.on('connect_error', (error) => {
  console.error('❌ Connection error:', error.message);
  process.exit(1);
});

// Timeout after 5 seconds
setTimeout(() => {
  console.log('Test timeout');
  process.exit(1);
}, 5000);

