"use client";

import dynamic from "next/dynamic";
import ChatUI from "@/components/ChatUI";
import Overlay from "@/components/Overlay";

const VRMCanvas = dynamic(
  () => import("@/components/VRMCanvas"),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-zinc-950 text-white selection:bg-pink-500/30">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-purple-900/20 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-pink-900/20 blur-[100px]" />
        <div className="absolute top-[20%] right-[20%] h-[300px] w-[300px] rounded-full bg-blue-900/10 blur-[80px]" />
      </div>

      <div className="absolute inset-0 z-10">
        <VRMCanvas />
      </div>

      <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-0">
        <Overlay />
        <div className="flex-1" />
        <div className="pointer-events-auto w-full max-w-2xl mx-auto p-6 md:p-12">
          <ChatUI />
        </div>
      </div>
    </main>
  );
}
