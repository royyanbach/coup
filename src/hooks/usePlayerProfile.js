import { useCallback, useEffect, useMemo, useState } from "react";
import { DEFAULT_PLAYER_ICON, EVENT_NAME } from "../constants";

const usePlayerProfile = ({
  dataChannels = {},
  mySocketId = '',
} = {}) => {
  const [connectedUsers, setConnectedUsers] = useState([]);

  const myProfile = useMemo(() => {
    return connectedUsers.find(user => user.id === mySocketId);
  }, [connectedUsers, mySocketId]);

  const updateUser = useCallback((userData) => {
    setConnectedUsers(users => {
      return users.map(user => {
        if (user.id === userData.id) {
          return { ...user, ...userData };
        }
        return user;
      });
    });
  }, []);

  const setMyProfileIcon = useCallback((icon) => {
    updateUser({ id: mySocketId, profileIcon: icon });
  }, [mySocketId, updateUser]);

  const removeConnectedUser = useCallback((socketId) => {
    setConnectedUsers(users => {
      return users.filter(user => user.id !== socketId);
    });
  }, []);

  const addConnectedUser = useCallback((socketId) => {
    setConnectedUsers(users => {
      return [...users, { coins: 2, id: socketId, profileIcon: DEFAULT_PLAYER_ICON }];
    });
  }, []);

  const broadCastMessageToAllUsers = useCallback((message) => {
    connectedUsers.forEach(user => {
      if (dataChannels[user.id]) {
        dataChannels[user.id].send(message);
      }
    });
  }, [connectedUsers]);

  useEffect(() => {
    if (myProfile) {
      broadCastMessageToAllUsers(JSON.stringify({
        eventType: EVENT_NAME.UPDATE_USER,
        payload: myProfile,
      }));
    }
  }, [myProfile]);

  useEffect(() => {
    if (mySocketId) {
      addConnectedUser(mySocketId);
    }
  }, [mySocketId, addConnectedUser]);

  console.log(connectedUsers);

  return {
    addConnectedUser,
    broadCastMessageToAllUsers,
    connectedUsers,
    myProfile,
    removeConnectedUser,
    setConnectedUsers,
    setMyProfileIcon,
    updateUser,
  };
};

export default usePlayerProfile;
