import express from 'express';
import dotenv from 'dotenv';
import { connection } from './database/connection.js';
import { app } from './app.js';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import cookie from "cookie";

dotenv.config();

const PORT = process.env.PORT || 3000;

//HANDLING UNCAUGHT 
process.on('uncaughtException',(err)=>{
  console.log("!!! ERROR !!! ",err);
  console.log("SHUTTING DOWN THE SERVER!!!");
  process.exit(1)
})


const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: `${process.env.FRONTEND_URL}`,
    methods: ['GET', 'POST', 'PUT'],
    credentials: true,
    allowedHeaders: ["Authorization"],
  },
});


// Token verification middleware


// Token verification middleware
io.use((socket, next) => {
  // Parse cookies from handshake headers
  const cookies = cookie.parse(socket.request.headers.cookie || "");
  
  // Your cookie name might be different — adjust if needed
  const rawToken = cookies?.token; 
  const token = rawToken?.startsWith("Bearer ") ? rawToken.split(" ")[1] : rawToken;

  console.log("server.js 36 token from cookie:", token);

  if (!token) {
    console.log("No token provided in cookie");
    return next(new Error("Authentication error: No token"));
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("Invalid token:", err);
      return next(new Error("Authentication error: Invalid token"));
    }

    // Attach decoded user info to the socket
    socket.user = decoded;
    console.log("User authenticated:", decoded);
    next();
  });
});



let activeUsers = [];

io.on('connection', (socket) => {
  // Handle individual user connections
  socket.on('new-user-add', (newUserId) => {
    console.log("---- server.js 62",newUserId);
    
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({ userId: newUserId, socketId: socket.id });
    }
    console.log('Connected users:', activeUsers);
    io.emit('get-users', activeUsers);
  });
  
  io.on('connection_error', (err) => {
    console.log('Connection error:', err.message);
  });
  
  // Handle sending a direct message
  socket.on('send-message', (data) => {
    const { receiverId } = data;
    const user = activeUsers.find((user) => user.userId === receiverId);
    if (user) {
      io.to(user.socketId).emit('receive-message', data);
    }
  });

  // **GROUP CHAT FUNCTIONALITY**
  // Join a group room
  socket.on('join-group', (groupId) => {
    socket.join(groupId);
    console.log(`User ${socket.id} joined group ${groupId}`);
    io.to(groupId).emit('group-notification', `User joined group ${groupId}`);
  });

  // Handle sending a group message
  socket.on('send-group-message', (data) => {
    const { groupId, message, senderId } = data;
    console.log(`Sending message to group ${groupId}`);
    io.to(groupId).emit('receive-group-message', { groupId, message, senderId });
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    console.log('User disconnected:', activeUsers);
    io.emit('get-users', activeUsers);
  });
});

connection()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
  });

  //UNHANDLED PROMISE REJECTION
  process.on("unhandledRejection",err=>{
    console.log(err);
    console.log("SHUTTING DOWN THE SERVER!!!");
    server.close(()=>{
      process.exit(1);
    })
    
  })