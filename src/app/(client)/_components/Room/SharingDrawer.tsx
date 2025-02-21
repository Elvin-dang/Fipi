import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Link } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import React, { useState } from "react";
import { toast } from "sonner";
import { SocialIcon } from "react-social-icons";

type Props = {
  roomId: string;
};

const SharingDrawer = ({ roomId }: Props) => {
  const [open, setOpen] = useState(false);

  const link = process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}/rooms/${roomId}`
    : `http://${process.env.NEXT_PUBLIC_URL}/rooms/${roomId}`;

  const handleCopyRoomLink = () => {
    navigator.clipboard.writeText(link);
    toast.success("Room link copied 🎉", {
      position: "bottom-center",
      duration: 2000,
    });
    setOpen(false);
  };

  const socialMedia = [
    {
      name: "facebook",
      label: "Facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${link}`,
    },
    {
      name: "whatsapp",
      label: "Whatsapp",
      url: `https://api.whatsapp.com/send?text=${link}`,
    },
    {
      name: "linkedin",
      label: "Linkedin",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${link}`,
    },
    {
      name: "x",
      label: "X",
      url: `https://twitter.com/intent/tweet?url=${link}`,
    },
    {
      name: "mailto",
      label: "Mail",
      url: `mailto:?subject=YOUR_SUBJECT&body=${link}`,
    },
  ];

  return (
    <Drawer open={open} onOpenChange={setOpen} repositionInputs={false}>
      <DrawerTrigger asChild>
        <Link className="text-gray-500 size-4 ml-2 cursor-pointer hover:text-gray-700" />
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Share</DrawerTitle>
            <DrawerDescription className="text-left">
              Share to your social, scan QR code, or copy the link
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-2">
            <ScrollArea>
              <div className="flex space-x-4 mb-2">
                {socialMedia.map((sm) => (
                  <div key={sm.name} className="flex flex-col items-center gap-2">
                    <SocialIcon
                      url={sm.url}
                      network={sm.name}
                      label={sm.name}
                      style={{ width: "64px", height: " 64px" }}
                    />
                    <p className="text-sm text-gray-500 font-semibold">{sm.label}</p>
                  </div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
            <Separator className="my-4" />
            <QRCodeSVG value={link} size={352} />
          </div>
          <DrawerFooter>
            <Card>
              <CardContent className="p-4">
                <div className="flex w-full items-center space-x-2">
                  <Input type="text" value={link} readOnly />
                  <Button onClick={handleCopyRoomLink}>Copy</Button>
                </div>
              </CardContent>
            </Card>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default SharingDrawer;
