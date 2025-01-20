import { create } from "zustand";
import { v4 } from "uuid";

interface GlobalState {
  id: string | null;
  signalingSocket: WebSocket | null;
  peerConnection: RTCPeerConnection | null;
  init: (url: string) => void;
}

export const useGlobalStore = create<GlobalState>()((set) => ({
  id: null,
  signalingSocket: null,
  peerConnection: null,
  init: (url) => {
    const socket = new WebSocket(url);
    const pc = new RTCPeerConnection({
      iceServers: [
        {
          urls: ["stun:stun1.1.google.com:19302", "stun:stun2.1.google.com:19302"],
        },
      ],
    });

    socket.onopen = () => {
      console.log("Connected to signaling server.");
    };

    socket.onmessage = async (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "offer") {
        await pc.setRemoteDescription({ type: "offer", sdp: data.sdp });
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.send(JSON.stringify({ type: "answer", sdp: answer.sdp }));
      } else if (data.type === "answer") {
        await pc.setRemoteDescription({ type: "answer", sdp: data.sdp });
      } else if (data.type === "candidate") {
        await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.send(JSON.stringify({ type: "candidate", candidate: event.candidate }));
      }
    };

    set({ id: v4(), signalingSocket: socket, peerConnection: pc });
  },
}));
