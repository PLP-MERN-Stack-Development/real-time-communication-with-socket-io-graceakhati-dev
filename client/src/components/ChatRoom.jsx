import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

function ChatRoom() {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');
  const [input, setInput] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    // Prompt for username on load
    const user = prompt('Enter your username:');
    if (!user || !user.trim()) {
      alert('Username is required. Please refresh the page.');
      return;
    }
    setUsername(user.trim());

    // Create socket connection with proper configuration
    const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
      forceNew: false,
    });
    socketRef.current = socket;

    // Handle connection
    socket.on('connect', () => {
      console.log('Connected to server:', socket.id);
      setIsConnected(true);
      // Emit joinChat event with username
      socket.emit('joinChat', user.trim());
    });

    // Handle disconnection
    socket.on('disconnect', (reason) => {
      console.log('Disconnected from server:', reason);
      setIsConnected(false);
    });

    // Handle reconnection attempts
    socket.on('reconnect_attempt', () => {
      console.log('Attempting to reconnect...');
    });

    socket.on('reconnect', (attemptNumber) => {
      console.log('Reconnected after', attemptNumber, 'attempts');
      setIsConnected(true);
      socket.emit('joinChat', user.trim());
    });

    socket.on('reconnect_failed', () => {
      console.error('Reconnection failed');
      setIsConnected(false);
    });

    // Handle connection errors
    socket.on('connect_error', (error) => {
      console.error('Connection error:', error.message);
      setIsConnected(false);
    });

    // Listen for chat messages
    socket.on('chatMessage', (messageData) => {
      // messageData should be {username, text}
      if (messageData && messageData.username && messageData.text) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            type: 'message',
            username: messageData.username,
            text: messageData.text,
            isOwn: messageData.username === user.trim()
          }
        ]);
      }
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

    // Listen for online users updates
    socket.on('onlineUsers', (users) => {
      setOnlineUsers(users);
    });

    // Listen for typing users updates
    socket.on('typingUsers', (users) => {
      setTypingUsers(users);
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

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Function to handle input change with typing indicator
  const handleInputChange = (e) => {
    setInput(e.target.value);

    // Emit typing event when user starts typing
    if (socketRef.current) {
      socketRef.current.emit('typing', true);

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Stop typing indicator after 2 seconds of no typing
      typingTimeoutRef.current = setTimeout(() => {
        if (socketRef.current) {
          socketRef.current.emit('typing', false);
        }
      }, 2000);
    }
  };

  // Function to handle sending messages
  const handleSendMessage = (e) => {
    e.preventDefault();
    const messageText = input.trim();
    
    if (messageText && socketRef.current && username && isConnected) {
      // Emit chatMessage event with text (server will add username from socket.id)
      socketRef.current.emit('chatMessage', {
        text: messageText
      });
      
      // Stop typing indicator
      if (socketRef.current) {
        socketRef.current.emit('typing', false);
      }
      
      // Clear input after sending
      setInput('');
      
      // Clear typing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="flex h-screen max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg">
      {/* Main chat area */}
      <div className="flex flex-col flex-1">
        {/* Connection status and online users header */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between px-4 py-2">
            <div className={`text-sm font-medium ${
              isConnected 
                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded' 
                : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-3 py-1 rounded'
            }`}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </div>
            {/* Dark mode toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>
          {/* Online users count */}
          <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 text-sm text-gray-600 dark:text-gray-400">
            {onlineUsers.length} {onlineUsers.length === 1 ? 'user' : 'users'} online
          </div>
        </div>

        {/* Messages area - scrollable, fixed height */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900">
          {messages.length === 0 ? (
            <div className="text-gray-500 dark:text-gray-400 text-center py-8">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((message, index) => {
              if (message.type === 'system') {
                return (
                  <div
                    key={index}
                    className="text-gray-500 dark:text-gray-400 italic text-sm text-center py-1"
                  >
                    {message.content}
                  </div>
                );
              }
              
              // Check if message is from current user
              const isOwnMessage = message.isOwn || false;
              
              return (
                <div
                  key={index}
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2 break-words shadow-sm ${
                      isOwnMessage
                        ? 'bg-blue-500 text-white rounded-br-sm'
                        : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-sm'
                    }`}
                  >
                    {/* Display username before text */}
                    <p className="text-xs font-semibold mb-1 opacity-80">
                      {message.username}
                    </p>
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  </div>
                </div>
              );
            })
          )}
          {/* Typing indicator */}
          {typingUsers.length > 0 && (
            <div className="text-gray-500 dark:text-gray-400 italic text-sm py-1">
              {typingUsers.length === 1
                ? `${typingUsers[0]} is typing...`
                : `${typingUsers.join(', ')} are typing...`}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area - sticky bottom bar */}
        <div className="sticky bottom-0 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-lg">
          <form onSubmit={handleSendMessage} className="p-4 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={!input.trim() || !socketRef.current || !isConnected || !username}
              className="px-6 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </form>
        </div>
      </div>

      {/* Online users sidebar */}
      <div className="w-48 border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex flex-col">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 font-semibold text-sm text-gray-700 dark:text-gray-300">
          Online Users
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {onlineUsers.length === 0 ? (
            <div className="text-gray-400 dark:text-gray-500 text-sm text-center py-4">
              No users online
            </div>
          ) : (
            <div className="space-y-1">
              {onlineUsers.map((user, index) => (
                <div
                  key={index}
                  className="px-3 py-2 bg-white dark:bg-gray-700 rounded text-sm text-gray-700 dark:text-gray-300 flex items-center shadow-sm"
                >
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  {user}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatRoom;

