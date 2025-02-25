"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGlobalStore } from "@/providers/globalStateProvider";
import Link from "next/link";
import React from "react";

const InformationBox = () => {
  const user = useGlobalStore((state) => state.user);

  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex items-center flex-col gap-20">
        <span className="relative flex size-40">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full border-sky-400 bg-sky-400 border opacity-75" />
          <Link href="/g" className="h-full w-full" replace>
            <Avatar className="h-full w-full animate-small-ping cursor-pointer">
              <AvatarImage src={user.avatar} alt={user.avatar} id="t-11" />
              <AvatarFallback>...</AvatarFallback>
            </Avatar>
          </Link>
        </span>
        <span
          className={`font-bold text-xl relative w-[max-content] font-mono before:absolute before:inset-0 before:animate-[typewriter_2s_steps(var(--tw-typewrite))_forwards] before:bg-white after:absolute after:bottom-1 after:left-0 after:w-[0.6em] after:h-[0.125em] after:animate-[typewriter_2s_steps(var(--tw-typewrite))_forwards,blink_1s_steps(var(--tw-blink))_infinite_2s] after:bg-black`}
          style={
            {
              "--tw-typewrite": `${user.name.length}`,
              "--tw-blink": `${user.name.length}`,
            } as React.CSSProperties
          }
        >
          {user.name}
        </span>
      </div>
    </div>
  );
};

export default InformationBox;
