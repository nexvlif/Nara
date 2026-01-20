"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, CameraOff, User, Sliders } from "lucide-react";
import { cn } from "@/lib/utils";

interface SettingsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onFaceTrackingChange?: (enabled: boolean) => void;
}

export default function SettingsMenu({ isOpen, onClose, onFaceTrackingChange }: SettingsMenuProps) {
  const [faceTrackingEnabled, setFaceTrackingEnabled] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<"granted" | "denied" | "prompt">("prompt");

  const toggleFaceTracking = async () => {
    if (!faceTrackingEnabled) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
        setCameraPermission("granted");
        setFaceTrackingEnabled(true);
        onFaceTrackingChange?.(true);
      } catch (err) {
        setCameraPermission("denied");
        console.error("Camera access denied:", err);
      }
    } else {
      setFaceTrackingEnabled(false);
      onFaceTrackingChange?.(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] pointer-events-auto"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-20 sm:bottom-24 right-3 sm:right-6 z-[201] w-72 sm:w-80 pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-pink-500" />
                  <span className="text-sm font-bold text-white">Settings</span>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-white/50" />
                </button>
              </div>

              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-white/50">
                    <User className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium uppercase tracking-wider">Animation</span>
                  </div>

                  <button
                    onClick={toggleFaceTracking}
                    className={cn(
                      "w-full flex items-center justify-between p-3 rounded-xl border transition-all",
                      faceTrackingEnabled
                        ? "bg-pink-500/20 border-pink-500/50"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {faceTrackingEnabled ? (
                        <Camera className="w-5 h-5 text-pink-500" />
                      ) : (
                        <CameraOff className="w-5 h-5 text-white/50" />
                      )}
                      <div className="text-left">
                        <div className="text-sm font-medium text-white">Face Tracking</div>
                        <div className="text-[10px] text-white/40">
                          {faceTrackingEnabled ? "Camera active" : "Use webcam to control"}
                        </div>
                      </div>
                    </div>
                    <div className={cn(
                      "w-10 h-6 rounded-full transition-colors relative",
                      faceTrackingEnabled ? "bg-pink-500" : "bg-white/20"
                    )}>
                      <div className={cn(
                        "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform",
                        faceTrackingEnabled ? "translate-x-5" : "translate-x-1"
                      )} />
                    </div>
                  </button>

                  {cameraPermission === "denied" && (
                    <p className="text-[10px] text-red-400 px-1">
                      Camera access denied. Please enable in browser settings.
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-white/5">
                  <p className="text-[10px] text-white/30 text-center">
                    {faceTrackingEnabled
                      ? "Move your head to control Nara"
                      : "Nara uses procedural animation"}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
