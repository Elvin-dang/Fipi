import React from "react";
import Room from "../_components/Room/Room";

export const dynamic = "force-dynamic";

const page = async () => {
  const url = process.env.VERCEL_URL
    ? "https://" + process.env.VERCEL_URL
    : "http://" + process.env.URL;
  const data = await fetch(`${url}/room`);
  const { name } = await data.json();

  return <Room roomId={name} />;
};

export default page;
