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
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { BadgeInfo, Dot, Package } from "lucide-react";
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
  roomId: string;
  type: "private" | "public";
};

const Room = ({ roomId, type }: Props) => {
  const [sendAll, setSendAll] = useState<ChangeEvent<HTMLInputElement>>();
  const [sendAllTime, setSendAllTime] = useState<number>();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const user = useGlobalStore((state) => state.user);
  const [users, setUsers] = useState<User[]>([]);

  const setMessage = useGlobalStore((state) => state.setMessage);

  const removePeerConnection = useGlobalStore((state) => state.removePeerConnection);

  useEffect(() => {
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
          setUsers((users) => [...users, addedUser]);
          console.log("Room:\t user_added: ", addedUser);
        });

        onChildRemoved(
          usersRef,
          (snapshot) => {
            const removedUser = snapshot.val();
            setUsers((users) => users.filter((u) => u.id !== removedUser.id));
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

        off(usersRef);
        off(receivedMessagesRef);
      }
    });
  }, []);

  const leaveRoom = (user: User) => {
    const dbRef = ref(db);
    const roomRef = child(dbRef, `rooms/${roomId}`);
    const usersRef = child(roomRef, "users");
    const userRef = child(usersRef, user.id);

    const messagesRef = child(dbRef, `rooms/${roomId}/messages`);
    const receivedMessagesRef = child(messagesRef, user.id);

    remove(userRef);
    remove(receivedMessagesRef);

    off(usersRef);
    off(receivedMessagesRef);
  };

  const openChooseFiles = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setSendAllTime(Date.now());
    setSendAll(e);
  };

  return (
    <Card className="w-[400px] max-w-[calc(100vw-32px)] m-auto">
      <CardHeader>
        <CardTitle>
          <div className="flex items-center justify-between">
            {type === "public" ? (
              <div className="flex items-end" id="t-21">
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
                <div className="flex items-end gap-2">
                  <span id="t-31">Room</span>
                  <SharingDrawer roomId={roomId} id="t-32" />
                </div>
              )
            )}
            <SettingDrawer id="t-setting">
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
          <Badge variant="outline" className="rounded-2xl pl-1 pr-3" id="t-num-user">
            <Dot className="text-green-500" strokeWidth={8} />
            {users.length}
          </Badge>
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-auto max-h-[calc(100dvh-290px)]">
        <div>
          {users.map((u) => (
            <UserListItem
              key={u.id}
              user={u}
              self={user}
              roomId={roomId}
              sendAllEvent={sendAll}
              sendAllTime={sendAllTime}
            />
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <input type="file" className="hidden" multiple ref={fileInputRef} onChange={onFileChange} />
        <Button className="w-full" onClick={openChooseFiles} id="t-send-all">
          Send to all <Package />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Room;
