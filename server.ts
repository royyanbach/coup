import 'dotenv/config';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { User } from 'src/stores/users';
import { GameStartedEvent, PlayerJoinedEvent, PlayerLeftEvent, RoomCreatedEvent, RoomJoinedEvent, UserUpdatedEvent } from 'src/constants';


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
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

// const clients = {};

type Rooms = {
  [roomCode: string]: {
    isStarted: boolean;
    members: User[];
    playerOrder?: string[];
    turn: number;
  };
};

const rooms: Rooms = {};

const createNewUser = (socketId: string): User => {
  return {
    id: socketId,
    coins: 2,
    profileIcon: 'ROBOT',
  };
};

io.on('connection', (socket) => {
  // Get the client's IP from the headers set by Cloudflare
  const clientIp = socket.handshake.headers['cf-connecting-ip'] || process.env.FALLBACK_CLIENT_IP;
  console.log(`New client connected: ${socket.id} ${clientIp}`);

  // const subnet = ip.subnet(clientIp, '255.255.255.0'); // Assuming a /24 subnet
  // clients[socket.id] = { socketId: socket.id, subnet: subnet.networkAddress };

  // const sameSubnetClients = Object.values(clients).filter(client => client.subnet === subnet.networkAddress);
  // const userIdsInSameSubnet = sameSubnetClients.map(client => client.socketId);

  // userIdsInSameSubnet.forEach(id => {
  //   io.to(id).emit('updateUserList', userIdsInSameSubnet.filter(userId => userId !== id));
  // });

  // socket.on('updateUserListRequest', () => {
  //   const sameSubnetClients = Object.values(clients).filter(client => client.subnet === clients[socket.id].subnet);
  //   const userIdsInSameSubnet = sameSubnetClients.map(client => client.socketId);
  //   userIdsInSameSubnet.forEach(id => {
  //     io.to(id).emit('updateUserList', userIdsInSameSubnet.filter(userId => userId !== id));
  //   });
  // });

  // socket.on('offer', (data) => {
  //   io.to(data.target).emit('offer', { offer: data.offer, sender: socket.id });
  // });

  // socket.on('answer', (data) => {
  //   io.to(data.target).emit('answer', { answer: data.answer, sender: socket.id });
  // });

  // socket.on('candidate', (data) => {
  //   io.to(data.target).emit('candidate', { candidate: data.candidate, sender: socket.id });
  // });

  socket.on('createRoom', () => {
    const roomCode = Math.random().toString(36).substring(10).toUpperCase();
    console.log('Creating room:', roomCode);

    if (!rooms[roomCode]) {
      rooms[roomCode] = {
        isStarted: false,
        members: [],
        turn: 1,
      };
    }

    rooms[roomCode].members.push(createNewUser(socket.id));
    socket.join(roomCode);
    const roomEvent: RoomCreatedEvent = {
      eventType: 'ROOM_CREATED',
      roomCode,
      users: rooms[roomCode].members,
    };
    io.to(socket.id).emit('roomEvent', roomEvent);
  });

  socket.on('joinRoom', (roomCode: string) => {
    const roomCodeUpper = roomCode.toUpperCase();
    console.log(`${socket.id} is joining room ${roomCodeUpper}`);

    if (rooms[roomCodeUpper]) {
      const newUser = createNewUser(socket.id);
      rooms[roomCodeUpper].members.push(newUser);
      socket.join(roomCodeUpper);
      const roomJoinedEvent: RoomJoinedEvent = {
        eventType: 'ROOM_JOINED',
        roomCode: roomCodeUpper,
        users: rooms[roomCodeUpper].members,
      };
      io.to(socket.id).emit('roomEvent', roomJoinedEvent);

      const playerJoinedEvent: PlayerJoinedEvent = {
        eventType: 'PLAYER_JOINED',
        user: newUser,
      }
      socket.to(roomCodeUpper).except(socket.id).emit('roomEvent', playerJoinedEvent);
    } else {
      io.to(socket.id).emit('error', 'Room does not exist');
    }
  });

  socket.on('updateProfile', (userData: Partial<User>) => {
    let roomCode;
    socket.rooms.forEach(roomId => {
      if (roomId !== socket.id) {
        roomCode = roomId;
      }
    });

    console.log(`Updating profile ${socket.id} in room ${roomCode}`);

    if (roomCode) {
      const room = rooms[roomCode];
      const userIndex = room.members.findIndex(user => user.id === socket.id);
      if (userIndex !== -1) {
        room.members[userIndex] = { ...room.members[userIndex], ...userData };
        const userUpdatedEvent: UserUpdatedEvent = {
          eventType: 'USER_UPDATED',
          user: {
            id: socket.id,
            ...userData
          },
        };
        io.to(roomCode).emit('roomEvent', userUpdatedEvent);
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);

    for (const roomCode in rooms) {
      const index = rooms[roomCode].members.findIndex(user => user.id === socket.id);
      if (index !== -1) {
        rooms[roomCode].members.splice(index, 1);
        // Notify other users in the room about the disconnection
        const playerLeftEvent: PlayerLeftEvent = {
          eventType: 'PLAYER_LEFT',
          user: {
            id: socket.id,
          },
        };
        socket.to(roomCode).emit('roomEvent', playerLeftEvent);
      }
      // If the room is empty, delete it
      if (rooms[roomCode].members.length === 0) {
        delete rooms[roomCode];
      }
    }
  });

  socket.on('startGame', () => {
    let roomCode;
    socket.rooms.forEach(roomId => {
      if (roomId !== socket.id) {
        roomCode = roomId;
      }
    });

    console.log(`Starting game in room ${roomCode}`);

    if (roomCode) {
      // Shuffle the player order
      const room = rooms[roomCode];
      room.playerOrder = room.members.map(user => ({ ...user, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(user => user.id);
      room.isStarted = true;

      const gameStartedEvent: GameStartedEvent = {
        eventType: 'GAME_STARTED',
        isStarted: room.isStarted,
        playerOrders: room.playerOrder,
        turn: room.turn,
      };
      io.to(roomCode).emit('roomEvent', gameStartedEvent);
    }
  })

});

server.listen(3000, () => console.log('Signaling server running on port 3000'));
