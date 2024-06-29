import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io(import.meta.env.VITE_SERVER_HOST, {
  path: import.meta.env.VITE_SERVER_PATH,
});

const configuration = {
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302',
    },
  ],
};

const peerConnections = {};
const dataChannels = {};

const App = () => {
  const [mySocketId, setMySocketId] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [isInRoom, setIsInRoom] = useState(false);
  const [userList, setUserList] = useState([]);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [receivedMessages, setReceivedMessages] = useState([]);

  const createRoom = () => {
    const code = Math.random().toString(36).substring(2, 10);
    socket.emit('createRoom', code);
  };

  const joinRoom = (code) => {
    socket.emit('joinRoom', code);
  };

  useEffect(() => {
    socket.emit('register');

    socket.on('connect', () => {
      setMySocketId(socket.id);
      console.log('Connected with socket ID:', socket.id);
    });

    socket.on('roomCreated', (code) => {
      setRoomCode(code);
      setIsInRoom(true);
      console.log(`Room created: ${code}`);
    });

    socket.on('roomJoined', (code) => {
      setRoomCode(code);
      setIsInRoom(true);
      console.log(`Joined room: ${code}`);
    });

    socket.on('newMember', (newMemberId) => {
      console.log('New member joined:', newMemberId);
      setTimeout(() => {
        connectUser(newMemberId);
      }, 500);
    });

    socket.on('updateUserList', (users) => {
      setUserList(users.filter(id => id !== socket.id && !connectedUsers.includes(id)));
    });

    socket.on('offer', async (data) => {
      if (!peerConnections[data.sender]) {
        createPeerConnection(data.sender);
      }
      const desc = new RTCSessionDescription(data.offer);
      await peerConnections[data.sender].setRemoteDescription(desc);
      const answer = await peerConnections[data.sender].createAnswer();
      await peerConnections[data.sender].setLocalDescription(answer);
      socket.emit('answer', { answer, target: data.sender });
    });

    socket.on('answer', async (data) => {
      const desc = new RTCSessionDescription(data.answer);
      await peerConnections[data.sender].setRemoteDescription(desc);
    });

    socket.on('candidate', async (data) => {
      const candidate = new RTCIceCandidate(data.candidate);
      await peerConnections[data.sender].addIceCandidate(candidate);
    });

    socket.on('updateUserListRequest', () => {
      socket.emit('register'); // Re-fetch the user list from the server
    });

    socket.on('userDisconnected', (disconnectedUserId) => {
      setConnectedUsers(prev => prev.filter(id => id !== disconnectedUserId));
      setUserList(prev => prev.includes(disconnectedUserId) ? prev : [...prev, disconnectedUserId]);
      delete peerConnections[disconnectedUserId];
      delete dataChannels[disconnectedUserId];
    });

    return () => {
      socket.off('connect');
      socket.off('roomCreated');
      socket.off('roomJoined');
      socket.off('newMember');
      socket.off('offer');
      socket.off('answer');
      socket.off('candidate');
      socket.off('updateUserList');
      socket.off('updateUserListRequest');
      socket.off('userDisconnected');
    };
  }, [connectedUsers]);

  const createPeerConnection = (socketId) => {
    const peerConnection = new RTCPeerConnection(configuration);

    peerConnection.onicecandidate = ({ candidate }) => {
      if (candidate) {
        socket.emit('candidate', { candidate, target: socketId });
      }
    };

    peerConnection.ondatachannel = (event) => {
      const channel = event.channel;
      setupDataChannel(channel, socketId);
    };

    const dataChannel = peerConnection.createDataChannel('dataChannel');
    setupDataChannel(dataChannel, socketId);
    dataChannels[socketId] = dataChannel;

    peerConnections[socketId] = peerConnection;

    // Add to connected users list
    setConnectedUsers(prev => [...prev, socketId]);
  };

  const setupDataChannel = (channel, socketId) => {
    channel.onmessage = (event) => {
      setReceivedMessages(prev => [...prev, event.data]);
    };

    channel.onopen = () => {
      console.log('Data channel is open');
    };

    channel.onclose = () => {
      console.log('Data channel is closed');
      // Remove from connected users list
      setConnectedUsers(prev => prev.filter(id => id !== socketId));
      // Add back to user list if still available
      setUserList(prev => prev.includes(socketId) ? prev : [...prev, socketId]);
      // Remove peer connection and data channel
      delete peerConnections[socketId];
      delete dataChannels[socketId];
    };
  };

  const connectUser = async (targetId) => {
    if (!peerConnections[targetId]) {
      createPeerConnection(targetId);
      const offer = await peerConnections[targetId].createOffer();
      await peerConnections[targetId].setLocalDescription(offer);
      socket.emit('offer', { offer, target: targetId });
      // Remove from user list
      setUserList(prev => prev.filter(id => id !== targetId));
      // Notify other users to update their user list
      socket.emit('updateUserListRequest');
    }
  };


  const sendMessage = () => {
    connectedUsers.forEach(targetId => {
      if (dataChannels[targetId]) {
        dataChannels[targetId].send(message);
      }
    });
    setMessage('');
  };

  return (
    <div>
      <h1>WebRTC Game</h1>
      <p>Your Socket ID: {mySocketId}</p>
      {!isInRoom && (
        <div>
          <button onClick={createRoom}>Create Room</button>
          <input
            type="text"
            placeholder="Enter Room Code"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
          />
          <button onClick={() => joinRoom(roomCode)}>Join Room</button>
        </div>
      )}
      {isInRoom && (
        <h2>Room Code: {roomCode}</h2>
      )}
      <h2>Available Users</h2>
      <ul>
        {userList.map(userId => (
          <li key={userId}>
            <span>{userId}</span>
            <button onClick={() => connectUser(userId)}>Connect</button>
          </li>
        ))}
      </ul>
      <h2>Connected Users</h2>
      <ul>
        {connectedUsers.map(userId => (
          <li key={userId}>{userId}</li>
        ))}
      </ul>
      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send Message</button>
      </div>
      <div>
        <h2>Received Messages</h2>
        {receivedMessages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
    </div>
  );
};

export default App;
