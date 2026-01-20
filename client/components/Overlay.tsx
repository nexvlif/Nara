"use client";

import { useEffect, useState } from "react";
import { Battery, BatteryCharging, Settings, Twitter, Github, Mic, MicOff } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import MusicPlayer from "./MusicPlayer";
import SettingsMenu from "./SettingsMenu";

interface BatteryManager extends EventTarget {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
  addEventListener(type: string, listener: EventListener | EventListenerObject | null, options?: boolean | AddEventListenerOptions): void;
  removeEventListener(type: string, listener: EventListener | EventListenerObject | null, options?: boolean | EventListenerOptions): void;
}

type NavigatorWithBattery = Navigator & {
  getBattery: () => Promise<BatteryManager>;
};

interface OverlayProps {
  onFaceTrackingChange?: (enabled: boolean) => void;
}

export default function Overlay({ onFaceTrackingChange }: OverlayProps) {
  const [time, setTime] = useState(new Date());
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [isCharging, setIsCharging] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const nav = navigator as NavigatorWithBattery;
    if (nav.getBattery) {
      nav.getBattery().then((battery) => {
        const updateBattery = () => {
          setBatteryLevel(Math.round(battery.level * 100));
          setIsCharging(battery.charging);
        };
        updateBattery();
        battery.addEventListener("levelchange", updateBattery);
        battery.addEventListener("chargingchange", updateBattery);
        return () => {
          battery.removeEventListener("levelchange", updateBattery);
          battery.removeEventListener("chargingchange", updateBattery);
        };
      });
    }
  }, []);

  const formatTime = (date: Date) => date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
  const formatDate = (date: Date) => date.toLocaleDateString("en-US", { weekday: "short", day: "numeric" });

  return (
    <>
      <div className="absolute inset-0 pointer-events-none select-none z-50 overflow-hidden flex flex-col justify-between p-3 sm:p-6">

        <div className="flex justify-between items-start w-full">
          <motion.div
            initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            className="flex flex-col text-white/90"
          >
            <span className="text-2xl sm:text-4xl font-light tracking-tighter tabular-nums leading-none">{formatTime(time)}</span>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white/50">{formatDate(time)}</span>
          </motion.div>

          <motion.div
            initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
            className="flex items-center gap-2 sm:gap-3"
          >
            <div className="hidden sm:flex items-center gap-2 bg-black/20 backdrop-blur-xl rounded-full px-3 py-1.5 border border-white/5 text-white/80">
              <Twitter className="w-3 h-3" />
              <span className="text-[10px] font-medium">@nexvlif</span>
              <Github className="w-3 h-3" />
              <span className="text-[10px] font-medium">@nexvlif</span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 bg-black/20 backdrop-blur-xl rounded-full px-2 sm:px-3 py-1 sm:py-1.5 border border-white/5 text-white/80">
              <span className="text-[10px] sm:text-xs font-mono font-bold">{batteryLevel}%</span>
              {isCharging ? <BatteryCharging className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-green-400" /> : <Battery className="w-3 sm:w-3.5 h-3 sm:h-3.5" />}
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-31 sm:bottom-6 left-3 sm:left-6 pointer-events-auto z-50">
          <MusicPlayer />
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute bottom-31 sm:bottom-6 right-3 sm:right-6 pointer-events-auto z-50"
        >
          <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-full bg-black/40 backdrop-blur-2xl border border-white/10 shadow-2xl">
            <button
              onClick={() => setIsMicActive(!isMicActive)}
              className={cn(
                "w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300",
                isMicActive
                  ? "bg-pink-500 text-white shadow-lg shadow-pink-500/25"
                  : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
              )}
            >
              {isMicActive ? <Mic className="w-4 h-4 sm:w-5 sm:h-5" /> : <MicOff className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>

            <div className="w-px h-5 sm:h-6 bg-white/10" />

            <button
              onClick={() => setIsSettingsOpen(true)}
              className={cn(
                "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors",
                isSettingsOpen
                  ? "bg-pink-500 text-white"
                  : "text-white/50 hover:bg-white/10 hover:text-white"
              )}
            >
              <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </motion.div>

      </div>

      <SettingsMenu
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onFaceTrackingChange={onFaceTrackingChange}
      />
    </>
  );
}
