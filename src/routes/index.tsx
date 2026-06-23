import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarCheck, ShieldCheck, Smile, Sparkles, Clock, MessageCircle } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { WhatsAppFab } from "@/components/site/WhatsAppFab";
import { Button } from "@/components/ui/button";
import { CLINIC, TREATMENTS, whatsappLink } from "@/lib/clinic";
import heroImg from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nijanand Dental Care — Dr. Dharmesh Padsala | Book Online" },
      { name: "description", content: "Painless, modern dentistry in a calming clinic. Book online with Dr. Dharmesh Padsala — RCT, implants, crowns, cleaning, whitening." },
      { property: "og:title", content: "Nijanand Dental Care — Book Online" },
      { property: "og:description", content: "Book your dental appointment in seconds." },
      { property: "og:image", content: heroImg },
      { name: "twitter:image", content: heroImg },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-soft-gradient">
        <div className="absolute inset-0 -z-10 opacity-60 [background-image:radial-gradient(circle_at_20%_20%,oklch(0.85_0.1_210/.7),transparent_45%),radial-gradient(circle_at_80%_30%,oklch(0.78_0.13_230/.5),transparent_50%)]" />
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border bg-card/70 px-3 py-1 text-xs text-primary backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> Trusted dental care in your neighbourhood
            </span>
            <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
              Healthy smiles, <span className="text-gradient">handled with care</span>.
            </h1>
            <p className="mt-4 max-w-lg text-base text-muted-foreground md:text-lg">
              {CLINIC.name} offers gentle, modern dentistry by {CLINIC.doctor}. From routine checkups to implants — book your slot online in seconds.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-hero-gradient">
                <Link to="/appointment">
                  <CalendarCheck className="h-5 w-5" /> Book Appointment
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={whatsappLink("Hello Dr. Padsala, I would like to book an appointment.")} target="_blank" rel="noreferrer">
                  <MessageCircle className="h-5 w-5" /> WhatsApp Us
                </a>
              </Button>
            </div>
            <div className="mt-8 grid max-w-md grid-cols-3 gap-4 text-center">
              {[
                { n: "10+", l: "Years experience" },
                { n: "5k+", l: "Happy patients" },
                { n: "9", l: "Treatments" },
              ].map((s) => (
                <div key={s.l} className="glass-soft rounded-xl p-3">
                  <div className="text-xl font-bold text-primary">{s.n}</div>
                  <div className="text-[11px] text-muted-foreground">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="glass overflow-hidden rounded-3xl">
              <img
                src={heroImg}
                alt="Modern dental clinic"
                width={1600}
                height={1024}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="glass absolute bottom-6 left-6 hidden rounded-2xl p-4 shadow-lg md:block">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Clock className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-sm font-semibold">Opening Hours</div>
                  <div className="text-xs text-muted-foreground">{CLINIC.hours.morning} • {CLINIC.hours.evening}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: ShieldCheck, t: "Sterile & Safe", d: "Hospital-grade sterilisation, disposable kits and modern infection control." },
            { icon: Smile, t: "Painless Care", d: "Latest techniques and gentle hands keep you comfortable end-to-end." },
            { icon: Sparkles, t: "Modern Tech", d: "Digital X-rays, RVG and advanced equipment for precise diagnosis." },
          ].map(({ icon: Icon, t, d }) => (
            <div key={t} className="glass rounded-2xl p-6">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-hero-gradient text-primary-foreground">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-lg font-semibold">{t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services preview */}
      <section className="bg-soft-gradient py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Treatments we offer</h2>
              <p className="mt-2 text-sm text-muted-foreground">Comprehensive dental care under one roof.</p>
            </div>
            <Button asChild variant="ghost">
              <Link to="/services">View all <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TREATMENTS.slice(0, 6).map((t) => (
              <Link key={t.id} to="/appointment" className="glass group rounded-2xl p-5 transition-transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{t.name}</h3>
                  <span className="text-xs text-muted-foreground">{t.duration} min</span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">From</span>
                  <span className="text-lg font-bold text-primary">₹{t.price.toLocaleString("en-IN")}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="glass rounded-3xl bg-hero-gradient p-8 text-primary-foreground md:p-12">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold md:text-3xl">Ready for a healthier smile?</h2>
              <p className="mt-1 text-sm text-primary-foreground/90">Book your appointment in under a minute.</p>
            </div>
            <div className="flex gap-3">
              <Button asChild size="lg" variant="secondary">
                <Link to="/appointment">Book now</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/40 bg-card/10 text-white hover:bg-card/20 hover:text-white">
                <a href={`tel:${CLINIC.phoneTel}`}>Call {CLINIC.phone}</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
      <WhatsAppFab />
    </SiteLayout>
  );
}
