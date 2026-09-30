// ─── Data ─────────────────────────────────────────────────────────────────────
export const SEVEN_DAY = [
  { d: "Mon", vol: 142, lots: 18, payout: 38400 },
  { d: "Tue", vol: 198, lots: 24, payout: 51200 },
  { d: "Wed", vol: 87,  lots: 11, payout: 21800 },
  { d: "Thu", vol: 234, lots: 31, payout: 63700 },
  { d: "Fri", vol: 312, lots: 38, payout: 84100 },
  { d: "Sat", vol: 276, lots: 33, payout: 74200 },
  { d: "Sun", vol: 189, lots: 22, payout: 49600 },
];

// Simple seeded pseudo-random for deterministic chart data
function seededRandom(seed: number) { let s = seed; return () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646; }; }
const _rng = seededRandom(42);

export const PRICE_30D = Array.from({ length: 30 }, (_, i) => ({
  d: `Jul ${i + 1}`,
  pcb:      265 + Math.sin(i / 3.2) * 18 + (_rng() - 0.5) * 8,
  cables:   325 + Math.cos(i / 4.1) * 14 + (_rng() - 0.5) * 7,
  batteries:112 + Math.sin(i / 5.0) * 9  + (_rng() - 0.5) * 5,
  crt:       15 + Math.sin(i / 6.5) * 3  + (_rng() - 0.5) * 2,
  aluminium: 60 + Math.cos(i / 3.8) * 5  + (_rng() - 0.5) * 3,
}));

export const LOTS_DATA = [
  { id: "LOT-8812", emoji: "battery", cat: "Battery",  collector: "Ravi Kumar",   phone: "98201 44310", estimatedWeight: 12.5, actualWeight: null, rate: 120, cpcbRate: 115, arrival: "09:14", status: "pending",  hazard: true  },
  { id: "LOT-8811", emoji: "cpu",     cat: "PCB",   collector: "Sunita Pawar", phone: "98765 32100", estimatedWeight: 6.2,  actualWeight: null, rate: 280, cpcbRate: 265, arrival: "09:02", status: "pending",  hazard: false },
  { id: "LOT-8810", emoji: "cable",   cat: "Cable",     collector: "Ahmed Sheikh", phone: "91234 88720", estimatedWeight: 18.0, actualWeight: null, rate: 340, cpcbRate: 325, arrival: "08:44", status: "pending",  hazard: false },
  { id: "LOT-8809", emoji: "cylinder", cat: "Motor",   collector: "Meena Raut",   phone: "97654 11230", estimatedWeight: 30.0, actualWeight: 30.0, rate: 65,  cpcbRate: 60,  arrival: "08:31", status: "settling", hazard: false },
  { id: "LOT-8808", emoji: "tv",      cat: "CRT Glass",    collector: "Priya Desai",  phone: "90123 55670", estimatedWeight: 25.0, actualWeight: 25.0, rate: 18,  cpcbRate: 15,  arrival: "07:58", status: "settled",  hazard: false },
  { id: "LOT-8807", emoji: "cpu",     cat: "PCB",   collector: "Ramesh Yadav", phone: "87654 99210", estimatedWeight: 9.0,  actualWeight: 9.0,  rate: 278, cpcbRate: 265, arrival: "07:42", status: "settled",  hazard: false },
  { id: "LOT-8806", emoji: "cable",   cat: "Cable",     collector: "Sunita Pawar", phone: "98765 32100", estimatedWeight: 14.5, actualWeight: 14.5, rate: 338, cpcbRate: 325, arrival: "07:20", status: "settled",  hazard: false },
  { id: "LOT-8805", emoji: "battery", cat: "Battery",  collector: "Ravi Kumar",   phone: "98201 44310", estimatedWeight: 8.0,  actualWeight: null, rate: 118, cpcbRate: 115, arrival: "07:05", status: "rejected", hazard: true  },
];

