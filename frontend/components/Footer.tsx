"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background text-muted-foreground py-12 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-8">
        <div>
          <h3 className="text-lg font-bold text-foreground mb-2">Chuzly</h3>
          <p className="max-w-sm text-sm">
            Plan events, vote, decide — all in one place. Simple, no sign-up
            required.
          </p>
        </div>

        <nav className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm">
          <div>
            <h4 className="text-foreground font-medium mb-2">Product</h4>
            <ul className="space-y-1">
              <li>
                <Link href="/#features">Features</Link>
              </li>
              <li>
                <Link href="/#pricing">Pricing</Link>
              </li>
              <li>
                <Link href="/#faq">FAQ</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-foreground font-medium mb-2">Company</h4>
            <ul className="space-y-1">
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <a href="mailto:support@chuzly.com" aria-label="Email support">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-foreground font-medium mb-2">Legal</h4>
            <ul className="space-y-1">
              <li>
                <Link href="/privacy">Privacy policy</Link>
              </li>
              <li>
                <Link href="/terms">Terms of service</Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div className="mt-10 text-xs text-center text-muted-foreground">
        © {new Date().getFullYear()} Chuzly. All rights reserved.
      </div>
    </footer>
  );
}
