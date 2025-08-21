"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    title: "Create your event",
    description: "Pick options like cinema, bowling, or paintball in seconds.",
    video: "/step1.mp4",
  },
  {
    title: "Share the link",
    description: "Send it to your friends.",
    video: "/step2.mp4",
  },
  {
    title: "Vote & decide",
    description: "Friends vote. Chuzly picks the best plan automatically",
    video: "/step3.mp4",
  },
];

export function HowItWorksSection() {
  const sectionRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);

  useGSAP(() => {
    if (window.innerWidth < 768) return;

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

  const nextStep = () => {
    setActiveStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
  };

  const prevStep = () => {
    setActiveStep((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const progressPercentage = ((activeStep + 1) / steps.length) * 100;

  return (
    <section
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
          <video
            key={steps[activeStep].video}
            src={steps[activeStep].video}
            autoPlay
            loop
            muted
            playsInline
            className="aspect-video w-full max-w-xl rounded-xl border border-border object-cover"
          />
        </div>
      </div>

      <div className="flex flex-col md:hidden px-6 py-12 gap-6 items-center">
        <video
          key={steps[activeStep].video}
          src={steps[activeStep].video}
          autoPlay
          loop
          muted
          playsInline
          className="w-full aspect-video rounded-xl border border-border object-cover"
        />
        <h3 className="text-lg font-semibold text-center">
          {steps[activeStep].title}
        </h3>
        <p className="text-sm text-muted-foreground text-center">
          {steps[activeStep].description}
        </p>

        <div className="w-full h-2 bg-border rounded-full overflow-hidden mt-4">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <div className="flex gap-4 mt-4">
          <button
            onClick={prevStep}
            disabled={activeStep === 0}
            className="px-4 py-2 border border-border rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={nextStep}
            disabled={activeStep === steps.length - 1}
            className="px-4 py-2 bg-primary text-white rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
