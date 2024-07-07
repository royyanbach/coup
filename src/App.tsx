import React, { useCallback, useEffect, useMemo, useState } from 'react';
import io from 'socket.io-client';
import Header from './components/Header';
import Welcome from './components/Welcome';
import Board from './components/Board';
// import usePlayerProfile from './hooks/usePlayerProfile';
import { PlayerIcon, ROOM_EVENTS, RoomEvent } from './constants';
import usersStore, { User } from './stores/users';

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

// const peerConnections = {};
// const dataChannels = {};

const App = () => {
  const [mySocketId, setMySocketId] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const isInRoom = !!roomCode;
  const { addUsers, users, removeUser, updateUser } = usersStore();
  // const [userList, setUserList] = useState([]);
  // const [message, setMessage] = useState('');
  const [activities, setActivities] = useState<RoomEvent[]>([]);

  const prependActivities = useCallback((message: RoomEvent) => {
    setActivities(prev => [message, ...prev]);
  }, []);

  // const {
  //   addConnectedUser,
  //   connectedUsers,
  //   removeConnectedUser,
  //   setMyProfileIcon,
  //   updateUser,
  // } = usePlayerProfile({
  //   dataChannels,
  //   mySocketId,
  // });

  const broadcastCreateRoom = () => {
    // const code = Math.random().toString(36).substring(0, 3);
    socket.emit('createRoom');
  };

  const broadcastJoinRoom = (code: string) => {
    socket.emit('joinRoom', code);
  };

  const broadcastUpdateProfile = (user: Partial<User>) => {
    socket.emit('updateProfile', user);
  }

  const handleNewMessage = (message) => {
    // try {
    //   const parsedMessage = JSON.parse(message);
    //   switch (parsedMessage.eventType) {
    //     case ROOM_EVENTS.UPDATE_USER:
    //       updateUser(parsedMessage.payload);
    //       break;
    //     default:
    //       console.log('Unknown event type:', parsedMessage.eventType);
    //       break;
    //   }
    // } catch (error) {
    //   console.error('Failed to parse message:', error);
    // }
  };

  const handleRoomEvent = useCallback((roomEvent: RoomEvent) => {
    switch (roomEvent.eventType) {
      case ROOM_EVENTS.ROOM_CREATED:
      case ROOM_EVENTS.ROOM_JOINED:
        setRoomCode(roomEvent.roomCode);
        addUsers(roomEvent.users);
        prependActivities(roomEvent);
        break;
      case ROOM_EVENTS.PLAYER_JOINED:
        addUsers([roomEvent.user]);
        prependActivities(roomEvent);
        break;
      case ROOM_EVENTS.USER_UPDATED:
        updateUser(roomEvent.user);
        break;
      case ROOM_EVENTS.PLAYER_LEFT:
        removeUser(roomEvent.user.id);
        break;
      default:
        console.warn('Unknown event type:', roomEvent);
        break;
    }
  }, []);

  useEffect(() => {
    socket.emit('register');

    socket.on('connect', () => {
      if (socket.id) {
        setMySocketId(socket.id);
      }
    });

    socket.on('error', (error) => {
      console.error('Socket Error:', error);
    });

    socket.on('roomEvent', handleRoomEvent);

    // socket.on('roomCreated', (code) => {
    //   setRoomCode(code);
    //   setIsInRoom(true);
    //   prependMessage({
    //     eventType: EVENT_NAME.CREATE_ROOM,
    //     actor: socket.id,
    //   });
    // });

    // socket.on('roomJoined', (code) => {
    //   setRoomCode(code);
    //   setIsInRoom(true);
    //   prependMessage({
    //     eventType: EVENT_NAME.JOIN_ROOM,
    //     actor: socket.id,
    //   });
    // });

    // socket.on('newMember', (newMemberId) => {
    //   prependMessage({
    //     eventType: EVENT_NAME.PLAYER_JOINED,
    //     actor: newMemberId,
    //   });
    //   setTimeout(() => {
    //     connectUser(newMemberId);
    //   }, 500);
    // });

    // socket.on('updateUserList', (users) => {
    //   setUserList(users.filter(id => id !== socket.id && !connectedUsers.includes(id)));
    // });

    // socket.on('offer', async (data) => {
    //   if (!peerConnections[data.sender]) {
    //     createPeerConnection(data.sender);
    //   }
    //   const desc = new RTCSessionDescription(data.offer);
    //   await peerConnections[data.sender].setRemoteDescription(desc);
    //   const answer = await peerConnections[data.sender].createAnswer();
    //   await peerConnections[data.sender].setLocalDescription(answer);
    //   socket.emit('answer', { answer, target: data.sender });
    // });

    // socket.on('answer', async (data) => {
    //   const desc = new RTCSessionDescription(data.answer);
    //   await peerConnections[data.sender].setRemoteDescription(desc);
    // });

    // socket.on('candidate', async (data) => {
    //   const candidate = new RTCIceCandidate(data.candidate);
    //   await peerConnections[data.sender].addIceCandidate(candidate);
    // });

    // socket.on('updateUserListRequest', () => {
    //   socket.emit('register'); // Re-fetch the user list from the server
    // });

    // socket.on('userDisconnected', (disconnectedUserId) => {
    //   removeConnectedUser(disconnectedUserId);
    //   setUserList(prev => prev.includes(disconnectedUserId) ? prev : [...prev, disconnectedUserId]);
    //   delete peerConnections[disconnectedUserId];
    //   delete dataChannels[disconnectedUserId];
    // });

    return () => {
      socket.off('connect');
      socket.off('error');
      socket.off('roomEvent');
      // socket.off('roomCreated');
      // socket.off('roomJoined');
      // socket.off('newMember');
      // socket.off('offer');
      // socket.off('answer');
      // socket.off('candidate');
      // socket.off('updateUserList');
      // socket.off('updateUserListRequest');
      // socket.off('userDisconnected');
    };
  }, []);

  // const createPeerConnection = (socketId) => {
  //   const peerConnection = new RTCPeerConnection(configuration);

  //   peerConnection.onicecandidate = ({ candidate }) => {
  //     if (candidate) {
  //       socket.emit('candidate', { candidate, target: socketId });
  //     }
  //   };

  //   peerConnection.ondatachannel = (event) => {
  //     const channel = event.channel;
  //     setupDataChannel(channel, socketId);
  //   };

  //   const dataChannel = peerConnection.createDataChannel('dataChannel');
  //   setupDataChannel(dataChannel, socketId);
  //   dataChannels[socketId] = dataChannel;

  //   peerConnections[socketId] = peerConnection;

  //   // Add to connected users list
  //   addConnectedUser(socketId);
  // };

  // const setupDataChannel = (channel, socketId) => {
  //   channel.onmessage = (event) => {
  //     handleNewMessage(event.data);
  //     // setReceivedMessages(prev => [...prev, event.data]);
  //   };

  //   channel.onopen = () => {
  //     console.log('Data channel is open');
  //   };

  //   channel.onclose = () => {
  //     console.log('Data channel is closed');
  //     // Remove from connected users list
  //     removeConnectedUser(socketId);
  //     // Add back to user list if still available
  //     setUserList(prev => prev.includes(socketId) ? prev : [...prev, socketId]);
  //     // Remove peer connection and data channel
  //     delete peerConnections[socketId];
  //     delete dataChannels[socketId];
  //   };
  // };

  // const connectUser = async (targetId) => {
  //   if (!peerConnections[targetId]) {
  //     createPeerConnection(targetId);
  //     const offer = await peerConnections[targetId].createOffer();
  //     await peerConnections[targetId].setLocalDescription(offer);
  //     socket.emit('offer', { offer, target: targetId });
  //     // Remove from user list
  //     setUserList(prev => prev.filter(id => id !== targetId));
  //     // Notify other users to update their user list
  //     socket.emit('updateUserListRequest');
  //   }
  // };

  const setMyProfileIcon = useCallback((icon: PlayerIcon) => {
    broadcastUpdateProfile({ profileIcon: icon });
  }, [mySocketId]);

  return (
    <div className="h-full bg-[url('splash-bg.jpg')] bg-no-repeat bg-center bg-cover">
      <div className='flex flex-col gap-10 justify-center items-center h-screen bg-gray-900 bg-opacity-40'>
        <Header roomCode={roomCode} />
        {!isInRoom && (
          <Welcome onCreateRoom={broadcastCreateRoom} onJoinRoom={broadcastJoinRoom} />
        )}
        {isInRoom && (
          <Board
            activities={activities}
            users={users}
            onChangePlayerIcon={setMyProfileIcon}
            mySocketId={mySocketId}
          />
        )}
        {/* <Board
          connectedUsers={connectedUsers}
          onChangePlayerIcon={setMyProfileIcon}
          mySocketId={mySocketId}
        /> */}
      </div>
      <div className='hidden'>
        <p>Your Socket ID: {mySocketId}</p>
        {/* {!isInRoom && (
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
        )} */}

        {/* <h2>Available Users</h2>
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
        </ul> */}

        {/* <div>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={() => broadCastMessageToAllUsers(message)}>Send Message</button>
        </div> */}

        {/* <div>
          <h2>Received Messages</h2>
          {receivedMessages.map((msg, index) => (
            <p key={index}>{msg}</p>
          ))}
        </div> */}
      </div>
    </div>
  );
};

export default App;
