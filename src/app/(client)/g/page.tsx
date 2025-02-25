import React from "react";
import Room from "../_components/Room/Room";

export const dynamic = "force-dynamic";

const Page = async () => {
  const url =
    process.env.NODE_ENV === "production"
      ? `https://${process.env.NEXT_PUBLIC_URL}/room`
      : `http://${process.env.NEXT_PUBLIC_URL}/room`;
  const data = await fetch(url, { cache: "no-store" });
  const jsonData = await data.json();

  return <Room roomId={jsonData.name} type="public" />;
};

export default Page;
