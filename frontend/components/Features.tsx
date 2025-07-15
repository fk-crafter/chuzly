"use client";

import { MagicCard } from "@/components/magicui/magic-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "next-themes";
import {
  Sparkles,
  Users,
  CalendarClock,
  Link,
  DollarSign,
  CircleCheck,
} from "lucide-react";
import { motion } from "motion/react";

const features = [
  {
    icon: <Sparkles className="w-6 h-6 text-primary" />,
    title: "Easy event creation",
    description: "Quickly set up options like bowling, cinema, or paintball.",
  },
  {
    icon: <Users className="w-6 h-6 text-primary" />,
    title: "Vote & decide together",
    description:
      "Let friends vote to choose the best plan—no group chat chaos.",
  },
  {
    icon: <CalendarClock className="w-6 h-6 text-primary" />,
    title: "Set deadlines",
    description: "Define when voting ends so decisions get made on time.",
  },
  {
    icon: <Link className="w-6 h-6 text-primary" />,
    title: "Shareable link",
    description: "Send a simple link to invite your friends to vote.",
  },
  {
    icon: <DollarSign className="w-6 h-6 text-primary" />,
    title: "Cost breakdown",
    description: "Add prices per person or per group to compare options.",
  },
  {
    icon: <CircleCheck className="w-6 h-6 text-primary" />,
    title: "Track responses",
    description: "See who voted, declined, or gave a reason — no confusion.",
  },
];

export function FeaturesSection() {
  const { theme } = useTheme();

  return (
    <section
      id="features"
      className="w-full py-10 px-4 flex flex-col items-center bg-background"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <Card className="p-0 w-full shadow-none border-none max-w-md mx-auto min-h-[200px]">
              <MagicCard
                gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
                className="p-0 min-h-[200px]"
              >
                <CardHeader className="p-6 pb-2 flex flex-col items-start gap-3">
                  <div className="rounded-full bg-muted p-2">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-2 text-muted-foreground text-sm">
                  {feature.description}
                </CardContent>
              </MagicCard>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
