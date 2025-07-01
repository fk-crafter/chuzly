"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    title: "Create your event",
    description: "Pick options like cinema, bowling, or paintball in seconds.",
    image: "/step1.png",
  },
  {
    title: "Share the link",
    description: "Send it to your friends.",
    image: "/step2.png",
  },
  {
    title: "Vote & decide",
    description: "Friends vote. Chuzly picks the best plan automatically.",
    image: "/step3.png",
  },
];

export function HowItWorksSection() {
  const sectionRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);

  useGSAP(() => {
    const section = sectionRef.current;

    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: () => `+=${steps.length * 100}vh`,
      pin: true,
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const newIndex = Math.round(progress * (steps.length - 1));
        setActiveStep(newIndex);
      },
    });

    gsap.to(".progress-line", {
      height: "100%",
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${steps.length * 100}vh`,
        scrub: true,
      },
    });
  }, []);

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  };

  const progressPercent = ((activeStep + 1) / steps.length) * 100;

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative bg-background overflow-hidden"
    >
      <div className="hidden md:flex h-screen max-w-6xl mx-auto px-6 items-center justify-between gap-12">
        <div className="w-1/3 relative flex flex-col gap-12">
          <div className="absolute left-[11px] top-0 h-full w-[2px] bg-border">
            <div className="progress-line w-full bg-primary h-0 origin-top" />
          </div>

          {steps.map((step, index) => (
            <div key={index} className="pl-8 relative">
              <div
                className={`step-circle absolute left-[-2px] top-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  index === activeStep
                    ? "bg-primary text-white scale-110"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {index + 1}
              </div>
              <h3
                className={`text-lg font-semibold mb-1 transition-opacity duration-300 ${
                  index === activeStep ? "opacity-100" : "opacity-40"
                }`}
              >
                {step.title}
              </h3>
              <p
                className={`text-sm transition-opacity duration-300 text-muted-foreground ${
                  index === activeStep ? "opacity-100" : "opacity-50"
                }`}
              >
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="w-2/3 h-[400px] bg-muted rounded-xl flex items-center justify-center p-6">
          <Image
            src={steps[activeStep].image}
            alt={`Step ${activeStep + 1}`}
            width={600}
            height={350}
            className="rounded-lg object-contain"
          />
        </div>
      </div>

      <div className="flex flex-col md:hidden px-4 py-12 space-y-6">
        <div className="relative w-full bg-muted rounded-xl overflow-hidden border border-border">
          <Image
            src={steps[activeStep].image}
            alt={`Step ${activeStep + 1}`}
            width={500}
            height={280}
            className="w-full object-cover rounded-xl"
          />
        </div>

        <div className="flex flex-col items-center text-center gap-2">
          <h3 className="text-lg font-semibold">{steps[activeStep].title}</h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            {steps[activeStep].description}
          </p>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-primary h-2 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex justify-between w-full pt-2">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={activeStep === 0}
            className="flex-1 mr-2"
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={activeStep === steps.length - 1}
            className="flex-1 ml-2"
          >
            Next
          </Button>
        </div>
      </div>
    </section>
  );
}
