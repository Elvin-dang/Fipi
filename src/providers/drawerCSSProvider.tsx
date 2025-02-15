import { ReactNode } from "react";

export const DrawerCSSProvider = ({ children }: { children: ReactNode }) => {
  return (
    <div data-vaul-drawer-wrapper="">
      <div className="relative flex min-h-screen flex-col bg-background p-2">{children}</div>
    </div>
  );
};
