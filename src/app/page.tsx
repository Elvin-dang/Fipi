"use client";

import Room from "./_components/Room/Room";
import { useGlobalStore } from "@/providers/globalStateProvider";

export default function Page() {
  const roomId = useGlobalStore((state) => state.roomId);

  return <Room roomId={roomId} type="public" />;
}
