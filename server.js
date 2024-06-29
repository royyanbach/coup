const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const ip = require('ip'); // To manage IP addresses

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

const clients = {};

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Get the client's IP from the headers set by Cloudflare
  const clientIp = socket.handshake.headers['cf-connecting-ip'] || socket.handshake.address;
  console.log(`Client IP: ${clientIp}`);

  const subnet = ip.subnet(clientIp, '255.255.255.0'); // Assuming a /24 subnet
  clients[socket.id] = { socketId: socket.id, subnet: subnet.networkAddress };

  const sameSubnetClients = Object.values(clients).filter(client => client.subnet === subnet.networkAddress);
  const userIdsInSameSubnet = sameSubnetClients.map(client => client.socketId);

  userIdsInSameSubnet.forEach(id => {
    io.to(id).emit('updateUserList', userIdsInSameSubnet.filter(userId => userId !== id));
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

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    const client = clients[socket.id];
    if (client) {
      const subnet = client.subnet;
      delete clients[socket.id];
      const sameSubnetClients = Object.values(clients).filter(client => client.subnet === subnet);
      const userIdsInSameSubnet = sameSubnetClients.map(client => client.socketId);

      userIdsInSameSubnet.forEach(id => {
        io.to(id).emit('updateUserList', userIdsInSameSubnet.filter(userId => userId !== id));
      });
    }
  });
});

server.listen(3000, () => console.log('Signaling server running on port 3000'));
