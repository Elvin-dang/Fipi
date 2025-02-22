import { Metadata } from "next";
import { ReactNode } from "react";

type Props = { children: ReactNode };

export const metadata: Metadata = {
  title: "Lobby",
  description:
    "A shared virtual space where users connected to the same network can discover and see each other",
};

const Layout = ({ children }: Props) => {
  return children;
};

export default Layout;
