import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BackgroundBeams } from "@/components/ui/background-beams";

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 z-10">
        Plan your hangouts effortlessly
      </h1>
      <p className="text-muted-foreground max-w-md mb-6 z-10">
        Create events with multiple options, share a single link, and let your
        friends vote. No sign-up required for them — fast, easy, and fun.
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
