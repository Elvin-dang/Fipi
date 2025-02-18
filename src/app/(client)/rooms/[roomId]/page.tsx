import React from "react";
import Room from "../../_components/Room/Room";
import { validate } from "uuid";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    roomId: string;
  }>;
};

const Page = async ({ params }: Props) => {
  const { roomId } = await params;

  if (!validate(roomId)) {
    notFound();
  }

  return <Room roomId={roomId} type="private" />;
};

export default Page;
