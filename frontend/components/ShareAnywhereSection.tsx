"use client";

import { motion } from "motion/react";
import {
  FaWhatsapp,
  FaFacebookMessenger,
  FaDiscord,
  FaInstagram,
  FaSnapchat,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const platforms = [
  { icon: <FaWhatsapp size={28} />, name: "WhatsApp" },
  { icon: <FaFacebookMessenger size={28} />, name: "Messenger" },
  { icon: <FaDiscord size={28} />, name: "Discord" },
  { icon: <FaInstagram size={28} />, name: "Instagram" },
  { icon: <FaXTwitter size={28} />, name: "X" },
  { icon: <FaSnapchat size={28} />, name: "Snapchat" },
];

export function ShareAnywhereSection() {
  return (
    <section className="w-full bg-background py-24 text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.6 }}
        className="max-w-2xl mx-auto"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Share it where your friends already are
        </h2>
        <p className="text-muted-foreground text-lg mb-12">
          Send your Chuzly event through WhatsApp, Messenger, Discord, or
          wherever your group hangs out.
        </p>
      </motion.div>

      <div className="flex flex-wrap justify-center gap-6">
        {platforms.map((platform, index) => (
          <motion.div
            key={platform.name}
            className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center shadow-md"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            viewport={{ once: true, amount: 0.6 }}
          >
            {platform.icon}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
