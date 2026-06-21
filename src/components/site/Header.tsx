import { Link } from "@tanstack/react-router";
import { Menu, Phone, Stethoscope, X } from "lucide-react";
import { useState } from "react";
import { CLINIC } from "@/lib/clinic";
import { Button } from "@/components/ui/button";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/appointment", label: "Book" },
  { to: "/portal", label: "Patient Portal" },
  { to: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="glass-soft border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-hero-gradient text-primary-foreground shadow-md">
              <Stethoscope className="h-5 w-5" />
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-bold tracking-tight">{CLINIC.name}</span>
              <span className="block text-[11px] text-muted-foreground">{CLINIC.doctor}</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="rounded-md px-3 py-2 text-sm text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
                activeProps={{ className: "text-primary font-semibold" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            <a
              href={`tel:${CLINIC.phoneTel}`}
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-2 text-sm text-foreground/80 hover:text-primary"
            >
              <Phone className="h-4 w-4" />
              {CLINIC.phone}
            </a>
            <Button asChild>
              <Link to="/appointment">Book Appointment</Link>
            </Button>
          </div>
          <button
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border md:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {open && (
          <div className="border-t md:hidden">
            <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2 text-sm hover:bg-accent"
                  activeProps={{ className: "text-primary font-semibold" }}
                  activeOptions={{ exact: l.to === "/" }}
                >
                  {l.label}
                </Link>
              ))}
              <Button asChild className="mt-2">
                <Link to="/appointment" onClick={() => setOpen(false)}>
                  Book Appointment
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}