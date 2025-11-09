# Real-Time Chat Application with Socket.io

A modern, full-featured real-time chat application built with React, Socket.io, Express, and Tailwind CSS. Experience instant messaging with advanced features like typing indicators, user presence tracking, and dark mode support.

![Chat App Demo](./screenshots/chat-demo.gif)

## 📋 Project Overview

This application demonstrates real-time bidirectional communication using Socket.io. The architecture consists of:

- **Backend**: Node.js/Express server with Socket.io for WebSocket connections
- **Frontend**: React application with Vite for fast development and optimized builds
- **Styling**: Tailwind CSS for modern, responsive UI with dark mode support

The app enables multiple users to chat in real-time, see who's online, track typing indicators, and enjoy a beautiful, modern interface.

## ✨ Live Features

### Core Features
- ✅ **Real-time Messaging**: Instant message delivery using Socket.io WebSockets
- ✅ **User Authentication**: Username-based authentication on connection
- ✅ **User Presence**: Live tracking and display of online users
- ✅ **System Notifications**: Automatic notifications when users join/leave

### Advanced Features (Implemented)
- ✅ **Typing Indicators**: Real-time "X is typing..." notifications
- ✅ **Online Users Sidebar**: Live list of connected users with status indicators
- ✅ **Dark Mode Toggle**: Seamless theme switching with persistent UI
- ✅ **Message Bubbles**: Beautiful, modern chat bubble design with distinct styling for sent/received messages
- ✅ **Auto-scroll**: Automatic scrolling to latest messages
- ✅ **Connection Status**: Visual indicator showing connection state
- ✅ **Responsive Design**: Mobile-friendly layout with sidebar

## 🚀 Setup & Run Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Modern web browser (Chrome, Firefox, Edge, Safari)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd real-time-communication-with-socket-io-graceakhati-dev
   ```

2. **Install server dependencies:**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies:**
   ```bash
   cd ../client
   npm install
   ```

### Running the Application

#### Start the Server

From the `server/` directory:

```bash
# Development mode (with auto-reload via nodemon)
npm run server

# Production mode
npm start
```

The server will start on `http://localhost:5000`

**Note**: If you encounter `EADDRINUSE` error (port already in use), stop any existing Node processes:
```bash
# Windows PowerShell
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force

# macOS/Linux
pkill -f node
```

#### Start the Client

From the `client/` directory (in a new terminal):

```bash
npm run dev
```

The client will start on `http://localhost:5173`

#### Access the Application

1. Open your browser and navigate to `http://localhost:5173`
2. Enter a username when prompted
3. Start chatting!

## 📡 API Endpoints

### HTTP Endpoints

- `GET /` - Health check endpoint
  - Returns: `"Server running"`

### Socket.io Events

#### Client → Server Events

| Event | Payload | Description |
|-------|---------|-------------|
| `joinChat` | `username` (string) | User joins the chat with a username |
| `chatMessage` | `message` (string) | User sends a chat message |
| `typing` | `isTyping` (boolean) | User typing status (true/false) |

#### Server → Client Events

| Event | Payload | Description |
|-------|---------|-------------|
| `userJoined` | `username` (string) | Broadcast when a user joins |
| `userLeft` | `username` (string) | Broadcast when a user leaves |
| `chatMessage` | `message` (string) | Broadcast message to all clients |
| `onlineUsers` | `users[]` (array) | List of currently online usernames |
| `typingUsers` | `users[]` (array) | List of users currently typing |

## 🧪 Testing Real-Time Features

### Test Real-Time Messaging

1. **Open multiple browser windows/tabs:**
   - Window 1: `http://localhost:5173` (User: Alice)
   - Window 2: `http://localhost:5173` (User: Bob)
   - Window 3: `http://localhost:5173` (User: Charlie)

2. **Send messages from different users:**
   - Messages should appear instantly in all windows
   - Each message should display in a styled bubble

