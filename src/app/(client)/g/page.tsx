"use client";

import React, { useEffect, useState } from "react";
import Room from "../_components/Room/Room";

export const dynamic = "force-dynamic";

const Page = () => {
  const [roomId, setRoomId] = useState<string>();

  useEffect(() => {
    const asyncTask = async () => {
      const data = await fetch(`/room`);
      const jsonData = await data.json();

      if (jsonData.name) setRoomId(jsonData.name);
    };
    asyncTask();
  }, []);

  return <Room roomId={roomId} type="public" />;
};

export default Page;