export const INVENTORY_DATA = [
  { id: "INV-4401", emoji: "cable",   cat: "Cable",     wt: "84.5 kg",  received: "14 Jul", collector: "Ahmed Sheikh", status: "in_stock",   zone: "Zone A-2", age: 0  },
  { id: "INV-4400", emoji: "cpu",     cat: "PCB",  wt: "62.0 kg",  received: "13 Jul", collector: "Sunita Pawar", status: "in_stock",   zone: "Zone B-1", age: 1  },
  { id: "INV-4399", emoji: "battery", cat: "Battery", wt: "38.5 kg",  received: "13 Jul", collector: "Ravi Kumar",   status: "processing", zone: "Zone C-3", age: 1  },
  { id: "INV-4398", emoji: "cylinder", cat: "Motor",   wt: "120.0 kg", received: "11 Jul", collector: "Meena Raut",   status: "processed",  zone: "Zone A-1", age: 3  },
  { id: "INV-4397", emoji: "settings", cat: "Magnet-Bearing Assembly",      wt: "210.0 kg", received: "09 Jul", collector: "Ramesh Yadav", status: "sold",       zone: "—",        age: 5  },
  { id: "INV-4396", emoji: "tv",      cat: "CRT Glass",   wt: "75.0 kg",  received: "05 Jul", collector: "Priya Desai",  status: "in_stock",   zone: "Zone D-4", age: 9  },
  { id: "INV-4395", emoji: "cpu",     cat: "PCB",  wt: "44.0 kg",  received: "02 Jul", collector: "Ahmed Sheikh", status: "in_stock",   zone: "Zone B-2", age: 12 },
  { id: "INV-4394", emoji: "battery", cat: "Battery",wt: "96.0 kg",  received: "28 Jun", collector: "Ravi Kumar",   status: "processing", zone: "Zone C-1", age: 16 },
];

  export const MATERIALS = [
    { name: "Cable",     emoji: "cable", rate: 340, prev: 328, unit: "kg", pinned: true,  hazard: false, trend: [328,332,335,340,338,342,340], cat: "Metal" },
    { name: "PCB",   emoji: "cpu", rate: 280, prev: 265, unit: "kg", pinned: true,  hazard: false, trend: [265,270,268,274,278,282,280], cat: "Electronics" },
    { name: "Battery",  emoji: "battery", rate: 120, prev: 123, unit: "kg", pinned: false, hazard: true,  trend: [123,120,118,122,120,119,120], cat: "Battery" },
    { name: "LCD Panel", emoji: "tv", rate: 80, prev: 78, unit: "kg", pinned: false, hazard: false, trend: [78,79,79,80,81,80,80], cat: "Electronics" },
    { name: "Motor",    emoji: "cylinder", rate: 210,  prev: 195,  unit: "kg", pinned: false, hazard: false, trend: [195,198,200,205,210,210,210],        cat: "Metal" },
    { name: "CRT Glass",    emoji: "tv", rate: 18,  prev: 20,  unit: "kg", pinned: false, hazard: false, trend: [20,19,18,18,17,18,18],        cat: "Electronics" },
    { name: "Magnet-Bearing Assembly",       emoji: "settings", rate: 350,  prev: 330,  unit: "kg", pinned: false, hazard: false, trend: [330,335,340,345,350,348,350],        cat: "Metal" },
    { name: "Mixed Plastics",    emoji: "box", rate: 14,  prev: 12,  unit: "kg", pinned: false, hazard: false, trend: [12,12,13,13,14,14,14],        cat: "Plastic" },
  ];

export const TRANSACTIONS = [
  { id: "TXN-9910", date: "14 Jul 09:18", lot: "LOT-8809", cat: "Motor",    collector: "Meena Raut",   wt: "30.0 kg", rate: "₹65",  amount: 1950,  method: "UPI",  status: "paid",    flag: null },
  { id: "TXN-9909", date: "14 Jul 08:55", lot: "LOT-8808", cat: "CRT Glass",    collector: "Priya Desai",  wt: "25.0 kg", rate: "₹18",  amount: 450,   method: "UPI",  status: "paid",    flag: null },
  { id: "TXN-9908", date: "14 Jul 07:50", lot: "LOT-8807", cat: "PCB",   collector: "Ramesh Yadav", wt: "9.0 kg",  rate: "₹278", amount: 2502,  method: "Bank", status: "paid",    flag: null },
  { id: "TXN-9907", date: "13 Jul 16:22", lot: "LOT-8806", cat: "Cable",     collector: "Sunita Pawar", wt: "14.5 kg", rate: "₹338", amount: 4901,  method: "UPI",  status: "paid",    flag: null },
  { id: "TXN-9906", date: "13 Jul 14:10", lot: "LOT-8804", cat: "PCB",   collector: "Ahmed Sheikh", wt: "6.2 kg",  rate: "₹280", amount: 1736,  method: "UPI",  status: "paid",    flag: 18   },
  { id: "TXN-9905", date: "12 Jul 11:05", lot: "LOT-8803", cat: "Cable",     collector: "Priya Desai",  wt: "9.5 kg",  rate: "₹342", amount: 3249,  method: "Bank", status: "paid",    flag: 21   },

  { id: "TXN-9903", date: "11 Jul 15:44", lot: "LOT-8801", cat: "Motor",    collector: "Meena Raut",   wt: "22.0 kg", rate: "₹65",  amount: 1430,  method: "UPI",  status: "paid",    flag: null },
];

