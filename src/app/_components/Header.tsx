"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Binoculars, Paperclip, Settings, ShieldQuestion } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Config, driver } from "driver.js";
import "driver.js/dist/driver.css";
import { usePathname } from "next/navigation";

const accordionItems = [
  {
    value: "item-1",
    trigger: "Sharing files between devices in a local network",
    content: (
      <div className="leading-8">
        To share a file with another device on the same local network, open Fipi (e.g.,{" "}
        <Button asChild variant="link" className="p-0">
          <Link href="http://fipi.live/g" target="_blank" className="font-semibold">
            http://fipi.live/g
          </Link>
        </Button>
        ) on both devices. Simply click on{" "}
        <Button variant="outline" size="sm">
          Send <Paperclip />
        </Button>{" "}
        to send a file to the recipient. The transfer will begin once the recipient accepts it.
      </div>
    ),
  },
  {
    value: "item-2",
    trigger: "Sending files across different networks",
    content: (
      <div className="leading-8">
        To share a file with a device on a different network, click{" "}
        <Button variant="outline" size="icon">
          <Settings />
        </Button>{" "}
        in the top-right corner, then select <span className="font-semibold">Create Room</span>{" "}
        button. You will be redirected to a unique room — share the link with your recipient so they
        can join and start transferring files.
      </div>
    ),
  },
  {
    value: "item-3",
    trigger: "VPN Compatibility",
    content: (
      <div className="leading-8">
        Fipi may not function properly with VPNs. If you experience connectivity issues, try
        disabling your VPN.
      </div>
    ),
  },
  {
    value: "item-4",
    trigger: "Security & Privacy",
    content: (
      <div className="leading-8">
        Fipi ensures secure, encrypted peer-to-peer file transfers, meaning no data is stored or
        processed by external servers. File details (such as name and size) and the file itself are
        transmitted directly between devices using WebRTC (Web Real-Time Communication), a
        browser-based technology designed for secure, direct communication.
      </div>
    ),
  },
];

const gDriver = driver();

const setting1: Config = {
  showProgress: false,
  disableActiveInteraction: true,
  stageRadius: 999,
  showButtons: ["close"],
  steps: [
    {
      element: "#t-11",
      popover: {
        title: "Click on the avatar to start",
        description: "Go to the lobby where you can meet recipients who share the same network.",
        side: "top",
        align: "center",
      },
    },
  ],
};

const setting2: Config = {
  showProgress: true,
  disableActiveInteraction: true,
  steps: [
    {
      element: "#t-21",
      popover: {
        title: "Lobby",
        description:
          "A shared virtual space where users connected to the same network can discover and see each other.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#t-num-user",
      popover: {
        title: "Number of users",
        description: "Display how many current active users in the lobby.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#t-self",
      popover: {
        title: "This is you",
        description: "Other people will see you under this identity.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#t-setting",
      popover: {
        title: "Setting",
        description: "Open to see more about app settings and you can create a room in here.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#t-send-all",
      popover: {
        title: "Send to all recipients",
        description:
          "You are able to send a file to all recipients in the lobby at a same time. Recipients with pending request or respond can not receive it.",
        side: "top",
        align: "center",
      },
    },
  ],
};

const setting3: Config = {
  showProgress: true,
  disableActiveInteraction: true,
  steps: [
    {
      element: "#t-31",
      popover: {
        title: "Lobby",
        description:
          "A shared virtual space where users connected to the same network can discover and see each other.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#t-32",
      popover: {
        title: "Share the room",
        description: "Share your room on your social, scan the QR code, or copy the link.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#t-num-user",
      popover: {
        title: "Number of users",
        description: "Display how many current active users in the room.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#t-self",
      popover: {
        title: "This is you",
        description: "Other people will see you under this identity.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#t-setting",
      popover: {
        title: "Setting",
        description: "Open to see more about app settings and you can leave room in here.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: "#t-send-all",
      popover: {
        title: "Send to all recipients",
        description:
          "You are able to send a file to all recipients in the room at a same time. Recipients with pending request or respond can not receive it.",
        side: "top",
        align: "center",
      },
    },
  ],
};

const Header = () => {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  let component;

  if (isDesktop) {
    component = (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <ShieldQuestion className="opacity-70 hover:opacity-100 cursor-pointer" size={20} />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center mr-8">
              <Image src="/logo.png" alt="logo" width={80} height={40} priority />
              <TourButton setOpen={setOpen} />
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <MainContent />
          <DialogFooter className="text-xs italic text-foreground">
            *Devices need to have the same&nbsp;
            <a
              href="https://www.google.com/search?q=what+is+my+ip"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-500"
            >
              public IP
            </a>
            &nbsp; to see each other.
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  } else {
    component = (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <ShieldQuestion className="opacity-70 hover:opacity-100 cursor-pointer" size={20} />
        </DrawerTrigger>
        <DrawerContent className="max-h-[90%]">
          <DrawerHeader>
            <DrawerTitle>
              <div className="flex justify-between items-center">
                <Image src="/logo.png" alt="logo" width={80} height={40} priority />
                <TourButton setOpen={setOpen} />
              </div>
            </DrawerTitle>
            <DrawerDescription></DrawerDescription>
          </DrawerHeader>
          <MainContent className="px-4 overflow-y-auto" />
          <DrawerFooter className="text-xs italic text-foreground text-right">
            *Devices need to have the same&nbsp;
            <a
              href="https://www.google.com/search?q=what+is+my+ip"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-500 contents"
            >
              public IP
            </a>
            &nbsp; to see each other.
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <motion.div
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -40, opacity: 0 }}
      transition={{ ease: "easeInOut", duration: 0.75 }}
      className="mb-2 px-4 flex gap-2 justify-end items-center"
    >
      {component}
    </motion.div>
  );
};

function MainContent({ className }: React.ComponentProps<"div">) {
  return (
    <div className={cn("grid items-start gap-4", className)}>
      <Accordion type="multiple" className="w-full">
        {accordionItems.map((a) => (
          <AccordionItem value={a.value} key={a.value}>
            <AccordionTrigger className="font-bold">{a.trigger}</AccordionTrigger>
            <AccordionContent>{a.content}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

function TourButton({
  className,
  setOpen,
}: React.ComponentProps<"button"> & { setOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
  const pathname = usePathname();
  const [shouldRender, setShouldRender] = useState(false);
  const activeSetting = useRef<Config>(undefined);

  useEffect(() => {
    const regexRoot = /^\/$/;
    const regexG = /^\/g$/;
    const regexRoom = /^\/rooms\/[a-zA-Z0-9_-]+$/;

    if (regexRoot.test(pathname)) {
      activeSetting.current = setting1;
      setShouldRender(true);
    } else if (regexG.test(pathname)) {
      activeSetting.current = setting2;
      setShouldRender(true);
    } else if (regexRoom.test(pathname)) {
      activeSetting.current = setting3;
      setShouldRender(true);
    } else {
      activeSetting.current = undefined;
      setShouldRender(false);
    }
  }, [pathname]);

  const onClick = () => {
    setOpen(false);
    if (activeSetting.current) {
      gDriver.setConfig(activeSetting.current);
      gDriver.drive();
    }
  };

  return (
    shouldRender && (
      <Button
        onClick={onClick}
        className={cn("font-semibold", className)}
        effect="expandIcon"
        icon={Binoculars}
        iconPlacement="right"
        variant="purple"
      >
        Begin a tour
      </Button>
    )
  );
}

export default Header;
