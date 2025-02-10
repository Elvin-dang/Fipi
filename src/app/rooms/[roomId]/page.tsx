"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/lib/firebase";
import { useGlobalStore } from "@/providers/globalStateProvider";
import {
  child,
  onChildAdded,
  onChildChanged,
  onChildRemoved,
  onDisconnect,
  onValue,
  ref,
  set,
  off,
} from "firebase/database";
import React, { use, useEffect, useState } from "react";
import UserListItem from "./_components/UserListItem";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";

type Props = {
  params: Promise<{
    roomId: string;
  }>;
};

const page = ({ params }: Props) => {
  const { roomId } = use(params);

  const user = useGlobalStore((state) => state.user);
  const room = useGlobalStore((state) => state.room);

  const newRoom = useGlobalStore((state) => state.newRoom);
  const addNewUserToRoom = useGlobalStore((state) => state.addNewUserToRoom);
  const removeUserFromRoom = useGlobalStore((state) => state.removeUserFromRoom);

  const addMessage = useGlobalStore((state) => state.addMessage);

  useEffect(() => {
    if (user) {
      const dbRef = ref(db);
      const connectedRef = child(dbRef, ".info/connected");
      const roomRef = child(dbRef, `rooms/${roomId}`);
      const usersRef = child(roomRef, "users");
      const userRef = child(usersRef, user.id);

      const messagesRef = child(dbRef, `rooms/${roomId}/messages`);
      const receivedMessagesRef = child(messagesRef, user.id);

      console.log("Room:\t Connecting to: ", roomId);

      onValue(connectedRef, (snapshot) => {
        if (snapshot.val() === true) {
          if (!room) newRoom(roomId);
          console.log("Firebase: (Re)Connected");

          onDisconnect(userRef).remove();
          onDisconnect(receivedMessagesRef).remove();

          set(userRef, user)
            .then(() => {
              console.log("Firebase: User added to the room");
            })
            .catch((error) => {
              console.warn("Firebase: Adding user to the room failed: ", error);
            });

          // Room section
          onChildAdded(usersRef, (snapshot) => {
            const addedUser = snapshot.val();
            addNewUserToRoom(addedUser);
            console.log("Room:\t user_added: ", addedUser);
          });

          onChildRemoved(
            usersRef,
            (snapshot) => {
              const removedUser = snapshot.val();
              removeUserFromRoom(removedUser);
              console.log("Room:\t user_removed: ", removedUser);
            },
            () => {
              // Handle case when the whole room is removed from Firebase
            }
          );

          onChildChanged(usersRef, (snapshot) => {
            const changedUser = snapshot.val();
            console.log("Room:\t user_changed: ", changedUser);
          });

          // Message section
          onChildAdded(receivedMessagesRef, (snapshot) => {
            const addedMessage = snapshot.val();
            addMessage(addedMessage);
          });
        } else {
          console.log("Firebase: Disconnected");
          off(usersRef);
          off(receivedMessagesRef);
        }
      });
    }
  }, [user]);

  return room && user ? (
    <div className="">
      <Card className="w-[350px] m-auto">
        <CardHeader>
          <CardTitle>Lobby</CardTitle>
          <CardDescription>{room.users.length} User(s)</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            {room.users.map((u) => (
              <UserListItem key={u.id} user={u} self={user} roomId={roomId} />
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">
            Send to all <Package />
          </Button>
        </CardFooter>
      </Card>
    </div>
  ) : (
    <p>Loading room...</p>
  );
};

export default page;
