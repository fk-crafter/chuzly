"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQSection() {
  return (
    <section className="w-full py-24 px-4 bg-background text-center">
      <p className="text-sm text-primary font-semibold mb-2 tracking-tight">
        Need help?
      </p>
      <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
        Frequently Asked Questions
      </h2>
      <p className="text-muted-foreground text-lg mb-12">
        Still have questions? Reach out on X or through the contact form.
      </p>

      <div className="max-w-2xl mx-auto text-left">
        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="item-1">
            <AccordionTrigger aria-label="Question: What is Chuzly?">
              What is Chuzly?
            </AccordionTrigger>
            <AccordionContent>
              Chuzly helps you plan group activities by letting friends vote on
              options. No sign-up required.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger aria-label="Question: Does everyone need an account?">
              Does everyone need an account?
            </AccordionTrigger>
            <AccordionContent>
              No. Only the organizer needs Chuzly. Friends can vote using a
              shared link.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger aria-label="Question: Can I track who voted?">
              Can I track who voted?
            </AccordionTrigger>
            <AccordionContent>
              Yes. You can see who voted, declined, or didn’t respond.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger aria-label="Question: How do I create an event?">
              How do I create an event?
            </AccordionTrigger>
            <AccordionContent>
              Pick activity options, set a deadline, and share the link. It
              takes less than a minute.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger aria-label="Question: Is it really free?">
              Is it really free?
            </AccordionTrigger>
            <AccordionContent>
              Yes. Chuzly has a free plan with the basics. You can upgrade
              anytime for more features.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-6">
            <AccordionTrigger aria-label="Question: What happens after everyone votes?">
              What happens after everyone votes?
            </AccordionTrigger>
            <AccordionContent>
              Chuzly selects the top option automatically based on votes.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-7">
            <AccordionTrigger aria-label="Question: Can I add a cost per option?">
              Can I add a cost per option?
            </AccordionTrigger>
            <AccordionContent>
              Yes. You can add prices so friends can compare and decide based on
              budget.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-8">
            <AccordionTrigger aria-label="Question: Does it work on mobile?">
              Does it work on mobile?
            </AccordionTrigger>
            <AccordionContent>
              Yes. Chuzly works on phones, tablets, and desktop. You can also
              install it as an app (PWA):
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>
                  Tap the <strong>Share</strong> button in Safari or Chrome
                </li>
                <li>
                  Select <strong>"Add to Home Screen"</strong>
                </li>
                <li>Confirm installation</li>
              </ol>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}
