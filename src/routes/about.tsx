import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, GraduationCap, HeartHandshake, Stethoscope } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { CLINIC } from "@/lib/clinic";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: `About ${CLINIC.doctor} — ${CLINIC.name}` },
      { name: "description", content: `Meet ${CLINIC.doctor}, lead dental surgeon at ${CLINIC.name}. Years of experience in painless dentistry, implants and cosmetic care.` },
      { property: "og:title", content: `About ${CLINIC.doctor}` },
      { property: "og:description", content: `Meet ${CLINIC.doctor} at ${CLINIC.name}.` },
    ],
  }),
  component: About,
});

function About() {
  return (
    <SiteLayout>
      <section className="bg-soft-gradient">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <span className="text-sm font-medium text-primary">About the doctor</span>
          <h1 className="mt-2 text-4xl font-bold md:text-5xl">{CLINIC.doctor}</h1>
          <p className="mt-2 text-muted-foreground">BDS — Dental Surgeon & Implantologist</p>
          <p className="mt-6 max-w-3xl text-base text-muted-foreground md:text-lg">
            With over a decade of clinical experience, Dr. Padsala combines warmth and precision to deliver dental care that's
            modern, ethical and genuinely painless. Each treatment plan is tailored to the patient — never rushed, never one-size-fits-all.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: GraduationCap, t: "Qualified", d: "BDS from a reputed institute, with continuing education in implants & aesthetics." },
            { icon: Award, t: "Experienced", d: "Hundreds of successful RCTs, crowns and implants completed." },
            { icon: HeartHandshake, t: "Patient-first", d: "Honest treatment plans, transparent pricing, no over-treatment." },
            { icon: Stethoscope, t: "Modern", d: "Digital X-ray, RVG and sterile single-use consumables." },
          ].map(({ icon: Icon, t, d }) => (
            <div key={t} className="glass rounded-2xl p-5">
              <Icon className="h-6 w-6 text-primary" />
              <h3 className="mt-3 font-semibold">{t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <Button asChild size="lg" className="bg-hero-gradient">
            <Link to="/appointment">Book a consultation</Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}