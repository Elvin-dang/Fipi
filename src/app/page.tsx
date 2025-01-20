"use client";

import { useGlobalStore } from "@/lib/zustand";
import { useCallback, useEffect, useState } from "react";

export default function Home() {
  const { id, signalingSocket, peerConnection, init } = useGlobalStore();
  const [receivedChunks, setReceivedChunks] = useState<Blob[]>([]);
  const [fileUrl, setFileUrl] = useState<string>("");
  const [fileType, setType] = useState<string>();
  const [fileName, setName] = useState<string>();
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    init("ws://localhost:8080");
  }, [init]);

  useEffect(() => {
    if (peerConnection) {
      peerConnection.ondatachannel = (event) => {
        const channel = event.channel;

        channel.onmessage = (e) => {
          try {
            const metadata = JSON.parse(e.data);
            setType(metadata.type);
            setName(metadata.name);
            setProgress(0);
          } catch (error) {
            if (e.data === "done") {
              const blob = new Blob(receivedChunks, { type: fileType });
              setFileUrl(URL.createObjectURL(blob));
            } else {
              receivedChunks.push(e.data);
              setReceivedChunks([...receivedChunks]);
            }
          }
        };
      };
    }
  }, [peerConnection, fileType]);

  const sendFile = useCallback(
    async (file: File) => {
      if (peerConnection && signalingSocket) {
        // Open channel to send file
        const channel = peerConnection.createDataChannel("file");

        channel.onopen = () => {
          const reader = new FileReader();
          let offset = 0;
          const chunkSize = file.size > 10 * 1024 * 1024 ? 4 * 1024 : 16 * 1024;

          reader.onload = (e) => {
            if (e.target?.result) {
              channel.send(e.target.result as ArrayBuffer);
              offset += chunkSize;
              if (offset < file.size) {
                setProgress(Math.round((offset / file.size) * 100));
                readSlice(offset);
              } else {
                channel.send("done");
                setProgress(100);
              }
            }
          };

          const readSlice = (o: number) => {
            const slice = file.slice(o, o + chunkSize);
            reader.readAsArrayBuffer(slice);
          };

          channel.send(JSON.stringify({ name: file.name, type: file.type }));
          readSlice(0);
          console.log(peerConnection.sctp?.maxMessageSize);
        };

        // Send offer to signaling server
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        signalingSocket.send(JSON.stringify({ type: "offer", sdp: offer.sdp }));
      }
    },
    [peerConnection, signalingSocket]
  );

  return (
    <main>
      <h1>Sharedrop-like File Sharing</h1>
      <h2>{id}</h2>
      <div>
        <input
          type="file"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              sendFile(e.target.files[0]);
            }
          }}
        />
        {fileUrl && (
          <div>
            <a href={fileUrl} download={fileName}>
              Download File: {fileName || "No File"}
            </a>
          </div>
        )}
        {progress > 0 && <div>Progress: {progress}/100</div>}
      </div>
    </main>
  );
}
