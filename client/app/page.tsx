"use client";

import { useState, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import ChatUI from "@/components/ChatUI";
import Overlay from "@/components/Overlay";
import SubtitleDisplay from "@/components/SubtitleDisplay";
import { playWithLipSync } from "@/lib/audio";
import { VRMController } from "@/lib/VRMController";

const VRMCanvas = dynamic(
  () => import("@/components/VRMCanvas"),
  { ssr: false }
);

interface ChatResponse {
  text: string;
  audio_url: string | null;
}

export default function Home() {
  const [subtitle, setSubtitle] = useState("");
  const [isSubtitleVisible, setIsSubtitleVisible] = useState(false);
  const vrmControllerRef = useRef<VRMController | null>(null);

  const handleControllerReady = useCallback((controller: VRMController) => {
    vrmControllerRef.current = controller;
    console.log("VRM Controller ready!");
  }, []);

  const handleResponse = useCallback((response: ChatResponse) => {
    setSubtitle(response.text);
    setIsSubtitleVisible(true);

    if (response.audio_url) {
      const audioUrl = `http://localhost:8000${response.audio_url}`;
      playWithLipSync(audioUrl, (volume) => {
        vrmControllerRef.current?.setLipSync(volume);
      });

      const duration = Math.max(5000, response.text.length * 80);
      setTimeout(() => {
        setIsSubtitleVisible(false);
      }, duration);
    } else {
      setTimeout(() => {
        setIsSubtitleVisible(false);
      }, 4000);
    }
  }, []);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-zinc-950 text-white selection:bg-pink-500/30">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-purple-900/20 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-pink-900/20 blur-[100px]" />
        <div className="absolute top-[20%] right-[20%] h-[300px] w-[300px] rounded-full bg-blue-900/10 blur-[80px]" />
      </div>

      <div className="absolute inset-0 z-10">
        <VRMCanvas onControllerReady={handleControllerReady} />
      </div>

      <SubtitleDisplay text={subtitle} isVisible={isSubtitleVisible} />

      <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-0">
        <Overlay />
        <div className="flex-1" />
        <div className="pointer-events-auto w-full max-w-2xl mx-auto p-6 md:p-12">
          <ChatUI onResponse={handleResponse} />
        </div>
      </div>
    </main>
  );
}