3. **Verify message delivery:**
   - All connected clients should receive messages simultaneously
   - No page refresh required

### Test Typing Indicators

1. **Start typing in one window:**
   - Type in the message input field
   - Other windows should show "X is typing..." indicator

2. **Stop typing:**
   - Indicator should disappear after 2 seconds of inactivity
   - Indicator should disappear immediately when message is sent

### Test User Presence

1. **Open multiple windows with different usernames:**
   - Each window should show all online users in the sidebar
   - Green dot indicator shows user is online

2. **Close a window:**
   - Other windows should show "X left the chat" system message
   - User should be removed from online users list

3. **Join with a new username:**
   - Other windows should show "X joined the chat" system message
   - New user should appear in online users sidebar

### Test Dark Mode

1. **Toggle dark mode:**
   - Click the sun/moon icon in the header
   - UI should switch between light and dark themes
   - All components should adapt (messages, sidebar, input)

2. **Verify theme persistence:**
   - Theme should remain consistent across all UI elements

### Test Connection Status

1. **Stop the server:**
   - Connection status should change to "Disconnected" (red)
   - Messages should not send

2. **Restart the server:**
   - Connection status should change to "Connected" (green)
   - Messages should work again

## 🚢 Deployment Guide

### Server Deployment

#### Option 1: Render

1. **Create a new Web Service on Render:**
   - Connect your GitHub repository
   - Set **Root Directory**: `server`
   - Set **Build Command**: `npm install`
   - Set **Start Command**: `npm start`

2. **Environment Variables:**
   - `PORT`: Automatically provided by Render (or set manually)
   - Update CORS origin in `server/index.js` to your client URL after deployment

3. **Deploy:**
   - Render will automatically build and deploy
   - Note your server URL (e.g., `https://your-app.onrender.com`)

#### Option 2: Railway

1. **Create a new project on Railway:**
   - Connect your GitHub repository
   - Add a new service
   - Set **Root Directory**: `server`

2. **Configure:**
   - Railway auto-detects Node.js
   - Set **Start Command**: `npm start`
   - Railway provides `PORT` automatically

3. **Deploy:**
   - Railway will build and deploy automatically
   - Note your server URL

### Client Deployment

#### Option 1: Netlify

1. **Build the client:**
   ```bash
   cd client
   npm run build
   ```
   This creates a `dist/` folder.

2. **Deploy to Netlify:**
   - Connect your GitHub repository
   - Set **Base directory**: `client`
   - Set **Build command**: `npm install && npm run build`
   - Set **Publish directory**: `client/dist`

3. **Environment Variables:**
   - Add `VITE_SOCKET_URL` with your deployed server URL
   - Example: `https://your-server.onrender.com`

4. **Update Server CORS:**
   - After deployment, update CORS origin in `server/index.js`:
   ```javascript
   origin: 'https://your-app.netlify.app'
   ```

#### Option 2: Vercel

