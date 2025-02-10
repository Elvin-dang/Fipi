import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User } from "@/models/user";
import React from "react";

type Props = {
  user: User;
  self?: User;
};

const UserListItem = ({ user, self }: Props) => {
  return (
    <div className="flex items-center gap-2 justify-between py-2">
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src={user.avatar} />
          <AvatarFallback>...</AvatarFallback>
        </Avatar>
        <p className="font-medium">{user.name}</p>
      </div>
      {self?.id !== user.id && (
        <div>
          <Button variant="outline">Send</Button>
        </div>
      )}
    </div>
  );
};

export default UserListItem;
