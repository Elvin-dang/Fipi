"use client";

import { useGlobalStore } from "@/providers/globalStateProvider";
import dynamic from "next/dynamic";
import Spinner from "@/components/Spinner";

const InformationBox = dynamic(() => import("@/app/_components/InformationBox"), {
  ssr: false,
});

export default function Home() {
  const user = useGlobalStore((state) => state.user);

  return user ? (
    <main className="h-full">
      <InformationBox />
    </main>
  ) : (
    <Spinner />
  );
}
