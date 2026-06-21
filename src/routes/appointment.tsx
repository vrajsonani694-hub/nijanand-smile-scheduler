import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { CalendarCheck, CheckCircle2, MessageCircle, Sun, Moon } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Toaster } from "@/components/ui/sonner";
import {
  CLINIC,
  EVENING_SLOTS,
  MORNING_SLOTS,
  TREATMENTS,
  formatSlot,
  isPastSlot,
  todayISO,
  treatmentName,
  whatsappLink,
} from "@/lib/clinic";
import { AppointmentSchema, Store, newId, type Appointment } from "@/lib/storage";

const SearchSchema = z.object({ treatment: z.string().optional() });

export const Route = createFileRoute("/appointment")({
  validateSearch: (s) => SearchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Book an Appointment — Nijanand Dental Care" },
      { name: "description", content: "Pick a date and a 15-minute slot. Instant WhatsApp confirmation. Open 10 AM – 1 PM and 5 PM – 10 PM." },
      { property: "og:title", content: "Book a Dental Appointment" },
      { property: "og:description", content: "Pick a date and slot — book in under a minute." },
    ],
  }),
  component: Booking,
});

function Booking() {
  const { treatment: presetTreatment } = Route.useSearch();

  const [date, setDate] = useState(todayISO());
  const [slot, setSlot] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other">("male");
  const [treatment, setTreatment] = useState<string>(presetTreatment || TREATMENTS[0].id);
  const [notes, setNotes] = useState("");
  const [confirmed, setConfirmed] = useState<Appointment | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const handler = () => setTick((t) => t + 1);
    window.addEventListener("appointments:changed", handler);
    return () => window.removeEventListener("appointments:changed", handler);
  }, []);

  const taken = useMemo(() => Store.takenSlots(date), [date, tick]);
  const isToday = date === todayISO();

  function pick(s: string) {
    if (taken.has(s)) return;
    if (isToday && isPastSlot(date, s)) return;
    setSlot(s);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!slot) {
      toast.error("Please select a time slot");
      return;
    }
    const result = AppointmentSchema.safeParse({
      id: newId(),
      createdAt: new Date().toISOString(),
      patientName: name,
      mobile,
      age: Number(age),
      gender,
      treatment,
      notes,
      date,
      slot,
      status: "confirmed",
    });
    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    if (Store.isSlotTaken(date, slot)) {
      toast.error("That slot was just booked. Please pick another.");
      setSlot(null);
      return;
    }
    Store.add(result.data);
    setConfirmed(result.data);
    toast.success("Appointment confirmed!");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (confirmed) {
    const msg = `Hello ${confirmed.patientName},\n\nYour appointment at ${CLINIC.name} has been confirmed.\n\nDoctor: ${CLINIC.doctor}\nDate: ${confirmed.date}\nTime: ${formatSlot(confirmed.slot)}\nTreatment: ${treatmentName(confirmed.treatment)}\n\nClinic Contact: ${CLINIC.phone}\n\nThank You.`;
    return (
      <SiteLayout>
        <Toaster richColors position="top-center" />
        <section className="mx-auto max-w-2xl px-4 py-16">
          <div className="glass rounded-3xl p-8 text-center">
            <CheckCircle2 className="mx-auto h-14 w-14 text-primary" />
            <h1 className="mt-4 text-3xl font-bold">Appointment Confirmed</h1>
            <p className="mt-1 text-muted-foreground">We've saved your slot. Please send the confirmation on WhatsApp so the clinic gets a copy.</p>
            <div className="mt-6 grid gap-3 rounded-2xl border bg-white/60 p-5 text-left text-sm">
              <Row k="Patient" v={confirmed.patientName} />
              <Row k="Mobile" v={confirmed.mobile} />
              <Row k="Doctor" v={CLINIC.doctor} />
              <Row k="Treatment" v={treatmentName(confirmed.treatment)} />
              <Row k="Date" v={confirmed.date} />
              <Row k="Time" v={formatSlot(confirmed.slot)} />
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Button asChild className="bg-[#25D366] hover:bg-[#1ebe57]">
                <a href={whatsappLink(msg)} target="_blank" rel="noreferrer">
                  <MessageCircle className="h-4 w-4" /> Send WhatsApp confirmation
                </a>
              </Button>
              <Button variant="outline" onClick={() => { setConfirmed(null); setSlot(null); }}>
                Book another
              </Button>
            </div>
          </div>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <Toaster richColors position="top-center" />
      <section className="bg-soft-gradient">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h1 className="text-3xl font-bold md:text-4xl">Book an appointment</h1>
          <p className="mt-1 text-muted-foreground">Pick a date and a 15-minute slot — it only takes a minute.</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-10 lg:grid-cols-[1fr_1.2fr]">
        {/* Slot picker */}
        <div className="glass space-y-5 rounded-2xl p-5">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              min={todayISO()}
              value={date}
              onChange={(e) => { setDate(e.target.value); setSlot(null); }}
              className="mt-1"
            />
          </div>
          <SlotGrid title="Morning" icon={Sun} slots={MORNING_SLOTS} taken={taken} pickedSlot={slot} onPick={pick} disablePast={isToday} date={date} />
          <SlotGrid title="Evening" icon={Moon} slots={EVENING_SLOTS} taken={taken} pickedSlot={slot} onPick={pick} disablePast={isToday} date={date} />
          <p className="text-xs text-muted-foreground">Clinic closed {CLINIC.hours.closed}.</p>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="glass space-y-4 rounded-2xl p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">Full name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ramesh Patel" required maxLength={80} />
            </div>
            <div>
              <Label htmlFor="mobile">Mobile number</Label>
              <Input id="mobile" inputMode="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="98xxxxxxxx" required maxLength={20} />
            </div>
            <div>
              <Label htmlFor="age">Age</Label>
              <Input id="age" type="number" min={1} max={120} value={age} onChange={(e) => setAge(e.target.value)} required />
            </div>
            <div>
              <Label>Gender</Label>
              <RadioGroup value={gender} onValueChange={(v) => setGender(v as typeof gender)} className="mt-2 flex gap-4">
                {(["male", "female", "other"] as const).map((g) => (
                  <label key={g} className="flex items-center gap-2 text-sm capitalize">
                    <RadioGroupItem value={g} /> {g}
                  </label>
                ))}
              </RadioGroup>
            </div>
          </div>
          <div>
            <Label>Treatment</Label>
            <Select value={treatment} onValueChange={setTreatment}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                {TREATMENTS.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea id="notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Anything we should know?" maxLength={500} />
          </div>

          <div className="rounded-xl border bg-white/60 p-3 text-sm">
            {slot ? (
              <>Booking <b>{formatSlot(slot)}</b> on <b>{date}</b></>
            ) : (
              <span className="text-muted-foreground">Pick a time slot to continue</span>
            )}
          </div>

          <Button type="submit" size="lg" className="w-full bg-hero-gradient">
            <CalendarCheck className="h-5 w-5" /> Confirm appointment
          </Button>
        </form>
      </section>
    </SiteLayout>
  );
}

function SlotGrid({
  title, icon: Icon, slots, taken, pickedSlot, onPick, disablePast, date,
}: {
  title: string; icon: typeof Sun; slots: string[]; taken: Set<string>;
  pickedSlot: string | null; onPick: (s: string) => void; disablePast: boolean; date: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 text-sm font-semibold"><Icon className="h-4 w-4 text-primary" /> {title}</div>
      <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
        {slots.map((s) => {
          const isTaken = taken.has(s);
          const past = disablePast && isPastSlot(date, s);
          const disabled = isTaken || past;
          const active = pickedSlot === s;
          return (
            <button
              key={s}
              type="button"
              onClick={() => onPick(s)}
              disabled={disabled}
              className={[
                "rounded-lg border px-2 py-2 text-xs font-medium transition-all",
                disabled ? "cursor-not-allowed bg-muted text-muted-foreground line-through opacity-60"
                : active ? "border-primary bg-hero-gradient text-primary-foreground shadow"
                : "bg-white/70 hover:border-primary hover:text-primary",
              ].join(" ")}
            >
              {formatSlot(s)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-medium">{v}</span>
    </div>
  );
}