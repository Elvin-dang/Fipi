"use client";

import { useState } from "react";
import { v4 } from "uuid";
import { useRouter } from "next/navigation";
import { useGlobalStore } from "@/providers/globalStateProvider";
import dynamic from "next/dynamic";

const InformationBox = dynamic(() => import("@/app/_components/InformationBox"), {
  ssr: false,
});

export default function Home() {
  const user = useGlobalStore((state) => state.user);

  const router = useRouter();

  const onCreateRoom = () => {
    const roomID = v4();
    router.push(`/rooms/${roomID}`);
  };

  return user ? (
    <main className="p-2">
      <h1 className="text-2xl">FiPi - File Sharing</h1>
      <InformationBox />
      <button className="border rounded-sm p-2" onClick={onCreateRoom}>
        Start a room
      </button>
    </main>
  ) : (
    <div>Loading...</div>
  );
}
