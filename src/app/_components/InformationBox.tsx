"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGlobalStore } from "@/providers/globalStateProvider";
import React from "react";

type Props = {};

const InformationBox = (props: Props) => {
  const user = useGlobalStore((state) => state.user);

  return (
    user && (
      <div>
        <h1>Your ID: {user.id}</h1>
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={user.avatar} />
            <AvatarFallback>...</AvatarFallback>
          </Avatar>
          <span>{user.name}</span>
        </div>
      </div>
    )
  );
};

export default InformationBox;
