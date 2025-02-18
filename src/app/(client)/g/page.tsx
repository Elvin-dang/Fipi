"use client";

import React, { useEffect, useState } from "react";
import Room from "../_components/Room/Room";

export const dynamic = "force-dynamic";

const Page = () => {
  const [roomId, setRoomId] = useState<string>();

  useEffect(() => {
    const asyncTask = async () => {
      //   const url = process.env.VERCEL_URL
      // ? "https://" + process.env.VERCEL_URL
      // : "http://" + process.env.URL;
      const data = await fetch(`/room`);
      const jsonData = await data.json();

      if (jsonData.name) setRoomId(jsonData.name);

      console.log("G CLIENT", jsonData);
    };
    asyncTask();
  }, []);

  return <Room roomId={roomId} />;
};

export default Page;
