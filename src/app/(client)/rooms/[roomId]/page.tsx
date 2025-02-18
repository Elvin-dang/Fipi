import React from "react";
import Room from "../../_components/Room/Room";

type Props = {
  params: Promise<{
    roomId: string;
  }>;
};

const Page = async ({ params }: Props) => {
  const { roomId } = await params;

  return <Room roomId={roomId} type="private" />;
};

export default Page;
