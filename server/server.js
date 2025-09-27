import express from 'express';
import dotenv from 'dotenv';
import { connection } from './database/connection.js';
import { app } from './app.js';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { User } from './models/userModel.js'; // Import User model

dotenv.config();

const PORT = process.env.PORT || 10000; // Use Render's default port
const isProduction = process.env.NODE_ENV === "production";

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL, // https://dev-sphere-vrvj.onrender.com
    methods: ['GET', 'POST'],
    credentials: true,
    allowedHeaders: ['Authorization'],
  },
  path: '/socket.io',
});

// Socket.io authentication middleware
io.use(async (socket, next) => {
  try {
    // Check cookie first
    const cookies = cookie.parse(socket.request.headers.cookie || '');
    let token = cookies.token;

    // Fallback to Authorization header or auth.token
    if (!token) {
      token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
    }

    console.log("Socket token:", token);
    console.log("Socket cookies:", cookies);

    if (!token) {
      console.log("No token provided in cookie or auth");
      return next(new Error("Authentication error: No token"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.id || !/^[0-9a-fA-F]{24}$/.test(decoded.id)) {
      return next(new Error(`Invalid user ID in token: ${decoded.id || "undefined"}`));
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new Error(`User not found for ID: ${decoded.id}`));
    }

    socket.user = user;
    console.log("Socket authenticated:", user._id);
    next();
  } catch (error) {
    console.error("Socket auth error:", error.message);
    return next(new Error("Authentication error: Invalid or expired token"));
  }
});

let activeUsers = [];

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('new-user-add', (newUserId) => {
    console.log("New user added:", newUserId);

    if (!activeUsers.some(user => user.userId === newUserId)) {
      activeUsers.push({ userId: newUserId, socketId: socket.id });
    }

    console.log('Connected users:', activeUsers);
    io.emit('get-users', activeUsers);
  });

  socket.on('send-message', (data) => {
    const { receiverId } = data;
    const user = activeUsers.find(user => user.userId === receiverId);

    if (user) {
      io.to(user.socketId).emit('receive-message', data);
    }
  });

  socket.on('join-group', (groupId) => {
    socket.join(groupId);
    console.log(`User ${socket.id} joined group ${groupId}`);
    io.to(groupId).emit('group-notification', `User joined group ${groupId}`);
  });

  socket.on('send-group-message', (data) => {
    const { groupId, message, senderId } = data;
    console.log(`Sending message to group ${groupId}`);
    io.to(groupId).emit('receive-group-message', { groupId, message, senderId });
  });

  socket.on('disconnect', () => {
    activeUsers = activeUsers.filter(user => user.socketId !== socket.id);
    console.log(`User disconnected: ${socket.id}`);
    io.emit('get-users', activeUsers);
  });

  socket.on('error', (err) => {
    console.log(`Socket error from ${socket.id}:`, err);
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

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error("!!! ERROR !!! ", err);
  console.error("SHUTTING DOWN THE SERVER!!!");
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  console.error("SHUTTING DOWN THE SERVER!!!");
  server.close(() => {
    process.exit(1);
  });
});