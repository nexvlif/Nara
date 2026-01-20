"use client";

import { motion, AnimatePresence } from "framer-motion";

interface SubtitleDisplayProps {
  text: string;
  isVisible: boolean;
}

export default function SubtitleDisplay({ text, isVisible }: SubtitleDisplayProps) {
  return (
    <AnimatePresence>
      {isVisible && text && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed bottom-36 left-1/2 -translate-x-1/2 z-30 max-w-3xl w-full px-4"
        >
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-lg opacity-60" />

            <div className="relative bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-4 shadow-2xl">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                  N
                </div>
                <motion.p
                  key={text}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-white/90 text-lg font-medium leading-relaxed"
                >
                  {text}
                </motion.p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
