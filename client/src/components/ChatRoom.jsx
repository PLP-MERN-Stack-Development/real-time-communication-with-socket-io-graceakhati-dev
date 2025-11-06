import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import MessageInput from './MessageInput';

function ChatRoom() {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Prompt for username on load
    const user = prompt('Enter your username:');
    if (!user || !user.trim()) {
      alert('Username is required. Please refresh the page.');
      return;
    }
    setUsername(user.trim());

    // Create socket connection
    const socket = io('http://localhost:5000');
    socketRef.current = socket;

    // Handle connection
    socket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to server');
      // Emit joinChat event with username
      socket.emit('joinChat', user.trim());
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from server');
    });

    // Listen for chat messages
    socket.on('chatMessage', (message) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: 'message', content: message },
      ]);
    });

    // Listen for user joined events
    socket.on('userJoined', (joinedUsername) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: 'system', content: `${joinedUsername} joined the chat` },
      ]);
    });

    // Listen for user left events
    socket.on('userLeft', (leftUsername) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: 'system', content: `${leftUsername} left the chat` },
      ]);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
        {messages.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={
                message.type === 'system'
                  ? 'text-gray-500 italic text-sm text-center py-1'
                  : 'bg-gray-100 rounded-lg px-4 py-2 break-words'
              }
            >
              {message.content}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area - sticky bottom bar */}
      <div className="sticky bottom-0 border-t border-gray-200 bg-white rounded-b-lg">
        <MessageInput socket={socketRef.current} />
      </div>
    </div>
  );
}

export default ChatRoom;

