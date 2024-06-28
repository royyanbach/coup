import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const socket = io('https://playground.royyanba.ch', {
  path: '/coup/socket.io'
});

const configuration = {
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302',
    },
  ],
};

const peerConnections = {};

const App = () => {
  const [mySocketId, setMySocketId] = useState('');
  const [targetSocketId, setTargetSocketId] = useState('');
  const localStreamRef = useRef();
  const localVideoRef = useRef();
  const remoteStreamsRef = useRef([]);
  const [remoteStreams, setRemoteStreams] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    socket.on('connect', () => {
      setMySocketId(socket.id);
      console.log('Connected with socket ID:', socket.id);
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

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        localStreamRef.current = stream;
        localVideoRef.current.srcObject = stream;
        setIsConnected(true);
      });

    return () => {
      socket.off('connect');
      socket.off('offer');
      socket.off('answer');
      socket.off('candidate');
    };
  }, []);

  const createPeerConnection = (socketId) => {
    const peerConnection = new RTCPeerConnection(configuration);

    peerConnection.onicecandidate = ({ candidate }) => {
      if (candidate) {
        socket.emit('candidate', { candidate, target: socketId });
      }
    };

    peerConnection.ontrack = (event) => {
      if (!remoteStreamsRef.current.includes(event.streams[0])) {
        remoteStreamsRef.current.push(event.streams[0]);
        setRemoteStreams([...remoteStreamsRef.current]);
      }
    };

    localStreamRef.current.getTracks().forEach(track => {
      peerConnection.addTrack(track, localStreamRef.current);
    });

    peerConnections[socketId] = peerConnection;
  };

  const callUser = async () => {
    if (!targetSocketId) {
      alert('Please enter the target socket ID.');
      return;
    }

    createPeerConnection(targetSocketId);
    const offer = await peerConnections[targetSocketId].createOffer();
    await peerConnections[targetSocketId].setLocalDescription(offer);
    socket.emit('offer', { offer, target: targetSocketId });
  };

  return (
    <div>
      <h1>WebRTC Game</h1>
      <p>Your Socket ID: {mySocketId}</p>
      <video ref={localVideoRef} autoPlay muted style={{ width: "300px" }} />
      {remoteStreams.map((stream, index) => (
        <video key={index} ref={(video) => { if (video) video.srcObject = stream }} autoPlay style={{ width: "300px" }} />
      ))}
      {isConnected && (
        <div>
          <input
            type="text"
            placeholder="Enter target socket ID"
            value={targetSocketId}
            onChange={(e) => setTargetSocketId(e.target.value)}
          />
          <button onClick={callUser}>Call User</button>
        </div>
      )}
    </div>
  );
};

export default App;
