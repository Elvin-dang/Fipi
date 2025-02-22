import { ReactNode } from "react";

export const DrawerCSSProvider = ({ children }: { children: ReactNode }) => {
  return (
    <div data-vaul-drawer-wrapper="">
      <div className="relative flex flex-col bg-background p-4 h-dvh">{children}</div>
    </div>
  );
};
