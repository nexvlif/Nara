"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Music as MusicIcon, Minimize2, Play, Pause } from "lucide-react";
import ReactPlayer from "react-player";
import { cn } from "@/lib/utils";

export default function MusicPlayer() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [url, setUrl] = useState("https://www.youtube.com/watch?v=jfKfPfyJRdk");
  const [playing, setPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [volume, setVolume] = useState(0.5);

  const togglePlay = () => setPlaying(!playing);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.includes("youtube.com") || searchQuery.includes("youtu.be")) {
      setUrl(searchQuery);
      setPlaying(true);
      setSearchQuery("");
    }
  };

  return (
    <motion.div
      layout
      initial={{ width: 48, height: 48, borderRadius: 24 }}
      animate={{
        width: isExpanded ? (typeof window !== 'undefined' && window.innerWidth < 640 ? 280 : 320) : 48,
        height: isExpanded ? (typeof window !== 'undefined' && window.innerWidth < 640 ? 340 : 400) : 48,
        borderRadius: isExpanded ? 20 : 24
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "bg-black/40 backdrop-blur-xl border border-white/10 overflow-hidden shadow-2xl relative",
        isExpanded ? "p-3 sm:p-4" : "p-0 cursor-pointer"
      )}
      onClick={() => !isExpanded && setIsExpanded(true)}
    >
      {!isExpanded && (
        <div className="w-full h-full flex items-center justify-center group">
          <motion.div
            animate={{ rotate: playing ? 360 : 0 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <MusicIcon className={cn("w-5 h-5 sm:w-6 sm:h-6 text-white/80", playing && "text-pink-500")} />
          </motion.div>
          {playing && (
            <div className="absolute inset-0 rounded-full border-2 border-pink-500/30 animate-ping" />
          )}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isExpanded ? 1 : 0 }}
        className={cn(
          "flex flex-col h-full gap-3 sm:gap-4 transition-all duration-300",
          !isExpanded && "pointer-events-none absolute inset-0 -z-10 h-0 w-0 overflow-hidden"
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MusicIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-500" />
            <span className="text-[10px] sm:text-xs font-bold text-white tracking-widest uppercase">Nara Music</span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}
            className="p-1 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white"
          >
            <Minimize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        <div className="relative aspect-video bg-black/50 rounded-lg overflow-hidden border border-white/5 group">
          <ReactPlayer
            src={url}
            width="100%"
            height="100%"
            playing={playing}
            volume={volume}
            onReady={() => setIsReady(true)}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            controls={false}
            className="absolute inset-0"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
            <button onClick={togglePlay} className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-pink-500 hover:scale-110 transition-all">
              {playing ? <Pause className="w-5 h-5 sm:w-6 sm:h-6 fill-current" /> : <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />}
            </button>
          </div>
        </div>

        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/40" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Paste YouTube URL..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-1.5 sm:py-2 pl-8 sm:pl-9 pr-3 text-[11px] sm:text-xs text-white focus:outline-none focus:border-pink-500/50 transition-colors placeholder:text-white/20"
          />
        </form>

        <div className="flex-1 flex flex-col justify-end gap-1.5 sm:gap-2">
          <div className="flex items-center justify-between text-white/50 text-[9px] sm:text-[10px] font-mono">
            <span>Now Playing via YouTube</span>
            {playing && <span className="text-pink-400 animate-pulse">LIVE</span>}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] sm:text-[10px] text-white/40">VOL</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={e => setVolume(parseFloat(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:bg-pink-500 [&::-webkit-slider-thumb]:rounded-full"
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
