"use client";

import { useGlobalStore } from "@/providers/globalStateProvider";
import dynamic from "next/dynamic";
import Spinner from "@/components/Spinner";
import SettingDrawer from "./(client)/_components/Setting/SettingDrawer";

const InformationBox = dynamic(() => import("@/app/_components/InformationBox"), {
  ssr: false,
});

export default function Home() {
  const user = useGlobalStore((state) => state.user);

  return user ? (
    <main className="p-2 h-screen min-h-screen">
      {/* <h1 className="text-2xl">FiPi - File Sharing</h1> */}

      <InformationBox />
    </main>
  ) : (
    <Spinner />
  );
}
