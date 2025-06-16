"use client";

export function CollaborativeSection() {
  return (
    <section className="w-full bg-background py-24 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="flex flex-col items-center">
          <div className="w-full h-64 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
            [Conversation preview]
          </div>
          <h3 className="text-xl font-semibold text-foreground mt-6 mb-2">
            No more endless group chats
          </h3>
          <p className="text-muted-foreground text-sm text-center">
            Chuzly replaces scattered messages with a single link that gets
            everyone aligned instantly.
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-full h-64 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
            [Feature illustration]
          </div>
          <h3 className="text-xl font-semibold text-foreground mt-6 mb-2">
            Make decisions, not threads
          </h3>
          <p className="text-muted-foreground text-sm text-center">
            Share plans, vote together, and agree on the best option — without
            back-and-forth chaos.
          </p>
        </div>
      </div>
    </section>
  );
}
