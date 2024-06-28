// Install dependencies: npm install express socket.io

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // The frontend origin
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

app.use(cors({
  origin: "http://localhost:5173", // The frontend origin
}));

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('offer', (data) => {
    io.to(data.target).emit('offer', { offer: data.offer, sender: socket.id });
  });

  socket.on('answer', (data) => {
    io.to(data.target).emit('answer', { answer: data.answer, sender: socket.id });
  });

  socket.on('candidate', (data) => {
    io.to(data.target).emit('candidate', { candidate: data.candidate, sender: socket.id });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

server.listen(3000, () => console.log('Signaling server running on port 3000'));
