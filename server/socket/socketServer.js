// // Importing and initializing socket.io server on port 8800 with CORS settings
// import { Server } from "socket.io";

// const io = new Server(8800, {
//   cors: {
//     origin: "http://localhost:5173", // Allow connections only from this origin (Frontend)
//   },
// });

  
//   // Initialize an empty array to keep track of active users
//   let activeUsers = [];
  
//   /**
//    * `io.on('connection')` is an event listener that gets triggered 
//    * whenever a new client connects to the Socket.IO server.
//    * `socket` represents the connection instance for each client.
//    */
//   io.on('connection', (socket) => {
  
//     /**
//      * This event listener handles adding a new user to the active users list.
//      * It listens for the 'new-user-add' event, emitted from the frontend with a `newUserId`.
//      */
//     socket.on('new-user-add', (newUserId) => {
  
//       // Check if the user is not already in the activeUsers array
//       if (!activeUsers.some((user) => user.userId === newUserId)) {
//         // Add the new user to the active users list along with their socketId
//         activeUsers.push({
//           userId: newUserId,
//           socketId: socket.id, // Unique identifier for the socket connection
//         });
//       }
  
//       // Log the active users for debugging purposes
//       console.log('Connected users:', activeUsers);
  
//       // Emit the updated list of active users to all connected clients
//       io.emit('get-users', activeUsers);
//     });
  
//     /**
//      * Listen for the 'send-message' event when a client sends a message.
//      * `data` contains the message information, including the receiverId.
//      */
//     socket.on('send-message', (data) => {
//       const { receiverId } = data; // Extract the receiver's user ID from the message data
  
//       // Find the receiver in the activeUsers array using their userId
//       const user = activeUsers.find((user) => user.userId === receiverId);
  
//       // Logging the details of the message for debugging purposes
//       console.log("Sending from socket to:", receiverId);
//       console.log("Data:", data);
  
//       // If the receiver is found, emit the 'receive-message' event to their socket
//       if (user) {
//         io.to(user.socketId).emit("receive-message", data);
//         // The message will now be received by the recipient's client
//       }
//     });
  
//     /**
//      * This event listener gets triggered when a client disconnects.
//      * The socket connection is closed, and the user is removed from the activeUsers list.
//      */
//     socket.on('disconnect', () => {
//       // Filter out the disconnected user from the activeUsers list based on socketId
//       activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
  
//       // Log the updated list of active users after disconnection
//       console.log('User disconnected:', activeUsers);
  
//       // Broadcast the updated active users list to all connected clients
//       io.emit('get-users', activeUsers);
//     });
//   });
import { Server } from "socket.io";

const io = new Server(8800, {
  cors: {
    origin: "http://localhost:5173", // Allow connections only from this origin (Frontend)
  },
});

let activeUsers = [];

io.on('connection', (socket) => {
  // Handle individual user connections
  socket.on('new-user-add', (newUserId) => {
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({ userId: newUserId, socketId: socket.id });
    }
    console.log('Connected users:', activeUsers);
    io.emit('get-users', activeUsers);
  });

  // Handle sending a direct message
  socket.on('send-message', (data) => {
    const { receiverId } = data;
    const user = activeUsers.find((user) => user.userId === receiverId);
    if (user) {
      io.to(user.socketId).emit("receive-message", data);
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
