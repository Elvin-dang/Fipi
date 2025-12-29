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
  onChildRemoved,
  onDisconnect,
  onValue,
  ref,
  set,
  off,
  remove,
} from "firebase/database";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BadgeInfo, Car, Dot, Package } from "lucide-react";
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
  const [pendingRespondMap, setPendingRespondMap] = useState<Record<string, boolean>>({});
  const pendingRespondCount = Object.values(pendingRespondMap).filter(Boolean).length;
  const openCallbacks = useRef<Record<string, (open?: boolean) => void>>({});
  const [tabValue, setTabValue] = useState<"people" | "clipboard">("people");

  // Shared clipboard state
  const [clipboardText, setClipboardText] = useState<string>("");
  const [editingClipboard, setEditingClipboard] = useState<string>("");
  const [clipboardUpdatedById, setClipboardUpdatedById] = useState<string | null>(null);
  const [clipboardUpdatedByName, setClipboardUpdatedByName] = useState<string | null>(null);
  const [clipboardUpdatedAt, setClipboardUpdatedAt] = useState<number | null>(null);
  const writeClipboardTimeout = useRef<any>(null);
  const MAX_CLIPBOARD_LENGTH = 5000;

  const setMessage = useGlobalStore((state) => state.setMessage);

  const removePeerConnection = useGlobalStore((state) => state.removePeerConnection);

  useEffect(() => {
    const dbRef = ref(db);
    const connectedRef = child(dbRef, ".info/connected");
    const roomRef = child(dbRef, `rooms/${roomId}`);
    const usersRef = child(roomRef, "users");
    const userRef = child(usersRef, user.id);
    const clipboardRef = child(roomRef, "sharedClipboard");

    const messagesRef = child(dbRef, `rooms/${roomId}/messages`);
    const receivedMessagesRef = child(messagesRef, user.id);

    // console.log("Room:\t Connecting to: ", roomId);

    onValue(connectedRef, (snapshot) => {
      if (snapshot.val() === true) {
        // console.log("Firebase: (Re)Connected");

        onDisconnect(userRef).remove();
        onDisconnect(receivedMessagesRef).remove();

        set(userRef, user)
          .then(() => {
            // console.log("Firebase: User added to the room");
          })
          .catch((error) => {
            console.warn("Firebase: Adding user to the room failed: ", error);
          });

        // Room section
        onChildAdded(usersRef, (snapshot) => {
          const addedUser = snapshot.val();
          setUsers((users) => [...users, addedUser]);
          // console.log("Room:\t user_added: ", addedUser);
        });

        onChildRemoved(
          usersRef,
          (snapshot) => {
            const removedUser = snapshot.val();
            setUsers((users) => users.filter((u) => u.id !== removedUser.id));
            removePeerConnection(removedUser.id);
            // console.log("Room:\t user_removed: ", removedUser);
          },
          () => {
            // Handle case when the whole room is removed from Firebase
          }
        );

        // onChildChanged(usersRef, (snapshot) => {
        //   const changedUser = snapshot.val();
        //   console.log("Room:\t user_changed: ", changedUser);
        // });

        // Message section
        onChildAdded(receivedMessagesRef, (snapshot) => {
          const addedMessage = snapshot.val();
          setMessage(addedMessage);
        });

        // Shared clipboard (real-time)
        onValue(clipboardRef, (snapshot) => {
          const val = snapshot.val();
          if (val && typeof val.text === "string") {
            setClipboardText(val.text);
            setEditingClipboard(val.text);
            setClipboardUpdatedById(val.updatedById ?? null);
            setClipboardUpdatedByName(val.updatedByName ?? null);
            setClipboardUpdatedAt(val.updatedAt ?? null);
          } else {
            setClipboardText("");
            setEditingClipboard("");
            setClipboardUpdatedById(null);
            setClipboardUpdatedByName(null);
            setClipboardUpdatedAt(null);
          }
        });
      } else {
        // console.log("Firebase: Disconnected");

        off(usersRef);
        off(receivedMessagesRef);
        off(clipboardRef);
      }
    });

    return () => {
      // cleanup any pending write
      if (writeClipboardTimeout.current) {
        clearTimeout(writeClipboardTimeout.current);
      }
      try {
        off(child(ref(db), `rooms/${roomId}/users`));
        off(child(ref(db), `rooms/${roomId}/messages/${user.id}`));
        off(child(ref(db), `rooms/${roomId}/sharedClipboard`));
      } catch (e) {
        /* ignore */
      }
    };
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

  const handleClipboardChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value.slice(0, MAX_CLIPBOARD_LENGTH);
    setEditingClipboard(val);

    // debounce writes to Firebase
    if (writeClipboardTimeout.current) clearTimeout(writeClipboardTimeout.current);
    writeClipboardTimeout.current = setTimeout(() => {
      try {
        const dbRef2 = ref(db);
        const roomRef2 = child(dbRef2, `rooms/${roomId}`);
        const sharedRef = child(roomRef2, "sharedClipboard");
        set(sharedRef, {
          text: val,
          updatedById: user.id,
          updatedByName: user.name,
          updatedAt: Date.now(),
        }).catch(() => {
          toast.error("Failed to update shared clipboard");
        });
      } catch (err) {
        toast.error("Failed to update shared clipboard");
      }
    }, 600);
  };

  const handleCopySharedClipboard = async () => {
    try {
      await navigator.clipboard.writeText(clipboardText || editingClipboard || "");
      toast.success("Shared clipboard copied", { duration: 2000 });
    } catch (e) {
      toast.error("Failed to copy");
    }
  };

  const handleClearSharedClipboard = () => {
    try {
      const dbRef2 = ref(db);
      const roomRef2 = child(dbRef2, `rooms/${roomId}`);
      const sharedRef = child(roomRef2, "sharedClipboard");
      set(sharedRef, { text: "", updatedBy: user.id, updatedAt: Date.now() });
      toast.success("Shared clipboard cleared", { duration: 1500 });
    } catch (e) {
      toast.error("Failed to clear shared clipboard");
    }
  };

  const openChooseFiles = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setSendAllTime(Date.now());
    setSendAll(e);
  };

  return (
    <Tabs value={tabValue} onValueChange={(v) => setTabValue(v as any)}>
      <Card className="w-[400px] max-w-[calc(100vw-64px)] m-auto">
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
          <CardDescription className="flex items-center justify-between">
            <Badge variant="outline" className="rounded-2xl pl-1 pr-3" id="t-num-user">
              <Dot className="text-green-500" strokeWidth={8} />
              {users.length}
            </Badge>

            <TabsList>
              <TabsTrigger value="people">
                <div className="flex items-center gap-2">
                  <span>People</span>
                  {pendingRespondCount > 0 && (
                    <Badge variant="destructive">{pendingRespondCount}</Badge>
                  )}
                </div>
              </TabsTrigger>
              <TabsTrigger value="clipboard">Shared clipboard</TabsTrigger>
            </TabsList>
          </CardDescription>
        </CardHeader>

        <TabsContent value="people">
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
                  onPendingRespondChange={(userId, pending) => {
                    setPendingRespondMap((prev) => ({ ...prev, [userId]: pending }));
                  }}
                  registerOpenCallback={(userId, fn) => {
                    openCallbacks.current[userId] = fn;
                  }}
                />
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <input
              type="file"
              className="hidden"
              multiple
              ref={fileInputRef}
              onChange={onFileChange}
            />
            <Button className="w-full" onClick={openChooseFiles} id="t-send-all">
              Send to all <Package />
            </Button>
          </CardFooter>
        </TabsContent>
        {/* Floating pending notifications when user is on clipboard tab */}
        {tabValue === "clipboard" && pendingRespondCount > 0 && (
          <div className="fixed right-4 bottom-4 z-50 space-y-2">
            {Object.entries(pendingRespondMap)
              .filter(([, v]) => v)
              .map(([uid]) => {
                const u = users.find((x) => x.id === uid);
                if (!u) return null;
                return (
                  <div key={uid} className="bg-white rounded shadow p-3 w-64">
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <div className="font-medium">{u.name}</div>
                        <div className="text-xs text-gray-500">sent a file</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            setTabValue("people");
                            setTimeout(() => {
                              const fn = openCallbacks.current[uid];
                              if (fn) fn(true);
                              const el = document.getElementById(`user-${uid}`);
                              if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                            }, 200);
                          }}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
        <TabsContent value="clipboard">
          <CardContent className="overflow-auto max-h-[calc(100dvh-290px)]">
            <div className="flex flex-col gap-3">
              {clipboardUpdatedById && (
                <div className="text-xs text-gray-400">
                  Last updated by {clipboardUpdatedByName}{" "}
                  {clipboardUpdatedAt
                    ? `at ${new Date(clipboardUpdatedAt).toLocaleTimeString()}`
                    : ""}
                </div>
              )}
              <Textarea
                value={editingClipboard}
                onChange={handleClipboardChange}
                maxLength={MAX_CLIPBOARD_LENGTH}
                placeholder="Shared clipboard for this room. Edits sync in real time to others."
                className="min-h-[180px] mt-1"
              />
            </div>
          </CardContent>
          <CardFooter className="flex gap-2 items-center justify-between">
            <div className="text-sm text-gray-500">
              {(editingClipboard || clipboardText).length}/{MAX_CLIPBOARD_LENGTH}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCopySharedClipboard}>
                Copy
              </Button>
              <Button variant="ghost" onClick={handleClearSharedClipboard}>
                Clear
              </Button>
            </div>
          </CardFooter>
        </TabsContent>
      </Card>
    </Tabs>
  );
};

export default Room;
