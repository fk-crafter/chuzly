"use client";

import { useState, useRef } from "react";
import { Play } from "lucide-react";
import { motion } from "motion/react";

export function MockupPreview() {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    setIsPlaying(true);
    videoRef.current?.play();
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full flex justify-center px-4 -mt-25 md:-mt-42"
    >
      <div className="aspect-video w-full max-w-4xl relative rounded-xl overflow-hidden border border-border bg-muted">
        {!isPlaying && (
          <>
            <img
              src="/mockup-visu.png"
              alt="Preview"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <button
              onClick={handlePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm hover:bg-black/60 transition z-10"
            >
              <Play className="w-12 h-12 text-white" />
            </button>
          </>
        )}

        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          src="/chuzly-pres3.mp4"
          controls={isPlaying}
        />
      </div>
    </motion.section>
  );
}
