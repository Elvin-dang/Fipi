import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws, req) => {
  console.log("A new connection", req.socket.remoteAddress);

  ws.on("error", console.error);

  ws.on("message", (data, isBinary) => {
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: isBinary });
      }
    });
  });
});

console.log("Signaling server running on ws://localhost:8080");
