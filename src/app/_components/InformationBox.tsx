"use client";

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
          <img className="rounded-full" src={user.avatar} />
          <span>{user.name}</span>
        </div>
      </div>
    )
  );
};

export default InformationBox;
