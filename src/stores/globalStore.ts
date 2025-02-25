import { Message } from "@/models/message";
import { Peer } from "@/models/peer";
import { User } from "@/models/user";
import Avatar from "@/utils/avatar";
import { createStore } from "zustand/vanilla";
import { devtools } from "zustand/middleware";

export type State = {
  user: User;
  message?: Message;
  connections: Peer[];
};

export type Actions = {
  setMessage: (message: Message) => void;

  createPeerConnection: (id: string) => RTCPeerConnection;
  getPeerConnection: (id: string) => RTCPeerConnection | undefined;
  removePeerConnection: (id: string) => void;
};

export type GlobalStore = State & Actions;

export const initGlobalStore = (id: string): State => {
  const { name, avatar } = Avatar();

  const user: User = {
    id,
    name,
    avatar,
  };

  return { user, connections: [] };
};

export const devtoolsInNonProd =
  process.env.NODE_ENV === "production" ? (((fn) => fn) as typeof devtools) : devtools;

export const createGlobalStore = (initState: State) => {
  return createStore<GlobalStore>()(
    devtoolsInNonProd((set, get) => ({
      ...initState,
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
