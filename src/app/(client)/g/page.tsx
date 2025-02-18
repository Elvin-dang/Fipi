import React from "react";
import Room from "../_components/Room/Room";

export const dynamic = "force-dynamic";

const page = async () => {
  const data = await fetch(`${process.env.URL}/room`);
  const { name } = await data.json();

  return <Room roomId={name} />;
};

export default page;
