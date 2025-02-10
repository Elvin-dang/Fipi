import Loader from "@/components/Loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { User } from "@/models/user";
import { useGlobalStore } from "@/providers/globalStateProvider";
import { toFileSize } from "@/utils/fileSize";
import { sendMessage } from "@/utils/sendMessage";
import { Check, Paperclip, X } from "lucide-react";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";

type Props = {
  roomId: string;
  user: User;
  self: User;
};

const UserListItem = ({ user, self, roomId }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [fileInfo, setFileInfo] = useState<{ name: string; type: string; size: number }>();
  const [pendingRequest, setPendingRequest] = useState(false);

  const messages = useGlobalStore((state) => state.messages);

  useEffect(() => {
    const filteredMessages = messages.filter((m) => m.sender === user.id);

    for (const message of filteredMessages) {
      switch (message.type) {
        case "REQUEST":
          setFileInfo(message.payload.file);
          setIsOpen(true);
          break;
        case "ACCEPT":
          break;
        case "REJECT":
          break;
        default:
          break;
      }
    }
  }, [messages]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const openChooseFiles = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      sendMessage("REQUEST", roomId, self.id, user.id, {
        file: {
          name: e.target.files[0].name,
          type: e.target.files[0].type,
          size: e.target.files[0].size,
        },
      });

      setIsOpen(true);
      setPendingRequest(true);
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
        {self.id !== user.id && !pendingRequest && (
          <div>
            <input type="file" className="hidden" ref={fileInputRef} onChange={onFileChange} />
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
                <div className="flex gap-2">
                  <Separator orientation="vertical" className="h-18" />
                  <div className="flex flex-col gap-2">
                    <Button className="rounded-full h-9 w-9">
                      <Check />
                    </Button>
                    <Button className="rounded-full h-9 w-9" variant="destructive">
                      <X />
                    </Button>
                  </div>
                </div>
              </div>
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
      </CollapsibleContent>
    </Collapsible>
  );
};

export default UserListItem;
