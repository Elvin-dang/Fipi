import { Button } from "@/components/ui/button";
import { User } from "@/models/user";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {
  leaveRoom: (user: User) => void;
  user: User;
};

const LeavePrivateRoomButton = ({ leaveRoom, user }: Props) => {
  const router = useRouter();

  const onClick = () => {
    leaveRoom(user);
    router.replace(`/g`);
  };

  return (
    <Button
      onClick={onClick}
      className="w-full"
      effect="expandIcon"
      icon={LogOut}
      iconPlacement="right"
      variant="destructive"
    >
      Leave room
    </Button>
  );
};

export default LeavePrivateRoomButton;
