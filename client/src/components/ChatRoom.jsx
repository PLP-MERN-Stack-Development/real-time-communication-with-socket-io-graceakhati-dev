import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import MessageInput from './MessageInput';

function ChatRoom() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Create socket connection
    const socket = io('http://localhost:5000');

    // Handle connection
    socket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to server');
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from server');
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white shadow-lg rounded-lg">
      {/* Connection status */}
      <div className={`px-4 py-2 text-sm font-medium ${
        isConnected 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }`}>
        {isConnected ? 'Connected' : 'Disconnected'}
      </div>

      {/* Messages area - scrollable, fixed height */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <div className="text-gray-500 text-center py-8">
          ChatRoom
        </div>
      </div>

      {/* Input area - sticky bottom bar */}
      <div className="sticky bottom-0 border-t border-gray-200 bg-white rounded-b-lg">
        <MessageInput />
      </div>
    </div>
  );
}

export default ChatRoom;

