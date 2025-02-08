import { Room } from "@/models/room";
import { User } from "@/models/user";
import { v4 } from "uuid";
import { createStore } from "zustand/vanilla";

export type State = {
  user?: User;
  room?: Room;
  peerConnection?: RTCPeerConnection;
};

export type Actions = {
  newRoom: (roomId: string) => void;
  addNewUserToRoom: (user: User) => void;
  removeUserFromRoom: (user: User) => void;
};

export type GlobalStore = State & Actions;

export const initGlobalStore = (): State => {
  // const peerConnection = new RTCPeerConnection({
  //   iceServers: [
  //     {
  //       urls: ["stun:stun1.1.google.com:19302", "stun:stun2.1.google.com:19302"],
  //     },
  //   ],
  // });

  const id = v4();
  const name = "User " + id;
  const avatar = "https://ui-avatars.com/api/?name=" + id;

  const user: User = {
    id,
    name,
    avatar,
  };

  return { user };
};

export const defaultInitState: State = {};

export const createGlobalStore = (initState: State = defaultInitState) => {
  return createStore<GlobalStore>()((set, get) => ({
    ...initState,
    newRoom: (roomId: string) => set(() => ({ room: { id: roomId, users: [] } })),
    addNewUserToRoom: (user: User) => {
      const room = get().room;
      if (room && !room.users.find((u) => u.id === user.id)) {
        set(() => ({ room: { ...room, users: [...room.users, user] } }));
      }
    },
    removeUserFromRoom: (user: User) => {
      const room = get().room;
      if (room && room.users.find((u) => u.id === user.id)) {
        set(() => ({ room: { ...room, users: room.users.filter((u) => u.id !== user.id) } }));
      }
    },
  }));
};
