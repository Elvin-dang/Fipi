import Loader from "@/components/Loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Message } from "@/models/message";
import { User } from "@/models/user";
import { useGlobalStore } from "@/providers/globalStateProvider";
import { downloadFile, reduceFiles, toFileSize } from "@/utils/file";
import { sendMessage } from "@/utils/sendMessage";
import { Check, FileCheck2, FileX2, Paperclip, Smile, X } from "lucide-react";
import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import ToastText from "./ToastText";
import { useSettingStore } from "@/providers/settingStoreProvider";

type Props = {
  roomId: string;
  user: User;
  self: User;
};

const UserListItem = ({ user, self, roomId }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const [fileInfo, setFileInfo] = useState<{
    name: string;
    type: string;
    size: number;
    chunkSize: number;
  }>();

  const [pendingRequest, setPendingRequest] = useState(false);
  const [pendingRespond, setPendingRespond] = useState(false);

  const dataChannel = useRef<RTCDataChannel>(undefined);
  const receivedDataChannel = useRef<RTCDataChannel>(undefined);

  const receivedChunks = useRef<Blob[]>([]);

  const [fileSendingProgress, setFileSendingProgress] = useState(0);
  const [fileReceivingProgress, setFileReceivingProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInfoRef = useRef<{
    name: string;
    type: string;
    size: number;
    chunkSize: number;
  }>(undefined);

  const message = useGlobalStore((state) => state.message);
  const getAutoSave = useSettingStore((state) => state.getAutoSave);

  const createPeerConnection = useGlobalStore((state) => state.createPeerConnection);
  const getPeerConnection = useGlobalStore((state) => state.getPeerConnection);

  useEffect(() => {
    const asyncTask = async () => {
      let peerConnection;
      if (message && message.sender === user.id) {
        switch (message.type) {
          case "OFFER":
            peerConnection = createPeerConnection(message.sender);

            peerConnection.onicecandidate = (event) => {
              if (event.candidate) {
                const c = event.candidate;
                const candidate = "toJSON" in c ? c.toJSON() : c;
                sendMessage("CANDIDATE", roomId, self.id, user.id, {
                  candidate,
                });
              }
            };

            receiveFileDataChannel(peerConnection);

            await peerConnection.setRemoteDescription(
              new RTCSessionDescription(message.payload.sdp)
            );

            peerConnection.setRemoteDescription(new RTCSessionDescription(message.payload.sdp));
            const answer = await peerConnection.createAnswer();
            peerConnection.setLocalDescription(answer);

            sendMessage("ANSWER", roomId, self.id, user.id, {
              sdp: answer,
            });
            break;
          case "ANSWER":
            peerConnection = getPeerConnection(message.sender);
            if (peerConnection) {
              peerConnection.setRemoteDescription(message.payload.sdp);
            }
            break;
          case "CANDIDATE":
            peerConnection = getPeerConnection(message.sender);
            if (peerConnection) {
              await peerConnection.addIceCandidate(new RTCIceCandidate(message.payload.candidate));
            }
            break;
          case "FILE_COMPLETE":
            setFileSendingProgress(0);
            setIsOpen(false);
            break;
          default:
            break;
        }
      }
    };

    asyncTask();
  }, [message]);

  const openChooseFiles = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = await reduceFiles(e.target.files, user.id);

      let peerConnection = getPeerConnection(user.id);

      if (!peerConnection) {
        peerConnection = createPeerConnection(user.id);

        receiveFileDataChannel(peerConnection);
        sendingFileDataChannel(file, peerConnection);

        peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            const c = event.candidate;
            const candidate = "toJSON" in c ? c.toJSON() : c;
            sendMessage("CANDIDATE", roomId, self.id, user.id, {
              candidate,
            });
          }
        };

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        sendMessage("OFFER", roomId, self.id, user.id, {
          sdp: offer,
        });
      } else {
        sendingFileDataChannel(file, peerConnection);
      }
    }
  };

  const sendingFileDataChannel = useCallback((file: File, peerConnection: RTCPeerConnection) => {
    const channel = peerConnection.createDataChannel(`file`);
    dataChannel.current = channel;

    channel.onopen = () => {
      channel.send(
        JSON.stringify({
          type: "REQUEST",
          payload: {
            file: {
              name: file.name,
              type: file.type,
              size: file.size,
              chunkSize: file.size > 10 * 1024 * 1024 ? 4 * 1024 : 16 * 1024,
            },
          },
        })
      );

      setPendingRequest(true);
      setIsOpen(true);
    };

    channel.onmessage = (event) => {
      const message: Message = JSON.parse(event.data);

      switch (message.type) {
        case "ACCEPT":
          setPendingRequest(false);
          toast(
            <ToastText main={user.name} text="accepted the file" icon={<FileCheck2 size={16} />} />
          );

          const sendQueue: number[] = [];
          let isSending = false;

          const reader = new FileReader();
          let offset = 0;
          const chunkSize = file.size > 10 * 1024 * 1024 ? 4 * 1024 : 16 * 1024;

          reader.onload = (e) => {
            if (e.target?.result) {
              channel.send(e.target.result as ArrayBuffer);
              offset += chunkSize;
              if (offset < file.size) {
                setFileSendingProgress(Math.round((offset / file.size) * 100));
                queueData(offset);
              } else {
                setFileSendingProgress(100);
                channel.close();
                toast.success(`File has been sent to ${user.name}`);
              }
            }
          };

          const readSlice = (o: number) => {
            const slice = file.slice(o, o + chunkSize);
            reader.readAsArrayBuffer(slice);
          };

          const sendNext = () => {
            if (isSending || sendQueue.length === 0) return;

            if (channel.bufferedAmount < 65536) {
              isSending = true;
              const data = sendQueue.shift();
              if (data !== undefined) readSlice(data);
              isSending = false;

              sendNext();
            } else {
              setTimeout(sendNext, 50);
            }
          };

          const queueData = (data: number) => {
            sendQueue.push(data);
            sendNext();
          };

          queueData(0);
          break;
        case "REJECT":
          setPendingRequest(false);
          setIsOpen(false);
          toast(
            <ToastText main={user.name} text="rejected the file" icon={<FileX2 size={16} />} />
          );
          break;
        default:
          break;
      }
    };
  }, []);

  const receiveFileDataChannel = useCallback(
    (peerConnection: RTCPeerConnection) => {
      peerConnection.ondatachannel = (event) => {
        const receivedChannel = event.channel;
        receivedDataChannel.current = receivedChannel;

        receivedChannel.binaryType = "arraybuffer";

        receivedChannel.onmessage = (event) => {
          try {
            const message: Message = JSON.parse(event.data);

            switch (message.type) {
              case "REQUEST":
                setPendingRespond(true);
                setFileInfo(message.payload.file);
                fileInfoRef.current = message.payload.file;
                setIsOpen(true);
                break;
              default:
                break;
            }
          } catch (e) {
            if (e instanceof SyntaxError) {
              receivedChunks.current.push(event.data);
              if (fileInfoRef.current) {
                setFileReceivingProgress(
                  Math.round(
                    ((receivedChunks.current.length * fileInfoRef.current.chunkSize) /
                      fileInfoRef.current.size) *
                      100
                  )
                );
              }
            }
          }
        };

        receivedChannel.onclose = () => {
          const resetState = () => {
            setIsOpen(false);
            receivedChunks.current = [];
            setFileInfo(undefined);
            fileInfoRef.current = undefined;
            setFileReceivingProgress(0);
            receivedDataChannel.current = undefined;

            sendMessage("FILE_COMPLETE", roomId, self.id, user.id, {});
          };

          const download = (blob: Blob) => {
            if (fileInfoRef.current) downloadFile(blob, fileInfoRef.current.name);
            resetState();
          };

          if (fileInfoRef.current) {
            setFileReceivingProgress(100);
            const receivedBlob = new Blob(receivedChunks.current);
            if (getAutoSave()) {
              download(receivedBlob);
            } else {
              toast(user.name, {
                description: fileInfoRef.current.name,
                duration: Infinity,
                action: {
                  label: "Download",
                  onClick: () => {
                    download(receivedBlob);
                  },
                },
                onDismiss: () => resetState(),
              });
            }
          }
        };
      };
    },
    [getAutoSave]
  );

  const onAccept = async () => {
    setPendingRespond(false);

    if (receivedDataChannel.current) {
      receivedDataChannel.current.send(JSON.stringify({ type: "ACCEPT" }));
    }
  };

  const onReject = () => {
    setPendingRespond(false);
    setFileInfo(undefined);
    setIsOpen(false);

    if (receivedDataChannel.current) {
      receivedDataChannel.current.send(JSON.stringify({ type: "REJECT" }));
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex items-center gap-2 justify-between py-2">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={user.avatar} />
            <AvatarFallback>...</AvatarFallback>
          </Avatar>
          <p className="font-medium">
            {user.name} {self.id === user.id && <span className="font-semibold">(You)</span>}
          </p>
        </div>
        {self.id !== user.id && !isOpen && (
          <div>
            <input
              type="file"
              className="hidden"
              multiple
              ref={fileInputRef}
              onChange={onFileChange}
            />
            <Button variant="outline" onClick={openChooseFiles}>
              Send <Paperclip />
            </Button>
          </div>
        )}
      </div>
      <CollapsibleContent>
        {fileInfo && (
          <Card>
            <CardContent className="p-2">
              <div className="flex gap-2 justify-between">
                <div className="flex flex-col gap-2 justify-between flex-1">
                  <h1 className="font-semibold">{fileInfo.name}</h1>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">{fileInfo.type}</span>
                    <span className="text-sm text-gray-600">{toFileSize(fileInfo.size)}</span>
                  </div>
                </div>
                {pendingRespond && (
                  <div className="flex gap-2 items-center">
                    <Separator orientation="vertical" className=" self-stretch" />
                    <div className="flex flex-col gap-2">
                      <Button className="rounded-full h-9 w-9" onClick={onAccept}>
                        <Check />
                      </Button>
                      <Button
                        className="rounded-full h-9 w-9"
                        variant="destructive"
                        onClick={onReject}
                      >
                        <X />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              {fileReceivingProgress > 0 && (
                <div className="mt-1">
                  <Progress value={fileReceivingProgress} />
                </div>
              )}
            </CardContent>
          </Card>
        )}
        {pendingRequest && (
          <Card className="mt-2">
            <CardHeader className="p-2">
              <CardTitle>
                <div className="flex gap-2 justify-between">
                  Waiting for response <Loader className="h-4 w-4" />
                </div>
              </CardTitle>
            </CardHeader>
          </Card>
        )}
        {fileSendingProgress !== 0 && (
          <Card className="mt-2">
            <CardHeader className="p-2">
              <CardTitle>
                <div className="flex gap-2 justify-between">
                  {fileSendingProgress < 100 ? (
                    <div className="w-full">
                      <p className="mb-2">Sending...</p>
                      <Progress value={fileSendingProgress} />
                    </div>
                  ) : (
                    <div className="flex justify-between items-center w-full">
                      <p>File sent</p>
                      <Smile />
                    </div>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
          </Card>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default UserListItem;
