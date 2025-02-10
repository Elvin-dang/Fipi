"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

  useEffect(() => {
    if (user) {
      const dbRef = ref(db);
      const connectedRef = child(dbRef, ".info/connected");
      const roomRef = child(dbRef, `rooms/${roomId}`);
      const usersRef = child(roomRef, "users");
      const userRef = child(usersRef, user.id);

      console.log("Room:\t Connecting to: ", roomId);

      onValue(connectedRef, (snapshot) => {
        if (snapshot.val() === true) {
          if (!room) newRoom(roomId);
          console.log("Firebase: (Re)Connected");

          onDisconnect(userRef).remove();

          set(userRef, user)
            .then(() => {
              console.log("Firebase: User added to the room");
            })
            .catch((error) => {
              console.warn("Firebase: Adding user to the room failed: ", error);
            });

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
        } else {
          console.log("Firebase: Disconnected");
          off(usersRef);
        }
      });
    }
  }, [user]);

  return room ? (
    <div className="">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>{room.users.length} user(s) in the room</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            {room.users.map((u) => (
              <UserListItem key={u.id} user={u} self={user} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  ) : (
    <p>Loading room...</p>
  );
};

export default page;
