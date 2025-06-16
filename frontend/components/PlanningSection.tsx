export function PlanningSection() {
  return (
    <section className="w-full py-20 px-4 flex flex-col items-center bg-muted/50 text-center">
      <div className="max-w-3xl mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Planning with friends is broken
        </h2>
        <p className="text-muted-foreground text-lg">
          Endless group chats, undecided plans, people dropping out last
          minute... Chuzly makes group outings effortless: set options, share a
          link, let friends vote.
        </p>
      </div>

      <div className="w-full max-w-5xl px-4">
        <div className="aspect-video w-full rounded-xl border border-border bg-background flex items-center justify-center text-muted-foreground text-sm">
          [ Before/After planning flow preview coming soon ]
        </div>
      </div>
    </section>
  );
}
