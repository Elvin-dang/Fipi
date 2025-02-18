import { Button } from "@/components/ui/button";
import { User } from "@/models/user";
import { DoorOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { v4 } from "uuid";

type Props = {
  leaveRoom: (user: User) => void;
  user: User;
};

const CreatePrivateRoomButton = ({ leaveRoom, user }: Props) => {
  const router = useRouter();

  const onClick = () => {
    const room = v4();
    leaveRoom(user);
    router.replace(`/rooms/${room}`);
  };

  return (
    <Button
      onClick={onClick}
      className="w-full"
      effect="expandIcon"
      icon={DoorOpen}
      iconPlacement="right"
      variant="purple"
    >
      Create room
    </Button>
  );
};

export default CreatePrivateRoomButton;
