export const CLINIC = {
  name: "Nijanand Dental Care",
  doctor: "Dr. Dharmesh Padsala",
  doctorTitle: "BDS — Dental Surgeon",
  phone: "+91 8000337283",
  phoneTel: "+918000337283",
  whatsapp: "918000337283",
  email: "care@nijananddental.com",
  address: "Nijanand Dental Care, Surat, Gujarat, India",
  hours: {
    morning: "10:00 AM – 01:00 PM",
    evening: "05:00 PM – 10:00 PM",
    closed: "Closed 01:00 PM – 05:00 PM",
  },
} as const;

export const SLOT_MINUTES = 15;

// Morning: 10:00 → 12:45 (inclusive) — last booking starts at 12:45
// Evening: 17:00 → 21:45 (inclusive)
function genSlots(startH: number, startM: number, endH: number, endM: number) {
  const out: string[] = [];
  let h = startH;
  let m = startM;
  while (h < endH || (h === endH && m <= endM)) {
    out.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    m += SLOT_MINUTES;
    if (m >= 60) {
      m -= 60;
      h += 1;
    }
  }
  return out;
}

export const MORNING_SLOTS = genSlots(10, 0, 12, 45);
export const EVENING_SLOTS = genSlots(17, 0, 21, 45);
export const ALL_SLOTS = [...MORNING_SLOTS, ...EVENING_SLOTS];

export function formatSlot(slot: string) {
  const [h, m] = slot.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hh = ((h + 11) % 12) + 1;
  return `${hh}:${String(m).padStart(2, "0")} ${period}`;
}

export const TREATMENTS = [
  { id: "consultation", name: "Consultation", price: 300, duration: 15 },
  { id: "cleaning", name: "Teeth Cleaning (Scaling)", price: 1500, duration: 30 },
  { id: "whitening", name: "Teeth Whitening", price: 6000, duration: 60 },
  { id: "rct", name: "Root Canal Treatment", price: 4500, duration: 60 },
  { id: "crown", name: "Dental Crown", price: 5500, duration: 45 },
  { id: "implant", name: "Dental Implant", price: 25000, duration: 90 },
  { id: "extraction", name: "Tooth Extraction", price: 800, duration: 30 },
  { id: "braces", name: "Braces Consultation", price: 500, duration: 30 },
  { id: "denture", name: "Denture", price: 8000, duration: 60 },
] as const;

export type TreatmentId = (typeof TREATMENTS)[number]["id"];

export function treatmentName(id: string) {
  return TREATMENTS.find((t) => t.id === id)?.name ?? id;
}
export function treatmentPrice(id: string) {
  return TREATMENTS.find((t) => t.id === id)?.price ?? 0;
}

export function whatsappLink(message: string) {
  return `https://wa.me/${CLINIC.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function todayISO() {
  const d = new Date();
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tz).toISOString().slice(0, 10);
}

export function isPastSlot(dateISO: string, slot: string) {
  const now = new Date();
  const [h, m] = slot.split(":").map(Number);
  const dt = new Date(`${dateISO}T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`);
  return dt.getTime() < now.getTime();
}