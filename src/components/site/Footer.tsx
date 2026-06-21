import { Link } from "@tanstack/react-router";
import { MapPin, Phone, MessageCircle, Clock, Stethoscope } from "lucide-react";
import { CLINIC, whatsappLink } from "@/lib/clinic";

export function Footer() {
  return (
    <footer className="mt-24 border-t bg-soft-gradient">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-semibold">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-hero-gradient text-primary-foreground">
              <Stethoscope className="h-4 w-4" />
            </span>
            {CLINIC.name}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Caring, painless and modern dentistry by {CLINIC.doctor}.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Quick Links</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-primary">About Doctor</Link></li>
            <li><Link to="/services" className="hover:text-primary">Services</Link></li>
            <li><Link to="/appointment" className="hover:text-primary">Book Appointment</Link></li>
            <li><Link to="/portal" className="hover:text-primary">Patient Portal</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Contact</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><Phone className="mt-0.5 h-4 w-4 text-primary" /><a href={`tel:${CLINIC.phoneTel}`}>{CLINIC.phone}</a></li>
            <li className="flex items-start gap-2"><MessageCircle className="mt-0.5 h-4 w-4 text-primary" /><a href={whatsappLink("Hello, I would like to book an appointment.")} target="_blank" rel="noreferrer">WhatsApp</a></li>
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 text-primary" />{CLINIC.address}</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Working Hours</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><Clock className="mt-0.5 h-4 w-4 text-primary" />{CLINIC.hours.morning}</li>
            <li className="flex items-start gap-2"><Clock className="mt-0.5 h-4 w-4 text-primary" />{CLINIC.hours.evening}</li>
            <li className="text-xs">{CLINIC.hours.closed}</li>
          </ul>
        </div>
      </div>
      <div className="border-t">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-4 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} {CLINIC.name}. All rights reserved.</span>
          <Link to="/admin" className="hover:text-primary">Admin</Link>
        </div>
      </div>
    </footer>
  );
}