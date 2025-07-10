// server.js
import { createServer } from 'http';
import { Server } from 'socket.io';
import express from 'express';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

io.on('connection', (socket) => {
  console.log('🟢 User connected:', socket.id);

  // Join room per user ID
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`🔗 User ${socket.id} joined room: ${roomId}`);
  });

  // Receive message and emit to correct room
  socket.on('send_message', (data) => {
    const { room, message, sender } = data;
    console.log(`💬 [${sender}] => Room: ${room} | Message: ${message}`);
    io.to(room).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('🔴 User disconnected:', socket.id);
  });
});

server.listen(3001, () => {
  console.log('🚀 Socket.io server running on port 3001');
});
