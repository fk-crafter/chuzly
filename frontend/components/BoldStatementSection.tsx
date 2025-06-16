"use client";

import { motion } from "motion/react";

export function BoldStatementSection() {
  return (
    <section className="w-full py-32 px-4 text-center text-black">
      <motion.div
        className="max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, amount: 1 }}
      >
        <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
          Your group plans fall apart <br className="hidden md:inline" /> like
          90% of the time
        </h2>
        <p className="text-lg mb-2 text-zinc-400">
          Stop relying on chaotic group chats and vague polls.
        </p>
        <p className="text-lg text-zinc-400">
          Chuzly helps you actually make decisions — fast and simple.
        </p>
      </motion.div>
    </section>
  );
}
