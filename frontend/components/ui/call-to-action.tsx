import { MoveRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function CTA() {
  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <div className="flex flex-col text-center bg-muted rounded-md p-4 lg:p-14 gap-8 items-center">
          <div>
            <Badge>Get started</Badge>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular">
              Plan with friends in seconds.
            </h3>
            <p className="text-lg leading-relaxed tracking-tight text-muted-foreground max-w-xl">
              Skip the endless group chats. Create a poll, share the link, and
              get everyone on the same page—fast and easy.
            </p>
          </div>
          <div className="flex flex-row gap-4">
            <Button className="gap-4" asChild>
              <a href="/create-account">
                Create your account <MoveRight className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { CTA };
