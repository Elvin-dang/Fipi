import { db } from "@/lib/firebase";
import { Payload } from "@/models/message";
import { child, push, ref } from "firebase/database";

export const sendMessage = (
  type: string,
  roomId: string,
  sender: string,
  receiver: string,
  payload: any
) => {
  const dbRef = ref(db);
  const messagesRef = child(dbRef, `rooms/${roomId}/messages`);
  const DestinationMessagesRef = child(messagesRef, receiver);

  push(DestinationMessagesRef, {
    type,
    sender,
    receiver,
    payload,
  });
};
