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
  remove,
} from "firebase/database";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BadgeInfo, Dot, Package } from "lucide-react";
import { sendMessage } from "@/utils/sendMessage";
import Spinner from "@/components/Spinner";
import UserListItem from "./UserListItem";
import SettingDrawer from "../Setting/SettingDrawer";
import CreatePrivateRoomButton from "./CreatePrivateRoomButton";
import LeavePrivateRoomButton from "./LeavePrivateRoomButton";
import { User } from "@/models/user";
import {
  HybridTooltip,
  HybridTooltipContent,
  HybridTooltipTrigger,
} from "@/components/HybridTooltip";
import { Badge } from "@/components/ui/badge";
import SharingDrawer from "./SharingDrawer";

type Props = {
  roomId?: string;
  type: "private" | "public";
};

const Room = ({ roomId, type }: Props) => {
  const user = useGlobalStore((state) => state.user);
  const room = useGlobalStore((state) => state.room);

  const newRoom = useGlobalStore((state) => state.newRoom);
  const getRoom = useGlobalStore((state) => state.getRoom);
  const addNewUserToRoom = useGlobalStore((state) => state.addNewUserToRoom);
  const removeUserFromRoom = useGlobalStore((state) => state.removeUserFromRoom);
  const clearRoom = useGlobalStore((state) => state.clearRoom);

  const setMessage = useGlobalStore((state) => state.setMessage);

  const removePeerConnection = useGlobalStore((state) => state.removePeerConnection);

  useEffect(() => {
    if (user && roomId) {
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
              removePeerConnection(removedUser.id);
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
            setMessage(addedMessage);
          });
        } else {
          console.log("Firebase: Disconnected");

          leaveRoom(user);
        }
      });
    }
  }, [user, roomId]);

  const leaveRoom = (user: User) => {
    const dbRef = ref(db);
    const roomRef = child(dbRef, `rooms/${roomId}`);
    const usersRef = child(roomRef, "users");
    const userRef = child(usersRef, user.id);

    const messagesRef = child(dbRef, `rooms/${roomId}/messages`);
    const receivedMessagesRef = child(messagesRef, user.id);

    const room = getRoom();

    if (room) {
      room.users.forEach((u) => sendMessage("LEAVE", room.id, user.id, u.id, {}));

      remove(userRef);
      remove(receivedMessagesRef);

      off(usersRef);
      off(receivedMessagesRef);

      clearRoom();
    }
  };

  return roomId && room && user ? (
    <Card className="w-[400px] max-w-[100vw] m-auto">
      <CardHeader>
        <CardTitle>
          <div className="flex items-center justify-between">
            {type === "public" ? (
              <div className="flex items-end">
                <span>Lobby</span>
                <HybridTooltip>
                  <HybridTooltipTrigger className="ml-2">
                    <BadgeInfo className="text-gray-500 size-4" />
                  </HybridTooltipTrigger>
                  <HybridTooltipContent>
                    A shared virtual space where users connected to the same network can discover
                    and see each other
                  </HybridTooltipContent>
                </HybridTooltip>
              </div>
            ) : (
              type === "private" && (
                <div className="flex items-end">
                  <span>Room</span>
                  <SharingDrawer roomId={roomId} />
                </div>
              )
            )}
            <SettingDrawer>
              {type === "public" ? (
                <>
                  <CreatePrivateRoomButton leaveRoom={leaveRoom} user={user} />
                </>
              ) : (
                type === "private" && (
                  <>
                    <LeavePrivateRoomButton leaveRoom={leaveRoom} user={user} />
                  </>
                )
              )}
            </SettingDrawer>
          </div>
        </CardTitle>
        <CardDescription>
          <Badge variant="outline" className="rounded-2xl pl-1 pr-3">
            <Dot className="text-green-500" strokeWidth={8} />
            {room.users.length}
          </Badge>
        </CardDescription>
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
  ) : (
    <Spinner />
  );
};

export default Room;