export const COLLECTORS = [
  { id: "KC-C-001", name: "Ravi Kumar",   area: "Dharavi",      lots: 124, vol: "1,840 kg", paid: "₹2,14,200", rating: 4.8, kyc: "verified", lastActive: "Today",  badge: "Gold"   },
  { id: "KC-C-002", name: "Sunita Pawar", area: "Kurla West",   lots: 98,  vol: "1,220 kg", paid: "₹1,68,400", rating: 4.6, kyc: "verified", lastActive: "Today",  badge: "Silver" },
  { id: "KC-C-003", name: "Ahmed Sheikh", area: "Andheri East", lots: 87,  vol: "1,640 kg", paid: "₹1,92,000", rating: 4.5, kyc: "verified", lastActive: "Today",  badge: "Silver" },
  { id: "KC-C-004", name: "Meena Raut",   area: "Bhandup",      lots: 62,  vol: "980 kg",   paid: "₹1,04,700", rating: 4.3, kyc: "verified", lastActive: "2d ago", badge: "Bronze" },
  { id: "KC-C-005", name: "Priya Desai",  area: "Ghatkopar",    lots: 44,  vol: "620 kg",   paid: "₹78,400",   rating: 4.1, kyc: "pending",  lastActive: "3d ago", badge: "Bronze" },
  { id: "KC-C-006", name: "Ramesh Yadav", area: "Mankhurd",     lots: 31,  vol: "440 kg",   paid: "₹56,200",   rating: 3.9, kyc: "pending",  lastActive: "5d ago", badge: null     },
  { id: "KC-C-007", name: "Leela Naik",   area: "Vikhroli",     lots: 18,  vol: "210 kg",   paid: "₹28,100",   rating: 3.8, kyc: "rejected", lastActive: "8d ago", badge: null     },
];

export const NOTIFICATIONS = [
  { id: 1,  cat: "alert",   icon: "alert", title: "Weight Variance on LOT-8810",         body: "18.8% variance detected — exceeds 15% CPCB threshold. Review needed.",          time: "2 min ago",  read: false },
  { id: 2,  cat: "request", icon: "box",   title: "New Lot from Ravi Kumar",                  body: "LOT-8812 · 12.5 kg Battery · Awaiting acceptance.",                time: "8 min ago",  read: false },
  { id: 3,  cat: "payment", icon: "card",  title: "₹1,950 disbursed to Meena Raut",           body: "Lot LOT-8809 · Motor · UPI transfer successful.",                   time: "18 min ago", read: false },
  { id: 4,  cat: "alert",   icon: "trend-down", title: "Rate drop: Cable −₹8/kg",         body: "Market rate fell from ₹348 to ₹340. Your published rate is now above market.",  time: "1 hr ago",   read: true  },
  { id: 5,  cat: "system",  icon: "file-text", title: "EPR Submission Due in 17 days",            body: "Sep 2026 report due 30 Sep. 8,420 kg collected — prepare for CPCB upload.",    time: "3 hr ago",   read: true  },
  { id: 6,  cat: "request", icon: "box",   title: "New Lot from Sunita Pawar",                body: "LOT-8811 · 6.2 kg PCB · Awaiting acceptance.",                   time: "4 hr ago",   read: true  },
  { id: 7,  cat: "alert",   icon: "clock", title: "CPCB Certificate Expiry in 30 days",      body: "CPCB-EPR-2026-BAT-00882 expires 31 Mar 2027. Renew before deadline.",            time: "Yesterday",  read: true  },
  { id: 8,  cat: "payment", icon: "card",  title: "₹4,901 disbursed to Sunita Pawar",        body: "Lot LOT-8806 · Cable · Bank transfer completed.",                     time: "Yesterday",  read: true  },
  { id: 9,  cat: "system",  icon: "lock",  title: "New staff login: Priya (Operator)",       body: "Priya Sharma logged in from a new device (Mumbai, Maharashtra).",                 time: "2 days ago", read: true  },
];

