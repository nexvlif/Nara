"use client";


import { useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function ChatUI() {
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);

  async function send() {
    if (!text.trim() || isSending) return;

    setIsSending(true);
    try {
      await fetch("#url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });
      setText("");
    } catch (e) {
      console.error("Failed to send message", e);
    } finally {
      setIsSending(false);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative group"
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />

      <div className="relative flex items-end gap-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl">
        <div className="flex-1 min-h-[50px] flex items-center">
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type something for Nara"
            className="w-full bg-transparent px-4 py-3 text-white placeholder-white/40 outline-none font-medium"
            disabled={isSending}
          />
        </div>

        <button
          onClick={send}
          disabled={!text.trim() || isSending}
          className={cn(
            "h-[46px] w-[46px] flex items-center justify-center rounded-xl transition-all duration-300",
            text.trim()
              ? "bg-pink-600 hover:bg-pink-500 text-white shadow-lg shadow-pink-500/20 scale-100 rotate-0"
              : "bg-white/5 text-white/20 scale-95 rotate-12 cursor-not-allowed"
          )}
        >
          {isSending ? (
            <Sparkles className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>

      <div className="absolute -top-6 left-4 text-[10px] text-white/30 tracking-widest uppercase font-semibold">
        AI Assistant Active
      </div>
    </motion.div>
  );
}
