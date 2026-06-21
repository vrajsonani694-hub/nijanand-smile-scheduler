import { z } from "zod";

export const AppointmentStatus = ["confirmed", "completed", "cancelled"] as const;
export type AppointmentStatus = (typeof AppointmentStatus)[number];

export const AppointmentSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  patientName: z.string().trim().min(2).max(80),
  mobile: z.string().trim().regex(/^[0-9+\s-]{8,20}$/u, "Enter a valid mobile number"),
  age: z.coerce.number().int().min(1).max(120),
  gender: z.enum(["male", "female", "other"]),
  treatment: z.string().min(1),
  notes: z.string().max(500).optional().default(""),
  date: z.string(),
  slot: z.string(),
  status: z.enum(AppointmentStatus).default("confirmed"),
});

export type Appointment = z.infer<typeof AppointmentSchema>;

const KEY = "nijanand_appointments_v1";

function read(): Appointment[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((a) => {
        const r = AppointmentSchema.safeParse(a);
        return r.success ? r.data : null;
      })
      .filter(Boolean) as Appointment[];
  } catch {
    return [];
  }
}

function write(list: Appointment[]) {
  window.localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent("appointments:changed"));
}

export const Store = {
  list(): Appointment[] {
    return read().sort((a, b) => (a.date + a.slot).localeCompare(b.date + b.slot));
  },
  add(a: Appointment) {
    const list = read();
    list.push(a);
    write(list);
  },
  update(id: string, patch: Partial<Appointment>) {
    const list = read().map((a) => (a.id === id ? { ...a, ...patch } : a));
    write(list);
  },
  remove(id: string) {
    write(read().filter((a) => a.id !== id));
  },
  byMobile(mobile: string) {
    const norm = mobile.replace(/\D/g, "").slice(-10);
    return this.list().filter((a) => a.mobile.replace(/\D/g, "").slice(-10) === norm);
  },
  isSlotTaken(date: string, slot: string) {
    return read().some(
      (a) => a.date === date && a.slot === slot && a.status !== "cancelled",
    );
  },
  takenSlots(date: string) {
    return new Set(
      read()
        .filter((a) => a.date === date && a.status !== "cancelled")
        .map((a) => a.slot),
    );
  },
};

export function newId() {
  return `apt_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}