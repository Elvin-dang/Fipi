import { Message } from "@/models/message";
import { Peer } from "@/models/peer";
import { Room } from "@/models/room";
import { User } from "@/models/user";
import Avatar from "@/utils/avatar";
import { createStore } from "zustand/vanilla";
import { devtools } from "zustand/middleware";

export type State = {
  publicIP?: string;
  token?: string;
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

  const auth = await fetch("/auth");
  const { id, public_ip, token } = await auth.json();

  const user: User = {
    id,
    name,
    avatar,
  };

  return { user, connections: [], publicIP: public_ip, token };
};

export const defaultInitState: State = { connections: [] };

export const createGlobalStore = (initState: State = defaultInitState) => {
  return createStore<GlobalStore>()(
    devtools((set, get) => ({
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
            { urls: "stun:stun.signalwire.com:3478" },
            { urls: "stun:stun.stochastix.de:3478" },
            { urls: "stun:stun.bethesda.net:3478" },
            { urls: "stun:stun.thinkrosystem.com:3478" },
            { urls: "stun:stun.alpirsbacher.de:3478" },
            { urls: "stun:stun.healthtap.com:3478" },
            { urls: "stun:stun.lleida.net:3478" },
            { urls: "stun:stun.fmo.de:3478" },
            { urls: "stun:stun.moonlight-stream.org:3478" },
            { urls: "stun:stun.hot-chilli.net:3478" },
            { urls: "stun:stun.m-online.net:3478" },
            { urls: "stun:stun.lovense.com:3478" },
            { urls: "stun:stun.business-isp.nl:3478" },
            { urls: "stun:stun.sipnet.ru:3478" },
            { urls: "stun:stun.3deluxe.de:3478" },
            { urls: "stun:stun.sonetel.com:3478" },
            { urls: "stun:stun.finsterwalder.com:3478" },
            { urls: "stun:stun.uabrides.com:3478" },
            { urls: "stun:stun.vavadating.com:3478" },
            { urls: "stun:stun.voipia.net:3478" },
            { urls: "stun:stun.mixvoip.com:3478" },
            { urls: "stun:stun.romaaeterna.nl:3478" },
            { urls: "stun:stun.kaseya.com:3478" },
            { urls: "stun:stun.nanocosmos.de:3478" },
            { urls: "stun:stun.freeswitch.org:3478" },
            { urls: "stun:stun.genymotion.com:3478" },
            { urls: "stun:stun.ipfire.org:3478" },
            { urls: "stun:stun.bitburger.de:3478" },
            { urls: "stun:stun.peeters.com:3478" },
            { urls: "stun:stun.frozenmountain.com:3478" },
            { urls: "stun:stun.antisip.com:3478" },
            { urls: "stun:stun.acronis.com:3478" },
            { urls: "stun:stun.baltmannsweiler.de:3478" },
            { urls: "stun:stun.peethultra.be:3478" },
            { urls: "stun:stun.sonetel.net:3478" },
            { urls: "stun:stun.verbo.be:3478" },
            { urls: "stun:stun.sip.us:3478" },
            { urls: "stun:stun.axialys.net:3478" },
            { urls: "stun:stun.annatel.net:3478" },
            { urls: "stun:stun.ttmath.org:3478" },
            { urls: "stun:stun.3wayint.com:3478" },
            { urls: "stun:stun.voztovoice.org:3478" },
            { urls: "stun:stun.diallog.com:3478" },
            { urls: "stun:stun.ringostat.com" },
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
