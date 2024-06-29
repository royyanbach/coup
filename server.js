require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const ip = require('ip');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

app.use(cors({
  origin: process.env.CLIENT_URL,
}));

const clients = {};
const rooms = {};

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Get the client's IP from the headers set by Cloudflare
  const clientIp = socket.handshake.headers['cf-connecting-ip'] || process.env.FALLBACK_CLIENT_IP;
  console.log(`Client IP: ${clientIp}`);

  const subnet = ip.subnet(clientIp, '255.255.255.0'); // Assuming a /24 subnet
  clients[socket.id] = { socketId: socket.id, subnet: subnet.networkAddress };

  const sameSubnetClients = Object.values(clients).filter(client => client.subnet === subnet.networkAddress);
  const userIdsInSameSubnet = sameSubnetClients.map(client => client.socketId);

  userIdsInSameSubnet.forEach(id => {
    io.to(id).emit('updateUserList', userIdsInSameSubnet.filter(userId => userId !== id));
  });

  socket.on('updateUserListRequest', () => {
    const sameSubnetClients = Object.values(clients).filter(client => client.subnet === clients[socket.id].subnet);
    const userIdsInSameSubnet = sameSubnetClients.map(client => client.socketId);
    userIdsInSameSubnet.forEach(id => {
      io.to(id).emit('updateUserList', userIdsInSameSubnet.filter(userId => userId !== id));
    });
  });

  socket.on('offer', (data) => {
    io.to(data.target).emit('offer', { offer: data.offer, sender: socket.id });
  });

  socket.on('answer', (data) => {
    io.to(data.target).emit('answer', { answer: data.answer, sender: socket.id });
  });

  socket.on('candidate', (data) => {
    io.to(data.target).emit('candidate', { candidate: data.candidate, sender: socket.id });
  });

  socket.on('createRoom', (roomCode) => {
    if (!rooms[roomCode]) {
      rooms[roomCode] = [];
    }
    rooms[roomCode].push(socket.id);
    socket.join(roomCode);
    io.to(socket.id).emit('roomCreated', roomCode);
    console.log(`Room ${roomCode} created by ${socket.id}`);
  });

  socket.on('joinRoom', (roomCode) => {
    if (rooms[roomCode]) {
      rooms[roomCode].push(socket.id);
      socket.join(roomCode);
      io.to(socket.id).emit('roomJoined', roomCode);
      console.log(`${socket.id} joined room ${roomCode}`);

      // Notify existing members in the room
      socket.to(roomCode).emit('newMember', socket.id);
      rooms[roomCode].forEach(member => {
        if (member !== socket.id) {
          io.to(socket.id).emit('newMember', member);
        }
      });
    } else {
      io.to(socket.id).emit('error', 'Room does not exist');
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    const client = clients[socket.id];
    if (client) {
      delete clients[socket.id];

      // Remove the user from all rooms they were part of
      for (const roomCode in rooms) {
        const index = rooms[roomCode].indexOf(socket.id);
        if (index !== -1) {
          rooms[roomCode].splice(index, 1);
          // Notify other users in the room about the disconnection
          socket.to(roomCode).emit('userDisconnected', socket.id);
        }
        // If the room is empty, delete it
        if (rooms[roomCode].length === 0) {
          delete rooms[roomCode];
        }
      }
    }
  });

});

server.listen(3000, () => console.log('Signaling server running on port 3000'));