export const EPR_TARGETS = [
  { cat: "Battery",  target: 12000, done: 8420,  color: "#dc2626"    },
  { cat: "PCB",   target: 8000,  done: 5960,  color: "#15803d"  },
  { cat: "CRT Monitors",      target: 5000,  done: 2100,  color: "#d97706"  },
  { cat: "Cable",     target: 15000, done: 12800, color: "#ea580c" },
  { cat: "Aluminium",         target: 6000,  done: 5700,  color: "#0284c7"    },
  { cat: "Battery", target: 3000,  done: 840,   color: "#64748b"  },
];

  export const RATES_BASE = [
    { cat: "PCB",    emoji: "cpu", cpcb: 265, mine: 280, hazard: false },
    { cat: "Cable",      emoji: "cable", cpcb: 325, mine: 340, hazard: false },
    { cat: "Battery",   emoji: "battery", cpcb: 115, mine: 120, hazard: true  },
    { cat: "LCD Panel",     emoji: "tv", cpcb: 75,  mine: 80,  hazard: false },
    { cat: "CRT Glass",     emoji: "tv", cpcb: 15,  mine: 18,  hazard: false },
    { cat: "Motor",     emoji: "cylinder", cpcb: 190,  mine: 210,  hazard: false },
    { cat: "Magnet-Bearing Assembly",        emoji: "settings", cpcb: 330,  mine: 350,  hazard: false },
    { cat: "Mixed Plastics",     emoji: "box", cpcb: 12,  mine: 14,  hazard: false },
  ];

export const ACTIVITY = [
  { t: "09:18", icon: "dot_green", text: "LOT-8809 settled — ₹1,950 disbursed to Meena Raut" },
  { t: "09:14", icon: "dot_green", text: "New lot LOT-8812 received — 12.5 kg Li-Ion" },
  { t: "09:02", icon: "dot_green", text: "New lot LOT-8811 received — 6.2 kg PCB" },
  { t: "08:52", icon: "dot_amber", text: "Weight dispute on LOT-8810 — 18.8% variance" },
  { t: "08:10", icon: "dot_red",   text: "LOT-8805 rejected — collector notified" },
  { t: "07:55", icon: "dot_green", text: "LOT-8808 settled — ₹450 disbursed to Priya Desai" },
  { t: "07:30", icon: "dot_green", text: "EPR monthly report submitted to CPCB portal" },
];

export const TEAM = [
  { name: "Arjun Mehta",    role: "Facility Manager", email: "arjun@ecogreen.in",  status: "active",   lastLogin: "Today" },
  { name: "Priya Sharma",   role: "Operator",         email: "priya@ecogreen.in",  status: "active",   lastLogin: "Today" },
  { name: "Vikram Joshi",   role: "Operator",         email: "vikram@ecogreen.in", status: "active",   lastLogin: "2d ago" },
  { name: "Smita Kulkarni", role: "Viewer",           email: "smita@ecogreen.in",  status: "inactive", lastLogin: "7d ago" },
];

export const DOCS = [
  { name: "CPCB Authorization Letter",       issued: "01 Apr 2026", expires: "31 Mar 2027", status: "active",  type: "PDF" },
  { name: "Maharashtra Pollution Board NOC", issued: "15 Feb 2026", expires: "14 Feb 2028", status: "active",  type: "PDF" },
  { name: "EPR Registration Certificate",    issued: "01 Apr 2026", expires: "31 Mar 2027", status: "active",  type: "PDF" },
  { name: "Fire NOC (MIDC Andheri)",        issued: "10 Jan 2026", expires: "09 Jan 2027", status: "active",  type: "PDF" },
  { name: "Trade License FY2026-27",         issued: "01 Apr 2026", expires: "31 Mar 2027", status: "active",  type: "PDF" },
];

export type AuditLogItem = {
  id: string;
  time: string;
  actor: string;
  role: string;
  action: string;
  target: string;
  changes: string;
};

export const AUDIT_LOGS: AuditLogItem[] = [
  { id: "AL-893", time: "2026-09-18T18:42:00Z", actor: "Admin", role: "Facility Manager", action: "Weight Override & Verify", target: "LOT-8812", changes: "12.0 kg → 12.5 kg" },
  { id: "AL-892", time: "2026-09-18T16:15:22Z", actor: "System", role: "Auto", action: "Payment Settled", target: "TXN-9932", changes: "Status: Pending → Paid" },
  { id: "AL-891", time: "2026-09-18T14:30:10Z", actor: "Admin", role: "Facility Manager", action: "Dispute Flagged", target: "LOT-8810", changes: "Variance > 10% (18kg vs 21.4kg)" },
  { id: "AL-890", time: "2026-09-17T11:05:00Z", actor: "Ravi Kumar", role: "Staff", action: "Collector Blocked", target: "COL-004", changes: "Status: Active → Blocked" },
  { id: "AL-889", time: "2026-09-16T09:00:00Z", actor: "Admin", role: "Facility Manager", action: "Rate Card Updated", target: "Global Rates", changes: "Li-Ion: ₹115 → ₹120" },
  { id: "AL-888", time: "2026-09-15T15:22:00Z", actor: "System", role: "Auto", action: "Target Alert", target: "EPR-BAT", changes: "Q3 Target reached (80%)" },
];
