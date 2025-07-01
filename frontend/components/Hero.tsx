import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BackgroundBeams } from "@/components/ui/background-beams";

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 z-10">
        Plan events with friends, effortlessly
      </h1>
      <p className="text-muted-foreground max-w-md mb-6 z-10">
        Create a poll, share one link, and let your friends pick the best option
        — no signup needed. Fast, fun, and stress-free.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 z-10">
        <Link href="#beta">
          <Button size="lg" className="cursor-pointer">
            Create an event
          </Button>
        </Link>
        <Link href="#how-it-works">
          <Button variant="outline" size="lg" className="cursor-pointer">
            How it works
          </Button>
        </Link>
      </div>

      <BackgroundBeams />
    </section>
  );
}
