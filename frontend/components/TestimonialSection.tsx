"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";

type Avatar = {
  name: string;
  message: string;
  imageUrl: string;
};

const avatars: Avatar[] = [
  {
    name: "Yannis",
    message: "Super clean work, looks amazing. Killer UI!",
    imageUrl: "/avatar/yannis.jpg",
  },
  {
    name: "Albia",
    message: "Nice UI, pretty smooth tbh.",
    imageUrl: "/avatar/albia.jpg",
  },
  {
    name: "Mark Cabale",
    message: "Loved the onboarding, was super user friendly.",
    imageUrl: "/avatar/mark.jpg",
  },
  {
    name: "Nicky Gee",
    message: "Awesome idea. Loved the onboarding, super user friendly.",
    imageUrl: "/avatar/nicky.jpg",
  },
  {
    name: "Andiencon",
    message: "Nice tool!",
    imageUrl: "/avatar/andiencon.jpg",
  },
  {
    name: "Hamza",
    message: "Masterclass. That’s fire!",
    imageUrl: "/avatar/hamza.jpg",
  },
  {
    name: "Lucas",
    message: "Cool tool, makes group planning way easier.",
    imageUrl: "/avatar/lucas.jpg",
  },
];

export function TestimonialSection() {
    const totalTestimonials = 25;
    const displayed = avatars.slice(0, 5);
    const remaining = totalTestimonials - displayed.length;

  return (
    <TooltipProvider>
      <div className="flex items-center justify-center gap-[-8px] mt-6">
        {displayed.map((avatar, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <div className="relative -ml-2 first:ml-0 w-10 h-10 rounded-full border-2 border-white dark:border-black overflow-hidden cursor-pointer">
                <Image
                  src={avatar.imageUrl}
                  alt={avatar.name}
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              </div>
            </TooltipTrigger>
            <TooltipContent className="text-sm max-w-xs text-center">
              “{avatar.message}” — <strong>{avatar.name}</strong>
            </TooltipContent>
          </Tooltip>
        ))}

{remaining > 0 && (
  <div className="relative -ml-2 w-10 h-10 rounded-full border-2 border-white dark:border-black bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
    +{remaining}
  </div>
)}
      </div>
    </TooltipProvider>
  );
}