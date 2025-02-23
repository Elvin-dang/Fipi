import { Message } from "@/models/message";
import { Peer } from "@/models/peer";
import { Room } from "@/models/room";
import { User } from "@/models/user";
import Avatar from "@/utils/avatar";
import { createStore } from "zustand/vanilla";
import { devtools } from "zustand/middleware";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "@/lib/firebase";

export type State = {
  publicIP?: string;
  user?: User;
  room?: Room;
  message?: Message;
  connections: Peer[];
};

export type Actions = {
  newRoom: (roomId: string) => void;
  getRoom: () => Room | undefined;
  addNewUserToRoom: (user: User) => void;
  removeUserFromRoom: (user: User) => void;
  clearRoom: () => void;

  setMessage: (message: Message) => void;

  createPeerConnection: (id: string) => RTCPeerConnection;
  getPeerConnection: (id: string) => RTCPeerConnection | undefined;
  removePeerConnection: (id: string) => void;
};

export type GlobalStore = State & Actions;

export const initGlobalStore = async (): Promise<State> => {
  const { name, avatar } = Avatar();

  const authRq = await fetch("/auth");
  const { id, public_ip, token } = await authRq.json();

  await signInWithCustomToken(auth, token);

  const user: User = {
    id,
    name,
    avatar,
  };

  return { user, connections: [], publicIP: public_ip };
};

export const defaultInitState: State = { connections: [] };

export const devtoolsInNonProd =
  process.env.NODE_ENV === "production" ? (((fn) => fn) as typeof devtools) : devtools;

export const createGlobalStore = (initState: State = defaultInitState) => {
  return createStore<GlobalStore>()(
    devtoolsInNonProd((set, get) => ({
      ...initState,
      // Room
      newRoom: (roomId: string) => set(() => ({ room: { id: roomId, users: [] } })),
      getRoom: () => {
        return get().room;
      },
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
      clearRoom: () => set(() => ({ room: undefined })),
      // Message
      setMessage: (message: Message) => {
        set(() => ({ message }));
      },
      // Peer Connection
      createPeerConnection(id) {
        const connections = get().connections;
        const existedConnection = connections.find((c) => c.id === id);
        if (existedConnection) return existedConnection.connection;

        const connection = new RTCPeerConnection({
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:stun1.l.google.com:19302" },
            { urls: "stun:stun2.l.google.com:19302" },
            { urls: "stun:stun3.l.google.com:19302" },
            { urls: "stun:stun4.l.google.com:19302" },
            { urls: "stun:stun.relay.metered.ca:80" },
            {
              urls: "turn:global.relay.metered.ca:80",
              username: process.env.NEXT_PUBLIC_TURN_SERVER_USERNAME,
              credential: process.env.NEXT_PUBLIC_TURN_SERVER_CREDENTIAL,
            },
            {
              urls: "turn:global.relay.metered.ca:80?transport=tcp",
              username: process.env.NEXT_PUBLIC_TURN_SERVER_USERNAME,
              credential: process.env.NEXT_PUBLIC_TURN_SERVER_CREDENTIAL,
            },
            {
              urls: "turn:global.relay.metered.ca:443",
              username: process.env.NEXT_PUBLIC_TURN_SERVER_USERNAME,
              credential: process.env.NEXT_PUBLIC_TURN_SERVER_CREDENTIAL,
            },
            {
              urls: "turns:global.relay.metered.ca:443?transport=tcp",
              username: process.env.NEXT_PUBLIC_TURN_SERVER_USERNAME,
              credential: process.env.NEXT_PUBLIC_TURN_SERVER_CREDENTIAL,
            },
          ],
        });

        set((state) => ({ connections: [...state.connections, { id, connection }] }));
        return connection;
      },
      getPeerConnection(id) {
        const connections = get().connections;
        return connections.find((c) => c.id === id)?.connection;
      },
      removePeerConnection(id) {
        set((state) => ({ connections: state.connections.filter((c) => c.id !== id) }));
      },
    }))
  );
};
