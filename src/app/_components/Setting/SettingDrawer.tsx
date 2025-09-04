import ThemeSwitcher from "@/components/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useSettingStore } from "@/providers/settingStoreProvider";
import { Settings } from "lucide-react";
import React, { ReactNode } from "react";

type Props = {
  children?: ReactNode;
  id: string;
};

const SettingDrawer = ({ children, id }: Props) => {
  const { autoSave, setAutoSave } = useSettingStore((state) => state);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon" id={id}>
          <Settings />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>
              <div className="flex items-center justify-between">
                <p className="text-xl">Setting</p>
                <ThemeSwitcher />
              </div>
            </DrawerTitle>
            <DrawerDescription className="text-left">Room and system settings</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-2">
            <div className="flex items-top space-x-2 mt-2">
              <Checkbox
                id="auto-download"
                checked={autoSave}
                onCheckedChange={(checked) => setAutoSave(checked)}
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="auto-download" className="font-semibold">
                  Auto Download
                </Label>
                <p className="text-sm text-muted-foreground">
                  Instantly download after successfully receiving files
                </p>
              </div>
            </div>
            <Separator className="my-4" />
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