1. **Install Vercel CLI (optional):**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   cd client
   vercel
   ```
   Or connect via GitHub in Vercel dashboard.

3. **Configure:**
   - Set **Root Directory**: `client`
   - Set **Build Command**: `npm run build`
   - Set **Output Directory**: `dist`

4. **Environment Variables:**
   - Add `VITE_SOCKET_URL` with your server URL

5. **Update Server CORS:**
   - Update CORS origin in `server/index.js` to your Vercel URL

### Post-Deployment Checklist

- [ ] Server is running and accessible
- [ ] Client is deployed and accessible
- [ ] CORS is configured correctly (server allows client origin)
- [ ] Environment variables are set (if needed)
- [ ] Test real-time features in production
- [ ] Verify dark mode works
- [ ] Check mobile responsiveness

## 📁 Project Structure

```
real-time-communication-with-socket-io-graceakhati-dev/
├── server/
│   ├── index.js              # Main server file with Socket.io setup
│   ├── server.js             # Legacy server file (not used)
│   ├── test-connection.js   # Test script for Socket.io connection
│   ├── package.json         # Server dependencies and scripts
│   ├── .gitignore          # Server gitignore
│   └── node_modules/       # Server dependencies (generated)
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatRoom.jsx      # Main chat component
│   │   │   └── MessageInput.jsx  # Message input with typing detection
│   │   ├── socket/
│   │   │   └── socket.js         # Socket client setup (legacy)
│   │   ├── App.jsx              # Root component
│   │   ├── main.jsx             # React entry point
│   │   └── index.css            # Tailwind CSS imports
│   ├── index.html              # HTML template
│   ├── package.json            # Client dependencies
│   ├── vite.config.js         # Vite configuration
│   ├── tailwind.config.js      # Tailwind configuration with dark mode
│   ├── postcss.config.js       # PostCSS configuration
│   ├── netlify.toml           # Netlify deployment configuration
│   ├── .gitignore            # Client gitignore
│   └── node_modules/         # Client dependencies (generated)
│
├── screenshots/              # Screenshots and GIFs (add your media here)
│   ├── chat-demo.gif        # Main demo GIF
│   ├── light-mode.png       # Light mode screenshot
│   ├── dark-mode.png        # Dark mode screenshot
│   ├── typing-indicator.png # Typing indicator screenshot
│   └── online-users.png     # Online users sidebar screenshot
│
└── README.md                 # This file
```

## 🎨 Screenshots & Media
- `light-mode.png` - Screenshot of the app in light mode
- `dark-mode.png` - Screenshot of the app in dark mode
- `online-users.png` - Screenshot of the online users sidebar
- `mobile-view.png` - Screenshot of mobile responsive design
- `multi-user-chat.png` - Screenshot showing multiple users chatting

## 🔧 Available Scripts

### Server Scripts

- `npm start` - Start server in production mode
- `npm run server` - Start server in development mode with nodemon (auto-reload)

### Client Scripts

- `npm run dev` - Start development server (Vite)
- `npm run build` - Build for production (creates `dist/` folder)
- `npm run preview` - Preview production build locally
- `npm run client` - Alias for `npm run dev`

## 🌍 Environment Variables

### Server

- `PORT` - Server port (default: 5000, provided by hosting platform in production)

### Client

- `VITE_SOCKET_URL` - Socket.io server URL (default: `http://localhost:5000`)

To use environment variables in client, create a `.env` file in `client/`:
```
VITE_SOCKET_URL=https://your-server.onrender.com
```

## 🐛 Troubleshooting

### Server Issues

**Port already in use:**
```bash
# Windows PowerShell
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force

# macOS/Linux
pkill -f node
```

**Server won't start:**
- Check if Node.js is installed: `node --version`
- Ensure dependencies are installed: `npm install`
- Check for syntax errors in `server/index.js`
- Verify port 5000 is available

### Client Issues

**Client won't connect to server:**
- Verify server is running on port 5000
- Check browser console for CORS errors
- Ensure CORS origin in server matches client URL
- Check network tab for WebSocket connection

**Build fails:**
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check for TypeScript/ESLint errors
- Verify all dependencies are compatible

**Messages not appearing:**
- Check browser console for Socket.io errors
- Verify WebSocket connection is established
- Ensure both server and client are running
- Check server logs for message reception

### Deployment Issues

**CORS errors in production:**
- Update CORS origin in `server/index.js` to match your client URL
- Ensure no trailing slashes in URLs
- Check both HTTP and HTTPS URLs if applicable

**Environment variables not working:**
- Vite requires `VITE_` prefix for client variables
- Restart dev server after adding variables
- Rebuild client after changing variables

## 📚 Technologies Used

- **Backend**: Node.js, Express.js, Socket.io
- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS, PostCSS
- **Real-time**: Socket.io (WebSockets)
- **Build Tool**: Vite
- **Package Manager**: npm

## 👤 Author
Grace Akhati

Built as part of a real-time communication assignment using Socket.io.
