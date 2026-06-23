import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Calendar, CheckCircle2, ChevronLeft, ChevronRight, Clock, IndianRupee, LogOut, Search, Trash2, Users, XCircle } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Toaster } from "@/components/ui/sonner";
import { formatSlot, todayISO, treatmentName, treatmentPrice, TREATMENTS } from "@/lib/clinic";
import { Store, type Appointment } from "@/lib/storage";

const SESSION_KEY = "nijanand_admin_session";
const DEFAULT_PASSWORD = "admin1234"; // demo

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Nijanand Dental Care" },
      { name: "description", content: "Clinic admin dashboard." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: Admin,
});

function Admin() {
  const [authed, setAuthed] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setAuthed(window.sessionStorage.getItem(SESSION_KEY) === "1");
    }
  }, []);
  if (!authed) return <Login onSuccess={() => setAuthed(true)} />;
  return <Dashboard onLogout={() => { sessionStorage.removeItem(SESSION_KEY); setAuthed(false); }} />;
}

function Login({ onSuccess }: { onSuccess: () => void }) {
  const [pw, setPw] = useState("");
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (pw === DEFAULT_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "1");
      onSuccess();
    } else {
      toast.error("Invalid password");
    }
  }
  return (
    <SiteLayout>
      <Toaster richColors position="top-center" />
      <section className="mx-auto max-w-md px-4 py-20">
        <div className="glass rounded-2xl p-6">
          <h1 className="text-2xl font-bold">Admin login</h1>
          <p className="mt-1 text-sm text-muted-foreground">Default password: <code className="rounded bg-muted px-1.5 py-0.5">{DEFAULT_PASSWORD}</code></p>
          <form onSubmit={submit} className="mt-5 space-y-3">
            <div>
              <Label htmlFor="pw">Password</Label>
              <Input id="pw" type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoFocus />
            </div>
            <Button type="submit" className="w-full bg-hero-gradient">Sign in</Button>
          </form>
        </div>
      </section>
    </SiteLayout>
  );
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const h = () => setTick((t) => t + 1);
    window.addEventListener("appointments:changed", h);
    return () => window.removeEventListener("appointments:changed", h);
  }, []);
  const all = useMemo(() => Store.list(), [tick]);
  const today = todayISO();

  const todays = all.filter((a) => a.date === today);
  const upcoming = all.filter((a) => a.date > today && a.status === "confirmed");
  const completed = all.filter((a) => a.status === "completed");
  const cancelled = all.filter((a) => a.status === "cancelled");
  const revenue = completed.reduce((sum, a) => sum + treatmentPrice(a.treatment), 0);
  const patients = new Set(all.map((a) => a.mobile.replace(/\D/g, "").slice(-10))).size;

  function setStatus(a: Appointment, status: Appointment["status"]) {
    Store.update(a.id, { status });
    toast.success(`Marked ${status}`);
  }
  function remove(a: Appointment) {
    Store.remove(a.id);
    toast.success("Deleted");
  }

  function exportCSV() {
    const headers = ["id", "date", "slot", "patient", "mobile", "age", "gender", "treatment", "price", "status", "notes"];
    const rows = all.map((a) => [
      a.id, a.date, a.slot, a.patientName, a.mobile, a.age, a.gender,
      treatmentName(a.treatment), treatmentPrice(a.treatment), a.status, (a.notes ?? "").replace(/[\r\n,]/g, " "),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `appointments-${today}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <SiteLayout>
      <Toaster richColors position="top-center" />
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome back, doctor.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportCSV}>Export CSV</Button>
            <Button variant="ghost" onClick={onLogout}><LogOut className="h-4 w-4" /> Sign out</Button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Stat icon={Calendar} label="Today" value={todays.length} />
          <Stat icon={Clock} label="Upcoming" value={upcoming.length} />
          <Stat icon={CheckCircle2} label="Completed" value={completed.length} />
          <Stat icon={XCircle} label="Cancelled" value={cancelled.length} />
          <Stat icon={Users} label="Patients" value={patients} />
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Stat icon={IndianRupee} label="Revenue (completed)" value={`₹${revenue.toLocaleString("en-IN")}`} highlight />
          <Stat icon={Calendar} label="Total appointments" value={all.length} />
        </div>

        <Tabs defaultValue="today" className="mt-8">
          <TabsList>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="treatments">Treatments</TabsTrigger>
          </TabsList>
          <TabsContent value="today" className="mt-4"><AptTable rows={todays} onStatus={setStatus} onRemove={remove} /></TabsContent>
          <TabsContent value="upcoming" className="mt-4"><AptTable rows={upcoming} onStatus={setStatus} onRemove={remove} /></TabsContent>
          <TabsContent value="all" className="mt-4"><AptTable rows={all} onStatus={setStatus} onRemove={remove} /></TabsContent>
          <TabsContent value="calendar" className="mt-4"><MonthCalendar all={all} /></TabsContent>
          <TabsContent value="patients" className="mt-4"><Patients all={all} /></TabsContent>
          <TabsContent value="treatments" className="mt-4"><Treatments /></TabsContent>
        </Tabs>
      </section>
    </SiteLayout>
  );
}

function Stat({ icon: Icon, label, value, highlight }: { icon: typeof Calendar; label: string; value: number | string; highlight?: boolean }) {
  return (
    <div className={"glass rounded-2xl p-4 " + (highlight ? "bg-hero-gradient text-primary-foreground" : "")}>
      <div className="flex items-center gap-2 text-xs uppercase tracking-wide opacity-80"><Icon className="h-4 w-4" /> {label}</div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
    </div>
  );
}

function AptTable({ rows, onStatus, onRemove }: { rows: Appointment[]; onStatus: (a: Appointment, s: Appointment["status"]) => void; onRemove: (a: Appointment) => void }) {
  if (rows.length === 0) return <div className="glass rounded-2xl p-8 text-center text-muted-foreground">No appointments.</div>;
  return (
    <div className="glass overflow-x-auto rounded-2xl">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Patient</TableHead>
            <TableHead>Mobile</TableHead>
            <TableHead>Treatment</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((a) => (
            <TableRow key={a.id}>
              <TableCell>{a.date}</TableCell>
              <TableCell>{formatSlot(a.slot)}</TableCell>
              <TableCell>{a.patientName} <span className="text-xs text-muted-foreground">({a.age}, {a.gender[0]?.toUpperCase()})</span></TableCell>
              <TableCell><a href={`tel:${a.mobile}`} className="text-primary">{a.mobile}</a></TableCell>
              <TableCell>{treatmentName(a.treatment)}</TableCell>
              <TableCell><span className="rounded-md bg-muted px-2 py-0.5 text-xs capitalize">{a.status}</span></TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  {a.status !== "completed" && <Button size="sm" variant="ghost" onClick={() => onStatus(a, "completed")}>Done</Button>}
                  {a.status !== "cancelled" && <Button size="sm" variant="ghost" onClick={() => onStatus(a, "cancelled")}>Cancel</Button>}
                  <Button size="sm" variant="ghost" onClick={() => onRemove(a)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function MonthCalendar({ all }: { all: Appointment[] }) {
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const byDate = new Map<string, Appointment[]>();
  for (const a of all) {
    const arr = byDate.get(a.date) ?? [];
    arr.push(a);
    byDate.set(a.date, arr);
  }

  function shift(n: number) { setCursor(new Date(year, month + n, 1)); }

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => shift(-1)}><ChevronLeft className="h-4 w-4" /></Button>
        <div className="text-lg font-semibold">{cursor.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</div>
        <Button variant="ghost" size="sm" onClick={() => shift(1)}><ChevronRight className="h-4 w-4" /></Button>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => <div key={d}>{d}</div>)}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {Array.from({ length: firstDay }).map((_, i) => <div key={"e"+i} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const items = byDate.get(iso) ?? [];
          const isToday = iso === todayISO();
          return (
            <div key={iso} className={"min-h-[72px] rounded-lg border p-1.5 text-left text-xs " + (isToday ? "border-primary bg-primary/5" : "bg-card/70")}>
              <div className="font-semibold">{day}</div>
              <div className="mt-1 space-y-0.5">
                {items.slice(0, 2).map((a) => (
                  <div key={a.id} className={"truncate rounded px-1 py-0.5 text-[10px] " + colorFor(a.status)}>{formatSlot(a.slot)} {a.patientName}</div>
                ))}
                {items.length > 2 && <div className="text-[10px] text-muted-foreground">+{items.length - 2} more</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
function colorFor(s: Appointment["status"]) {
  if (s === "completed") return "bg-emerald-100 text-emerald-700";
  if (s === "cancelled") return "bg-red-100 text-red-700";
  return "bg-sky-100 text-sky-700";
}

function Patients({ all }: { all: Appointment[] }) {
  const [q, setQ] = useState("");
  const map = new Map<string, { name: string; mobile: string; age: number; gender: string; visits: number; last: string }>();
  for (const a of all) {
    const key = a.mobile.replace(/\D/g, "").slice(-10);
    const existing = map.get(key);
    if (!existing) map.set(key, { name: a.patientName, mobile: a.mobile, age: a.age, gender: a.gender, visits: 1, last: a.date });
    else { existing.visits += 1; if (a.date > existing.last) existing.last = a.date; }
  }
  const rows = Array.from(map.values()).filter((p) =>
    !q || p.name.toLowerCase().includes(q.toLowerCase()) || p.mobile.includes(q));
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search name or mobile" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs" />
      </div>
      {rows.length === 0 ? <p className="mt-6 text-center text-sm text-muted-foreground">No patients yet.</p> : (
        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Visits</TableHead>
                <TableHead>Last visit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((p) => (
                <TableRow key={p.mobile}>
                  <TableCell>{p.name}</TableCell>
                  <TableCell><a href={`tel:${p.mobile}`} className="text-primary">{p.mobile}</a></TableCell>
                  <TableCell>{p.age}</TableCell>
                  <TableCell className="capitalize">{p.gender}</TableCell>
                  <TableCell>{p.visits}</TableCell>
                  <TableCell>{p.last}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

function Treatments() {
  return (
    <div className="glass rounded-2xl p-5">
      <p className="text-sm text-muted-foreground">Treatments are configured in <code>src/lib/clinic.ts</code>. Connect Lovable Cloud to enable full CRUD from this UI.</p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {TREATMENTS.map((t) => (
          <div key={t.id} className="rounded-xl border bg-card/70 p-3">
            <div className="font-medium">{t.name}</div>
            <div className="text-xs text-muted-foreground">{t.duration} min • ₹{t.price.toLocaleString("en-IN")}</div>
          </div>
        ))}
      </div>
    </div>
  );
}