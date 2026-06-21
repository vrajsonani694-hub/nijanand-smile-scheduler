import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { TREATMENTS } from "@/lib/clinic";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Dental Services — Nijanand Dental Care" },
      { name: "description", content: "RCT, dental crowns, implants, extractions, cleaning, whitening, braces and more. Modern dental treatments at transparent prices." },
      { property: "og:title", content: "Dental Services — Nijanand Dental Care" },
      { property: "og:description", content: "Comprehensive dental treatments by Dr. Dharmesh Padsala." },
    ],
  }),
  component: Services,
});

function Services() {
  return (
    <SiteLayout>
      <section className="bg-soft-gradient">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h1 className="text-4xl font-bold md:text-5xl">Our treatments</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">From routine cleaning to full-mouth rehabilitation — everything under one roof, with transparent pricing.</p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TREATMENTS.map((t) => (
            <div key={t.id} className="glass flex flex-col rounded-2xl p-6">
              <h3 className="text-lg font-semibold">{t.name}</h3>
              <div className="mt-1 text-xs text-muted-foreground">~{t.duration} min appointment</div>
              <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                <li className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 text-primary" /> Painless, professional care</li>
                <li className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 text-primary" /> Quality materials</li>
                <li className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 text-primary" /> Honest pricing</li>
              </ul>
              <div className="mt-6 flex items-end justify-between">
                <div>
                  <div className="text-xs text-muted-foreground">Starting at</div>
                  <div className="text-2xl font-bold text-primary">₹{t.price.toLocaleString("en-IN")}</div>
                </div>
                <Button asChild>
                  <Link to="/appointment" search={{ treatment: t.id } as never}>Book</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}