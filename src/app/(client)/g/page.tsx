import React from "react";
import Room from "../_components/Room/Room";

export const dynamic = "force-dynamic";

const Page = async () => {
  const data = await fetch(`http://localhost:3000/room`);
  const jsonData = await data.json();

  return <Room roomId={jsonData.name} type="public" />;
};

export default Page;
