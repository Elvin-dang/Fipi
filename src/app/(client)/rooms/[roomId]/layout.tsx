import { Metadata } from "next";
import { ReactNode } from "react";

type Props = { children: ReactNode };

export const metadata: Metadata = {
  title: "Room",
  description: "Welcome to your private room! Anyone with the link can join instantly",
};

const Layout = ({ children }: Props) => {
  return children;
};

export default Layout;
