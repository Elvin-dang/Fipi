import { ReactNode } from "react";

export const DrawerCSSProvider = ({ children }: { children: ReactNode }) => {
  return (
    <div data-vaul-drawer-wrapper="">
      <div className="relative flex flex-col bg-background h-dvh">{children}</div>
    </div>
  );
};
