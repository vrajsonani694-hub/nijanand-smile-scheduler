import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { CLINIC, whatsappLink } from "@/lib/clinic";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: `Contact — ${CLINIC.name}` },
      { name: "description", content: `Call ${CLINIC.phone} or WhatsApp to book an appointment at ${CLINIC.name}.` },
      { property: "og:title", content: `Contact ${CLINIC.name}` },
      { property: "og:description", content: "Get in touch — call or WhatsApp anytime." },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <SiteLayout>
      <section className="bg-soft-gradient">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h1 className="text-4xl font-bold md:text-5xl">Get in touch</h1>
          <p className="mt-2 max-w-xl text-muted-foreground">We'd love to help. Reach us anytime during clinic hours — or message on WhatsApp.</p>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-12 md:grid-cols-2">
        <div className="glass space-y-5 rounded-2xl p-6">
          <Row icon={Phone} title="Phone" value={CLINIC.phone} href={`tel:${CLINIC.phoneTel}`} />
          <Row icon={MessageCircle} title="WhatsApp" value={CLINIC.phone} href={whatsappLink("Hello, I would like to book an appointment.")} />
          <Row icon={Mail} title="Email" value={CLINIC.email} href={`mailto:${CLINIC.email}`} />
          <Row icon={MapPin} title="Address" value={CLINIC.address} />
          <div className="flex items-start gap-3">
            <span className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary"><Clock className="h-4 w-4" /></span>
            <div>
              <div className="text-sm font-semibold">Working hours</div>
              <div className="text-sm text-muted-foreground">Morning: {CLINIC.hours.morning}</div>
              <div className="text-sm text-muted-foreground">Evening: {CLINIC.hours.evening}</div>
              <div className="text-xs text-muted-foreground">{CLINIC.hours.closed}</div>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button asChild className="bg-hero-gradient"><a href={`tel:${CLINIC.phoneTel}`}>Call now</a></Button>
            <Button asChild variant="outline"><a href={whatsappLink("Hello, I would like to book an appointment.")} target="_blank" rel="noreferrer">WhatsApp</a></Button>
          </div>
        </div>
        <div className="glass overflow-hidden rounded-2xl">
          <iframe
            title="Map"
            src="https://www.google.com/maps?q=Surat,Gujarat&output=embed"
            className="h-full min-h-[360px] w-full"
            loading="lazy"
          />
        </div>
      </section>
    </SiteLayout>
  );
}

function Row({ icon: Icon, title, value, href }: { icon: typeof Phone; title: string; value: string; href?: string }) {
  const content = (
    <div className="flex items-start gap-3">
      <span className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon className="h-4 w-4" /></span>
      <div>
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-sm text-muted-foreground">{value}</div>
      </div>
    </div>
  );
  return href ? <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">{content}</a> : content;
}