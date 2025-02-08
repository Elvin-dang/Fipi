"use client";

import { useState } from "react";
import { v4 } from "uuid";
import { useRouter } from "next/navigation";
import { useGlobalStore } from "@/providers/globalStateProvider";
import dynamic from "next/dynamic";

const InformationBox = dynamic(() => import("@/app/_components/InformationBox"), {
  ssr: false,
});

export default function Home() {
  const { user } = useGlobalStore((state) => state);
  const [receivedChunks, setReceivedChunks] = useState<Blob[]>([]);
  const [fileUrl, setFileUrl] = useState<string>("");
  const [fileType, setType] = useState<string>();
  const [fileName, setName] = useState<string>();
  const [progress, setProgress] = useState<number>(0);

  const router = useRouter();

  const onCreateRoom = () => {
    const roomID = v4();
    router.push(`/rooms/${roomID}`);
  };

  // useEffect(() => {
  //   if (id) {
  //     const fetchIp = async () => {
  //       const res = await fetch("http://localhost:3000/room");
  //       const data = await res.json();

  //       const dbRef = ref(db);
  //       const connectedRef = child(dbRef, ".info/connected");
  //       const roomRef = child(dbRef, `rooms/${data.ip}`);
  //       const usersRef = child(roomRef, "users");
  //       const userRef = child(usersRef, id);

  //       console.log("Room:\t Connecting to: ", data.ip);

  //       onValue(connectedRef, (snapshot) => {
  //         if (snapshot.val() === true) {
  //           console.log("Firebase: (Re)Connected");

  //           onDisconnect(userRef).remove();

  //           set(userRef, { uuid: id, public_ip: data.ip })
  //             .then(() => {
  //               console.log("Firebase: User added to the room");
  //             })
  //             .catch((error) => {
  //               console.warn("Firebase: Adding user to the room failed: ", error);
  //             });

  //           onChildAdded(usersRef, (snapshot) => {
  //             const addedUser = snapshot.val();
  //             console.log("Room:\t user_added: ", addedUser);
  //           });

  //           onChildRemoved(
  //             usersRef,
  //             (snapshot) => {
  //               const removedUser = snapshot.val();
  //               console.log("Room:\t user_removed: ", removedUser);
  //             },
  //             () => {
  //               // Handle case when the whole room is removed from Firebase
  //             }
  //           );

  //           onChildChanged(usersRef, (snapshot) => {
  //             const changedUser = snapshot.val();
  //             console.log("Room:\t user_changed: ", changedUser);
  //           });
  //         } else {
  //           console.log("Firebase: Disconnected");
  //           off(usersRef);
  //         }
  //       });
  //     };
  //     fetchIp();
  //   }
  // }, [id]);

  // useEffect(() => {
  //   if (peerConnection) {
  //     peerConnection.ondatachannel = (event) => {
  //       const channel = event.channel;

  //       channel.onmessage = (e) => {
  //         try {
  //           const metadata = JSON.parse(e.data);
  //           setType(metadata.type);
  //           setName(metadata.name);
  //           setProgress(0);
  //         } catch (error) {
  //           if (e.data === "done") {
  //             const blob = new Blob(receivedChunks, { type: fileType });
  //             setFileUrl(URL.createObjectURL(blob));
  //           } else {
  //             receivedChunks.push(e.data);
  //             setReceivedChunks([...receivedChunks]);
  //           }
  //         }
  //       };
  //     };
  //   }
  // }, [peerConnection, fileType]);

  // const sendFile = useCallback(
  //   async (file: File) => {
  //     if (peerConnection && signalingSocket) {
  //       // Open channel to send file
  //       const channel = peerConnection.createDataChannel("file");

  //       channel.onopen = () => {
  //         const reader = new FileReader();
  //         let offset = 0;
  //         const chunkSize = file.size > 10 * 1024 * 1024 ? 4 * 1024 : 16 * 1024;

  //         reader.onload = (e) => {
  //           if (e.target?.result) {
  //             channel.send(e.target.result as ArrayBuffer);
  //             offset += chunkSize;
  //             if (offset < file.size) {
  //               setProgress(Math.round((offset / file.size) * 100));
  //               readSlice(offset);
  //             } else {
  //               channel.send("done");
  //               setProgress(100);
  //             }
  //           }
  //         };

  //         const readSlice = (o: number) => {
  //           const slice = file.slice(o, o + chunkSize);
  //           reader.readAsArrayBuffer(slice);
  //         };

  //         channel.send(JSON.stringify({ name: file.name, type: file.type }));
  //         readSlice(0);
  //         console.log(peerConnection.sctp?.maxMessageSize);
  //       };

  //       // Send offer to signaling server
  //       const offer = await peerConnection.createOffer();
  //       await peerConnection.setLocalDescription(offer);
  //       signalingSocket.send(JSON.stringify({ type: "offer", sdp: offer.sdp }));
  //     }
  //   },
  //   [peerConnection, signalingSocket]
  // );

  return user ? (
    <main className="p-2">
      <h1 className="text-2xl">FiPi - File Sharing</h1>
      <InformationBox />
      <button className="border rounded-sm p-2" onClick={onCreateRoom}>
        Create Room
      </button>
      {/* <div>
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
      </div> */}
    </main>
  ) : (
    <div>Loading...</div>
  );
}
