import React from "react";
import Room from "../_components/Room/Room";
import { headers } from "next/headers";
import crypto from "crypto";

const Page = async () => {
  const headersList = await headers();

  const ip =
    headersList.get("X-Forwarded-For") ||
    headersList.get("X-Real-IP") ||
    headersList.get("cf-connecting-ip");
  // @ts-expect-error ip always exists
  const name = crypto.createHmac("md5", process.env.SECRET).update(ip).digest("hex");

  return <Room roomId={name} type="public" />;
};

export default Page;
