import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { ReactNode } from "react";

type Props = {
  main: string;
  text: string;
  icon?: ReactNode;
  avatar: string;
};

const ToastText = ({ main, text, icon, avatar }: Props) => {
  return (
    <div className="flex gap-2 items-center">
      <Avatar className="size-8">
        <AvatarImage src={avatar} />
        <AvatarFallback>...</AvatarFallback>
      </Avatar>
      {icon}
      <p>
        <span className="font-bold">{main}</span> {text}
      </p>
    </div>
  );
};

export default ToastText;
