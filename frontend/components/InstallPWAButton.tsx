"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Smartphone, Share, PlusSquare } from "lucide-react";

export function InstallPWAButton() {
  const [open, setOpen] = useState(false);
  const [shouldShow, setShouldShow] = useState(true);

  useEffect(() => {
    const isStandalone =
      (window.matchMedia &&
        window.matchMedia("(display-mode: standalone)").matches) ||
      (window.navigator as any).standalone === true;
    if (isStandalone) setShouldShow(false);
  }, []);

  if (!shouldShow) return null;

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        className="md:hidden flex items-center gap-1 rounded-full border-primary/30 bg-primary/10 text-primary hover:bg-primary/20"
        onClick={() => setOpen(true)}
      >
        <Smartphone className="w-4 h-4" />
        App
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Install this app
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-5 text-sm">
            <p className="text-muted-foreground">
              Add this app to your home screen for quick access:
            </p>
            <ol className="list-decimal list-inside space-y-3">
              <li className="flex items-center gap-2">
                <Share className="w-5 h-5 text-primary" />
                Tap the <b>Share</b> button in Safari/Chrome
              </li>
              <li className="flex items-center gap-2">
                <PlusSquare className="w-5 h-5 text-primary" />
                Select <b>"Add to Home Screen"</b>
              </li>
              <li className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-primary" />
                Confirm installation
              </li>
            </ol>
            <p className="text-xs text-muted-foreground">
              On Android, you might see an “Install App” banner.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
