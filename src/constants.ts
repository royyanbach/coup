import { User } from "./stores/users";

export default {};

export const PLAYER_ICONS = {
  WOLF: '🐺',
  TIGER: '🐯',
  PANDA: '🐼',
  SNAKE: '🐍',
  CRAB: '🦀',
  DOLPHIN: '🐬',
  PARROT: '🦜',
  OWL: '🦉',
  PENGUIN: '🐧',
  ROBOT: '🤖',
} as const;

export type PlayerIcon = keyof typeof PLAYER_ICONS;

export const DEFAULT_PLAYER_ICON = PLAYER_ICONS.ROBOT;

export const ROOM_EVENTS = {
  PLAYER_JOINED: 'PLAYER_JOINED',
  PLAYER_LEFT: 'PLAYER_LEFT',
  ROOM_CREATED: 'ROOM_CREATED',
  ROOM_JOINED: 'ROOM_JOINED',
  USER_UPDATED: 'USER_UPDATED',
} as const;

export type RoomCreatedEvent = {
  eventType: typeof ROOM_EVENTS.ROOM_CREATED;
  roomCode: string;
  users: User[];
};

export type RoomJoinedEvent = {
  eventType: typeof ROOM_EVENTS.ROOM_JOINED;
  roomCode: string;
  users: User[];
};

export type PlayerJoinedEvent = {
  eventType: typeof ROOM_EVENTS.PLAYER_JOINED;
  user: User;
};

export type PlayerLeftEvent = {
  eventType: typeof ROOM_EVENTS.PLAYER_LEFT;
  user: Partial<User> & Pick<User, 'id'>;
};

export type UserUpdatedEvent = {
  eventType: typeof ROOM_EVENTS.USER_UPDATED;
  user: Partial<User> & Pick<User, 'id'>;
};

export type RoomEvent = RoomCreatedEvent
  | RoomJoinedEvent
  | PlayerJoinedEvent
  | PlayerLeftEvent
  | UserUpdatedEvent;
