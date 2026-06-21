import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Calendar, Search, X } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "@/components/ui/sonner";
import { formatSlot, treatmentName } from "@/lib/clinic";
import { Store, type Appointment } from "@/lib/storage";

export const Route = createFileRoute("/portal")({
  head: () => ({
    meta: [
      { title: "Patient Portal — Nijanand Dental Care" },
      { name: "description", content: "View, reschedule or cancel your dental appointments using your mobile number." },
      { property: "og:title", content: "Patient Portal" },
      { property: "og:description", content: "Manage your appointments." },
    ],
  }),
  component: Portal,
});

function Portal() {
  const [mobile, setMobile] = useState("");
  const [list, setList] = useState<Appointment[] | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const h = () => setTick((t) => t + 1);
    window.addEventListener("appointments:changed", h);
    return () => window.removeEventListener("appointments:changed", h);
  }, []);

  useEffect(() => {
    if (mobile.replace(/\D/g, "").length >= 6) setList(Store.byMobile(mobile));
  }, [mobile, tick]);

  function search(e: React.FormEvent) {
    e.preventDefault();
    setList(Store.byMobile(mobile));
  }

  function cancel(a: Appointment) {
    Store.update(a.id, { status: "cancelled" });
    toast.success("Appointment cancelled");
  }

  return (
    <SiteLayout>
      <Toaster richColors position="top-center" />
      <section className="bg-soft-gradient">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <h1 className="text-3xl font-bold md:text-4xl">Patient portal</h1>
          <p className="mt-1 text-muted-foreground">Enter your mobile number to view your appointments.</p>
          <form onSubmit={search} className="mt-6 flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[220px]">
              <Label htmlFor="m">Mobile number</Label>
              <Input id="m" inputMode="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="98xxxxxxxx" />
            </div>
            <Button type="submit" className="bg-hero-gradient"><Search className="h-4 w-4" /> Find</Button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-10">
        {list === null ? null : list.length === 0 ? (
          <div className="glass rounded-2xl p-8 text-center text-muted-foreground">No appointments found for this number.</div>
        ) : (
          <div className="space-y-3">
            {list.map((a) => (
              <div key={a.id} className="glass flex flex-wrap items-center justify-between gap-3 rounded-2xl p-5">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Calendar className="h-4 w-4 text-primary" /> {a.date} • {formatSlot(a.slot)}
                  </div>
                  <div className="mt-0.5 text-sm text-muted-foreground">{treatmentName(a.treatment)} • {a.patientName}</div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={a.status} />
                  {a.status === "confirmed" && (
                    <Button size="sm" variant="outline" onClick={() => cancel(a)}>
                      <X className="h-4 w-4" /> Cancel
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}

function StatusBadge({ status }: { status: Appointment["status"] }) {
  const map = {
    confirmed: "bg-primary/10 text-primary",
    completed: "bg-emerald-100 text-emerald-700",
    cancelled: "bg-red-100 text-red-700",
  } as const;
  return <Badge variant="secondary" className={map[status]}>{status}</Badge>;
}