import { PlayerIcon } from 'src/constants';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export type User = {
  coins: number;
  id: string;
  profileIcon: PlayerIcon;
};

type State = {
  currentUserId: string;
  users: User[];
}

type Actions = {
  addUsers: (users: User[]) => void;
  removeUser: (userId: string) => void;
  setCurrentUserId: (userId: string) => void;
  updateUser: (userData: Partial<User>) => void;
}

const useUserStore = create<State & Actions>()(immer((set) => ({
  currentUserId: '',
  users: [],
  addUsers: (users) => {
    set((state) => {
      state.users.push(...users);
    });
  },
  removeUser: (userId) => {
    set((state) => {
      state.users = state.users.filter(user => user.id !== userId);
    });
  },
  setCurrentUserId: (userId) => {
    set((state) => {
      state.currentUserId = userId;
    });
  },
  updateUser: (userData) => {
    set((state) => {
      const userIndex = state.users.findIndex(user => user.id === userData.id);
      if (userIndex > -1) {
        state.users[userIndex] = { ...state.users[userIndex], ...userData };
      }
    });
  },
})));

export default useUserStore;