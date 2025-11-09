// socket.js - Socket.io client setup

import { io } from "socket.io-client";

const socket = io("https://socket-io-app-v9pg.onrender.com", {
  transports: ["websocket"],
  withCredentials: true,
});

export default socket; 