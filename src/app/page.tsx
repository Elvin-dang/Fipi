"use client";

import dynamic from "next/dynamic";

const InformationBox = dynamic(() => import("@/app/_components/InformationBox"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="h-full">
      <InformationBox />
    </main>
  );
}
