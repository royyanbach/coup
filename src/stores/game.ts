import { RoomEvent } from 'src/constants';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

type State = {
  activities: RoomEvent[];
  roomCode: string;
}

type Actions = {
  addActivity: (activity: RoomEvent) => void;
  setRoomCode: (roomCode: string) => void;
}

const useGameStore = create<State & Actions>()(immer((set) => ({
  activities: [],
  roomCode: '',
  addActivity: (activity) => {
    set((state) => {
      state.activities.unshift(activity);
    });
  },
  setRoomCode: (roomCode) => {
    set((state) => {
      state.roomCode = roomCode;
    });
  },
})));

export default useGameStore;