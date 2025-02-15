import ThemeSwitcher from "@/components/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Settings } from "lucide-react";
import React, { ReactNode } from "react";

type Props = {
  children?: ReactNode;
};

const SettingDrawer = ({ children }: Props) => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Setting</DrawerTitle>
            <DrawerDescription>Room and system settings</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <ThemeSwitcher />
            {children}
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button>Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default SettingDrawer;
