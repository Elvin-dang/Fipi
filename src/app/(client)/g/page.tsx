import React from "react";
import Room from "../_components/Room/Room";

export const dynamic = "force-dynamic";

type Props = {};

const page = async (props: Props) => {
  const data = await fetch(`${process.env.URL}/room`);
  const { name } = await data.json();

  return <Room roomId={name} />;
};

export default page;
