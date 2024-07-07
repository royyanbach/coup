import { RoomEvent } from '../constants';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { User } from './users';

export type State = {
  activities: RoomEvent[];
  isStarted: boolean;
  playerOrders: User['id'][];
  roomCode: string;
  turn: number;
}

type Actions = {
  addActivity: (activity: RoomEvent) => void;
  setIsStarted: (isStarted: boolean) => void;
  setPlayerOrders: (playerOrders: User['id'][]) => void;
  setRoomCode: (roomCode: string) => void;
  setTurn: (turn: number) => void;
}

const useGameStore = create<State & Actions>()(immer((set) => ({
  activities: [],
  isStarted: false,
  playerOrders: [],
  roomCode: '',
  turn: 1,
  addActivity: (activity) => {
    set((state) => {
      state.activities.unshift(activity);
    });
  },
  setIsStarted: (isStarted) => {
    set((state) => {
      state.isStarted = isStarted;
    });
  },
  setPlayerOrders: (playerOrders) => {
    set((state) => {
      state.playerOrders = playerOrders;
    });
  },
  setRoomCode: (roomCode) => {
    set((state) => {
      state.roomCode = roomCode;
    });
  },
  setTurn: (turn) => {
    set((state) => {
      state.turn = turn;
    });
  }
})));

export default useGameStore;