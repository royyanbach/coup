import { useCallback, useEffect } from 'react';
import io from 'socket.io-client';
import Header from './components/Header';
import Welcome from './components/Welcome';
import Board from './components/Board';
import { PlayerIcon, ROOM_EVENTS, RoomEvent } from './constants';
import useUserStore, { User } from './stores/users';
import useGameStore from './stores/game';

const socket = io(import.meta.env.VITE_SERVER_HOST, {
  path: import.meta.env.VITE_SERVER_PATH,
});

const App = () => {
  const {
    addActivity,
    roomCode,
    setIsStarted,
    setPlayerOrders,
    setRoomCode,
  } = useGameStore();

  const {
    addUsers,
    removeUser,
    setCurrentUserId,
    updateUser,
  } = useUserStore();
  const isInRoom = !!roomCode;

  const broadcastCreateRoom = () => {
    socket.emit('createRoom');
  };

  const broadcastStartGame = () => {
    socket.emit('startGame');
  };

  const broadcastJoinRoom = (code: string) => {
    socket.emit('joinRoom', code);
  };

  const broadcastUpdateProfile = (user: Partial<User>) => {
    socket.emit('updateProfile', user);
  }

  const handleRoomEvent = useCallback((roomEvent: RoomEvent) => {
    console.warn(roomEvent);
    switch (roomEvent.eventType) {
      case ROOM_EVENTS.GAME_STARTED:
        setIsStarted(roomEvent.isStarted);
        setPlayerOrders(roomEvent.playerOrders);
        addActivity(roomEvent);
        break;
      case ROOM_EVENTS.ROOM_CREATED:
      case ROOM_EVENTS.ROOM_JOINED:
        setRoomCode(roomEvent.roomCode);
        addUsers(roomEvent.users);
        addActivity(roomEvent);
        break;
      case ROOM_EVENTS.PLAYER_JOINED:
        addUsers([roomEvent.user]);
        addActivity(roomEvent);
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
        setCurrentUserId(socket.id);
      }
    });

    socket.on('error', (error) => {
      console.error('Socket Error:', error);
    });

    socket.on('roomEvent', handleRoomEvent);

    return () => {
      socket.off('connect');
      socket.off('error');
      socket.off('roomEvent');
    };
  }, []);

  const setMyProfileIcon = useCallback((icon: PlayerIcon) => {
    broadcastUpdateProfile({ profileIcon: icon });
  }, []);

  return (
    <div className="h-full bg-[url('splash-bg.jpg')] bg-no-repeat bg-center bg-cover">
      <div className='flex flex-col gap-10 justify-center items-center h-screen bg-gray-900 bg-opacity-40'>
        <Header />

        {!isInRoom && (
          <Welcome onCreateRoom={broadcastCreateRoom} onJoinRoom={broadcastJoinRoom} />
        )}

        {isInRoom && (
          <Board onGameStart={broadcastStartGame} onChangePlayerIcon={setMyProfileIcon} />
        )}
      </div>
    </div>
  );
};

export default App;
