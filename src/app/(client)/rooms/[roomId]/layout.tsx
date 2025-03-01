import { Metadata } from "next";
import { ReactNode } from "react";

type Props = { children: ReactNode };

export const metadata: Metadata = {
  title: "Room",
  description: "Start transferring files securely",
};

const Layout = ({ children }: Props) => {
  return children;
};

export default Layout;
