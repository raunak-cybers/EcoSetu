import React, { useState, useMemo, Fragment, useEffect } from "react";
import NotificationsView from "./NotificationsView";
import Login from "./pages/Login";
import AdminPanel from "./pages/admin/AdminPanel";
import AdminDashboard from "./pages/admin/Dashboard";
import FacilityVerification from "./pages/admin/FacilityVerification";
import DisputeOverrides from "./pages/admin/DisputeOverrides";
import { AuthProvider, useAuth, formatFacilitySubtext } from "./hooks/useAuth";
import { supabase, isSupabaseConfigured } from "./lib/supabaseClient";
import appLogo from "./assets/logo.png";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

// ─── Palette ──────────────────────────────────────────────────────────────────
const G = {
  sbBg: "#0c1a12", sbHover: "#142b1c", sbActive: "#1a3d24", sbBorder: "#1f3329",
  bg: "#f5f2ec", card: "#ffffff", card2: "#faf9f6",
  green: "#15803d", greenM: "#16a34a", greenL: "#dcfce7", greenXL: "#f0fdf4",
  amber: "#d97706", amberL: "#fef3c7",
  red: "#dc2626", redL: "#fef2f2",
  orange: "#ea580c", orangeL: "#fff7ed",
  sky: "#0284c7", skyL: "#e0f2fe",
  purple: "#7c3aed", purpleL: "#ede9fe",
  dark: "#0f172a", mid: "#334155", muted: "#64748b", faint: "#94a3b8",
  border: "#e7e2d9", borderM: "#d4cfc8",
};

// ─── Shared UI atoms ──────────────────────────────────────────────────────────
function Btn({ children, variant = "primary", onClick, small, full, disabled }: {
  children: React.ReactNode; variant?: "primary"|"ghost"|"danger"|"amber"|"sky";
  onClick?: () => void; small?: boolean; full?: boolean; disabled?: boolean;
}) {
  const s = {
    primary: { background: G.green,   color: "#fff",   border: "1px solid " + G.green },
    ghost:   { background: "transparent", color: G.mid, border: "1px solid " + G.border },
    danger:  { background: G.redL,    color: G.red,    border: "1px solid #fca5a5" },
    amber:   { background: G.amberL,  color: G.amber,  border: "1px solid #fcd34d" },
    sky:     { background: G.skyL,    color: G.sky,    border: "1px solid #7dd3fc" },
  }[variant];
  return (
    <button onClick={onClick} disabled={disabled}
      className={`rounded-lg font-medium transition-all hover:opacity-90 active:scale-[0.98] whitespace-nowrap ${
        small ? "px-2.5 py-1.5 text-xs" : "px-3.5 py-2 text-sm"
      } ${full ? "w-full" : ""} ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
      style={s}>{children}</button>
  );
}

const TH = ({ ch }: { ch: string }) => (
  <th className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-widest whitespace-nowrap"
    style={{ color: G.muted, background: G.card2, borderBottom: "1px solid " + G.border }}>{ch}</th>
);
const TD = ({ children, mono, muted, right, green }: {
  children: React.ReactNode; mono?: boolean; muted?: boolean; right?: boolean; green?: boolean;
}) => (
  <td className={`px-3 py-3 text-sm border-b ${mono ? "font-mono" : ""} ${right ? "text-right" : ""}`}
    style={{ color: green ? G.green : muted ? G.muted : G.dark, borderColor: G.border }}>{children}</td>
);

function Pill({ label, color, bg }: { label: string; color: string; bg: string }) {
  return <span className="text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap font-mono"
    style={{ color, background: bg }}>{label}</span>;
}

function Icon({ name, color = "currentColor", size = 16 }: { name: string; color?: string; size?: number }) {
  if (name.startsWith("dot_")) {
    const c = name.split("_")[1];
    return <svg width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill={G[c as keyof typeof G] || c}/></svg>
  }
  
  const iconPaths: Record<string, React.ReactNode> = {
    save: <><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></>,
    tag: <><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></>,
    pin: <><line x1="12" y1="17" x2="12" y2="22"/><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.68V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3v4.68a2 2 0 0 1-1.11 1.87l-1.78.9A2 2 0 0 0 5 15.24Z"/></>,
    rupee: <><path d="M6 3h12"/><path d="M6 8h12"/><path d="M6 13h8.5l-5 8"/><path d="M6 13a4 4 0 0 0 4-4"/></>,
    award: <><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></>,
    "check-circle": <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>,
    star: <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></>,
    alert: <><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    box: <><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></>,
    check: <><polyline points="20 6 9 17 4 12"/></>,
    clock: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    card: <><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></>,
    lock: <><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>,
    leaf: <><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><line x1="2" y1="22" x2="11" y2="13"/></>,
    "trend-down": <><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/></>,
    "trending-up": <><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></>,
    cpu: <><rect width="16" height="16" x="4" y="4" rx="2" ry="2"/><path d="M9 9h6v6H9z"/><path d="M9 1v3"/><path d="M15 1v3"/><path d="M9 20v3"/><path d="M15 20v3"/><path d="M20 9h3"/><path d="M20 14h3"/><path d="M1 9h3"/><path d="M1 14h3"/></>,
    cable: <><path d="M4 9a2 2 0 0 1-2-2V4h6v3a2 2 0 0 1-2 2"/><path d="M18 9a2 2 0 0 1-2-2V4h6v3a2 2 0 0 1-2 2"/><path d="M5 9v11a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9"/><line x1="12" y1="12" x2="12" y2="22"/></>,
    battery: <><rect width="16" height="10" x="2" y="7" rx="2" ry="2"/><line x1="22" y1="11" x2="22" y2="13"/></>,
    mail: <><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></>,
    tv: <><rect width="20" height="15" x="2" y="7" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></>,
    cylinder: <><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/></>,
    settings: <><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></>,
    home: <><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
    scan: <><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/></>,
    list: <><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></>,
    database: <><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></>,
    "indian-rupee": <><text x="12" y="17" fontSize="16" fontWeight="600" textAnchor="middle" fill="currentColor" stroke="none" fontFamily="sans-serif">₹</text></>,
    "pie-chart": <><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    scale: <><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></>,
    laptop: <><rect width="18" height="12" x="3" y="4" rx="2"/><line x1="2" x2="22" y1="20" y2="20"/></>,
    phone: <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></>,
    "bar-chart": <><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></>,
    smartphone: <><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></>,
    camera: <><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></>,
    zap: <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></>,
    edit: <><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></>,
    "shield-check": <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></>,
    "arrow-right": <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
    "chevron-right": <><polyline points="9 18 15 12 9 6"/></>,
    bell: <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></>,
    search: <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    info: <><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></>,
    "arrow-left": <><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></>,
    truck: <><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-5l-3-4h-5v10"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></>,
    wallet: <><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></>,
    "map-pin": <><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></>,
    building: <><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M16 14h.01"/></>,
    "file-text": <><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></>,
    calendar: <><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
    filter: <><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></>,
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>,
    "more-vertical": <><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="19" r="1.5"/></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    x: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    trash: <><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></>,
    "arrow-up-down": <><path d="m21 16-4 4-4-4"/><path d="M17 20V4"/><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/></>,
    printer: <><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></>,
    "external-link": <><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></>,
  };

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      {iconPaths[name] || iconPaths["box"]}
    </svg>
  );
}

function KCard({ label, value, sub, delta, icon, color = G.green, onClick }: {
  label: string; value: string; sub: string; delta?: string; icon: React.ReactNode; color?: string; onClick?: () => void;
}) {
  const up = !delta?.startsWith("-");
  return (
    <div onClick={onClick}
      className={`rounded-xl p-4 flex flex-col gap-2.5 ${onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""}`}
      style={{ background: G.card, border: `1px solid ${G.border}` }}>
      <div className="flex items-start justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: G.muted }}>{label}</span>
        <span className="text-base">{icon}</span>
      </div>
      <p className="text-2xl font-mono font-medium" style={{ color: G.dark }}>{value}</p>
      <div className="flex items-center gap-2">
        <p className="text-xs" style={{ color: G.muted }}>{sub}</p>
        {delta && <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded"
          style={{ background: up ? G.greenL : G.redL, color: up ? G.green : G.red }}>{delta}</span>}
      </div>
    </div>
  );
}

function SectionHd({ title, sub, right }: { title: string; sub?: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-5">
      <div>
        <h2 className="text-base font-semibold" style={{ color: G.dark }}>{title}</h2>
        {sub && <p className="text-xs mt-0.5" style={{ color: G.muted }}>{sub}</p>}
      </div>
      {right && <div className="flex items-center gap-2 flex-shrink-0">{right}</div>}
    </div>
  );
}

function Badge({ text, type = "green" }: { text: string; type?: "green"|"red"|"amber"|"sky"|"gray"|"purple" }) {
  const mp = { green: [G.greenL, G.green], red: [G.redL, G.red], amber: [G.amberL, G.amber],
    sky: [G.skyL, G.sky], gray: ["#f1f5f9", G.muted], purple: [G.purpleL, G.purple] }[type];
  return <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full font-mono whitespace-nowrap"
    style={{ background: mp[0], color: mp[1] }}>{text}</span>;
}

function SearchInput({ placeholder, value, onChange }: { placeholder: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center" style={{ color: G.faint }}><Icon name="search" size={14} /></span>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="pl-8 pr-3 py-2 rounded-lg text-sm outline-none w-full"
        style={{ background: G.card, border: `1px solid ${G.border}`, color: G.dark }} />
    </div>
  );
}

function DateRangeFilter({ active, setActive }: { active: string; setActive: (v: string) => void }) {
  return (
    <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: G.card2, border: `1px solid ${G.border}` }}>
      {["Today", "Week", "Month"].map(r => (
        <button key={r} onClick={() => setActive(r)}
          className="px-3 py-1 rounded-md text-xs font-medium transition-all"
          style={{ background: active === r ? G.green : "transparent", color: active === r ? "#fff" : G.muted }}>
          {r}
        </button>
      ))}
    </div>
  );
}

import { AUDIT_LOGS, AuditLogItem, SEVEN_DAY, PRICE_30D, LOTS_DATA, INVENTORY_DATA, MATERIALS, TRANSACTIONS, COLLECTORS, NOTIFICATIONS, EPR_TARGETS, RATES_BASE, ACTIVITY, TEAM, DOCS } from './mockData';

// ─── View: DASHBOARD ──────────────────────────────────────────────────────────
function Dashboard({ lots, setLots, setView, lotsLoading }: { lots: LotItem[], setLots: React.Dispatch<React.SetStateAction<LotItem[]>>, setView: (v: string) => void, lotsLoading?: boolean }) {
  const { facility } = useAuth();
  const [dateRange, setDateRange] = useState<"Daily"|"Weekly"|"Monthly">("Weekly");
  const [catFilter, setCatFilter] = useState<"All"|"E-Waste"|"Plastics"|"Metals">("All");
  const [selectedPin, setSelectedPin] = useState<string | null>("andheri-west");
  const [dateMenuOpen, setDateMenuOpen] = useState(false);
  const [selectedDatePreset, setSelectedDatePreset] = useState("1 Sep 2026 - 30 Sep 2026");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const incomingLots = useMemo(() => lots.filter(l => l.status === "pending" || l.status === "requested"), [lots]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleAccept = async (id: string, name: string) => {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('lots').update({ 
        handover_status: 'accepted',
        recycler_name: facility?.name || 'Green Recycle Hub'
      }).eq('lot_id', id);
    }
    setLots(prev => prev.map(r => r.id === id ? { 
      ...r, 
      status: "accepted_awaiting_verification" as const,
      acceptedBy: "Admin",
      acceptedAt: new Date().toISOString()
    } : r));
    showToast(`✓ Accepted Lot ${id} from ${name}. Moved to Scan & Verify for inspection.`);
    logAuditEvent("Lot Accepted", id, `Status: Pending → Awaiting Verification`);
  };

  const handleDecline = async (id: string, name: string) => {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('lots').update({ 
        handover_status: 'declined',
        recycler_name: facility?.name || 'Green Recycle Hub'
      }).eq('lot_id', id);
    }
    setLots(prev => prev.map(r => r.id === id ? { ...r, status: "rejected" } : r));
    showToast(`Declined Lot ${id} from ${name}. Collector has been notified.`);
    logAuditEvent("Lot Rejected", id, `Status: Pending → Rejected`);
  };

  const handleExportPDF = () => {
    showToast("📄 Generating Facility Monthly Report PDF (Sep 2026)... Download starting.");
  };

  const filteredRequests = incomingLots.filter(r => {
    if (catFilter === "All") return true;
    if (catFilter === "E-Waste" && ["PCB", "CRT Glass", "Battery"].includes(r.cat)) return true;
    if (catFilter === "Metals" && ["Cable", "Motor", "Magnet-Bearing Assembly"].includes(r.cat)) return true;
    if (catFilter === "Plastics" && ["Mixed Plastics"].includes(r.cat)) return true;
    return false;
  });

  const TREND_DATA_WEEKLY = [
    { d: "1 Sep",  vol: 180 },
    { d: "4 Sep",  vol: 340 },
    { d: "7 Sep",  vol: 280 },
    { d: "10 Sep", vol: 320 },
    { d: "13 Sep", vol: 540 },
    { d: "16 Sep", vol: 580 },
    { d: "19 Sep", vol: 460 },
    { d: "22 Sep", vol: 490 },
    { d: "25 Sep", vol: 680 },
    { d: "28 Sep", vol: 732 },
  ];

  const TREND_DATA_DAILY = [
    { d: "Mon", vol: 110 }, { d: "Tue", vol: 145 }, { d: "Wed", vol: 130 },
    { d: "Thu", vol: 190 }, { d: "Fri", vol: 240 }, { d: "Sat", vol: 310 }, { d: "Sun", vol: 280 }
  ];

  const TREND_DATA_MONTHLY = [
    { d: "Apr", vol: 920 }, { d: "May", vol: 1040 }, { d: "Jun", vol: 1180 },
    { d: "Jul", vol: 1120 }, { d: "Aug", vol: 1210 }, { d: "Sep", vol: 1245 }
  ];

  const currentChartData = dateRange === "Weekly" ? TREND_DATA_WEEKLY : dateRange === "Daily" ? TREND_DATA_DAILY : TREND_DATA_MONTHLY;

  // Map Pins
  const MAP_PINS = [
    { id: "andheri-west", name: "Andheri West", collector: "Rakesh Sharma", batch: "Mixed Plastics • 450 kg", status: "pending", x: "28%", y: "42%", time: "12:23 PM" },
    { id: "jogeshwari",   name: "Jogeshwari",   collector: "Sunita Pawar",  batch: "E-Waste • 320 kg",        status: "high",    x: "58%", y: "32%", time: "01:15 PM" },
    { id: "andheri-east", name: "Andheri East", collector: "Imran Shaikh",  batch: "Metals • 780 kg",         status: "completed",x: "24%", y: "72%", time: "09:40 AM" },
    { id: "malad",        name: "Malad",        collector: "Priya Desai",   batch: "E-Waste • 210 kg",        status: "completed",x: "76%", y: "68%", time: "10:15 AM" },
    { id: "kurla",        name: "Kurla Hub",    collector: "Ravi Kumar",    batch: "Li-Ion • 540 kg",         status: "pending", x: "42%", y: "82%", time: "02:00 PM" },
  ];

  return (
    <div className="flex flex-col gap-4.5 slide-in max-w-7xl mx-auto w-full pb-8 relative">
      {/* ── Toast Notification Banner ── */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-4.5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-gray-700 animate-slide-in">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <p className="text-xs font-semibold">{toastMsg}</p>
          <button onClick={() => setToastMsg(null)} className="text-gray-400 hover:text-white text-xs ml-2 cursor-pointer"><Icon name="x" size={14} /></button>
        </div>
      )}

      {/* ── Top Facility Banner ── */}
      <div className="rounded-2xl p-4.5 bg-white border border-gray-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center flex-shrink-0 shadow-xs">
            <Icon name="building" size={22} color="#047857" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-base font-bold text-gray-900 tracking-tight">
                {facility?.name || "Metro Recycling Solutions - Mumbai"}
              </h1>
              <button onClick={() => setView("notifications")}
                className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-100 text-[11px] font-semibold hover:bg-red-100 transition-colors cursor-pointer">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span>2 Action Required</span>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-0.5 truncate">
              {formatFacilitySubtext(facility)}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 self-end md:self-auto flex-shrink-0">
          <button onClick={handleExportPDF}
            className="px-3.5 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer">
            <Icon name="file-text" size={14} color="#4b5563" />
            <span>Export PDF</span>
          </button>

          {/* Date range picker dropdown */}
          <div className="relative">
            <button onClick={() => setDateMenuOpen(!dateMenuOpen)}
              className="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer">
              <Icon name="calendar" size={14} color="#fff" />
              <span>{selectedDatePreset}</span>
              <span className="text-[10px]">▼</span>
            </button>

            {dateMenuOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-48 bg-white border border-gray-100 rounded-xl shadow-lg p-1 z-30 flex flex-col gap-0.5">
                {["1 Sep 2026 - 30 Sep 2026", "Last 30 Days", "This Quarter (Q3)", "FY 2026-27 YTD"].map(p => (
                  <button key={p} onClick={() => { setSelectedDatePreset(p); setDateMenuOpen(false); showToast(`Date filter applied: ${p}`); }}
                    className={`text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      selectedDatePreset === p ? "bg-emerald-50 text-emerald-800 font-bold" : "text-gray-700 hover:bg-gray-50"
                    }`}>
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── 4 KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Tonnes */}
        <div onClick={() => setView("inventory")}
          className="rounded-2xl p-4.5 bg-white border border-gray-100 shadow-sm flex items-center justify-between cursor-pointer hover:border-emerald-300 hover:shadow-md transition-all">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center">
                <Icon name="truck" size={16} color="#047857" />
              </div>
              <span className="text-xs font-semibold text-gray-500">Total Tonnes Processed</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-1">{(parseFloat(lots.reduce((acc, l) => acc + (l.actualWeight !== null ? l.actualWeight : l.estimatedWeight), 0).toFixed(1)) / 1000).toFixed(2)}</p>
            <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <span>▲</span>
              <span>Based on {lots.length} lots</span>
            </p>
          </div>
          {/* Mini bar chart graphic */}
          <div className="flex items-end gap-1 h-9 opacity-80 pr-1">
            {[40, 60, 50, 75, 90, 100].map((h, i) => (
              <div key={i} className="w-1.5 rounded-t bg-emerald-400" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>

        {/* Card 2: Active Collectors */}
        <div onClick={() => setView("collectors")}
          className="rounded-2xl p-4.5 bg-white border border-gray-100 shadow-sm flex items-center justify-between cursor-pointer hover:border-emerald-300 hover:shadow-md transition-all">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center">
                <Icon name="users" size={16} color="#047857" />
              </div>
              <span className="text-xs font-semibold text-gray-500">Active Collectors</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-1">{lots.map(l => l.collectorName).filter((v, i, a) => a.indexOf(v) === i).length}</p>
            <p className="text-xs font-semibold text-emerald-600">
              Unique collectors
            </p>
          </div>
          {/* Wavy line graphic */}
          <div className="w-14 h-8 flex items-center pr-1">
            <svg viewBox="0 0 60 30" className="w-full h-full text-emerald-500 overflow-visible">
              <path d="M 0 20 Q 15 5 30 18 T 60 8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 3: Pending Payouts */}
        <div onClick={() => setView("payments")}
          className="rounded-2xl p-4.5 bg-white border border-gray-100 shadow-sm flex items-center justify-between cursor-pointer hover:border-amber-300 hover:shadow-md transition-all">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/80 flex items-center justify-center">
                <Icon name="wallet" size={16} color="#d97706" />
              </div>
              <span className="text-xs font-semibold text-gray-500">Pending Payouts</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              ₹{lots.filter(l => l.status === "settling" || l.status === "verified").reduce((s, l) => s + Math.round((l.actualWeight || l.estimatedWeight) * l.rate), 0).toLocaleString()}
            </p>
            <p className="text-xs text-amber-700 font-semibold">
              {lots.filter(l => l.status === "settling" || l.status === "verified").length} payout{lots.filter(l => l.status === "settling" || l.status === "verified").length === 1 ? "" : "s"} remaining
            </p>
          </div>
          {/* Amber Clock Icon Box */}
          <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-200/70 flex items-center justify-center text-amber-600 shadow-xs mr-1">
            <Icon name="clock" size={16} color="#d97706" />
          </div>
        </div>

        {/* Card 4: Recycling Impact */}
        <div onClick={() => setView("epr")}
          className="rounded-2xl p-4.5 bg-white border border-gray-100 shadow-sm flex items-center justify-between cursor-pointer hover:border-emerald-300 hover:shadow-md transition-all">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center">
                <Icon name="leaf" size={16} color="#047857" />
              </div>
              <span className="text-xs font-semibold text-gray-500">Recycling Impact</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-1">{(parseFloat(lots.reduce((acc, l) => acc + (l.actualWeight !== null ? l.actualWeight : l.estimatedWeight), 0).toFixed(1)) * 2.5 / 1000).toFixed(2)} tonnes</p>
            <p className="text-xs text-emerald-700">
              Est CO₂ saved
            </p>
          </div>
          {/* Green tree illustration */}
          <div className="w-12 h-12 flex items-center justify-center mr-1">
            <svg viewBox="0 0 40 40" className="w-full h-full">
              <circle cx="20" cy="16" r="12" fill="#86efac" opacity="0.7"/>
              <circle cx="15" cy="14" r="8" fill="#4ade80"/>
              <circle cx="25" cy="14" r="9" fill="#22c55e"/>
              <circle cx="20" cy="10" r="7" fill="#16a34a"/>
              <rect x="18" y="24" width="4" height="12" rx="1" fill="#78350f"/>
            </svg>
          </div>
        </div>
      </div>

      {/* ── Main Content Split (Left: Incoming Requests, Right: Trends + Map + Activity) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4.5">
        
        {/* ── Left Column: Incoming Batch Requests (4.5 cols) ── */}
        <div className="lg:col-span-5 rounded-2xl p-5 bg-white border border-gray-100 shadow-sm flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-3.5">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center">
                  <Icon name="box" size={16} color="#047857" />
                </div>
                <h3 className="text-sm font-bold text-gray-900">Incoming Batch Requests</h3>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-100">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">LIVE</span>
              </div>
            </div>

            {/* Requests List */}
            <div className="flex flex-col gap-3 mt-1">
              {lotsLoading ? (
                <div className="flex items-center justify-center py-8 gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-emerald-600 border-t-transparent" />
                  <span className="text-xs text-gray-400 font-medium">Connecting to Supabase...</span>
                </div>
              ) : filteredRequests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 gap-2">
                  <span className="text-3xl">📭</span>
                  <p className="text-xs font-semibold text-gray-500">No incoming lots yet</p>
                  <p className="text-[10px] text-gray-400 text-center">New lots created by collectors will appear here in real-time.</p>
                </div>
              ) : filteredRequests.map(req => (
                <div key={req.id} 
                  className={`px-3 py-2.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-all ${
                    req.status === "accepted" 
                      ? "bg-emerald-50/60 border-emerald-200" 
                      : "bg-white border-gray-100 hover:border-gray-200"
                  }`}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500 flex-shrink-0">
                      {req.collector.substring(0,2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-bold text-gray-900 truncate">{req.collector}</p>
                        <span className="text-[9px] font-mono text-gray-400">{req.id}</span>
                      </div>
                      <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-[10px] text-gray-600 mt-0.5">
                        <span className="flex items-center gap-0.5 whitespace-nowrap">
                          <Icon name="box" size={10} color="#059669" /> {req.cat}
                        </span>
                        <span className="font-mono font-bold whitespace-nowrap">• {req.estimatedWeight} kg</span>
                        <span className="text-gray-400 whitespace-nowrap">• {req.arrival}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {req.status === "accepted" ? (
                      <button onClick={() => setView("scan")}
                        className="px-2.5 py-1.5 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[10px] shadow-xs transition-colors cursor-pointer">
                        Verify QR →
                      </button>
                    ) : (
                      <>
                        <button onClick={() => handleAccept(req.id, req.collector)}
                          className="px-2.5 py-1.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200 hover:bg-emerald-100 transition-all cursor-pointer">
                          Accept
                        </button>
                        <button onClick={() => handleDecline(req.id, req.collector)}
                          className="px-2.5 py-1.5 rounded-md bg-gray-50 text-gray-500 font-bold text-[10px] border border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors cursor-pointer">
                          Decline
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer View All */}
          <button onClick={() => setView("lots")}
            className="w-full py-2.5 text-center text-xs font-bold text-emerald-800 hover:text-emerald-900 border-t border-gray-100 flex items-center justify-center gap-1.5 cursor-pointer hover:bg-gray-50/50 rounded-b-xl transition-colors">
            <span>View All Requests</span>
            <Icon name="arrow-right" size={13} color="currentColor" />
          </button>
        </div>

        {/* ── Right Column: Volume Trends + Map + Activity (7.5 cols) ── */}
        <div className="lg:col-span-7 flex flex-col gap-4.5">
          
          {/* Top: Volume Trends Chart Card */}
          <div className="rounded-2xl p-5 bg-white border border-gray-100 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center">
                  <Icon name="bar-chart" size={16} color="#047857" />
                </div>
                <h3 className="text-sm font-bold text-gray-900">Volume Trends</h3>
              </div>

              {/* Range Toggle */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-100/80 border border-gray-200/60">
                {(["Daily", "Weekly", "Monthly"] as const).map(r => (
                  <button key={r} onClick={() => setDateRange(r)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      dateRange === r 
                        ? "bg-emerald-800 text-white shadow-xs font-bold" 
                        : "text-gray-600 hover:text-gray-900"
                    }`}>
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Area Chart with custom high-fidelity curve */}
            <div className="h-56 -ml-4 pr-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={currentChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="d" tick={{ fontSize: 10.5, fill: "#94a3b8", fontFamily: "Inter" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10.5, fill: "#94a3b8", fontFamily: "Inter" }} tickLine={false} axisLine={false} width={42} />
                  <Tooltip content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white px-3.5 py-2 rounded-xl shadow-lg border border-gray-100 text-xs">
                          <p className="text-gray-400 font-medium text-[10px]">{label} 2026</p>
                          <p className="font-bold text-emerald-800 flex items-center gap-1.5 mt-0.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span>{payload[0].value} tonnes</span>
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }} />
                  <Area type="monotone" dataKey="vol" stroke="#059669" strokeWidth={2.5} fill="url(#volGrad)" 
                    activeDot={{ r: 5, fill: "#047857", stroke: "#fff", strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bottom Grid: Pickup Points Map & Recent Activity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5">
            
            {/* Map Card */}
            <div className="rounded-2xl p-5 bg-white border border-gray-100 shadow-sm flex flex-col justify-between gap-3 min-h-[260px]">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Icon name="map-pin" size={15} color="#047857" />
                    <h4 className="text-xs font-bold text-gray-900">Collector Pickup Points</h4>
                  </div>
                  {/* Legend */}
                  <div className="flex items-center gap-2 text-[9.5px] font-semibold text-gray-500">
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Completed</span>
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Pending</span>
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500" /> High Priority</span>
                  </div>
                </div>

                {/* Map Graphic Area */}
                <div className="relative rounded-xl overflow-hidden bg-slate-50 border border-gray-100 mt-3 h-48 flex items-center justify-center select-none">
                  {/* Realistic Mumbai map vector background representation */}
                  <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
                  
                  {/* Road Network Lines */}
                  <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none">
                    <path d="M 0 50 Q 80 80 150 120 T 300 160" fill="none" stroke="#64748b" strokeWidth="2.5" />
                    <path d="M 120 0 Q 140 100 180 200" fill="none" stroke="#64748b" strokeWidth="2" />
                    <path d="M 220 20 Q 200 90 260 180" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 2" />
                    <path d="M 30 180 Q 140 140 280 40" fill="none" stroke="#10b981" strokeWidth="1.5" opacity="0.6" />
                  </svg>

                  {/* Central Facility Hub */}
                  <div className="absolute top-[52%] left-[46%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
                    <div className="relative flex items-center justify-center">
                      <span className="absolute w-8 h-8 rounded-full bg-emerald-400 opacity-40 animate-ping" />
                      <div className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[9px] font-bold shadow-md ring-2 ring-white">
                        MIDC
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-gray-800 bg-white/90 backdrop-blur px-1.5 rounded shadow-xs mt-0.5">
                      Facility Hub
                    </span>
                  </div>

                  {/* Pickup Pins */}
                  {MAP_PINS.map(pin => (
                    <div key={pin.id} onClick={() => setSelectedPin(selectedPin === pin.id ? null : pin.id)}
                      className="absolute cursor-pointer -translate-x-1/2 -translate-y-1/2 group transition-transform hover:scale-125 z-20"
                      style={{ top: pin.y, left: pin.x }}>
                      <div className={`w-3 h-3 rounded-full shadow-md ring-2 ring-white ${
                        pin.status === "completed" ? "bg-emerald-500" : pin.status === "high" ? "bg-red-500 animate-pulse" : "bg-amber-500"
                      }`} />
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[9px] font-semibold text-gray-700 bg-white/80 backdrop-blur px-1 rounded whitespace-nowrap shadow-xs hidden group-hover:inline-block">
                        {pin.name}
                      </span>
                    </div>
                  ))}

                  {/* Active Popover for selected pin */}
                  {selectedPin && (
                    <div className="absolute left-4 bottom-3 bg-white/95 backdrop-blur-md rounded-xl p-2.5 border border-gray-200 shadow-md text-xs z-30 flex flex-col gap-1 max-w-[180px]">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900 text-[11px]">{MAP_PINS.find(p => p.id === selectedPin)?.name}</span>
                        <button onClick={() => setSelectedPin(null)} className="text-gray-400 hover:text-gray-700 text-[10px] cursor-pointer"><Icon name="x" size={14} /></button>
                      </div>
                      <p className="text-[10px] text-gray-600">{MAP_PINS.find(p => p.id === selectedPin)?.collector}</p>
                      <p className="text-[10px] font-medium text-emerald-700">{MAP_PINS.find(p => p.id === selectedPin)?.batch}</p>
                      <p className="text-[9px] text-gray-400">Scheduled: {MAP_PINS.find(p => p.id === selectedPin)?.time}</p>
                    </div>
                  )}

                  {/* Zoom controls */}
                  <div className="absolute top-2 right-2 flex flex-col rounded-lg bg-white/90 border border-gray-200 shadow-xs overflow-hidden z-20">
                    <button onClick={() => showToast("Map zoom in")} className="px-2 py-1 text-xs font-bold text-gray-600 hover:bg-gray-100 cursor-pointer">+</button>
                    <button onClick={() => showToast("Map zoom out")} className="px-2 py-1 text-xs font-bold text-gray-600 hover:bg-gray-100 border-t border-gray-200 cursor-pointer">−</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity Card */}
            <div className="rounded-2xl p-5 bg-white border border-gray-100 shadow-sm flex flex-col justify-between gap-3 min-h-[260px]">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Icon name="clock" size={15} color="#047857" />
                    <h4 className="text-xs font-bold text-gray-900">Recent Activity</h4>
                  </div>
                  <button onClick={() => setView("notifications")} className="text-[11px] font-bold text-emerald-700 hover:underline cursor-pointer">
                    View All →
                  </button>
                </div>

                {/* Feed Items */}
                <div className="flex flex-col divide-y divide-gray-100 mt-2">
                  <div className="py-2.5 flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon name="check" size={12} color="#047857" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-gray-900 truncate">Lot LOT-8812 verified</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">Ravi Kumar • 12 min ago</p>
                    </div>
                  </div>

                  <div className="py-2.5 flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon name="users" size={12} color="#0284c7" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-gray-900 truncate">New collector registered</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">Suresh Yadav • 28 min ago</p>
                    </div>
                  </div>

                  <div className="py-2.5 flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon name="card" size={12} color="#047857" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-gray-900 truncate">Payout of ₹12,400 processed</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">Ref: PAY-7782 • 1 hour ago</p>
                    </div>
                  </div>

                  <div className="py-2.5 flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon name="alert" size={12} color="#d97706" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-gray-900 truncate">High volume request received</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">Request ID: 17231 • 2 hours ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

// ─── Shared Recycle Graphic ──────────────────────────────────────────────────
function RecycleBannerGraphic() {
  return (
    <div className="hidden lg:flex items-center gap-3 relative select-none pr-1 flex-shrink-0">
      {/* Illustrated Globe & Trees */}
      <div className="relative w-28 h-18 flex items-center justify-center">
        <svg viewBox="0 0 120 80" className="w-full h-full overflow-visible">
          {/* Background hill */}
          <path d="M10 70 Q 60 45 110 70 Z" fill="#dcfce7" opacity="0.8"/>
          {/* Trees behind */}
          <circle cx="28" cy="42" r="14" fill="#86efac" opacity="0.9"/>
          <circle cx="95" cy="45" r="12" fill="#86efac" opacity="0.9"/>
          <circle cx="20" cy="50" r="10" fill="#4ade80" opacity="0.9"/>
          <circle cx="102" cy="52" r="9" fill="#22c55e" opacity="0.8"/>
          <circle cx="34" cy="52" r="11" fill="#16a34a" opacity="0.8"/>
          <circle cx="86" cy="50" r="13" fill="#15803d" opacity="0.8"/>

          {/* Earth Globe */}
          <g transform="translate(60, 42)">
            <circle cx="0" cy="0" r="22" fill="#38bdf8" />
            <circle cx="0" cy="0" r="22" fill="url(#globeGrad)" opacity="0.3"/>
            {/* Continents / Landmass */}
            <path d="M-14 -8 Q -8 -16 2 -14 Q 8 -10 12 -4 Q 10 4 2 8 Q -6 6 -12 2 Z" fill="#22c55e"/>
            <path d="M-6 10 Q 0 14 8 12 Q 14 16 10 20 Q -2 22 -8 16 Z" fill="#16a34a"/>
            <path d="M-18 4 Q -12 12 -16 18 Q -22 14 -20 8 Z" fill="#15803d"/>
            <circle cx="0" cy="0" r="22" stroke="#bae6fd" strokeWidth="1.5" fill="none"/>
          </g>

          {/* Foreground Foliage */}
          <circle cx="48" cy="58" r="8" fill="#16a34a"/>
          <circle cx="72" cy="58" r="8" fill="#15803d"/>
          
          <defs>
            <linearGradient id="globeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.4"/>
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.8"/>
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Styled Catchphrase */}
      <div className="flex flex-col">
        <span className="text-xs font-black italic tracking-tight leading-tight" style={{ color: "#14532d", fontFamily: "cursive, serif" }}>
          Recycle
        </span>
        <span className="text-xs font-black italic tracking-tight leading-tight" style={{ color: "#166534", fontFamily: "cursive, serif" }}>
          Responsibly
        </span>
        <span className="text-[10px] font-bold tracking-tight text-emerald-700 leading-tight">
          for a Better Tomorrow
        </span>
      </div>
    </div>
  );
}

// ─── View: SCAN & VERIFY ──────────────────────────────────────────────────────
function ScanVerify({ lots, setLots, transactions, setTransactions, scanRoute, setScanRoute }: { lots: LotItem[], setLots: React.Dispatch<React.SetStateAction<LotItem[]>>, transactions: any[], setTransactions: React.Dispatch<React.SetStateAction<any[]>>, scanRoute?: {lotId: string, step: number} | null, setScanRoute?: React.Dispatch<React.SetStateAction<{lotId: string, step: number} | null>> }) {
  const [step, setStep] = useState<0|1|2|3|4|5>(0);
  const [lotId, setLotId] = useState("");
  const [lotIdInput, setLotIdInput] = useState("");
  const [weight, setWeight] = useState<string>("");
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [verifyConfirmModalOpen, setVerifyConfirmModalOpen] = useState(false);
  const [rejCat, setRejCat] = useState("contamination");
  const [rejNotes, setRejNotes] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [searchedLot, setSearchedLot] = useState<LotItem | null>(null);

  const weightInputRef = React.useRef<HTMLInputElement>(null);
  const [pulseGlow, setPulseGlow] = useState(false);

  useEffect(() => {
    if (step === 1) {
      setPulseGlow(true);
      setTimeout(() => setPulseGlow(false), 800);
      setTimeout(() => {
         if (weightInputRef.current) {
            weightInputRef.current.focus();
         }
      }, 50);
    }
  }, [step]);

  const [paymentMethod, setPaymentMethod] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [resolutionNote, setResolutionNote] = useState("");

  useEffect(() => {
    if (scanRoute) {
      setLotId(scanRoute.lotId);
      setStep(scanRoute.step as 0|1|2|3|4|5);
      if (setScanRoute) setScanRoute(null);
    }
  }, [scanRoute, setScanRoute]);

  const LOT = lots.find(l => l.id === lotId) || lots[0]; // scanned lot
  const STEPS = ["Scan QR / Enter ID", "Inspect & Weigh", "Payment Summary"];
  const showToast = (msg: string) => { setToastMsg(msg); setTimeout(() => setToastMsg(null), 3500); };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "" || /^\d*\.?\d*$/.test(val)) {
      setWeight(val);
    }
  };

  const getWeightError = (w: string) => {
    if (w === "") return ""; // empty = fallback to scale (estimatedWeight)
    const num = parseFloat(w);
    if (isNaN(num)) return "Enter a valid numeric weight in kg";
    if (num <= 0) return "Weight must be greater than 0";
    if (num > 9999) return "Weight seems unusually high — please recheck";
    return "";
  };
  const weightErr = getWeightError(weight);

  const handleSearch = () => {
    setSearchError("");
    setSearchedLot(null);

    const input = lotIdInput.trim();
    if (!input) {
      setSearchError("Please enter a Lot ID");
      return;
    }

    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      const found = lots.find(l => 
        l.id.toUpperCase() === input.toUpperCase() && 
        (l.status === "accepted_awaiting_verification" || l.status === "accepted" || l.status === "disputed" || l.status === "dispute")
      );
      if (found) {
        startInspection(found.id);
      } else {
        const anyLot = lots.find(l => l.id.toUpperCase() === input.toUpperCase());
        if (anyLot && (anyLot.status === "pending" || anyLot.status === "requested")) {
          setSearchError(`Lot ${input} is Pending. Accept it in Lots Queue before inspecting.`);
        } else if (anyLot) {
          setSearchError(`Lot ${input} is ${anyLot.status} and cannot be inspected now.`);
        } else {
          setSearchError(`Lot ${input} not found or not ready for inspection.`);
        }
      }
    }, 600);
  };

  const startInspection = (id: string) => {
    setLotId(id);
    setStep(1);
    setSearchError("");
    setSearchedLot(null);
    setLotIdInput("");
  };

  const handleFinalizeConfirm = async () => {
    const actWt = parseFloat(weight) || LOT.estimatedWeight;
    const variance = Math.abs((actWt - LOT.estimatedWeight) / LOT.estimatedWeight);
    const variancePercent = ((actWt - LOT.estimatedWeight) / LOT.estimatedWeight) * 100;
    const amount = Math.round(actWt * LOT.rate);

    // Update Supabase to trigger Confirmed step in Collector App
    if (isSupabaseConfigured && supabase) {
      await supabase.from('lots').update({ 
        handover_status: 'handed_over',
        verified_weight: actWt,
        final_price: amount
      }).eq('lot_id', LOT.id);
    }

    if (LOT.status === "disputed" || LOT.status === "dispute") {
       setLots(prev => prev.map(l => l.id === LOT.id ? { 
         ...l, 
         status: "settling" as const, 
         actualWeight: actWt, 
         variancePercent,
         verifiedBy: "Admin", 
         verifiedAt: new Date().toISOString(), 
         resolutionNote 
       } : l));
       logAuditEvent("Dispute Resolved", LOT.id, `Resolved at ${actWt}kg`);
       showToast(`✓ Dispute resolved for Lot ${LOT.id}. Moved to Settling.`);
       setStep(3);
       setVerifyConfirmModalOpen(false);
       return;
    }

    if (variance <= 0.10) {
      setLots(prev => prev.map(l => l.id === LOT.id ? { 
        ...l, 
        status: "settling" as const, 
        actualWeight: actWt, 
        variancePercent,
        verifiedBy: "Admin", 
        verifiedAt: new Date().toISOString() 
      } : l));
      logAuditEvent("Weight Verified", LOT.id, `Verified at ${actWt}kg (Tolerance OK: ${variancePercent.toFixed(1)}%)`);
      showToast(`✓ Lot ${LOT.id} verified (${actWt} kg). Tolerance within ±10%.`);
      setStep(3);
      setVerifyConfirmModalOpen(false);
    } else {
      setLots(prev => prev.map(l => l.id === LOT.id ? { 
        ...l, 
        status: "disputed" as const, 
        actualWeight: actWt, 
        variancePercent,
        verifiedBy: "Admin", 
        verifiedAt: new Date().toISOString() 
      } : l));
      logAuditEvent("Dispute Flagged", LOT.id, `High variance (${variancePercent.toFixed(1)}%) -> ${actWt}kg vs est ${LOT.estimatedWeight}kg`);
      showToast(`⚠ High variance (${variancePercent.toFixed(1)}%). Lot ${LOT.id} flagged for Dispute.`);
      setStep(3);
      setVerifyConfirmModalOpen(false);
    }
  };

  const handlePayLater = async () => {
    const actWt = LOT.actualWeight || LOT.estimatedWeight;
    const isDisputed = LOT.status === "disputed" || LOT.status === "dispute" || (LOT.variancePercent !== null && LOT.variancePercent !== undefined && Math.abs(LOT.variancePercent) > 10);
    const amount = Math.round(actWt * LOT.rate);

    if (isSupabaseConfigured && supabase) {
      await supabase.from('lots').update({ 
        handover_status: 'handed_over',
        verified_weight: actWt,
        final_price: amount
      }).eq('lot_id', LOT.id);
    }

    if (isDisputed) {
      setLots(prev => prev.map(l => l.id === LOT.id ? { 
        ...l, 
        status: "disputed" as const, 
        finalWeight: actWt, 
      } : l));
      logAuditEvent("Dispute Queued", LOT.id, `Queued in Dispute tab for review`);
      showToast(`⚠ Lot ${LOT.id} routed to Dispute tab (${(LOT.variancePercent || 0).toFixed(1)}% variance).`);
    } else {
      setLots(prev => prev.map(l => l.id === LOT.id ? { 
        ...l, 
        status: "settling" as const, 
        finalWeight: actWt, 
        settledAt: new Date().toISOString() 
      } : l));
      logAuditEvent("Payment Settled", LOT.id, `Queued for Settling payout`);
      showToast(`✓ Lot ${LOT.id} moved to Settling queue (Pending Payout).`);
    }

    setStep(0);
    setLotId("");
    setWeight("");
  };

  const handlePayNow = () => {
    setStep(4); // Go to method selector
  };

  const processPayment = (method: string) => {
    setPaymentMethod(method);
    setIsProcessingPayment(true);
    setTimeout(async () => {
      setIsProcessingPayment(false);
      
      const actWt = LOT.actualWeight || LOT.estimatedWeight;
      const amount = Math.round(actWt * LOT.rate);

      if (isSupabaseConfigured && supabase) {
        await supabase.from('lots').update({ 
          handover_status: 'paid',
          verified_weight: actWt,
          final_price: amount
        }).eq('lot_id', LOT.id);
      }

      if (resolutionNote) {
         showToast(`SMS Sent: "Your ${LOT.id} dispute was resolved — ₹${amount.toLocaleString()} paid to your account."`);
      }

      setLots(prev => prev.map(l => l.id === LOT.id ? { ...l, status: "paid", finalWeight: actWt, paidAt: new Date().toISOString() } : l));
      logAuditEvent("Payment Completed", LOT.id, `₹${amount.toLocaleString()} disbursed`);

      setStep(5); // Success Receipt
    }, 1500);
  };

  const resetScanner = () => {
    setStep(0);
    setLotId("");
    setWeight("");
    setPaymentMethod("");
  };

  const handleReject = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('lots').update({ handover_status: 'declined' }).eq('lot_id', LOT.id);
    }
    setLots(prev => prev.map(l => l.id === LOT.id ? { ...l, status: "rejected_on_inspection", rejectionReason: { category: rejCat as any, notes: rejNotes } } : l));
    showToast(`Lot ${LOT.id} rejected on inspection (${rejCat}).`);
    setRejectModalOpen(false);
    setStep(0);
    setLotId("");
    setWeight("");
  };

  return (
    <div className="flex flex-col gap-4.5 slide-in max-w-6xl mx-auto w-full pb-8 relative">
      {toastMsg && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-in border border-gray-700">
          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center"><Icon name="info" size={14} color="#fff" /></div>
          <p className="text-sm font-semibold">{toastMsg}</p>
        </div>
      )}

      {/* ── Header Card & Stepper Banner ── */}
      <div className="rounded-2xl p-5 bg-white border border-gray-100 shadow-sm relative flex flex-col gap-4">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
          <span>Operations</span>
          <span>&gt;</span>
          <span className="text-gray-700 font-semibold">Scan &amp; Verify</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Title block */}
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm flex-shrink-0">
              <Icon name="scan" size={24} color="#047857" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">Scan &amp; Verify</h1>
              <p className="text-xs text-gray-500 mt-0.5">Confirm collector handovers — scan QR, capture weight, and complete verification</p>
            </div>
          </div>

          {/* Stepper */}
          <div className="flex items-center justify-center flex-1 max-w-sm mx-auto w-full">
            {STEPS.map((s, i) => {
              const currentStepIdx = step === 0 ? 0 : step === 1 ? 1 : 2;
              return (
                <React.Fragment key={s}>
                  <div className="flex flex-col items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      i < currentStepIdx ? "bg-emerald-600 text-white shadow-sm" : i === currentStepIdx ? "bg-emerald-700 text-white ring-4 ring-emerald-100 shadow-sm" : "bg-gray-100 text-gray-400 border border-gray-200"
                    }`}>
                      {i < currentStepIdx ? <Icon name="check" size={14}/> : i + 1}
                    </div>
                    <p className={`text-[10.5px] mt-1.5 text-center leading-tight font-medium ${i === currentStepIdx ? "text-emerald-800 font-bold" : "text-gray-500"}`} style={{ width: 100 }}>
                      {s}
                    </p>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`flex-1 h-[1.5px] mb-5 mx-1 min-w-[16px] max-w-[42px] ${i < currentStepIdx ? "bg-emerald-600" : "bg-gray-200"}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {step !== 3 && <RecycleBannerGraphic />}
        </div>
      </div>

      {/* ── Step 0: Scan & Incoming ── */}
      {step === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5">
          {/* Left: Scan QR Code */}
          <div className="rounded-2xl p-5 bg-white border border-gray-100 shadow-sm flex flex-col gap-4 justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Icon name="camera" size={18} color="#047857" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Scan QR Code</h3>
                  <p className="text-xs text-gray-500">Use your device camera to scan the lot token QR</p>
                </div>
              </div>
            </div>

            {/* Viewfinder Area */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 flex flex-col items-center justify-center p-6 min-h-[220px] shadow-inner border border-slate-800">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900 to-slate-950 opacity-90" />
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:16px_16px]" />

              <div className="relative w-44 h-44 flex items-center justify-center">
                <div className="absolute top-0 left-0 w-6 h-6 border-t-[3px] border-l-[3px] border-emerald-400 rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-[3px] border-r-[3px] border-emerald-400 rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-[3px] border-l-[3px] border-emerald-400 rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-[3px] border-r-[3px] border-emerald-400 rounded-br-lg" />

                <svg viewBox="0 0 100 100" className="w-28 h-28 text-white opacity-40">
                  <rect x="10" y="10" width="24" height="24" rx="3" fill="none" stroke="currentColor" strokeWidth="6" />
                  <rect x="18" y="18" width="8" height="8" fill="currentColor" />
                  <rect x="66" y="10" width="24" height="24" rx="3" fill="none" stroke="currentColor" strokeWidth="6" />
                  <rect x="74" y="18" width="8" height="8" fill="currentColor" />
                  <rect x="10" y="66" width="24" height="24" rx="3" fill="none" stroke="currentColor" strokeWidth="6" />
                  <rect x="18" y="74" width="8" height="8" fill="currentColor" />
                  <rect x="42" y="14" width="8" height="8" fill="currentColor" />
                  <rect x="42" y="32" width="8" height="18" fill="currentColor" />
                  <rect x="14" y="42" width="18" height="8" fill="currentColor" />
                  <rect x="66" y="42" width="12" height="12" fill="currentColor" />
                  <rect x="44" y="66" width="14" height="8" fill="currentColor" />
                  <rect x="66" y="66" width="8" height="18" fill="currentColor" />
                  <rect x="78" y="78" width="12" height="12" fill="currentColor" />
                </svg>

                <div className="absolute left-2 right-2 h-[2px] bg-emerald-400 shadow-[0_0_12px_#34d399] scan-laser" />
              </div>

              <div className="relative mt-3 px-3.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-1.5 shadow-sm">
                <Icon name="leaf" size={12} color="#34d399" />
                <span>Align the QR code within the frame</span>
              </div>
            </div>
            
            {/* Footer Status */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Camera active • MIDC-CAM-01</span>
              </div>
            </div>
          </div>

          {/* Right: Manual Entry & Requests */}
          <div className="rounded-2xl p-5 bg-white border border-gray-100 shadow-sm flex flex-col justify-between gap-4.5">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Icon name="edit" size={18} color="#047857" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Manual Lot ID Entry</h3>
                  <p className="text-xs text-gray-500">If QR is damaged or unavailable</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Lot ID / Token Number</label>
                <div className="flex items-center gap-2">
                  <input 
                    value={lotIdInput} 
                    onChange={e => setLotIdInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
                    placeholder="e.g. LOT-5712-OX"
                    className={`flex-1 px-4 py-2.5 rounded-xl border ${searchError ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-gray-200 focus:border-emerald-600 focus:ring-emerald-100'} text-sm font-mono text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 bg-white transition-all`} />
                  <button 
                    onClick={handleSearch}
                    disabled={isSearching || !lotIdInput.trim()}
                    className="bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 disabled:hover:bg-emerald-800 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer flex items-center justify-center min-w-[80px]">
                    {isSearching ? (
                      <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                    ) : (
                      "Enter"
                    )}
                  </button>
                </div>
                {searchError && (
                  <p className="text-[11px] font-semibold text-red-600 mt-1.5 flex items-center gap-1">
                    <Icon name="alert" size={12} color="currentColor" /> {searchError}
                  </p>
                )}
                
                {/* Matched Lot Summary Card */}
                {searchedLot && !isSearching && (
                  <div className="mt-3 p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 animate-slide-in">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <Icon name="check" size={14} color="#059669" />
                          <p className="text-xs font-bold text-emerald-900">Lot Found</p>
                        </div>
                        <p className="text-[11px] text-gray-600">{searchedLot.collector} • {searchedLot.cat} • {searchedLot.estimatedWeight} kg</p>
                      </div>
                      <button 
                        onClick={() => startInspection(searchedLot.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg shadow-sm transition-all cursor-pointer">
                        Proceed →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-gray-100" />

            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                    <Icon name="clock" size={18} color="#047857" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">Incoming Accepted Lots</h3>
                </div>
              </div>

              <div className="flex flex-col gap-2 h-44 overflow-y-auto pr-1 custom-scrollbar">
                {lots.filter(l => l.status === "accepted_awaiting_verification" || l.status === "accepted").length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-4 border border-dashed border-gray-200 rounded-xl bg-gray-50/60">
                    <Icon name="clock" size={20} color="#9ca3af" />
                    <p className="text-xs font-bold text-gray-700 mt-2">No lots awaiting verification</p>
                    <p className="text-[11px] text-gray-400 mt-0.5 max-w-[210px] leading-relaxed">Accept pending scrap lots from the Lots Queue to inspect and weigh them here.</p>
                  </div>
                ) : (
                  lots.filter(l => l.status === "accepted_awaiting_verification" || l.status === "accepted").map(l => (
                    <div key={l.id} onClick={() => startInspection(l.id)}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer hover:border-emerald-300 hover:shadow-sm bg-gray-50/70 border-gray-100 hover:bg-white`}>
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100/80 text-emerald-800 flex items-center justify-center flex-shrink-0">
                          <Icon name={l.emoji} size={16} color="#047857" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-emerald-800">{l.id}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">Awaiting Verification</span>
                          </div>
                          <p className="text-xs text-gray-500 truncate mt-0.5">
                            {l.collector} • {l.cat} • ~{l.estimatedWeight} kg
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-emerald-700 font-bold hover:underline">Inspect →</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Step 1: Inspect & Weigh ── */}
      {step === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5">
          <div className="rounded-2xl p-5 bg-white border border-gray-100 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <p className="text-sm font-bold text-gray-900">Lot Details — {LOT.id}</p>
                <p className="text-xs text-gray-500">Collector: {LOT.collector}</p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-mono">
                {LOT.cat}
              </span>
            </div>

            <div className="grid gap-2 grid-cols-2">
              {[
                { l: "Category",  v: <span className="flex items-center gap-1.5"><Icon name={LOT.emoji} size={14} color="#059669"/> {LOT.cat}</span> },
                { l: "Collector", v: LOT.collector },
                { l: "Phone",     v: LOT.phone },
                { l: "Est. Wt",   v: `${LOT.estimatedWeight} kg` },
                { l: "Rate",      v: `₹${LOT.rate}/kg` },
                { l: "Condition", v: LOT.condition || "Unknown" },
              ].map(r => (
                <div key={r.l} className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">{r.l}</p>
                  <p className="text-sm font-semibold text-gray-900">{r.v}</p>
                </div>
              ))}
            </div>

            {/* Photo capture */}
            <div>
              <p className="text-xs font-bold text-gray-700 mb-2">Photo Evidence (required)</p>
              <div className="grid gap-2 grid-cols-3">
                {["Lot overview", "Weight scale", "Collector ID"].map((lbl, i) => (
                  <div key={lbl} className="rounded-xl p-2 flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:bg-emerald-50/50 hover:border-emerald-300 transition-all"
                    style={{ background: "#f8fafc", border: `1.5px dashed #cbd5e1`, height: 80 }}>
                    <div className="w-7 h-7 rounded-full bg-white shadow-xs flex items-center justify-center text-gray-600">
                      <Icon name={i === 0 ? "box" : i === 1 ? "scale" : "card"} size={16} color="#059669" />
                    </div>
                    <p className="text-[10.5px] font-medium text-gray-600 text-center">{lbl}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-5 bg-white border border-gray-100 shadow-sm flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-sm font-bold text-gray-900">Weight Capture &amp; Calibration</p>
                <p className="text-xs text-gray-500">Live feed from calibrated digital platform</p>
              </div>

              {(LOT.status === "disputed" || LOT.status === "dispute") && (
                <div className="rounded-xl p-4 border bg-amber-50 border-amber-200">
                  <p className="text-[11px] font-bold text-amber-900 uppercase">Dispute Information</p>
                  <div className="flex gap-4 mt-1.5 text-xs text-amber-800">
                    <div>
                      <span className="font-semibold opacity-70">Estimated:</span> <span className="font-mono">{LOT.estimatedWeight} kg</span>
                    </div>
                    <div>
                      <span className="font-semibold opacity-70">Actual (Flagged):</span> <span className="font-mono font-bold text-amber-900">{LOT.actualWeight} kg</span>
                    </div>
                    <div>
                      <span className="font-semibold opacity-70">Variance:</span> <span className="font-mono font-bold text-amber-900">{LOT.actualWeight && LOT.estimatedWeight ? ((LOT.actualWeight - LOT.estimatedWeight) / LOT.estimatedWeight * 100).toFixed(1) : 0}%</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <textarea value={resolutionNote} onChange={e => setResolutionNote(e.target.value)} placeholder="Record resolution rationale (e.g. 'Reweighed, collector agrees with actuals')" className="w-full text-xs p-2.5 rounded-lg border border-amber-200 bg-white placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-amber-200 text-gray-800" rows={2}></textarea>
                  </div>
                </div>
              )}

              {/* Digital Scale Display */}
              <div className="rounded-2xl p-6 text-center bg-gray-900 text-white border border-gray-800 shadow-inner relative overflow-hidden">
                <div className="absolute top-3 left-4 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-mono text-emerald-300 uppercase tracking-wider">EGR-SCALE-02 • NABL Certified</span>
                </div>
                <div className="inline-flex items-end gap-2 my-2">
                  <input ref={weightInputRef} value={weight} onChange={handleWeightChange}
                    placeholder={String(LOT.estimatedWeight)} className={`text-6xl font-mono font-bold text-right bg-transparent outline-none w-44 text-emerald-400 placeholder:text-gray-600 rounded-lg ${pulseGlow ? 'animate-input-focus' : ''}`} />
                  <span className="text-2xl font-bold text-emerald-600 pb-2">kg</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Auto-reading from connected bluetooth scale • type to override</p>
                {weightErr && (
                  <p className="text-[13px] text-red-500 font-bold mt-2 animate-slide-in">{weightErr}</p>
                )}
              </div>

              {/* Live Calculation */}
              <div className="rounded-xl p-4 border bg-emerald-50 border-emerald-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[11px] font-bold text-emerald-900 uppercase">Live Payout Calc</p>
                    <p className="text-xs text-emerald-700 mt-0.5">{(weight || LOT.estimatedWeight)} kg × ₹{LOT.rate}/kg</p>
                  </div>
                  <p className="text-2xl font-mono font-bold text-emerald-700">₹{Math.round(parseFloat(weight || String(LOT.estimatedWeight)) * LOT.rate).toLocaleString()}</p>
                </div>
              </div>
              
              {weight && Math.abs((+weight - LOT.estimatedWeight) / LOT.estimatedWeight) > 0.10 && (
                <div className="rounded-xl p-3 border bg-amber-50 border-amber-200 text-amber-900">
                   <p className="text-xs font-bold flex items-center gap-1"><Icon name="alert" size={14}/> {(Math.abs(+weight - LOT.estimatedWeight) / LOT.estimatedWeight * 100).toFixed(1)}% variance detected.</p>
                   <p className="text-xs mt-0.5">This will automatically flag the lot for Dispute upon confirmation.</p>
                </div>
              )}
            </div>

            <div className="flex gap-2.5 pt-2">
              <button onClick={() => setStep(0)}
                className="px-4 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
                ← Back
              </button>
              <button onClick={() => setRejectModalOpen(true)}
                className="flex-1 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-bold text-xs py-3 px-4 rounded-xl shadow-sm transition-all cursor-pointer">
                Reject on inspection
              </button>
              <button onClick={() => setVerifyConfirmModalOpen(true)}
                disabled={!!weightErr}
                className="flex-[1.5] bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs py-3 px-4 rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5">
                <span>Verify & Proceed →</span>
              </button>
            </div>
          </div>

          {verifyConfirmModalOpen && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl p-6 max-w-sm w-full animate-slide-in shadow-xl">
                <h3 className="text-lg font-black text-gray-900 mb-2">Confirm Verification</h3>
                <p className="text-sm text-gray-600 mb-5">
                  Are you sure you want to verify and proceed with {parseFloat(weight) || LOT.estimatedWeight} kg?
                  This will immediately update the Collector's app with the final payout values.
                </p>
                <div className="flex gap-3">
                  <button onClick={() => setVerifyConfirmModalOpen(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-sm py-2.5 rounded-xl transition-colors cursor-pointer">
                    Cancel
                  </button>
                  <button onClick={handleFinalizeConfirm} className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm py-2.5 rounded-xl shadow-sm transition-colors cursor-pointer">
                    Confirm & Sync
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Step 3: Payment Summary & Outcome ── */}
      {step === 3 && (() => {
        const isLotDisputed = LOT.status === "disputed" || LOT.status === "dispute" || (LOT.variancePercent !== null && LOT.variancePercent !== undefined && Math.abs(LOT.variancePercent) > 10);
        const varPct = LOT.variancePercent !== null && LOT.variancePercent !== undefined ? LOT.variancePercent : (LOT.actualWeight ? ((LOT.actualWeight - LOT.estimatedWeight) / LOT.estimatedWeight) * 100 : 0);
        const finalWt = LOT.actualWeight || LOT.estimatedWeight;
        const totalPayout = Math.round(finalWt * LOT.rate);

        return (
          <div className="max-w-[480px] mx-auto w-full bg-white rounded-[20px] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 flex flex-col gap-4 animate-slide-in relative">
            <button onClick={() => setStep(1)} className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
              <Icon name="arrow-left" size={20} color="currentColor" />
            </button>
            
            <div className="text-center relative">
              {!isLotDisputed && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
                   <div className="absolute top-[-5px] left-[30%] w-1.5 h-1.5 bg-emerald-400 rounded-full animate-confetti" style={{animationDelay: '0.1s'}} />
                   <div className="absolute top-[10px] right-[35%] w-2 h-2 bg-amber-400 rounded-full animate-confetti" style={{animationDelay: '0.2s'}} />
                   <div className="absolute bottom-[20%] left-[30%] w-1 h-1 bg-emerald-600 rounded-full animate-confetti" style={{animationDelay: '0.3s'}} />
                   <div className="absolute top-[40%] right-[25%] w-1.5 h-1.5 bg-blue-400 rounded-full animate-confetti" style={{animationDelay: '0.15s'}} />
                </div>
              )}
              
              {isLotDisputed ? (
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-2 text-orange-600 animate-scale-bounce shadow-sm">
                  <Icon name="alert" size={24} color="#ea580c" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#dcfce7] flex items-center justify-center mx-auto mb-2 text-[#047857] animate-scale-bounce shadow-sm">
                  <Icon name="check" size={24} color="currentColor" />
                </div>
              )}

              <h2 className="text-[20px] font-bold text-gray-900 tracking-tight">
                {isLotDisputed ? "Weight Variance Detected" : "Verification Complete"}
              </h2>
              <p className="text-[13px] text-gray-500 mt-0.5">
                {isLotDisputed 
                  ? `Lot ${LOT.id} has a ${varPct > 0 ? '+' : ''}${varPct.toFixed(1)}% weight variance.` 
                  : `Lot ${LOT.id} has been verified and is ready for payment.`}
              </p>
            </div>

            <div className="rounded-xl overflow-hidden border border-gray-100 bg-[#fafafa]">
              <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100 bg-white">
                <span className="text-[13px] font-bold text-gray-900">Lot Details</span>
                {isLotDisputed ? (
                  <span className="bg-orange-50 text-orange-700 px-2.5 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 border border-orange-200">
                    <Icon name="alert" size={10} color="#ea580c" /> Variance ({varPct > 0 ? '+' : ''}{varPct.toFixed(1)}%)
                  </span>
                ) : (
                  <span className="bg-[#ecfdf5] text-[#047857] px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 border border-[#d1fae5]">
                    <Icon name="check" size={10} color="currentColor" /> Verified
                  </span>
                )}
              </div>
              
              <div className="p-4 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Icon name="users" size={15} color="currentColor" />
                    <span className="text-[12px] font-medium">Collector</span>
                  </div>
                  <span className="text-[13px] font-bold text-gray-900">{LOT.collector}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Icon name="box" size={15} color="currentColor" />
                    <span className="text-[12px] font-medium">Material</span>
                  </div>
                  <span className="text-[13px] font-bold text-gray-900">{LOT.cat}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Icon name="scale" size={15} color="currentColor" />
                    <span className="text-[12px] font-medium">Estimated Weight</span>
                  </div>
                  <span className="text-[13px] font-semibold text-gray-600">{LOT.estimatedWeight} kg</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Icon name="scale" size={15} color="currentColor" />
                    <span className="text-[12px] font-medium">Actual (Verified) Weight</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] font-bold text-gray-900">{finalWt} kg</span>
                    {Math.abs(varPct) > 0.1 && (
                      <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${isLotDisputed ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-800'}`}>
                        {varPct > 0 ? '+' : ''}{varPct.toFixed(1)}%
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-200 border-dashed">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Icon name="indian-rupee" size={15} color="currentColor" />
                    <span className="text-[12px] font-medium">Rate</span>
                  </div>
                  <span className="text-[13px] font-bold text-gray-900">₹{LOT.rate}/kg</span>
                </div>
                
                <div className="flex justify-between items-center pt-1">
                  <div className="flex items-center gap-2 text-gray-900">
                    <Icon name="card" size={16} color="currentColor" />
                    <span className="text-[14px] font-bold">Total Payout</span>
                  </div>
                  <span className={`text-[24px] font-black ${isLotDisputed ? 'text-orange-700' : 'text-[#047857]'}`}>₹{totalPayout.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div className={`flex items-center gap-2 px-2 text-[11px] font-medium py-2 rounded-lg justify-center border ${isLotDisputed ? 'text-orange-800 bg-orange-50 border-orange-200' : 'text-gray-500 bg-[#f8fafc] border-gray-100'}`}>
              <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${isLotDisputed ? 'bg-orange-200 text-orange-800' : 'bg-[#ecfdf5] text-[#10b981]'}`}>
                <Icon name={isLotDisputed ? "alert" : "check"} size={8} color="currentColor" />
              </div>
              {isLotDisputed 
                ? `Variance logged by System on ${new Date().toLocaleDateString()} — Recycler review required` 
                : `Verified by Admin on ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <div className="flex gap-2">
                <button onClick={handlePayLater} className={`flex-1 font-bold py-2.5 rounded-xl transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2 text-[13px] ${isLotDisputed ? 'bg-white hover:bg-orange-50 border border-orange-300 text-orange-700' : 'bg-white hover:bg-gray-50 border border-gray-200 text-gray-700'}`}>
                  <Icon name={isLotDisputed ? "alert" : "clock"} size={14} color="currentColor" />
                  {isLotDisputed ? "Pay Later" : "Pay Later"}
                </button>
                <button onClick={handlePayNow} className={`flex-1 font-bold py-2.5 rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 text-[13px] ${isLotDisputed ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-[#047857] hover:bg-[#065f46] text-white'}`}>
                  <Icon name="card" size={14} color="currentColor" />
                  {isLotDisputed ? "Resolve & Pay Now" : "Pay Now"}
                </button>
              </div>
              <button onClick={() => setStep(1)} className="text-[12px] font-semibold text-gray-500 hover:text-gray-900 text-center py-1 cursor-pointer transition-colors mt-0.5">
                &larr; Cancel & Go Back
              </button>
            </div>
          </div>
        );
      })()}

      {/* ── Step 3: Payment Method ── */}
      {step === 4 && (
        <div className="max-w-md mx-auto w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-5 animate-slide-in">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Select Payment Method</h2>
            <p className="text-sm text-gray-500 mt-1">Paying ₹{Math.round((LOT.actualWeight || LOT.estimatedWeight) * LOT.rate).toLocaleString()} to {LOT.collector}</p>
          </div>

          <div className="flex flex-col gap-3">
            {[
              { id: "UPI", icon: "smartphone", desc: "Instant transfer via UPI ID" },
              { id: "Cash", icon: "cash", desc: "Physical cash handover" },
              { id: "Bank Transfer", icon: "bank", desc: "NEFT/IMPS transfer" }
            ].map(m => (
              <button key={m.id} onClick={() => processPayment(m.id)} disabled={isProcessingPayment}
                className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all cursor-pointer ${isProcessingPayment && paymentMethod === m.id ? "bg-emerald-50 border-emerald-300 ring-2 ring-emerald-100" : isProcessingPayment ? "opacity-50 cursor-not-allowed" : "bg-white border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/30"}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isProcessingPayment && paymentMethod === m.id ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>
                  {isProcessingPayment && paymentMethod === m.id ? (
                    <span className="w-5 h-5 rounded-full border-2 border-emerald-500/30 border-t-emerald-600 animate-spin" />
                  ) : (
                    <Icon name={m.icon as any} size={18} color="currentColor" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{m.id}</p>
                  <p className="text-xs text-gray-500">{m.desc}</p>
                </div>
              </button>
            ))}
          </div>
          
          {!isProcessingPayment && (
            <button onClick={() => setStep(3)} className="text-xs font-bold text-gray-500 hover:text-gray-900 text-center py-2 cursor-pointer transition-colors">
              &larr; Cancel & Go Back
            </button>
          )}
        </div>
      )}

      {/* ── Step 4: Success Confirmation ── */}
      {step === 5 && (
        <div className="max-w-md mx-auto w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col items-center text-center gap-5 animate-slide-in">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 relative">
            <div className="absolute inset-0 rounded-full border-4 border-emerald-100 animate-ping" />
            <Icon name="check" size={32} color="#047857" />
          </div>
          
          <div>
            <h2 className="text-xl font-bold text-gray-900">Payment Successful</h2>
            <p className="text-sm text-gray-500 mt-1">Transaction recorded in ledger.</p>
          </div>

          <div className="w-full bg-gray-50 rounded-xl p-4 border border-gray-200 border-dashed text-left flex flex-col gap-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Receipt Details</p>
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">Amount</span>
              <span className="text-sm font-bold text-emerald-700">₹{Math.round((LOT.actualWeight || LOT.estimatedWeight) * LOT.rate).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">To</span>
              <span className="text-xs font-bold text-gray-900">{LOT.collector}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">Method</span>
              <span className="text-xs font-bold text-gray-900">{paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">Ref</span>
              <span className="text-xs font-mono font-bold text-gray-900">TXN-{Math.floor(Math.random() * 9000 + 1000)}</span>
            </div>
          </div>

          <div className="flex flex-col w-full gap-2.5 pt-2">
            <button className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-sm py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2">
              <Icon name="download" size={16} color="currentColor" />
              Download Receipt
            </button>
            <button onClick={resetScanner} className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm py-2.5 rounded-xl shadow-sm transition-all cursor-pointer">
              Back to Scanner
            </button>
          </div>
        </div>
      )}

      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-100 flex flex-col gap-4 animate-slide-in">
            <h3 className="text-lg font-bold text-gray-900">Reject Lot {LOT.id}</h3>
            
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Reason Category</label>
              <select value={rejCat} onChange={(e) => setRejCat(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-red-500">
                <option value="contamination">Contamination</option>
                <option value="material_mismatch">Material Mismatch</option>
                <option value="hazard_concern">Hazardous Handling Concern</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Inspector Notes</label>
              <textarea value={rejNotes} onChange={(e) => setRejNotes(e.target.value)} rows={3} placeholder="Provide details..." className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-red-500" />
            </div>

            <div className="flex gap-2 pt-2">
              <button onClick={() => setRejectModalOpen(false)} className="flex-1 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-sm font-bold py-2.5 rounded-xl cursor-pointer">
                Cancel
              </button>
              <button onClick={handleReject} className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-2.5 rounded-xl shadow-xs cursor-pointer">
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Inventory() {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("all");

  const cats = ["All", ...Array.from(new Set(INVENTORY_DATA.map(i => i.cat)))];
  const filtered = INVENTORY_DATA.filter(i => {
    const ms = !search || i.id.includes(search) || i.cat.toLowerCase().includes(search.toLowerCase()) || i.collector.toLowerCase().includes(search.toLowerCase());
    const mc = catFilter === "All" || i.cat === catFilter;
    const mst = statusFilter === "all" || i.status === statusFilter;
    return ms && mc && mst;
  });

  const STATUS_META: Record<string, [string, string]> = {
    in_stock: [G.skyL, G.sky], processing: [G.amberL, G.amber], processed: [G.greenL, G.green], sold: ["#f1f5f9", G.muted],
  };

  const totalKg = INVENTORY_DATA.reduce((s, i) => s + parseFloat(i.wt), 0);

  return (
    <div className="flex flex-col gap-5 slide-in">
      <SectionHd title="Inventory" sub="All material lots currently in facility — tracked by status and zone"
        right={<><Btn variant="ghost" small><span className="flex items-center gap-2"><Icon name="tag" size={14}/> Generate Labels</span></Btn><Btn variant="ghost" small><span className="flex items-center gap-2"><Icon name="download" size={14}/> Export CSV</span></Btn></>} />

      {/* Summary cards */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
        {[
          { l: "In Stock",    v: `${INVENTORY_DATA.filter(i=>i.status==="in_stock").length} lots`,   icon: <Icon name="box" size={20}/>, color: G.sky   },
          { l: "Processing",  v: `${INVENTORY_DATA.filter(i=>i.status==="processing").length} lots`,  icon: <Icon name="settings" size={20}/>, color: G.amber },
          { l: "Processed",   v: `${INVENTORY_DATA.filter(i=>i.status==="processed").length} lots`,   icon: <Icon name="check" size={20}/>, color: G.green },
          { l: "Total Volume",v: `${totalKg.toFixed(0)} kg`,                                          icon: <Icon name="scale" size={20}/>, color: G.green },
        ].map(k => <KCard key={k.l} label={k.l} value={k.v} sub="" icon={k.icon} color={k.color} />)}
      </div>

      {/* Aging alert */}
      {INVENTORY_DATA.some(i => i.age >= 10 && i.status !== "sold") && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{ background: G.amberL, border: `1px solid #fcd34d` }}>
          <span>⏰</span>
          <p className="text-sm" style={{ color: G.dark }}>
            <strong>2 lots aging &gt; 10 days</strong> — {INVENTORY_DATA.filter(i=>i.age>=10&&i.status!=="sold").map(i=>i.id).join(", ")}. Review for processing or disposal.
          </p>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <SearchInput placeholder="Search lots, categories, collectors..." value={search} onChange={setSearch} />
        <div className="flex gap-1 p-1 rounded-lg" style={{ background: G.card2, border: `1px solid ${G.border}` }}>
          {["all", "in_stock", "processing", "processed", "sold"].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className="px-3 py-1 rounded-md text-xs font-medium capitalize transition-all"
              style={{ background: statusFilter===s ? G.green : "transparent", color: statusFilter===s ? "#fff" : G.muted }}>
              {s.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ background: G.card, border: `1px solid ${G.border}` }}>
        <table className="w-full">
          <thead><tr>
            <TH ch="Inventory ID" /><TH ch="Category" /><TH ch="Weight" /><TH ch="Received" />
            <TH ch="Collector" /><TH ch="Status" /><TH ch="Zone" /><TH ch="Age (days)" /><TH ch="Actions" />
          </tr></thead>
          <tbody>
            {filtered.map(item => {
              const [bg, color] = STATUS_META[item.status] ?? ["#f1f5f9", G.muted];
              return (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors"
                  style={{ background: item.age >= 10 && item.status !== "sold" ? "#fffbeb" : "transparent" }}>
                  <TD mono green>{item.id}</TD>
                  <TD><div className="flex items-center gap-2"><Icon name={item.emoji} size={14} /><span>{item.cat}</span></div></TD>
                  <TD mono>{item.wt}</TD>
                  <TD mono muted>{item.received}</TD>
                  <TD>{item.collector}</TD>
                  <TD><Pill label={item.status.replace("_", " ")} color={color} bg={bg} /></TD>
                  <TD mono muted>{item.zone}</TD>
                  <TD>
                    <span className="font-mono text-sm" style={{ color: item.age >= 10 ? G.amber : item.age >= 5 ? G.orange : G.muted }}>
                      {item.age}d {item.age >= 10 ? "⏰" : ""}
                    </span>
                  </TD>
                  <TD>
                    <div className="flex gap-1">
                      <Btn variant="ghost" small>View</Btn>
                      {item.status === "in_stock" && <Btn variant="sky" small>Process</Btn>}
                      <Btn variant="ghost" small><Icon name="tag" size={14}/></Btn>
                    </div>
                  </TD>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── View: MARKET TRENDS ──────────────────────────────────────────────────────
function MarketTrends() {
  const [search, setSearch] = useState("");
  const [pinned, setPinned] = useState<Set<string>>(new Set(MATERIALS.filter(m => m.pinned).map(m => m.name)));
  const [selected, setSelected] = useState<string | null>("Cable");
  const [alertThresholds, setAlertThresholds] = useState<Record<string, number>>({});

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return MATERIALS.filter(m => !q || m.name.toLowerCase().includes(q) || m.cat.toLowerCase().includes(q));
  }, [search]);

  const pinnedMats = filtered.filter(m => pinned.has(m.name));
  const otherMats  = filtered.filter(m => !pinned.has(m.name));

  const selectedMat = MATERIALS.find(m => m.name === selected);

  const togglePin = (name: string) => {
    const s = new Set(pinned);
    s.has(name) ? s.delete(name) : s.add(name);
    setPinned(s);
  };

  const MiniSparkline = ({ data, color }: { data: number[]; color: string }) => (
    <svg width={64} height={24} viewBox={`0 0 64 24`}>
      <polyline
        points={data.map((v, i) => `${(i / (data.length - 1)) * 64},${24 - ((v - Math.min(...data)) / (Math.max(...data) - Math.min(...data) + 1)) * 22}`).join(" ")}
        fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round"
      />
    </svg>
  );

  const MatRow = ({ m }: { m: typeof MATERIALS[0] }) => {
    const delta = m.rate - m.prev;
    const pct   = ((delta / m.prev) * 100).toFixed(1);
    const color = delta > 0 ? G.green : delta < 0 ? G.red : G.muted;
    return (
      <div onClick={() => setSelected(m.name)}
        className="flex items-center gap-3 px-4 py-3 border-b cursor-pointer hover:bg-slate-50 transition-colors"
        style={{ borderColor: G.border, background: selected === m.name ? G.greenXL : "transparent" }}>
        <button onClick={e => { e.stopPropagation(); togglePin(m.name); }}
          className="text-base flex-shrink-0" title={pinned.has(m.name) ? "Unpin" : "Pin"}>
          {pinned.has(m.name) ? <Icon name="pin" size={16} /> : <Icon name="map-pin" size={16} />}
        </button>
        <Icon name={m.emoji} size={20} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium" style={{ color: G.dark }}>{m.name}</p>
            {m.hazard && <Badge text="HAZ" type="red" />}
            <Badge text={m.cat} type="gray" />
          </div>
          <p className="font-mono text-xs mt-0.5" style={{ color: G.muted }}>Last updated: 2 min ago · Mumbai</p>
        </div>
        <MiniSparkline data={m.trend} color={color} />
        <div className="text-right flex-shrink-0 w-24">
          <p className="font-mono text-base font-medium" style={{ color: G.dark }}>₹{m.rate}/{m.unit}</p>
          <p className="font-mono text-xs" style={{ color }}>
            {delta >= 0 ? "↑" : "↓"} ₹{Math.abs(delta)} ({pct}%)
          </p>
        </div>
        {alertThresholds[m.name] ? (
          <span className="font-mono text-[10px] px-2 py-0.5 rounded-full" style={{ background: G.amberL, color: G.amber }}>
            <span className="flex items-center gap-1.5"><Icon name="bell" size={14}/> Alert</span> ≥₹{alertThresholds[m.name]}
          </span>
        ) : null}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-5 slide-in">
      <SectionHd title="Market Trends" sub="Live CPCB reference rates · Sync from collector app · Mumbai Zone"
        right={
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: G.greenXL, border: `1px solid ${G.greenL}` }}>
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: "#22c55e" }} />
            <span className="font-mono text-xs font-medium" style={{ color: G.green }}>Synced 2 min ago</span>
          </div>
        } />

      <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 340px" }}>
        {/* Material list */}
        <div className="rounded-xl overflow-hidden" style={{ background: G.card, border: `1px solid ${G.border}` }}>
          <div className="px-4 py-3 border-b flex items-center gap-3" style={{ borderColor: G.border }}>
            <SearchInput placeholder="Search materials..." value={search} onChange={setSearch} />
          </div>
          {pinnedMats.length > 0 && (
            <>
              <div className="px-4 py-2" style={{ background: G.card2 }}>
                <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: G.muted }}><span className="flex items-center gap-1"><Icon name="pin" size={10}/> Pinned</span></p>
              </div>
              {pinnedMats.map(m => <MatRow key={m.name} m={m} />)}
            </>
          )}
          {otherMats.length > 0 && (
            <>
              <div className="px-4 py-2" style={{ background: G.card2 }}>
                <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: G.muted }}>All Materials</p>
              </div>
              {otherMats.map(m => <MatRow key={m.name} m={m} />)}
            </>
          )}
        </div>

        {/* Detail panel */}
        {selectedMat ? (
          <div className="rounded-xl p-5 flex flex-col gap-4" style={{ background: G.card, border: `1px solid ${G.border}` }}>
            <div className="flex items-center gap-3">
              <Icon name={selectedMat.emoji} size={32} />
              <div>
                <p className="text-base font-semibold" style={{ color: G.dark }}>{selectedMat.name}</p>
                <p className="text-xs" style={{ color: G.muted }}>{selectedMat.cat} · per {selectedMat.unit}</p>
              </div>
            </div>

            <div className="grid gap-2" style={{ gridTemplateColumns: "1fr 1fr" }}>
              {[
                { l: "Current Rate", v: `₹${selectedMat.rate}/kg`, c: G.dark },
                { l: "Previous",     v: `₹${selectedMat.prev}/kg`, c: G.muted },
                { l: "Change",       v: `${selectedMat.rate-selectedMat.prev >= 0 ? "+" : ""}₹${selectedMat.rate-selectedMat.prev}`, c: selectedMat.rate>selectedMat.prev?G.green:G.red },
                { l: "Your Buy Rate",v: `₹${RATES_BASE.find(r=>r.cat===selectedMat.name)?.mine ?? "—"}/kg`, c: G.green },
              ].map(r => (
                <div key={r.l} className="p-2.5 rounded-lg" style={{ background: G.bg }}>
                  <p className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: G.faint }}>{r.l}</p>
                  <p className="font-mono text-sm font-medium" style={{ color: r.c }}>{r.v}</p>
                </div>
              ))}
            </div>

            {/* 7d sparkline large */}
            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: G.muted }}>7-Day Trend</p>
              <ResponsiveContainer width="100%" height={100}>
                <LineChart data={selectedMat.trend.map((v, i) => ({ d: `D${i+1}`, v }))} margin={{ top:4,right:4,left:-30,bottom:0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={G.border} />
                  <XAxis dataKey="d" tick={{ fontSize:9, fill:G.muted, fontFamily:"DM Mono" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize:9, fill:G.muted, fontFamily:"DM Mono" }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background:G.card, border:`1px solid ${G.border}`, borderRadius:6, fontSize:11, fontFamily:"DM Mono" }} formatter={(v: any)=>[ `₹${v}/kg` ]} />
                  <Line type="monotone" dataKey="v" stroke={selectedMat.rate>selectedMat.prev?G.green:G.red} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Rate alert */}
            <div>
              <p className="text-xs font-semibold mb-1.5" style={{ color: G.muted }}><span className="flex items-center gap-1.5"><Icon name="bell" size={14}/> Rate Alert</span></p>
              <div className="flex gap-2">
                <input type="number"
                  value={alertThresholds[selectedMat.name] || ""}
                  onChange={e => setAlertThresholds(p => ({ ...p, [selectedMat.name]: +e.target.value }))}
                  placeholder={`Notify if ≥ ₹${selectedMat.rate + 10}/kg`}
                  className="flex-1 px-3 py-2 rounded-lg text-sm font-mono outline-none"
                  style={{ background: G.bg, border: `1px solid ${G.border}`, color: G.dark }} />
                <Btn variant="amber" small>Set</Btn>
              </div>
            </div>

            <Btn variant="ghost" full small onClick={() => togglePin(selectedMat.name)}>
              {pinned.has(selectedMat.name) ? "Unpin" : <span className="flex items-center gap-1.5"><Icon name="pin" size={14}/> Pin to top</span>}
            </Btn>
          </div>
        ) : (
          <div className="rounded-xl flex items-center justify-center" style={{ background: G.card, border: `1px solid ${G.border}` }}>
            <p className="text-sm" style={{ color: G.faint }}>Select a material to view detail</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Shared Payment Modal ───────────────────────────────────────────────────
function PaymentModal({
  lot,
  isOpen,
  onClose,
  onSuccess
}: {
  lot: LotItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (method: string, txRef: string) => void;
}) {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [txRef, setTxRef] = useState("");
  const [paidTime, setPaidTime] = useState("");

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSelectedMethod("");
      setIsProcessing(false);
      setTxRef("");
      setPaidTime("");
    }
  }, [isOpen, lot?.id]);

  if (!isOpen || !lot) return null;

  const finalWt = lot.finalWeight || lot.actualWeight || lot.estimatedWeight;
  const amount = Math.round(finalWt * lot.rate);

  const handleSelectMethod = (method: string) => {
    setSelectedMethod(method);
    setIsProcessing(true);
    const ref = "TXN-" + Math.floor(1000 + Math.random() * 9000);
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setTxRef(ref);
    setPaidTime(timeStr);

    setTimeout(() => {
      setIsProcessing(false);
      onSuccess(method, ref);
      setStep(2);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-[24px] p-6 max-w-md w-full shadow-2xl border border-gray-100 flex flex-col gap-4 animate-slide-in relative">
        
        {/* Step 1: Method Selector */}
        {step === 1 && (
          <>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <Icon name="card" size={16} color="#047857" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Authorize Payout</h3>
                  <p className="text-[11px] text-gray-500">Lot {lot.id} • {lot.collector}</p>
                </div>
              </div>
              {!isProcessing && (
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer p-1 rounded-lg hover:bg-gray-100 transition-colors">
                  <Icon name="x" size={16} />
                </button>
              )}
            </div>

            {/* Context Pre-filled Breakdown Card */}
            <div className="rounded-xl p-3.5 bg-gray-50 border border-gray-100 flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Collector</span>
                <span className="font-bold text-gray-800">{lot.collector} <span className="text-gray-400 font-normal tabular-nums">({lot.phone})</span></span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Category &amp; Weight</span>
                <span className="font-semibold text-gray-800">{lot.cat} • {finalWt} kg</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Rate</span>
                <span className="font-mono text-gray-700">₹{lot.rate} / kg</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between items-baseline">
                <span className="text-xs font-bold text-gray-900">Total Settlement Amount</span>
                <span className="font-mono text-xl font-black text-[#047857]">
                  ₹{amount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Method Picker */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Select Payout Method</label>
              <div className="flex flex-col gap-2.5">
                {[
                  { id: "UPI", icon: "smartphone", title: "Instant UPI Transfer", desc: "Disburse directly to collector UPI VPA" },
                  { id: "Cash", icon: "card", title: "Counter Cash Handover", desc: "Physical cash voucher & ledger signature" },
                  { id: "Bank Transfer", icon: "settings", title: "Bank IMPS / NEFT", desc: "Direct NEFT deposit to verified bank" }
                ].map(m => (
                  <button
                    key={m.id}
                    onClick={() => handleSelectMethod(m.id)}
                    disabled={isProcessing}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isProcessing && selectedMethod === m.id
                        ? "bg-emerald-50 border-emerald-400 ring-2 ring-emerald-100"
                        : isProcessing
                          ? "opacity-50 cursor-not-allowed bg-white border-gray-100"
                          : "bg-white border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/20"
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isProcessing && selectedMethod === m.id ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-600"
                    }`}>
                      {isProcessing && selectedMethod === m.id ? (
                        <span className="w-4 h-4 rounded-full border-2 border-emerald-500/30 border-t-emerald-600 animate-spin" />
                      ) : (
                        <Icon name={m.icon as any} size={16} color="currentColor" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-gray-900">{m.title}</p>
                      <p className="text-[10.5px] text-gray-500 truncate">{m.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {!isProcessing && (
              <div className="pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer text-center"
                >
                  Cancel &amp; Keep in Settling
                </button>
              </div>
            )}
          </>
        )}

        {/* Step 2: Payment Receipt & Success Confirmation */}
        {step === 2 && (
          <div className="flex flex-col items-center text-center gap-4 py-2 animate-slide-in">
            <div className="w-14 h-14 rounded-full bg-[#dcfce7] flex items-center justify-center text-[#047857] shadow-sm relative">
              <div className="absolute inset-0 rounded-full border-4 border-emerald-200 animate-ping opacity-60" />
              <Icon name="check" size={28} color="#047857" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 tracking-tight">Payment Disbursed Successfully</h3>
              <p className="text-xs text-gray-500 mt-0.5">Lot {lot.id} has been settled and moved to History.</p>
            </div>

            <div className="w-full bg-[#f8fafc] rounded-2xl p-4 border border-gray-200 border-dashed text-left flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Amount Paid</span>
                <span className="font-mono text-base font-black text-[#047857]">₹{amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Paid To</span>
                <span className="font-bold text-gray-800">{lot.collector}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Method</span>
                <span className="font-semibold text-gray-800">{selectedMethod}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Transaction Ref</span>
                <span className="font-mono font-bold text-[#1B1464]">{txRef}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Time</span>
                <span className="font-mono text-gray-500">{paidTime || "Just now"}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full pt-1">
              <button
                onClick={onClose}
                className="w-full bg-[#047857] hover:bg-[#065f46] text-white font-bold text-xs py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// ─── View: PAYMENTS ───────────────────────────────────────────────────────────
function Payments({ 
  lots, 
  setLots, 
  setView, 
  setScanRoute,
  transactions,
  setTransactions 
}: { 
  lots: LotItem[]; 
  setLots: React.Dispatch<React.SetStateAction<LotItem[]>>; 
  setView?: (v: string) => void; 
  setScanRoute?: React.Dispatch<React.SetStateAction<{lotId: string, step: number} | null>>;
  transactions?: typeof TRANSACTIONS;
  setTransactions?: React.Dispatch<React.SetStateAction<typeof TRANSACTIONS>>;
}) {
  const [tab, setTab]     = useState<"ledger"|"pending">("ledger");
  const [search, setSearch] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [payModalLot, setPayModalLot] = useState<LotItem | null>(null);
  const [settlementRules, setSettlementRules] = useState([
    { rule: "Auto-pay after facility confirmation", enabled: true },
    { rule: "Require manager approval > ₹10,000", enabled: true },
    { rule: "Send SMS receipt to collector on pay", enabled: false },
    { rule: "Auto-flag variance > 15% before pay",  enabled: true },
  ]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const toggleRule = (idx: number) => setSettlementRules(prev =>
    prev.map((r, i) => i === idx ? { ...r, enabled: !r.enabled } : r)
  );

  const pendingPaymentLots = useMemo(() => lots.filter(l => l.status === "settling" || l.status === "verified"), [lots]);
  const completedPaymentLots = useMemo(() => lots.filter(l => l.status === "paid" || l.status === "settled"), [lots]);
  const allPaymentLots = useMemo(() => lots.filter(l => l.status === "settling" || l.status === "verified" || l.status === "paid" || l.status === "settled"), [lots]);

  const filtered = useMemo(() => {
    const target = tab === "pending" ? pendingPaymentLots : allPaymentLots;
    if (!search) return target;
    const q = search.toLowerCase();
    return target.filter(l => l.id.toLowerCase().includes(q) || l.collector.toLowerCase().includes(q) || l.cat.toLowerCase().includes(q));
  }, [tab, pendingPaymentLots, allPaymentLots, search]);

  const totalPaid = useMemo(() => {
    return completedPaymentLots.reduce((s,l) => s + Math.round((l.finalWeight || l.actualWeight || l.estimatedWeight) * l.rate), 0);
  }, [completedPaymentLots]);

  const totalPending = useMemo(() => {
    return pendingPaymentLots.reduce((s,l) => s + Math.round((l.finalWeight || l.actualWeight || l.estimatedWeight) * l.rate), 0);
  }, [pendingPaymentLots]);

  const handlePaymentSuccess = async (method: string, ref: string) => {
    if (!payModalLot) return;
    const finalW = payModalLot.finalWeight || payModalLot.actualWeight || payModalLot.estimatedWeight;
    const payout = Math.round(finalW * payModalLot.rate);

    if (isSupabaseConfigured && supabase) {
      await supabase.from('lots').update({ 
        handover_status: 'paid',
        verified_weight: finalW,
        final_price: payout
      }).eq('lot_id', payModalLot.id);
    }

    setLots(prev => prev.map(l => l.id === payModalLot.id ? {
      ...l,
      status: "settled" as const,
      finalWeight: finalW,
      settledAt: new Date().toISOString()
    } : l));

    if (setTransactions) {
      setTransactions(prev => [{
        id: ref,
        date: "Today " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        lot: payModalLot.id,
        cat: payModalLot.cat,
        collector: payModalLot.collector,
        wt: `${finalW} kg`,
        rate: `₹${payModalLot.rate}`,
        amount: payout,
        method,
        status: "paid",
        flag: null
      }, ...prev]);
    }

    logAuditEvent("Payment Settled", payModalLot.id, `₹${payout.toLocaleString()} disbursed via ${method} (${ref})`);
    showToast(`✓ ₹${payout.toLocaleString()} disbursed to ${payModalLot.collector} for ${payModalLot.id}. Moved to History.`);
  };

  return (
    <div className="flex flex-col gap-5 slide-in relative">
      {/* Reusable Payment Modal */}
      <PaymentModal
        lot={payModalLot}
        isOpen={!!payModalLot}
        onClose={() => setPayModalLot(null)}
        onSuccess={handlePaymentSuccess}
      />

      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-4.5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-gray-700 animate-slide-in">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <p className="text-xs font-semibold">{toastMsg}</p>
          <button onClick={() => setToastMsg(null)} className="text-gray-400 hover:text-white text-xs ml-2 cursor-pointer"><Icon name="x" size={14} /></button>
        </div>
      )}

      <SectionHd title="Payments & Settlements" sub="Full transaction ledger, payout management, and settlement rules"
        right={<><Btn variant="ghost" small><span className="flex items-center gap-2"><Icon name="download" size={14}/> Export Statement</span></Btn><Btn small>+ Manual Payment</Btn></>} />

      {/* Summary cards */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
        <KCard label="Total paid"  value={`₹${(totalPaid/1000).toFixed(1)}k`}   sub="Completed payments" delta="+14%" icon={<Icon name="check" size={20}/>} color={G.green} />
        <KCard label="Settled — awaiting payment"   value={`₹${totalPending.toLocaleString()}`}   sub={`${pendingPaymentLots.length} pending payout${pendingPaymentLots.length === 1 ? '' : 's'}`} icon={<Icon name="clock" size={20}/>} color={G.amber} />
        <KCard label="Avg. Per Lot"     value="₹2,840"                               sub="This month"     delta="+6%"  icon={<Icon name="bar-chart" size={20}/>} color={G.sky}   />
        <KCard label="UPI Success Rate" value="99.2%"                                sub="Last 30 days"               icon={<Icon name="smartphone" size={20}/>} color={G.green} />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-lg w-fit" style={{ background: G.card2, border: `1px solid ${G.border}` }}>
        <button onClick={() => setTab("ledger")}
          className="px-4 py-1.5 rounded-md text-xs font-medium capitalize transition-all cursor-pointer flex items-center gap-1.5"
          style={{ background: tab==="ledger" ? G.green : "transparent", color: tab==="ledger" ? "#fff" : G.muted }}>
          <span>Transaction Ledger</span>
          <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-full" style={{ background: tab==="ledger" ? "rgba(255,255,255,0.2)" : G.border }}>
            {allPaymentLots.length}
          </span>
        </button>
        <button onClick={() => setTab("pending")}
          className="px-4 py-1.5 rounded-md text-xs font-medium capitalize transition-all cursor-pointer flex items-center gap-1.5"
          style={{ background: tab==="pending" ? G.green : "transparent", color: tab==="pending" ? "#fff" : G.muted }}>
          <span>Pending Payouts</span>
          {pendingPaymentLots.length > 0 ? (
            <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500 text-white font-bold">
              {pendingPaymentLots.length}
            </span>
          ) : (
            <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-full" style={{ background: tab==="pending" ? "rgba(255,255,255,0.2)" : G.border }}>
              0
            </span>
          )}
        </button>
      </div>

      {tab === "ledger" && (
        <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 280px" }}>
          <div className="rounded-xl overflow-hidden" style={{ background: G.card, border: `1px solid ${G.border}` }}>
            <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: G.border }}>
              <SearchInput placeholder="Search lots..." value={search} onChange={setSearch} />
              <span className="text-xs" style={{ color: G.muted }}>{filtered.length} results</span>
            </div>
            <table className="w-full">
              <thead><tr>
                <TH ch="Lot ID" /><TH ch="Date Settled" /><TH ch="Category" />
                <TH ch="Collector" /><TH ch="Weight" /><TH ch="Amount" />
                <TH ch="Status" /><TH ch="Actions" />
              </tr></thead>
              <tbody>
                {filtered.map(l => {
                  const amount = Math.round((l.finalWeight || l.actualWeight || l.estimatedWeight) * l.rate);
                  const isPending = l.status === "settling" || l.status === "verified";
                  const rowTint = isPending ? "bg-amber-50/50" : "";
                  return (
                    <tr key={l.id} className={`hover:bg-slate-50 transition-colors ${rowTint}`}>
                      <TD mono green>{l.id}</TD>
                      <TD mono muted>{l.settledAt ? new Date(l.settledAt).toLocaleDateString() : (l.date || "Today")}</TD>
                      <TD>{l.cat}</TD>
                      <TD>{l.collector}</TD>
                      <TD mono>{l.finalWeight || l.actualWeight || l.estimatedWeight} kg</TD>
                      <TD mono green>₹{amount.toLocaleString()}</TD>
                      <TD><Badge text={isPending ? "Awaiting Payout" : "Paid"} type={isPending ? "amber" : "green"} /></TD>
                      <TD>
                        <div className="flex gap-1">
                          {isPending ? (
                            <button onClick={() => setPayModalLot(l)}
                              className="px-2.5 py-1 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] font-bold cursor-pointer transition-colors shadow-sm flex items-center gap-1">
                              <Icon name="card" size={10} color="#fff" />
                              <span>Pay</span>
                            </button>
                          ) : (
                            <button onClick={() => { if (setScanRoute) setScanRoute({ lotId: l.id, step: 5 }); if (setView) setView("scan"); }}
                              className="px-2 py-1 rounded-md bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-[10px] font-bold cursor-pointer transition-colors shadow-sm">
                              Receipt
                            </button>
                          )}
                        </div>
                      </TD>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Settlement Rules sidebar */}
          <div className="rounded-xl p-5 flex flex-col gap-4 h-fit" style={{ background: G.card, border: `1px solid ${G.border}` }}>
            <p className="text-sm font-semibold" style={{ color: G.dark }}>Auto-Settlement Rules</p>
            {settlementRules.map((r, idx) => (
              <div key={r.rule} className="flex items-center gap-3 cursor-pointer" onClick={() => toggleRule(idx)}>
                <div className="w-9 h-5 rounded-full relative flex-shrink-0"
                  style={{ background: r.enabled ? G.green : G.border }}>
                  <span className="absolute top-0.5 w-4 h-4 rounded-full"
                    style={{ background: G.card, left: r.enabled ? "calc(100% - 18px)" : "2px", transition: "left 0.2s" }} />
                </div>
                <p className="text-xs" style={{ color: G.dark }}>{r.rule}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "pending" && (
        <div className="rounded-xl overflow-hidden" style={{ background: G.card, border: `1px solid ${G.border}` }}>
          {pendingPaymentLots.map(l => {
            const amount = Math.round((l.finalWeight || l.actualWeight || l.estimatedWeight) * l.rate);
            return (
              <div key={l.id} className="flex items-center gap-4 px-5 py-4 border-b bg-amber-50/40 hover:bg-amber-50/70 transition-colors" style={{ borderColor: G.border }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: G.amberL }}><Icon name="rupee" size={20}/></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold" style={{ color: G.dark }}>{l.collector} — {l.cat}</p>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">Pending Payout</span>
                  </div>
                  <p className="font-mono text-xs mt-0.5" style={{ color: G.muted }}>
                    {l.id} · {l.finalWeight || l.actualWeight || l.estimatedWeight} kg @ ₹{l.rate}/kg · {l.settledAt ? new Date(l.settledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (l.arrival || "08:31")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-xl font-bold" style={{ color: G.green }}>₹{amount.toLocaleString()}</p>
                  <p className="text-[10px] text-gray-400">Due to {l.collector.split(" ")[0]}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setPayModalLot(l)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs cursor-pointer transition-all shadow-sm flex items-center gap-1.5 active:scale-95">
                    <Icon name="card" size={13} color="#fff" />
                    <span>Pay ₹{amount.toLocaleString()}</span>
                  </button>
                </div>
              </div>
            )
          })}
          {pendingPaymentLots.length === 0 && (
            <div className="p-12 text-center flex flex-col items-center justify-center gap-2">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
                <Icon name="check" size={24} color="#059669" />
              </div>
              <p className="text-sm font-bold text-gray-800">All Payouts Disbursed</p>
              <p className="text-xs text-gray-400">There are currently 0 pending payments remaining.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── View: LOTS QUEUE ─────────────────────────────────────────────────────────
interface LotItem {
  id: string;
  emoji: string;
  cat: string;
  collector: string;
  collectorName?: string;
  phone: string;
  estimatedWeight: number;
  actualWeight: number | null;
  finalWeight: number | null;
  rate: number;
  cpcbRate: number;
  arrival: string;
  date?: string;
  status: "pending" | "accepted_awaiting_verification" | "settling" | "disputed" | "settled" | "paid" | "rejected" | "rejected_on_inspection" | "requested" | "accepted" | "verified" | "dispute";
  hazard: boolean;
  rejectionReason: { category: "contamination" | "material_mismatch" | "hazard_concern" | "other", notes: string } | null;
  acceptedBy?: string;
  acceptedAt?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  settledAt?: string;
  paidAt?: string;
  resolutionNote?: string;
  variancePercent: number | null;
  condition?: string;
  imageUrl?: string;
}

function LotsQueue({
  lots,
  setLots,
  setView,
  registerModalOpen: externalRegisterModalOpen,
  setRegisterModalOpen: externalSetRegisterModalOpen,
  transactions,
  setTransactions,
}: {
  lots: LotItem[];
  setLots: React.Dispatch<React.SetStateAction<LotItem[]>>;
  setView: (v: string) => void;
  registerModalOpen?: boolean;
  setRegisterModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  transactions?: typeof TRANSACTIONS;
  setTransactions?: React.Dispatch<React.SetStateAction<typeof TRANSACTIONS>>;
}) {
  const { facility } = useAuth();
  const [activeTab, setActiveTab] = useState<"pending" | "settling" | "dispute" | "history">("pending");
  const [selectedLot, setSelectedLot] = useState<LotItem | null>(lots[0] || null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [weightFilter, setWeightFilter] = useState("all");
  const [noteText, setNoteText] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Modals
  const [rejectModalLot, setRejectModalLot] = useState<LotItem | null>(null);
  const [rejectReason, setRejectReason] = useState("Contaminated / mixed material");
  const [rejectNotes, setRejectNotes] = useState("");
  const [rejectSendSms, setRejectSendSms] = useState(true);

  const [payModalLot, setPayModalLot] = useState<LotItem | null>(null);

  const [resolveModalLot, setResolveModalLot] = useState<LotItem | null>(null);
  const [resolveWeight, setResolveWeight] = useState("");
  const [resolveStep, setResolveStep] = useState<"weight" | "payment_choice">("weight");

  const [internalRegisterModalOpen, setInternalRegisterModalOpen] = useState(false);
  const registerModalOpen = externalRegisterModalOpen !== undefined ? externalRegisterModalOpen : internalRegisterModalOpen;
  const setRegisterModalOpen = externalSetRegisterModalOpen || setInternalRegisterModalOpen;
  const [newLotForm, setNewLotForm] = useState({
    collector: "Ravi Kumar",
    phone: "98201 44310",
    cat: "PCB",
    emoji: "cpu",
    estimatedWeight: "15.0",
    rate: "280",
    cpcbRate: 265,
    hazard: false,
    bay: "Intake Bay A-1"
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Counts & Summaries
  const pendingCount = useMemo(() => lots.filter(l => l.status === "pending" || l.status === "requested").length, [lots]);
  const settlingCount = useMemo(() => lots.filter(l => l.status === "settling" || l.status === "verified").length, [lots]);
  const disputeCount = useMemo(() => lots.filter(l => l.status === "disputed" || l.status === "dispute").length, [lots]);
  const historyCount = useMemo(() => lots.filter(l => ["settled", "paid", "rejected", "rejected_on_inspection"].includes(l.status)).length, [lots]);

  const totalWeightKg = useMemo(() => {
    return lots.reduce((acc, l) => acc + (l.actualWeight !== null ? l.actualWeight : l.estimatedWeight), 0).toFixed(1);
  }, [lots]);

  const estimatedTotalValue = useMemo(() => {
    return lots.reduce((acc, l) => acc + ((l.actualWeight !== null ? l.actualWeight : l.estimatedWeight) * l.rate), 0);
  }, [lots]);

  // Tab Filtering
  const filteredLots = useMemo(() => {
    return lots.filter(l => {
      // Tab Match
      let tabMatch = false;
      if (activeTab === "pending") tabMatch = (l.status === "pending" || l.status === "requested");
      else if (activeTab === "settling") tabMatch = (l.status === "settling" || l.status === "verified");
      else if (activeTab === "dispute") tabMatch = (l.status === "disputed" || l.status === "dispute");
      else if (activeTab === "history") tabMatch = ["settled", "paid", "rejected", "rejected_on_inspection"].includes(l.status);

      if (!tabMatch) return false;

      // Query Search
      const q = search.toLowerCase().trim();
      if (q) {
        const matchQuery = l.id.toLowerCase().includes(q) ||
          l.collector.toLowerCase().includes(q) ||
          l.cat.toLowerCase().includes(q) ||
          l.phone.includes(q);
        if (!matchQuery) return false;
      }

      // Category Filter
      if (categoryFilter !== "all" && l.cat !== categoryFilter) {
        return false;
      }

      // Weight Filter
      const wt = l.actualWeight !== null ? l.actualWeight : l.estimatedWeight;
      if (weightFilter === "<10" && wt >= 10) return false;
      if (weightFilter === "10-25" && (wt < 10 || wt > 25)) return false;
      if (weightFilter === ">25" && wt <= 25) return false;

      return true;
    });
  }, [lots, activeTab, search, categoryFilter, weightFilter]);

  // Keep selected lot in sync with lots state
  const currentSelectedLot = useMemo(() => {
    if (!selectedLot) return null;
    return lots.find(l => l.id === selectedLot.id) || null;
  }, [selectedLot, lots]);

  // Actions
  const handleAcceptLot = async (lot: LotItem) => {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('lots').update({ 
        handover_status: 'accepted',
        recycler_name: facility?.name || 'Green Recycle Hub'
      }).eq('lot_id', lot.id);
    }
    setLots(prev => prev.map(l => l.id === lot.id ? {
      ...l,
      status: "accepted_awaiting_verification" as const,
      acceptedBy: "Admin",
      acceptedAt: new Date().toISOString()
    } : l));
    showToast(`✓ Lot ${lot.id} accepted. Moved to Scan & Verify for inspection.`);
    logAuditEvent("Lot Accepted", lot.id, `Status: Pending → Awaiting Verification`);

    // Advance selection to next pending lot if present
    const remaining = lots.filter(l => (l.status === "pending" || l.status === "requested" || l.status === "pickup_pending") && l.id !== lot.id);
    if (selectedLot?.id === lot.id) {
      setSelectedLot(remaining[0] || null);
    }
  };

  const handleOpenReject = (lot: LotItem) => {
    setRejectModalLot(lot);
    setRejectReason("Contaminated / mixed material");
    setRejectNotes("");
  };

  const handleConfirmReject = async () => {
    if (!rejectModalLot) return;
    if (isSupabaseConfigured && supabase) {
      await supabase.from('lots').update({ 
        handover_status: 'declined',
        recycler_name: facility?.name || 'Green Recycle Hub'
      }).eq('lot_id', rejectModalLot.id);
    }
    setLots(prev => prev.map(l => l.id === rejectModalLot.id ? {
      ...l,
      status: "rejected" as const,
      rejectionReason: { category: "other", notes: rejectReason }
    } : l));
    showToast(`Lot ${rejectModalLot.id} marked as Rejected (${rejectReason}).${rejectSendSms ? " SMS sent to collector." : ""}`);
    logAuditEvent("Lot Rejected", rejectModalLot.id, `Status: Rejected (${rejectReason})`);
    setRejectModalLot(null);
  };

  const handlePaymentSuccess = (method: string, ref: string) => {
    if (!payModalLot) return;
    const finalW = payModalLot.finalWeight || payModalLot.actualWeight || payModalLot.estimatedWeight;
    const payout = Math.round(finalW * payModalLot.rate);

    if (isSupabaseConfigured && supabase) {
      supabase.from('lots').update({ 
        handover_status: 'paid',
        verified_weight: finalW,
        final_price: payout
      }).eq('lot_id', payModalLot.id);
    }

    setLots(prev => prev.map(l => l.id === payModalLot.id ? {
      ...l,
      status: "settled" as const,
      finalWeight: finalW,
      settledAt: new Date().toISOString()
    } : l));

    if (setTransactions) {
      setTransactions(prev => [{
        id: ref,
        date: "Today " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        lot: payModalLot.id,
        cat: payModalLot.cat,
        collector: payModalLot.collector,
        wt: `${finalW} kg`,
        rate: `₹${payModalLot.rate}`,
        amount: payout,
        method,
        status: "paid",
        flag: null
      }, ...prev]);
    }

    logAuditEvent("Payment Settled", payModalLot.id, `₹${payout.toLocaleString()} disbursed via ${method} (${ref})`);
    showToast(`✓ ₹${payout.toLocaleString()} disbursed to ${payModalLot.collector} for ${payModalLot.id}. Moved to History.`);
  };

  const handleOpenResolve = (lot: LotItem) => {
    setResolveModalLot(lot);
    setResolveWeight(String(lot.actualWeight || lot.estimatedWeight));
    setResolveStep("weight");
  };

  const handleVerifyWeightAndShowChoices = () => {
    if (!resolveModalLot) return;
    const finalW = parseFloat(resolveWeight) || resolveModalLot.actualWeight || resolveModalLot.estimatedWeight;
    const variance = ((finalW - resolveModalLot.estimatedWeight) / resolveModalLot.estimatedWeight) * 100;
    const updatedLot: LotItem = {
      ...resolveModalLot,
      status: "settling" as const,
      actualWeight: finalW,
      finalWeight: finalW,
      variancePercent: variance,
      verifiedBy: "Admin",
      verifiedAt: new Date().toISOString(),
    };

    setLots(prev => prev.map(l => l.id === resolveModalLot.id ? updatedLot : l));
    setResolveModalLot(updatedLot);
    setResolveStep("payment_choice");
    logAuditEvent("Dispute Weight Verified", resolveModalLot.id, `Weight verified at ${finalW} kg (variance: ${variance.toFixed(1)}%) -> Settling`);
  };

  const handleResolvePayNow = () => {
    if (!resolveModalLot) return;
    const finalW = resolveModalLot.finalWeight || resolveModalLot.actualWeight || resolveModalLot.estimatedWeight;
    const currentLot: LotItem = {
      ...resolveModalLot,
      status: "settling" as const,
      actualWeight: finalW,
      finalWeight: finalW,
    };
    setResolveModalLot(null);
    setResolveStep("weight");
    setPayModalLot(currentLot);
  };

  const handleResolvePayLater = () => {
    if (!resolveModalLot) return;
    const finalW = resolveModalLot.finalWeight || resolveModalLot.actualWeight || resolveModalLot.estimatedWeight;
    showToast(`✓ Dispute for ${resolveModalLot.id} resolved (${finalW} kg). Moved to Settling queue.`);
    logAuditEvent("Dispute Resolved", resolveModalLot.id, `Verified weight set to ${finalW} kg -> Pay Later (Settling)`);
    setResolveModalLot(null);
    setResolveStep("weight");
  };

  const handleCloseResolveModal = () => {
    if (resolveStep === "payment_choice" && resolveModalLot) {
      const finalW = resolveModalLot.finalWeight || resolveModalLot.actualWeight || resolveModalLot.estimatedWeight;
      showToast(`✓ Dispute for ${resolveModalLot.id} resolved (${finalW} kg). Moved to Settling queue.`);
    }
    setResolveModalLot(null);
    setResolveStep("weight");
  };

  const handleEscalateDispute = (lot: LotItem) => {
    showToast(`⚠️ Dispute for ${lot.id} escalated to CPCB compliance officer.`);
    logAuditEvent("Dispute Escalated", lot.id, "Escalated to CPCB Compliance Officer");
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `LOT-${8813 + Math.floor(Math.random() * 100)}`;
    const newEntry: LotItem = {
      id: newId,
      emoji: newLotForm.emoji,
      cat: newLotForm.cat,
      collector: newLotForm.collector,
      phone: newLotForm.phone,
      estimatedWeight: parseFloat(newLotForm.estimatedWeight) || 10,
      actualWeight: null,
      finalWeight: null,
      variancePercent: null,
      rate: parseFloat(newLotForm.rate) || 100,
      cpcbRate: newLotForm.cpcbRate,
      arrival: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      date: "Today",
      status: "pending",
      hazard: newLotForm.hazard,
      rejectionReason: null
    };
    setLots(prev => [newEntry, ...prev]);
    setRegisterModalOpen(false);
    showToast(`✓ Registered Manual Lot ${newId} for ${newLotForm.collector}`);
    logAuditEvent("Manual Lot Registered", newId, `Created with ${newLotForm.estimatedWeight} kg`);
  };

  const handleExport = () => {
    showToast(`📥 Exported ${filteredLots.length} lots from "${activeTab.toUpperCase()}" tab to CSV.`);
  };

  return (
    <div className="flex flex-col gap-5 w-full pb-8 relative">
      {/* ── Toast Notification Banner ── */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1B1464] text-white px-4.5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-indigo-400/40 animate-slide-in">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <p className="text-xs font-semibold">{toastMsg}</p>
          <button onClick={() => setToastMsg(null)} className="text-indigo-200 hover:text-white text-xs ml-2 cursor-pointer">
            <Icon name="x" size={14} />
          </button>
        </div>
      )}

      {/* ── 2-Column Split Layout (Matching Red Box 1 and Red Box 2) ── */}
      <div className="flex flex-col lg:flex-row gap-5 items-start">
        {/* ── Left Column (Table Area + Header + Tabs + Toolbar) ── */}
        <div className="flex-1 w-full flex flex-col gap-4 min-w-0">
          {/* 1. Page Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs text-gray-400 mb-1 font-medium">Operations &gt; Lots Queue</p>
              <h1 className="text-2xl font-bold text-[#1B1464] tracking-tight">Lots Queue</h1>
              <p className="text-sm text-gray-500 mt-0.5">Review and process incoming scrap lots from collectors.</p>
            </div>

            {/* Right: Summary Metric Pill + Register Manual Lot Button */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start sm:self-center">
              <div className="flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-[#e6f9ed] border border-[#a7f3d0] shadow-2xs">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#065f46]">
                  <Icon name="leaf" size={13} color="#059669" />
                  <span>{pendingCount} Lots in Queue</span>
                </div>
                <span className="text-emerald-300 font-light">|</span>
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#065f46] tabular-nums">
                  <Icon name="scale" size={13} color="#059669" />
                  <span>{totalWeightKg} kg</span>
                </div>
                <span className="text-emerald-300 font-light">|</span>
                <div className="flex items-center gap-1 text-xs font-bold text-[#065f46] tabular-nums">
                  <span>₹</span>
                  <span>{estimatedTotalValue.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={() => setRegisterModalOpen(true)}
                className="bg-[#1B1464] hover:bg-[#120d47] text-white rounded-full py-2 px-3.5 text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-[0.98] whitespace-nowrap"
              >
                <Icon name="plus" size={13} color="#fff" />
                <span>Register Manual Lot</span>
              </button>
            </div>
          </div>

          {/* 2. Tab Row */}
          <div className="flex items-center gap-2">
            {[
              { id: "pending" as const, label: "Pending", count: pendingCount, badgeType: "default" },
              { id: "settling" as const, label: "Settling", count: settlingCount, badgeType: "default" },
              { id: "dispute" as const, label: "Dispute", count: disputeCount, badgeType: "dispute" },
              { id: "history" as const, label: "History", count: historyCount, badgeType: "default" },
            ].map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setSelectedLot(null); }}
                  className={`flex items-center gap-2.5 px-4.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                    isActive
                      ? "bg-[#064e3b] text-white shadow-xs"
                      : "bg-white border border-gray-200/90 text-[#1e293b] hover:bg-gray-50"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`w-5 h-5 rounded-full text-[11px] font-bold tabular-nums flex items-center justify-center shrink-0 ${
                      isActive
                        ? "bg-white text-[#064e3b]"
                        : tab.badgeType === "dispute"
                          ? "bg-red-50 text-red-500 border border-red-100"
                          : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 3. Toolbar: Search & Filters spanning the table width */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search */}
            <div className="relative flex-1 min-w-[240px]">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by lot ID, collector, material..."
                className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-gray-200 rounded-xl text-gray-800 placeholder:text-gray-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all shadow-2xs font-medium"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Icon name="search" size={13} color="currentColor" />
              </span>
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs">
                  ✕
                </button>
              )}
            </div>

            {/* Category Dropdown */}
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="border border-gray-200 rounded-xl px-3.5 py-2 text-xs bg-white text-gray-700 outline-none focus:border-indigo-500 shadow-2xs cursor-pointer font-medium"
            >
              <option value="all">All Categories</option>
              {MATERIALS.map(m => (
                <option key={m.name} value={m.name}>{m.name}</option>
              ))}
            </select>

            {/* Date Filter */}
            <select
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              className="border border-gray-200 rounded-xl px-3.5 py-2 text-xs bg-white text-gray-700 outline-none focus:border-indigo-500 shadow-2xs cursor-pointer font-medium"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>

            {/* Weight Filter */}
            <select
              value={weightFilter}
              onChange={e => setWeightFilter(e.target.value)}
              className="border border-gray-200 rounded-xl px-3.5 py-2 text-xs bg-white text-gray-700 outline-none focus:border-indigo-500 shadow-2xs cursor-pointer font-medium"
            >
              <option value="all">Any Weight</option>
              <option value="<10">&lt; 10 kg</option>
              <option value="10-25">10–25 kg</option>
              <option value=">25">&gt; 25 kg</option>
            </select>
          </div>

          {/* 4. Table Container */}
          <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse text-left">
                <thead className="sticky top-0 z-10 bg-gray-50/90 border-b border-gray-100">
                  <tr>
                    <th className="py-3.5 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Item / Category</th>
                    <th className="py-3.5 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Collector</th>
                    <th className="py-3.5 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Lot ID &amp; Time</th>
                    <th className="py-3.5 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center">{activeTab === "pending" ? "Est. Weight" : "Weight / Variance"}</th>
                    <th className="py-3.5 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center">Est. Value</th>
                    <th className="py-3.5 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredLots.map(lot => {
                    const isSelected = currentSelectedLot?.id === lot.id;
                    const totalEst = Math.round((lot.actualWeight || lot.estimatedWeight) * lot.rate);

                    return (
                      <tr
                        key={lot.id}
                        onClick={() => setSelectedLot(lot)}
                        className={`hover:bg-gray-50/80 transition-colors cursor-pointer ${
                          isSelected ? "bg-indigo-50/60 ring-1 ring-inset ring-indigo-200" : ""
                        }`}
                      >
                        {/* Item / Category */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-[#e6f9ed] text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0">
                              <Icon name={lot.emoji || "box"} size={16} color="#059669" />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 text-xs leading-tight">{lot.cat}</p>
                              {lot.hazard && (
                                <span className="inline-block mt-0.5 px-2 py-0.2 rounded-full text-[9.5px] font-bold bg-red-100 text-red-700">
                                  Hazardous
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Collector */}
                        <td className="py-3.5 px-4">
                          <div>
                            <p className="font-bold text-gray-900 text-xs">{lot.collector}</p>
                            <p className="text-xs text-gray-400 font-medium tabular-nums mt-0.5">{lot.phone}</p>
                          </div>
                        </td>

                        {/* Lot ID & Time */}
                        <td className="py-3.5 px-4 text-xs">
                          <div>
                            <p className="font-bold text-[#1B1464] tracking-tight">{lot.id}</p>
                            <p className="text-xs text-gray-400 mt-0.5 tabular-nums">{lot.arrival} • {lot.date || "Today"}</p>
                          </div>
                        </td>

                        {/* Est. Weight & Variance */}
                        <td className="py-3.5 px-4 text-center text-xs tabular-nums">
                          <p className="font-bold text-gray-800">
                            {lot.actualWeight !== null && lot.actualWeight !== undefined ? `${lot.actualWeight} kg` : `${lot.estimatedWeight} kg`}
                          </p>
                          {lot.actualWeight !== null && lot.actualWeight !== undefined && lot.actualWeight !== lot.estimatedWeight && (
                            <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                              Est: {lot.estimatedWeight} kg
                            </p>
                          )}
                          {lot.variancePercent !== null && lot.variancePercent !== undefined && Math.abs(lot.variancePercent) > 0.1 && (
                            <div className="mt-0.5">
                              <span className={`inline-block text-[9.5px] font-bold px-1.5 py-0.2 rounded-full ${
                                Math.abs(lot.variancePercent) > 10 
                                  ? "bg-orange-100 text-orange-700 border border-orange-200" 
                                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              }`}>
                                {lot.variancePercent > 0 ? "+" : ""}{lot.variancePercent.toFixed(1)}%
                              </span>
                            </div>
                          )}
                        </td>

                        {/* Est. Value */}
                        <td className="py-3.5 px-4 text-center text-xs font-bold text-[#059669] tabular-nums">
                          ₹{totalEst.toLocaleString()}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap" onClick={e => e.stopPropagation()}>
                          {activeTab === "pending" && (
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => handleAcceptLot(lot)}
                                className="px-3 py-1.5 rounded-lg bg-[#e6f9ed] hover:bg-emerald-100 text-[#059669] border border-[#a7f3d0] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                              >
                                <Icon name="check" size={12} color="#059669" />
                                <span>Accept</span>
                              </button>
                              <button
                                onClick={() => handleOpenReject(lot)}
                                className="px-3 py-1.5 rounded-lg bg-[#fee2e2] hover:bg-red-100 text-[#dc2626] border border-[#fecaca] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <Icon name="x" size={12} color="#dc2626" />
                                <span>Reject</span>
                              </button>
                            </div>
                          )}

                          {activeTab === "settling" && (
                            <div className="flex items-center justify-center gap-1.5">
                              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                                Settling
                              </span>
                              <button
                                onClick={() => setPayModalLot(lot)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs flex items-center gap-1"
                              >
                                <Icon name="card" size={12} color="#fff" />
                                <span>Pay</span>
                              </button>
                            </div>
                          )}

                          {activeTab === "dispute" && (
                            <div className="flex items-center justify-center gap-1.5">
                              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 border border-orange-200 flex items-center gap-1">
                                <Icon name="alert" size={12} color="#ea580c" />
                                <span>Dispute</span>
                              </span>
                              <button
                                onClick={() => handleOpenResolve(lot)}
                                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold transition-colors cursor-pointer"
                              >
                                Resolve
                              </button>
                            </div>
                          )}

                          {activeTab === "history" && (
                            <span
                              className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                                lot.status === "paid" || lot.status === "settled"
                              ? "bg-[#e6f9ed] text-emerald-700 border border-emerald-200"
                              : "bg-red-50 text-red-700 border border-red-200"
                            }`}
                            >
                              {lot.status === "paid" || lot.status === "settled" ? "Settled" : "Rejected"}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}

                  {filteredLots.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-gray-400">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <span className="text-3xl">📭</span>
                          <p className="text-sm font-medium">No lots found in this filter.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── Right Column: Lot Details Panel ── */}
        <div className="w-full lg:w-[340px] shrink-0 flex flex-col gap-3 sticky top-4">
          {/* Persistent Right-Side Lot Details Panel */}
          <div className="w-full bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-4 shadow-sm h-fit">
          {!currentSelectedLot ? (
            /* Persistent Empty State: Orange document/clipboard icon + message */
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-2xl mb-3 shadow-2xs">
                📋
              </div>
              <p className="text-xs text-gray-400 font-medium max-w-[180px] leading-relaxed">
                Select a lot from the table to view its details.
              </p>
            </div>
          ) : (
            /* Populated Lot Details View */
            <div className="flex flex-col gap-4">
              {/* Panel Header */}
              <div className="flex items-center justify-between pb-1">
                <h3 className="font-bold text-base text-gray-900">Lot Details</h3>
                <button
                  onClick={() => setSelectedLot(null)}
                  className="w-7 h-7 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 flex items-center justify-center cursor-pointer transition-colors"
                >
                  <Icon name="x" size={18} />
                </button>
              </div>

              {/* Item Card */}
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                  <Icon name="file-text" size={22} color="#059669" />
                </div>
                <div className="flex flex-col min-w-0">
                  <h4 className="font-bold text-sm text-gray-900 leading-tight truncate">
                    {currentSelectedLot.cat}
                  </h4>

                  <div className="flex flex-col text-[11px] text-gray-400 font-medium mt-2 leading-relaxed">
                    <span>Lot ID: {currentSelectedLot.id}</span>
                    <span>{currentSelectedLot.arrival || "09:14"} • {currentSelectedLot.date || "15 Sep 2026"}</span>
                  </div>
                </div>
              </div>

              {/* Estimated Details Card */}
              <div className="flex flex-col gap-1.5">
                <h5 className="text-xs font-bold text-gray-800">Estimated Details</h5>
                <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-3 grid grid-cols-3 divide-x divide-emerald-200/60 text-center">
                  <div className="flex flex-col items-center px-1">
                    <span className="text-sm font-bold text-[#15803d] tabular-nums">{currentSelectedLot.estimatedWeight} kg</span>
                    <span className="text-[10px] text-gray-500 font-medium mt-0.5">Est. Weight</span>
                  </div>
                  <div className="flex flex-col items-center px-1">
                    <span className="text-sm font-bold text-[#15803d] tabular-nums">
                      ₹ {Math.round(currentSelectedLot.estimatedWeight * (currentSelectedLot.rate || currentSelectedLot.cpcbRate || 150)).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-gray-500 font-medium mt-0.5">Est. Value</span>
                  </div>
                  <div className="flex flex-col items-center px-1">
                    <span className="text-sm font-bold text-[#15803d] tabular-nums">
                      ₹ {currentSelectedLot.rate || currentSelectedLot.cpcbRate || 150}/kg
                    </span>
                    <span className="text-[10px] text-gray-500 font-medium mt-0.5">Ref. Rate</span>
                  </div>
                </div>
              </div>

              {/* Additional Info / Image */}
              <div className="flex flex-col gap-1.5">
                <h5 className="text-xs font-bold text-gray-800">Condition & Image</h5>
                <div className="bg-white border border-gray-200 rounded-xl p-3 flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500 font-medium">Condition:</span>
                    <span className="font-bold text-gray-900">{currentSelectedLot.condition || "Not specified"}</span>
                  </div>
                  {currentSelectedLot.imageUrl ? (
                    <div className="mt-1 w-full h-32 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center relative">
                      <div className="absolute inset-0 bg-gray-200 flex flex-col items-center justify-center text-gray-500">
                        <Icon name="camera" size={24} color="#9ca3af" />
                        <span className="text-xs font-bold mt-1">Demo Image</span>
                        <span className="text-[9px] mt-1 opacity-70 truncate px-2">{currentSelectedLot.imageUrl.split('/').pop()}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-1 w-full h-16 bg-gray-50 border border-gray-100 border-dashed rounded-lg flex items-center justify-center text-[11px] text-gray-400 font-medium">
                      No image attached
                    </div>
                  )}
                </div>
              </div>

              {/* CPCB Reference Rate Card */}
              <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-2xs flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
                    <span>CPCB Reference Rate</span>
                    <span className="text-[11px] text-gray-400 cursor-help" title="Central Pollution Control Board benchmark">ⓘ</span>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer" title="Open CPCB rate reference">
                    <Icon name="external-link" size={13} color="#9ca3af" />
                  </button>
                </div>
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-gray-400 font-medium text-[11px] truncate max-w-[160px]">
                    {currentSelectedLot.cat} (Mixed)
                  </span>
                  <span className="text-gray-700 font-semibold tabular-nums">
                    ₹ {currentSelectedLot.cpcbRate} – {currentSelectedLot.cpcbRate + 50}/kg
                  </span>
                </div>
              </div>

              {/* Collector Information Card */}
              <div className="flex flex-col gap-1.5">
                <h5 className="text-xs font-bold text-gray-800">Collector Information</h5>
                <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-2xs flex items-center justify-between hover:border-gray-200 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center shrink-0 border border-blue-100">
                      {currentSelectedLot.collector.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-xs text-gray-900">{currentSelectedLot.collector}</span>
                      <div className="flex items-center gap-1 text-[11px] text-gray-500 mt-0.5">
                        <Icon name="phone" size={11} color="#9ca3af" />
                        <span className="tabular-nums">+91 {currentSelectedLot.phone}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-gray-500 mt-0.5">
                        <Icon name="map-pin" size={11} color="#9ca3af" />
                        <span>Mumbai, Maharashtra</span>
                      </div>
                    </div>
                  </div>
                  <Icon name="chevron-right" size={14} color="#9ca3af" />
                </div>
              </div>

              {/* Weight Variance Card */}
              {(() => {
                const actWt = currentSelectedLot.actualWeight;
                const hasActual = actWt !== null && actWt !== undefined;
                const varianceKg = hasActual ? (actWt - currentSelectedLot.estimatedWeight).toFixed(1) : "0.0";
                const variancePercent = hasActual
                  ? (((actWt - currentSelectedLot.estimatedWeight) / currentSelectedLot.estimatedWeight) * 100).toFixed(1)
                  : "0.0";
                const isZero = !hasActual || varianceKg === "0.0";
                const isPositive = Number(varianceKg) > 0;
                const absPct = Math.abs(Number(variancePercent));
                const isDisputed = absPct > 10;

                return (
                  <div className={`rounded-xl border p-3.5 shadow-2xs flex flex-col gap-2 ${isDisputed ? 'bg-orange-50/40 border-orange-200' : 'bg-white border-gray-100'}`}>
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isDisputed ? 'bg-orange-100 text-orange-700' : 'bg-[#dcfce7] text-[#15803d]'}`}>
                        <Icon name={isDisputed ? "alert" : "scale"} size={15} color={isDisputed ? "#ea580c" : "#15803d"} />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-gray-800">Weight Variance</h5>
                        <p className={`text-xs font-bold tabular-nums mt-0.5 ${isDisputed ? 'text-orange-700' : 'text-[#15803d]'}`}>
                          {isZero ? "0.0 kg (0.0%)" : `${isPositive ? "+" : ""}${varianceKg} kg (${variancePercent}%)`}
                        </p>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mt-1">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isZero
                            ? "w-[15%] bg-emerald-400"
                            : absPct <= 10
                              ? "w-[50%] bg-emerald-500"
                              : absPct <= 20
                                ? "w-[80%] bg-amber-500"
                                : "w-[100%] bg-red-500"
                        }`}
                      />
                    </div>

                    <p className={`text-[10px] text-center font-semibold ${isDisputed ? 'text-orange-700' : 'text-gray-500'}`}>
                      {isZero ? "No variance recorded" : absPct <= 10 ? "Within tolerance (±10%)" : "⚠ Exceeds tolerance (>10%) — Disputed"}
                    </p>
                  </div>
                );
              })()}

              {/* Notes Section */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5">
                  <Icon name="file-text" size={13} color="#4b5563" />
                  <label className="text-xs font-bold text-gray-800">Review Notes</label>
                </div>
                <textarea
                  value={noteText}
                  maxLength={300}
                  onChange={e => setNoteText(e.target.value)}
                  placeholder="Add review notes or intake remarks..."
                  className="w-full border border-gray-200 rounded-xl p-2.5 text-xs resize-none h-16 bg-[#fafafa] focus:bg-white outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 placeholder:text-gray-400 font-medium"
                />
                <div className="text-[10px] text-gray-400 text-right font-medium">
                  {noteText.length}/300
                </div>
              </div>

              {/* Panel Footer Buttons */}
              <div className="pt-1">
                {activeTab === "pending" && (
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => handleAcceptLot(currentSelectedLot)}
                      className="flex-1 bg-[#064e3b] hover:bg-[#043d2e] text-white font-bold text-xs py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center active:scale-[0.98]"
                    >
                      ✓ Accept Lot
                    </button>
                    <button
                      onClick={() => handleOpenReject(currentSelectedLot)}
                      className="flex-1 bg-[#fee2e2] hover:bg-[#fecaca] text-[#dc2626] font-bold text-xs py-2.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center active:scale-[0.98]"
                    >
                      ✕ Reject Lot
                    </button>
                  </div>
                )}

                {activeTab === "settling" && (
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setPayModalLot(currentSelectedLot)}
                      className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 active:scale-[0.98]"
                    >
                      <Icon name="card" size={14} color="#fff" />
                      <span>Pay Lot</span>
                    </button>
                    <button
                      onClick={() => {
                        setLots(prev => prev.map(l => l.id === currentSelectedLot.id ? { ...l, status: "dispute" } : l));
                        showToast(`⚠️ Lot ${currentSelectedLot.id} moved to Dispute.`);
                      }}
                      className="w-full border border-orange-300 text-orange-600 hover:bg-orange-50 font-bold text-xs py-2 rounded-xl transition-colors cursor-pointer"
                    >
                      Raise Dispute
                    </button>
                  </div>
                )}

                {activeTab === "dispute" && (
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleOpenResolve(currentSelectedLot)}
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      Resolve Dispute
                    </button>
                    <button
                      onClick={() => handleEscalateDispute(currentSelectedLot)}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs py-2 rounded-xl transition-colors cursor-pointer"
                    >
                      Escalate to CPCB
                    </button>
                  </div>
                )}

                {activeTab === "history" && (
                  <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-center text-xs text-gray-500 font-medium">
                    Read-only archive record
                  </div>
                )}
              </div>
            </div>
          )}
          </div>
        </div>
      </div>

      {/* ── Modal 1: Reject Confirmation ── */}
      {rejectModalLot && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-100 flex flex-col gap-4 animate-slide-in">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                  <Icon name="alert" size={18} color="#dc2626" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Reject Lot {rejectModalLot.id}</h3>
                  <p className="text-[11px] text-gray-500">{rejectModalLot.collector} • {rejectModalLot.cat}</p>
                </div>
              </div>
              <button onClick={() => setRejectModalLot(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <Icon name="x" size={14} />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Reason for Rejection *</label>
                <select
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-800 outline-none focus:ring-2 focus:ring-red-200"
                >
                  <option value="Contaminated / mixed material">Contaminated / mixed material</option>
                  <option value="Excessive moisture / debris">Excessive moisture / debris</option>
                  <option value="Hazardous material uncertified">Hazardous material uncertified</option>
                  <option value="Counterfeit / substandard grade">Counterfeit / substandard grade</option>
                  <option value="Collector cancelled handover">Collector cancelled handover</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Internal Operational Notes (Optional)</label>
                <textarea
                  value={rejectNotes}
                  onChange={e => setRejectNotes(e.target.value)}
                  rows={2}
                  placeholder="Add details on material inspection..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-800 outline-none focus:ring-2 focus:ring-red-200"
                />
              </div>

              <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rejectSendSms}
                  onChange={e => setRejectSendSms(e.target.checked)}
                  className="rounded text-red-600"
                />
                <span>Send rejection SMS with reason to collector ({rejectModalLot.phone})</span>
              </label>
            </div>

            <div className="flex items-center gap-2.5 pt-2 border-t border-gray-100">
              <button
                onClick={() => setRejectModalLot(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal 2: Resolve Dispute (2-Step Flow: Weight Verification → Payment Choice) ── */}
      {resolveModalLot && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-gray-100 flex flex-col gap-4 animate-slide-in">
            {resolveStep === "weight" ? (
              <>
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                      <Icon name="card" size={16} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">Resolve Dispute</h3>
                      <p className="text-[11px] text-gray-500">Lot {resolveModalLot.id} • {resolveModalLot.collector}</p>
                    </div>
                  </div>
                  <button onClick={handleCloseResolveModal} className="text-gray-400 hover:text-gray-800 transition-colors cursor-pointer">
                    <Icon name="x" size={16} />
                  </button>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Final Verified Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={resolveWeight}
                    onChange={e => setResolveWeight(e.target.value)}
                    className="w-full text-lg font-mono font-bold text-gray-900 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">Est. Weight was {resolveModalLot.estimatedWeight} kg.</p>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleCloseResolveModal}
                    className="flex-1 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold py-2.5 px-4 rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleVerifyWeightAndShowChoices}
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Verify &amp; Settle
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                      <Icon name="check" size={16} color="#059669" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">Dispute Resolved</h3>
                      <p className="text-[11px] text-gray-500">Lot {resolveModalLot.id} • {resolveModalLot.collector}</p>
                    </div>
                  </div>
                  <button onClick={handleCloseResolveModal} className="text-gray-400 hover:text-gray-800 transition-colors cursor-pointer">
                    <Icon name="x" size={16} />
                  </button>
                </div>

                <div className="rounded-xl p-3.5 bg-emerald-50/70 border border-emerald-100 flex flex-col gap-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Material</span>
                    <span className="font-semibold text-gray-800">{resolveModalLot.cat}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Verified Weight</span>
                    <span className="font-mono font-bold text-gray-800">{resolveModalLot.actualWeight} kg</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Rate / kg</span>
                    <span className="font-mono font-bold text-gray-800">₹{resolveModalLot.rate}</span>
                  </div>
                  <div className="border-t border-emerald-200/60 pt-2 flex justify-between items-baseline">
                    <span className="text-xs font-bold text-gray-900">Recalculated Value</span>
                    <span className="font-mono text-base font-bold text-emerald-700">
                      ₹{Math.round((resolveModalLot.actualWeight || resolveModalLot.estimatedWeight) * resolveModalLot.rate).toLocaleString()}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-gray-600 font-medium leading-relaxed">
                  Dispute resolved. Choose payment schedule for <span className="font-bold text-gray-800">{resolveModalLot.collector}</span>:
                </p>

                <div className="flex flex-col gap-2 pt-1">
                  <button
                    onClick={handleResolvePayNow}
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]"
                  >
                    <Icon name="card" size={13} color="#fff" />
                    <span>Pay Now (₹{Math.round((resolveModalLot.actualWeight || resolveModalLot.estimatedWeight) * resolveModalLot.rate).toLocaleString()})</span>
                  </button>
                  <button
                    onClick={handleResolvePayLater}
                    className="w-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]"
                  >
                    <Icon name="clock" size={13} color="#b45309" />
                    <span>Pay Later (Move to Settling)</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Payment Modal (Shared standard payment flow) ── */}
      <PaymentModal
        lot={payModalLot}
        isOpen={!!payModalLot}
        onClose={() => setPayModalLot(null)}
        onSuccess={handlePaymentSuccess}
      />

      {/* ── Modal 4: Register Manual Lot ── */}
      {registerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleRegisterSubmit} className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-gray-100 flex flex-col gap-4 animate-slide-in">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-[#1B1464] flex items-center justify-center">
                  <Icon name="plus" size={18} color="#1B1464" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Register Manual Intake Lot</h3>
                  <p className="text-[11px] text-gray-500">Direct scale intake or offline collector handover</p>
                </div>
              </div>
              <button type="button" onClick={() => setRegisterModalOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <Icon name="x" size={14} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Collector Name *</label>
                <input
                  type="text"
                  required
                  value={newLotForm.collector}
                  onChange={e => setNewLotForm({ ...newLotForm, collector: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number *</label>
                <input
                  type="text"
                  required
                  value={newLotForm.phone}
                  onChange={e => setNewLotForm({ ...newLotForm, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Material Category *</label>
                <select
                  value={newLotForm.cat}
                  onChange={e => {
                    const cat = e.target.value;
                    const mat = MATERIALS.find(m => m.name === cat);
                    setNewLotForm({
                      ...newLotForm,
                      cat,
                      emoji: mat?.emoji || "box",
                      rate: String(mat?.rate || 100),
                      cpcbRate: mat?.rate ? mat.rate - 15 : 90,
                      hazard: mat?.hazard || false,
                    });
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:ring-2 focus:ring-indigo-200"
                >
                  {MATERIALS.map(m => (
                    <option key={m.name} value={m.name}>{m.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Intake Bay *</label>
                <select
                  value={newLotForm.bay}
                  onChange={e => setNewLotForm({ ...newLotForm, bay: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:ring-2 focus:ring-indigo-200"
                >
                  <option value="Intake Bay A-1">Intake Bay A-1 (Electronics)</option>
                  <option value="Intake Bay A-2">Intake Bay A-2 (Metals)</option>
                  <option value="Intake Bay B-1">Intake Bay B-1 (Batteries)</option>
                  <option value="Intake Bay C-1">Intake Bay C-1 (General)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Estimated Weight (kg) *</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={newLotForm.estimatedWeight}
                  onChange={e => setNewLotForm({ ...newLotForm, estimatedWeight: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-mono outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Buy Rate (₹/kg) *</label>
                <input
                  type="number"
                  required
                  value={newLotForm.rate}
                  onChange={e => setNewLotForm({ ...newLotForm, rate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-mono outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-indigo-900">Estimated Total Payout:</span>
              <span className="font-mono text-sm font-bold text-[#1B1464]">
                ₹{Math.round((parseFloat(newLotForm.estimatedWeight) || 0) * (parseFloat(newLotForm.rate) || 0)).toLocaleString()}
              </span>
            </div>

            <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={newLotForm.hazard}
                onChange={e => setNewLotForm({ ...newLotForm, hazard: e.target.checked })}
                className="rounded text-red-600"
              />
              <span>Tag as Hazardous material (Requires PPE &amp; EPR Token)</span>
            </label>

            <div className="flex items-center gap-2.5 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setRegisterModalOpen(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-[#1B1464] hover:bg-indigo-950 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Icon name="plus" size={14} color="#fff" />
                <span>Register Lot</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

// ─── View: SETTLEMENT ─────────────────────────────────────────────────────────
function Settlement() {
  const lot = LOTS_DATA[2];
  const [done, setDone] = useState(false);
  const actual = lot.actualWeight!;
  const diff   = ((actual - lot.estimatedWeight) / lot.estimatedWeight * 100).toFixed(1);
  const origPay = Math.round(lot.estimatedWeight * lot.rate);
  const newPay  = Math.round(actual    * lot.rate);

  if (done) return (
    <div className="flex flex-col items-center justify-center gap-4 h-64 slide-in">
      <div className="w-14 h-14 rounded-full flex items-center justify-center text-3xl" style={{background:G.greenL}}><Icon name="check-circle" size={32}/></div>
      <div className="text-center">
        <p className="text-xl font-semibold" style={{color:G.dark}}>Settlement Complete</p>
        <p className="text-sm mt-1" style={{color:G.muted}}>₹{newPay.toLocaleString()} disbursed to Ahmed Sheikh via UPI</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-5 slide-in max-w-3xl">
      <SectionHd title="Weight Dispute — Settlement" sub={`${lot.id} · ${lot.cat} · Ahmed Sheikh`} />
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{background:G.redL, border:`1px solid #fca5a5`}}>
        <span className="text-xl flex-shrink-0"><Icon name="alert" size={24}/></span>
        <div>
          <p className="text-sm font-semibold" style={{color:G.red}}>{diff}% Weight Variance — Exceeds 15% CPCB Threshold</p>
          <p className="text-xs mt-0.5" style={{color:"#b91c1c"}}>Collector: {lot.estimatedWeight} kg · Scale: {actual} kg · Diff: {(actual-lot.estimatedWeight).toFixed(1)} kg</p>
        </div>
      </div>
      <div className="grid gap-4" style={{gridTemplateColumns:"1fr 1fr"}}>
        <div className="rounded-xl p-5 flex flex-col gap-3" style={{background:G.card, border:`1px solid ${G.border}`}}>
          <p className="text-[10px] font-semibold uppercase tracking-widest" style={{color:G.muted}}>Collector Estimate</p>
          <p className="font-mono text-5xl font-medium" style={{color:G.mid}}>{lot.estimatedWeight} kg</p>
          <p className="text-sm" style={{color:G.muted}}>{lot.collector} · {lot.cat}</p>
          <div className="px-3 py-2 rounded-lg text-xs" style={{background:G.bg, color:G.muted}}>App-submitted. Not certified.</div>
        </div>
        <div className="rounded-xl p-5 flex flex-col gap-3" style={{background:G.card, border:`1.5px solid ${G.green}`}}>
          <p className="text-[10px] font-semibold uppercase tracking-widest" style={{color:G.muted}}>Facility Scale Reading</p>
          <p className="font-mono text-5xl font-medium" style={{color:G.dark}}>{actual} kg</p>
          <p className="text-sm" style={{color:G.muted}}>Scale EGR-SCALE-02 · NABL Certified</p>
          <div className="px-3 py-2 rounded-lg text-xs" style={{background:G.greenXL, color:G.green}}>Certified & timestamped</div>
        </div>
      </div>
      <div className="rounded-xl p-5 flex flex-col gap-3" style={{background:G.card, border:`1px solid ${G.border}`}}>
        <p className="text-sm font-semibold" style={{color:G.dark}}>Recalculated Payout</p>
        {[
          {l:`Original (${lot.estimatedWeight} kg × ₹${lot.rate}/kg)`, v:`₹${origPay.toLocaleString()}`, strike:true},
          {l:`Revised (${actual} kg × ₹${lot.rate}/kg)`,     v:`₹${newPay.toLocaleString()}`,  strike:false},
        ].map(r => (
          <div key={r.l} className="flex items-center justify-between py-2.5 px-3 rounded-lg"
            style={{background:r.strike?G.bg:G.greenXL}}>
            <span className="text-sm" style={{color:r.strike?G.muted:G.dark}}>{r.l}</span>
            <span className={`font-mono text-base font-medium ${r.strike?"line-through":""}`}
              style={{color:r.strike?G.faint:G.green}}>{r.v}</span>
          </div>
        ))}
        <div className="flex gap-3 pt-1">
          <Btn variant="ghost">View Dispute Log</Btn>
          <Btn variant="danger">Hold & Escalate</Btn>
          <div className="flex-1"/>
          <Btn onClick={()=>setDone(true)}>Confirm & Disburse ₹{newPay.toLocaleString()}</Btn>
        </div>
      </div>
    </div>
  );
}

// ─── View: RATES ──────────────────────────────────────────────────────────────
function RatesCard() {
  const [rates, setRates] = useState<Record<string,number>>(Object.fromEntries(RATES_BASE.map(r=>[r.cat,r.mine])));
  const [saved, setSaved] = useState(false);
  const save = () => {
    RATES_BASE.forEach(r => {
       if (rates[r.cat] !== undefined && rates[r.cat] !== r.mine) {
          logAuditEvent("Rate Card Updated", r.cat, `₹${r.mine} → ₹${rates[r.cat]}`);
          r.mine = rates[r.cat];
       }
    });
    setSaved(true); setTimeout(()=>setSaved(false), 2000); 
  };

  return (
    <div className="flex flex-col gap-5 slide-in">
      <SectionHd title="Buying Rates Card" sub="Published live to collectors in the Kabadiwala app"
        right={<><span className="text-xs flex items-center gap-1" style={{color:saved?G.green:G.faint}}>{saved?<><Icon name="check" size={12}/> Published live</>:""}</span><Btn onClick={save}><span className="flex items-center gap-2"><Icon name="save" size={16}/> Save & Publish</span></Btn></>} />
      <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm" style={{background:G.amberL, border:`1px solid #fcd34d`, color:G.amber}}>
        <span className="flex items-center gap-2"><Icon name="alert" size={16}/> Hazardous category rates must be ≥ CPCB base rate. Rates below base will be flagged.</span>
      </div>
      <div className="rounded-xl overflow-hidden" style={{background:G.card, border:`1px solid ${G.border}`}}>
        <table className="w-full">
          <thead><tr>
            <TH ch="Material"/><TH ch="CPCB Base"/><TH ch="Your Rate (₹/kg)"/><TH ch="vs CPCB"/><TH ch="Margin"/><TH ch="Published"/>
          </tr></thead>
          <tbody>
            {RATES_BASE.map(r => {
              const mine = rates[r.cat] ?? r.mine;
              const diff = mine - r.cpcb;
              const below = diff < 0 && r.hazard;
              return (
                <tr key={r.cat} className="hover:bg-slate-50 transition-colors" style={{borderTop:`1px solid ${G.border}`}}>
                  <TD>
                    <div className="flex items-center gap-2.5">
                      <Icon name={r.emoji} size={20} />
                      <div>
                        <p className="text-sm font-medium" style={{color:G.dark}}>
                          {r.cat}
                          {r.cat === 'Cable' ? ' (Copper/Aluminium)' : ''}
                          {r.cat === 'Battery' ? ' (Li-Ion/Lead Acid)' : ''}
                        </p>
                        {r.hazard && <Badge text="HAZARDOUS" type="red" />}
                      </div>
                    </div>
                  </TD>
                  <TD mono muted>₹{r.cpcb}/kg</TD>
                  <TD>
                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg w-fit"
                      style={{background:below?G.redL:G.bg, border:`1px solid ${below?"#fca5a5":G.border}`}}>
                      <span className="font-mono text-xs" style={{color:G.muted}}>₹</span>
                      <input type="number" value={mine}
                        onChange={e=>setRates(p=>({...p,[r.cat]:+e.target.value}))}
                        className="font-mono text-sm font-medium w-16 bg-transparent outline-none"
                        style={{color:G.dark}}/>
                      <span className="text-xs" style={{color:G.muted}}>/kg</span>
                    </div>
                  </TD>
                  <TD>
                    <Badge text={`${diff>=0?"+":""}₹${diff}/kg`} type={below?"red":diff>=0?"green":"gray"} />
                  </TD>
                  <TD mono muted>{mine>0?`${((diff/mine)*100).toFixed(1)}%`:"—"}</TD>
                  <TD mono muted>Today 07:00</TD>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── View: ANALYTICS ─────────────────────────────────────────────────────────
function Analytics() {
  const [range, setRange] = useState<"7d"|"30d">("30d");
  const data = range === "30d" ? PRICE_30D : PRICE_30D.slice(-7);
  const SPLIT = [
    {name:"Cable",value:38,color:G.amber},{name:"PCB",value:27,color:G.green},
    {name:"Battery",value:19,color:G.red},{name:"Aluminium",value:10,color:G.sky},{name:"CRT/Other",value:6,color:G.muted},
  ];
  return (
    <div className="flex flex-col gap-5 slide-in">
      <SectionHd title="Analytics & Reports" sub="Price trends, volume, collector performance"
        right={<Btn variant="ghost"><span className="flex items-center gap-2"><Icon name="download" size={16}/> Export EPR CSV</span></Btn>} />
      <div className="grid gap-4" style={{gridTemplateColumns:"2fr 1fr"}}>
        <div className="rounded-xl p-5" style={{background:G.card,border:`1px solid ${G.border}`}}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold" style={{color:G.dark}}>Commodity Price Trends (₹/kg)</p>
              <p className="text-xs mt-0.5" style={{color:G.muted}}>CPCB reference · Mumbai Zone</p>
            </div>
            <div className="flex gap-1 p-1 rounded-lg" style={{background:G.bg}}>
              {(["7d","30d"] as const).map(r=>(
                <button key={r} onClick={()=>setRange(r)} className="px-3 py-1 rounded-md text-xs font-medium transition-all"
                  style={{background:range===r?G.green:"transparent",color:range===r?"#fff":G.muted}}>{r}</button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data} margin={{top:4,right:4,left:-22,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke={G.border}/>
              <XAxis dataKey="d" tick={{fontSize:9,fill:G.muted,fontFamily:"DM Mono"}} tickLine={false} axisLine={false} interval={range==="30d"?4:0}/>
              <YAxis tick={{fontSize:9,fill:G.muted,fontFamily:"DM Mono"}} tickLine={false} axisLine={false}/>
              <Tooltip contentStyle={{background:G.card,border:`1px solid ${G.border}`,borderRadius:8,fontSize:11,fontFamily:"DM Mono"}} formatter={(v: any)=>[ `₹${Number(v).toFixed(0)}/kg` ]}/>
              <Legend iconType="circle" iconSize={8} wrapperStyle={{fontSize:11,fontFamily:"DM Mono"}}/>
              <Line type="monotone" dataKey="cables"    name="Cable"  stroke={G.amber}  strokeWidth={1.5} dot={false}/>
              <Line type="monotone" dataKey="pcb"       name="PCB"            stroke={G.green}  strokeWidth={1.5} dot={false}/>
              <Line type="monotone" dataKey="batteries" name="Li-Ion"         stroke={G.red}    strokeWidth={1.5} dot={false}/>
              <Line type="monotone" dataKey="aluminium" name="Aluminium"      stroke={G.sky}    strokeWidth={1.5} dot={false}/>
              <Line type="monotone" dataKey="crt"       name="CRT"            stroke={G.muted}  strokeWidth={1.5} dot={false}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl p-5" style={{background:G.card,border:`1px solid ${G.border}`}}>
          <p className="text-sm font-semibold mb-3" style={{color:G.dark}}>Volume by Category</p>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart><Pie data={SPLIT} cx="50%" cy="50%" innerRadius={44} outerRadius={66} paddingAngle={2} dataKey="value">
              {SPLIT.map((c,i)=><Cell key={i} fill={c.color} stroke="none"/>)}
            </Pie><Tooltip contentStyle={{background:G.card,border:`1px solid ${G.border}`,borderRadius:8,fontSize:11}} formatter={(v: any)=>[ `${v}%` ]}/></PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-1.5 mt-1">
            {SPLIT.map(c=>(
              <div key={c.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full flex-shrink-0" style={{background:c.color}}/><span className="text-xs" style={{color:G.muted}}>{c.name}</span></div>
                <span className="font-mono text-xs font-medium" style={{color:G.dark}}>{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="grid gap-4" style={{gridTemplateColumns:"1fr 1fr"}}>
        <div className="rounded-xl p-5" style={{background:G.card,border:`1px solid ${G.border}`}}>
          <p className="text-sm font-semibold mb-3" style={{color:G.dark}}>Daily Volume (7d)</p>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={SEVEN_DAY} margin={{top:4,right:4,left:-22,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke={G.border} vertical={false}/>
              <XAxis dataKey="d" tick={{fontSize:10,fill:G.muted,fontFamily:"DM Mono"}} tickLine={false} axisLine={false}/>
              <YAxis tick={{fontSize:10,fill:G.muted,fontFamily:"DM Mono"}} tickLine={false} axisLine={false}/>
              <Tooltip contentStyle={{background:G.card,border:`1px solid ${G.border}`,borderRadius:8,fontSize:11,fontFamily:"DM Mono"}}/>
              <Bar dataKey="vol" name="Volume (kg)" fill={`${G.green}cc`} radius={[3,3,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl overflow-hidden" style={{background:G.card,border:`1px solid ${G.border}`}}>
          <div className="px-4 py-3 border-b" style={{borderColor:G.border}}>
            <p className="text-sm font-semibold" style={{color:G.dark}}>Collector Performance</p>
          </div>
          <table className="w-full">
            <thead><tr><TH ch="#"/><TH ch="Collector"/><TH ch="Lots"/><TH ch="Volume"/><TH ch="Payout"/><TH ch="Rating"/></tr></thead>
            <tbody>
              {COLLECTORS.slice(0,5).map((c,i)=>(
                <tr key={c.id} className="hover:bg-slate-50" style={{borderTop:`1px solid ${G.border}`}}>
                  <TD mono><span style={{color:i<3?G.amber:G.faint}}>#{i+1}</span></TD>
                  <TD><div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold" style={{background:G.greenL,color:G.green}}>{c.name.charAt(0)}</div><span className="text-sm" style={{color:G.dark}}>{c.name}</span></div></TD>
                  <TD mono>{c.lots}</TD>
                  <TD mono>{c.vol}</TD>
                  <TD mono green>{c.paid}</TD>
                  <TD mono><span style={{color:c.rating>=4.5?G.green:c.rating>=4?G.amber:G.muted}} className="flex items-center gap-1"><Icon name="star" size={12}/>{c.rating}</span></TD>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── View: EPR ────────────────────────────────────────────────────────────────


function AuditLogTab({ auditLogs }: { auditLogs: AuditLogItem[] }) {
  const [filter, setFilter] = useState("");
  const filteredLogs = auditLogs.filter(l => l.target.toLowerCase().includes(filter.toLowerCase()) || l.action.toLowerCase().includes(filter.toLowerCase()) || l.actor.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="flex flex-col gap-4 animate-slide-in">
      <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex-wrap">
        <div className="flex flex-1 items-center gap-3 flex-wrap">
           <div className="relative flex-1 min-w-[200px] max-w-sm">
              <input type="text" placeholder="Filter by Lot ID, Actor, or Action..." value={filter} onChange={e => setFilter(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-emerald-500 transition-colors" />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Icon name="search" size={16} color="currentColor" />
              </div>
           </div>
           
           <select className="bg-gray-50 border border-gray-200 text-sm text-gray-600 rounded-lg px-3 py-2 outline-none">
             <option>All Actions</option>
             <option>Verifications</option>
             <option>Disputes</option>
             <option>Payments</option>
           </select>
           
           <select className="bg-gray-50 border border-gray-200 text-sm text-gray-600 rounded-lg px-3 py-2 outline-none">
             <option>All Dates</option>
             <option>Today</option>
             <option>Last 7 Days</option>
           </select>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm">
            CSV
          </button>
          <button className="px-3 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm">
            PDF
          </button>
        </div>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider">
                <th className="p-4 font-bold">Timestamp</th>
                <th className="p-4 font-bold">Actor</th>
                <th className="p-4 font-bold">Action</th>
                <th className="p-4 font-bold">Target</th>
                <th className="p-4 font-bold">Changes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredLogs.map(l => (
                <tr key={l.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 whitespace-nowrap">
                    <div className="font-mono text-xs text-gray-900">{new Date(l.time).toLocaleDateString()}</div>
                    <div className="font-mono text-[11px] text-gray-500">{new Date(l.time).toLocaleTimeString()}</div>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <div className="font-bold text-gray-900 flex items-center gap-1.5">
                      {l.actor === "System" ? <span className="w-5 h-5 rounded bg-blue-100 text-blue-700 flex items-center justify-center text-[10px]"><Icon name="cpu" size={12} color="currentColor"/></span> : <span className="w-5 h-5 rounded bg-gray-100 text-gray-700 flex items-center justify-center text-[10px]"><Icon name="users" size={12} color="currentColor"/></span>}
                      {l.actor}
                    </div>
                    <div className="text-[11px] text-gray-500 ml-6.5">{l.role}</div>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <span className="bg-gray-100 text-gray-700 font-semibold px-2.5 py-1 rounded-md text-[11px] border border-gray-200">{l.action}</span>
                  </td>
                  <td className="p-4 font-mono text-xs text-emerald-700 font-bold whitespace-nowrap">{l.target}</td>
                  <td className="p-4 text-xs text-gray-600 font-medium whitespace-nowrap">
                    {l.changes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredLogs.length === 0 && (
          <div className="p-8 text-center text-gray-500 text-sm font-medium">No audit logs match your filters.</div>
        )}
      </div>
    </div>
  );
}

function EprTracker({ auditLogs }: { auditLogs: AuditLogItem[] }) {
  const { facility } = useAuth();
  const [tab, setTab] = useState<"compliance" | "audit">("compliance");
  const totalPct = Math.round(EPR_TARGETS.reduce((s,e)=>s+e.done,0)/EPR_TARGETS.reduce((s,e)=>s+e.target,0)*100);
  const CERTS = [
    {id:"CPCB-EPR-2026-EWM-04421",status:"active" ,issued:"01 Apr 2026",expires:"31 Mar 2027",cat:"E-Waste (IT & Telecom)"},
    {id:"CPCB-EPR-2026-BAT-00882",status:"active" ,issued:"01 Apr 2026",expires:"31 Mar 2027",cat:"Batteries"},
    {id:"CPCB-EPR-2025-MISC-1124",status:"expired",issued:"01 Apr 2025",expires:"31 Mar 2026",cat:"Miscellaneous WEEE"},
  ];
  return (
    <div className="flex flex-col gap-5 slide-in">
      <SectionHd title="EPR Compliance &amp; Audit" sub="Compliance tracking and operational audit logs"
        right={
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button onClick={() => setTab("compliance")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                tab === "compliance" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}>
              Compliance
            </button>
            <button onClick={() => setTab("audit")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                tab === "audit" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}>
              Audit Log
            </button>
          </div>
        }/>
        
      {tab === "compliance" && (
        <div className="flex flex-col gap-5 animate-slide-in">
          <div className="flex justify-end -mt-2">
            <Btn variant="ghost"><span className="flex items-center gap-2"><Icon name="file-text" size={16}/> Download EPR Report</span></Btn>
          </div>
          <div className="rounded-xl p-5 flex items-center gap-6" style={{background:G.card,border:`1.5px solid ${G.green}`}}>
            <div className="flex flex-col items-center justify-center w-24 h-24 rounded-full flex-shrink-0" style={{background:G.greenXL,border:`3px solid ${G.greenL}`}}>
              <p className="font-mono text-2xl font-medium" style={{color:G.green}}>{totalPct}%</p>
              <p className="text-[10px]" style={{color:G.muted}}>Overall</p>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold" style={{color:G.dark}}>{facility?.name ? `${facility.name} — Annual Target` : "EcoGreen E-Waste MIDC — Annual Target"}</p>
              <p className="text-xs mt-0.5 mb-3" style={{color:G.muted}}>
                {EPR_TARGETS.reduce((s,e)=>s+e.done,0).toLocaleString()} kg / {EPR_TARGETS.reduce((s,e)=>s+e.target,0).toLocaleString()} kg · FY ends 31 Mar 2027
              </p>
              <div className="h-2.5 rounded-full overflow-hidden" style={{background:G.bg}}>
                <div className="h-full rounded-full" style={{width:`${totalPct}%`,background:`linear-gradient(90deg,${G.green},${G.greenM})`}}/>
              </div>
            </div>
          </div>
          <div className="grid gap-4" style={{gridTemplateColumns:"1fr 1fr"}}>
            <div className="rounded-xl p-5 flex flex-col gap-4" style={{background:G.card,border:`1px solid ${G.border}`}}>
              <p className="text-sm font-semibold" style={{color:G.dark}}>Target vs. Collected</p>
              {EPR_TARGETS.map(e=>{
                const pct=Math.round(e.done/e.target*100);
                return (
                  <div key={e.cat} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium" style={{color:G.mid}}>{e.cat}</span>
                      <span className="font-mono text-xs" style={{color:G.muted}}>{e.done.toLocaleString()} / {e.target.toLocaleString()} kg</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{background:G.bg}}>
                      <div className="h-full rounded-full" style={{width:`${pct}%`,background:e.color}}/>
                    </div>
                    <p className="font-mono text-[10px] text-right" style={{color:pct>=80?G.green:pct>=50?G.amber:G.red}}>{pct}%</p>
                  </div>
                );
              })}
            </div>
            <div className="rounded-xl p-5 flex flex-col gap-3" style={{background:G.card,border:`1px solid ${G.border}`}}>
              <p className="text-sm font-semibold" style={{color:G.dark}}>CPCB Certificates</p>
              {CERTS.map(c=>(
                <div key={c.id} className="rounded-lg p-3 flex flex-col gap-1.5" style={{background:G.bg,border:`1px solid ${G.border}`}}>
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-mono text-xs font-medium truncate" style={{color:G.dark}}>{c.id}</p>
                    <Badge text={c.status} type={c.status==="active"?"green":"red"} />
                  </div>
                  <p className="text-xs" style={{color:G.muted}}>{c.cat}</p>
                  <div className="flex gap-4 font-mono text-[10px]" style={{color:G.faint}}>
                    <span>Issued: {c.issued}</span><span>Expires: {c.expires}</span>
                  </div>
                </div>
              ))}
              <Btn variant="ghost">+ Apply for New Certificate</Btn>
            </div>
          </div>
        </div>
      )}

      {tab === "audit" && <AuditLogTab auditLogs={auditLogs} />}
    </div>
  );
}


// ─── View: COLLECTORS ────────────────────────────────────────────────────────
function Collectors({ collectors, setCollectors }: { collectors: any[], setCollectors: any }) {
  const [kycF, setKycF] = useState("all");
  const filtered = collectors.filter(c => kycF==="all"||c.kyc===kycF);
  const KYC: Record<string,[string,string]> = {verified:[G.greenL,G.green],pending:[G.amberL,G.amber],rejected:[G.redL,G.red]};
  const BADGE: Record<string,React.ReactNode> = {Gold:<Icon name="award" size={14} color="#eab308"/>,Silver:<Icon name="award" size={14} color="#94a3b8"/>,Bronze:<Icon name="award" size={14} color="#b45309"/>};
  return (
    <div className="flex flex-col gap-5 slide-in">
      <SectionHd title="Collectors" sub="All collectors linked to this facility"
        right={<Btn>+ Invite Collector</Btn>}/>
      <div className="grid gap-4" style={{gridTemplateColumns:"repeat(4,1fr)"}}>
        <KCard label="Total"    value={`${COLLECTORS.length}`}                                          sub="" icon={<Icon name="users" size={20}/>} color={G.green}/>
        <KCard label="Verified" value={`${COLLECTORS.filter(c=>c.kyc==="verified").length}`}            sub="" icon={<Icon name="check" size={20}/>} color={G.green}/>
        <KCard label="Pending"  value={`${COLLECTORS.filter(c=>c.kyc==="pending").length}`}             sub="" icon={<Icon name="clock" size={20}/>} color={G.amber}/>
        <KCard label="Active Today" value={`${COLLECTORS.filter(c=>c.lastActive==="Today").length}`}    sub="" icon={<Icon name="dot_sky" size={20}/>} color={G.sky}/>
      </div>
      <div className="flex gap-1 p-1 rounded-lg w-fit" style={{background:G.card2,border:`1px solid ${G.border}`}}>
        {["all","verified","pending","rejected"].map(f=>(
          <button key={f} onClick={()=>setKycF(f)} className="px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all"
            style={{background:kycF===f?G.green:"transparent",color:kycF===f?"#fff":G.muted}}>{f==="all"?`All (${COLLECTORS.length})`:f}</button>
        ))}
      </div>
      <div className="rounded-xl overflow-hidden" style={{background:G.card,border:`1px solid ${G.border}`}}>
        <table className="w-full">
          <thead><tr>
            <TH ch="Collector"/><TH ch="Area"/><TH ch="Lots"/><TH ch="Volume"/>
            <TH ch="Total Paid"/><TH ch="Rating"/><TH ch="KYC"/><TH ch="Badge"/><TH ch="Last Active"/><TH ch="Actions"/>
          </tr></thead>
          <tbody>
            {filtered.map(c=>{
              const [bg,color]=KYC[c.kyc];
              return (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors" style={{borderTop:`1px solid ${G.border}`}}>
                  <TD>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0" style={{background:G.greenL,color:G.green}}>{c.name.charAt(0)}</div>
                      <div><p className="text-sm font-medium" style={{color:G.dark}}>{c.name}</p><p className="font-mono text-[10px]" style={{color:G.muted}}>{c.id}</p></div>
                    </div>
                  </TD>
                  <TD muted>{c.area}</TD>
                  <TD mono>{c.lots}</TD>
                  <TD mono>{c.vol}</TD>
                  <TD mono green>{c.paid}</TD>
                  <TD mono><span style={{color:c.rating>=4.5?G.green:c.rating>=4?G.amber:G.red}} className="flex items-center gap-1"><Icon name="star" size={12}/>{c.rating}</span></TD>
                  <TD><Pill label={c.kyc} color={color} bg={bg}/></TD>
                  <TD>{c.blocked ? <Badge text="Blocked" type="red" /> : (c.badge?<span className="flex items-center gap-1">{BADGE[c.badge]} {c.badge}</span>:<span style={{color:G.faint}}>—</span>)}</TD>
                  <TD mono muted>{c.lastActive}</TD>
                  <TD>
                    <div className="flex gap-1">
                      <Btn variant="ghost" small>View</Btn>
                      {c.kyc==="pending"&&<Btn small>Verify KYC</Btn>}
                      {c.kyc==="rejected"&&<Btn variant="danger" small>Re-check</Btn>}
                      {c.blocked ? 
                        <Btn variant="danger" small onClick={() => { setCollectors(collectors.map(x => x.id === c.id ? {...x, blocked: false} : x)); logAuditEvent("Collector Unblocked", c.id, "Status: Blocked → Active"); }}>Unblock</Btn> : 
                        <Btn variant="ghost" small onClick={() => { setCollectors(collectors.map(x => x.id === c.id ? {...x, blocked: true} : x)); logAuditEvent("Collector Blocked", c.id, "Status: Active → Blocked"); }}>Block</Btn>
                      }
                    </div>
                  </TD>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── View: PROFILE ────────────────────────────────────────────────────────────
function Profile() {
  const { user, facility, logout } = useAuth();
  const [tab, setTab] = useState<"facility"|"team"|"docs"|"bank">("facility");
  const [notifPrefs, setNotifPrefs] = useState([
    {l:"Email alerts for new lots",       on:true },
    {l:"SMS on payment disbursement",     on:true },
    {l:"Weekly EPR summary email",        on:false},
    {l:"Push: weight variance detected",  on:true },
  ]);

  const toggleNotif = (idx: number) => setNotifPrefs(prev =>
    prev.map((p, i) => i === idx ? { ...p, on: !p.on } : p)
  );

  const DOC_STATUS: Record<string,[string,string]> = {active:[G.greenL,G.green],expired:[G.redL,G.red]};

  return (
    <div className="flex flex-col gap-5 slide-in">
      <SectionHd 
        title="Profile & Settings" 
        sub="Facility details, team management, documents, and bank details"
        right={
          <button
            onClick={() => logout()}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Log Out</span>
          </button>
        }
      />
      <div className="flex gap-1 p-1 rounded-lg w-fit" style={{background:G.card2,border:`1px solid ${G.border}`}}>
        {(["facility","team","docs","bank"] as const).map(t=>(
          <button key={t} onClick={()=>setTab(t)} className="px-4 py-1.5 rounded-md text-xs font-medium capitalize transition-all"
            style={{background:tab===t?G.green:"transparent",color:tab===t?"#fff":G.muted}}>
            {t==="facility"?"Facility Details":t==="team"?"Team":t==="docs"?"Documents":"Bank / Payout"}
          </button>
        ))}
      </div>

      {tab==="facility" && (
        <div className="grid gap-4" style={{gridTemplateColumns:"1fr 1fr"}}>
          <div className="rounded-xl p-5 flex flex-col gap-4" style={{background:G.card,border:`1px solid ${G.border}`}}>
            <p className="text-sm font-semibold" style={{color:G.dark}}>Facility Information</p>
            {[
              {l:"Facility Name",   v: facility?.name || "EcoGreen E-Waste Pvt Ltd"},
              {l:"Waste Stream",    v: facility?.category || "E-Waste & Lithium Batteries"},
              {l:"CPCB Reg. No.",   v: facility?.cpcbNumber || facility?.cpcbStatus || "CPCB-EWM-MH-04421"},
              {l:"GST Number",      v: facility?.gstNumber || "27AABCE1234F1Z5"},
              {l:"Address",         v: facility?.address || (facility?.location ? `${facility.location}, India` : "Plot 14-C, MIDC Andheri East, Mumbai 400093")},
              {l:"Operating Hours", v: facility?.operatingHours || "Mon–Sat, 08:00–18:00"},
              {l:"Contact Email",   v: facility?.email || user?.email || "ops@ecogreen.in"},
              {l:"Phone",           v: facility?.phone || "+91 22 6812 4400"},
            ].map(r=>(
              <div key={r.l} className="flex flex-col gap-0.5">
                <p className="text-[10px] font-semibold uppercase tracking-widest" style={{color:G.faint}}>{r.l}</p>
                <p className="text-sm" style={{color:G.dark}}>{r.v}</p>
              </div>
            ))}
            <Btn variant="ghost">Edit Details</Btn>
          </div>
          <div className="rounded-xl p-5 flex flex-col gap-4" style={{background:G.card,border:`1px solid ${G.border}`}}>
            <p className="text-sm font-semibold" style={{color:G.dark}}>Authorization Status</p>
            <div className="flex items-center gap-3 p-3 rounded-xl" style={{background:G.greenXL,border:`1px solid ${G.greenL}`}}>
              <span className="text-2xl"><Icon name="check-circle" size={24}/></span>
              <div>
                <p className="text-sm font-semibold" style={{color:G.green}}>CPCB Authorized Facility</p>
                <p className="font-mono text-xs" style={{color:G.muted}}>{facility?.cpcbStatus || "Valid until 31 Mar 2027"}</p>
              </div>
            </div>
            <p className="text-sm font-semibold" style={{color:G.dark}}>Notification Preferences</p>
            {notifPrefs.map((r, idx)=>(
              <div key={r.l} className="flex items-center justify-between cursor-pointer" onClick={() => toggleNotif(idx)}>
                <p className="text-sm" style={{color:G.dark}}>{r.l}</p>
                <div className="w-9 h-5 rounded-full relative" style={{background:r.on?G.green:G.border}}>
                  <span className="absolute top-0.5 w-4 h-4 rounded-full" style={{background:G.card,left:r.on?"calc(100%-18px)":"2px",transition:"left 0.2s"}}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab==="team" && (
        <div className="rounded-xl overflow-hidden" style={{background:G.card,border:`1px solid ${G.border}`}}>
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{borderColor:G.border}}>
            <p className="text-sm font-semibold" style={{color:G.dark}}>Team Members ({TEAM.length})</p>
            <Btn small>+ Invite Staff</Btn>
          </div>
          <table className="w-full">
            <thead><tr><TH ch="Name"/><TH ch="Role"/><TH ch="Email"/><TH ch="Status"/><TH ch="Last Login"/><TH ch="Actions"/></tr></thead>
            <tbody>
              {TEAM.map(m=>(
                <tr key={m.name} className="hover:bg-slate-50" style={{borderTop:`1px solid ${G.border}`}}>
                  <TD>
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold" style={{background:G.greenL,color:G.green}}>{m.name.charAt(0)}</div>
                      <span className="text-sm font-medium" style={{color:G.dark}}>{m.name}</span>
                    </div>
                  </TD>
                  <TD><Badge text={m.role} type="gray"/></TD>
                  <TD mono muted>{m.email}</TD>
                  <TD><Badge text={m.status} type={m.status==="active"?"green":"gray"}/></TD>
                  <TD mono muted>{m.lastLogin}</TD>
                  <TD><div className="flex gap-1"><Btn variant="ghost" small>Edit</Btn><Btn variant="danger" small>Remove</Btn></div></TD>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab==="docs" && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold" style={{color:G.dark}}>Compliance Documents</p>
            <Btn variant="ghost" small>+ Upload Document</Btn>
          </div>
          {DOCS.map(d=>{
            const [bg,color]=DOC_STATUS[d.status];
            const daysLeft = d.status==="active"?Math.floor((new Date(d.expires.split(" ").reverse().join("-")).getTime()-Date.now())/86400000):0;
            return (
              <div key={d.name} className="flex items-center gap-4 p-4 rounded-xl" style={{background:G.card,border:`1px solid ${d.status==="expired"?"#fca5a5":G.border}`}}>
                <span className="text-2xl flex-shrink-0"><Icon name="file-text" size={24}/></span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{color:G.dark}}>{d.name}</p>
                  <p className="font-mono text-xs mt-0.5" style={{color:G.muted}}>Issued: {d.issued} · Expires: {d.expires}</p>
                  {d.status==="active"&&daysLeft<60&&<p className="text-xs mt-0.5" style={{color:G.amber}}>Expires in {daysLeft} days</p>}
                </div>
                <Pill label={d.status} color={color} bg={bg}/>
                <div className="flex gap-1">
                  <Btn variant="ghost" small>View</Btn>
                  <Btn variant="ghost" small>Renew</Btn>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab==="bank" && (
        <div className="grid gap-4" style={{gridTemplateColumns:"1fr 1fr"}}>
          <div className="rounded-xl p-5 flex flex-col gap-4" style={{background:G.card,border:`1px solid ${G.border}`}}>
            <p className="text-sm font-semibold" style={{color:G.dark}}>Payout Bank Account</p>
            {[
              {l:"Account Holder", v: facility?.name || "EcoGreen E-Waste Pvt Ltd"},
              {l:"Bank",           v: "HDFC Bank"},
              {l:"Account No.",   v: "•••• •••• 4412"},
              {l:"IFSC Code",     v: "HDFC0001234"},
              {l:"Branch",        v: facility?.location ? `${facility.location}, India` : "Andheri East, Mumbai"},
            ].map(r=>(
              <div key={r.l} className="flex flex-col gap-0.5">
                <p className="text-[10px] font-semibold uppercase tracking-widest" style={{color:G.faint}}>{r.l}</p>
                <p className="font-mono text-sm" style={{color:G.dark}}>{r.v}</p>
              </div>
            ))}
            <Btn variant="ghost">Update Bank Details</Btn>
          </div>
          <div className="rounded-xl p-5 flex flex-col gap-4" style={{background:G.card,border:`1px solid ${G.border}`}}>
            <p className="text-sm font-semibold" style={{color:G.dark}}>UPI & GST</p>
            {[
              {l:"UPI ID",         v: facility?.email ? `${facility.email.split("@")[0]}@razorpay` : "ecogreen@razorpay"},
              {l:"UPI Name",       v: facility?.name || "EcoGreen E-Waste Pvt Ltd"},
              {l:"GST Number",     v: facility?.gstNumber || "27AABCE1234F1Z5"},
              {l:"GST Rate",       v: "18% (Services)"},
              {l:"PAN",            v: "AABCE1234F"},
            ].map(r=>(
              <div key={r.l} className="flex flex-col gap-0.5">
                <p className="text-[10px] font-semibold uppercase tracking-widest" style={{color:G.faint}}>{r.l}</p>
                <p className="font-mono text-sm" style={{color:G.dark}}>{r.v}</p>
              </div>
            ))}
            <Btn variant="ghost">Edit GST / UPI</Btn>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Nav config ───────────────────────────────────────────────────────────────
type View = "dashboard"|"scan"|"lots"|"inventory"|"settlement"|"payments"|"trends"|"rates"|"analytics"|"epr"|"collectors"|"notifications"|"profile"|"admin_dashboard"|"facility_verification"|"dispute_overrides"|"facilities";

const RECYCLER_NAV_GROUPS = [
  { label: "Operations", items: [
    { id: "dashboard"     as View, label: "Dashboard",     icon: "home",  badge: 0 },
    { id: "scan"          as View, label: "Scan & Verify", icon: "scan",  badge: 2 },
    { id: "lots"          as View, label: "Lots Queue",    icon: "list",  badge: 3 },
    { id: "inventory"     as View, label: "Inventory",     icon: "database",  badge: 0 },
  ]},
  { label: "Finance", items: [
    { id: "payments"      as View, label: "Payments",      icon: "card", badge: 1 },
    { id: "trends"        as View, label: "Market Trends", icon: "trending-up",  badge: 0 },
    { id: "rates"         as View, label: "Rates Card",    icon: "indian-rupee",  badge: 0 },
  ]},
  { label: "Reports", items: [
    { id: "analytics"     as View, label: "Analytics",     icon: "pie-chart", badge: 0 },
    { id: "epr"           as View, label: "EPR & Audit",   icon: "leaf", badge: 0 },
  ]},
  { label: "People", items: [
    { id: "collectors"    as View, label: "Collectors",    icon: "users", badge: 2 },
  ]},
];

const ADMIN_NAV_GROUPS = [
  { label: "Admin Core", items: [
    { id: "admin_dashboard" as View, label: "Dashboard", icon: "home", badge: 0 },
    { id: "facility_verification" as View, label: "Facility Verification", icon: "file-text", badge: 3 },
    { id: "dispute_overrides" as View, label: "Dispute Overrides", icon: "alert-circle", badge: 2 },
  ]},
  { label: "Network", items: [
    { id: "collectors" as View, label: "Collectors", icon: "users", badge: 0 },
    { id: "facilities" as View, label: "Facilities", icon: "database", badge: 0 },
  ]},
  { label: "Governance", items: [
    { id: "analytics" as View, label: "Reports & Audits", icon: "pie-chart", badge: 0 },
  ]},
];

// ─── Global Audit Event ───────────────────────────────────────────────────────
let globalLogEvent: (action: string, target: string, changes: string, actor?: string, role?: string) => void = () => {};
export function logAuditEvent(action: string, target: string, changes: string, actor = "Admin", role = "Facility Manager") {
  globalLogEvent(action, target, changes, actor, role);
}

// ─── Main Dashboard App ───────────────────────────────────────────────────────
function DashboardApp() {
  const { user, facility, role, loading, logout } = useAuth();
  const [auditLogs, setAuditLogs] = React.useState<AuditLogItem[]>(AUDIT_LOGS);
  React.useEffect(() => {
    globalLogEvent = (action, target, changes, actor = "Admin", role = "Facility Manager") => {
      const newLog = {
        id: "AL-" + Math.floor(1000 + Math.random() * 9000),
        time: new Date().toISOString(),
        actor,
        role,
        action,
        target,
        changes
      };
      setAuditLogs(prev => [newLog, ...prev]);

      if (isSupabaseConfigured && supabase) {
        supabase.from('audit_logs').insert({
          id: newLog.id,
          actor: newLog.actor,
          role: newLog.role,
          action: newLog.action,
          target: newLog.target,
          changes: newLog.changes,
          facility_name: facility?.name || 'Green Recycle Hub',
        }).then(({error}) => {
          if (error && error.code !== '42P01') console.error('Audit Log Sync Error:', error); // Ignore table not found temporarily
        });
      }
    };
  }, [facility?.name]);

  React.useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(50).then(({data, error}) => {
        if (data && !error && data.length > 0) {
          const realLogs = data.map((d: any) => ({
            id: d.id,
            time: d.created_at || new Date().toISOString(),
            actor: d.actor,
            role: d.role,
            action: d.action,
            target: d.target,
            changes: d.changes
          }));
          setAuditLogs(realLogs);
        }
      });
    }
  }, []);

  const [lots, setLots] = useState<LotItem[]>(
    isSupabaseConfigured ? [] : LOTS_DATA.map(l => {
      let st: LotItem["status"] = "pending";
      if (l.status === "pending" || l.status === "requested") st = "pending";
      else if (l.status === "accepted" || l.status === "accepted_awaiting_verification") st = "accepted_awaiting_verification";
      else if (l.status === "settling" || l.status === "verified") st = "settling";
      else if (l.status === "disputed" || l.status === "dispute") st = "disputed";
      else if (l.status === "settled") st = "settled";
      else if (l.status === "paid") st = "paid";
      else if (l.status === "rejected") st = "rejected";
      else if (l.status === "rejected_on_inspection") st = "rejected_on_inspection";

      return { 
        ...l, 
        status: st,
        estimatedWeight: l.estimatedWeight,
        actualWeight: l.actualWeight,
        finalWeight: st === "settled" || st === "paid" ? (l.actualWeight || l.estimatedWeight) : null,
        variancePercent: l.actualWeight && l.estimatedWeight ? ((l.actualWeight - l.estimatedWeight) / l.estimatedWeight) * 100 : null,
        rejectionReason: st === "rejected" ? { category: "other", notes: "Contaminated plastic casing" } : null,
      };
    })
  );
  const [lotsLoading, setLotsLoading] = useState(isSupabaseConfigured);
  const [transactions, setTransactions] = useState(TRANSACTIONS);
  const [collectorsState, setCollectorsState] = useState(COLLECTORS);
  const [view, setView]   = useState<View>(role === "admin" ? "admin_dashboard" : "dashboard");
  const [scanRoute, setScanRoute] = useState<{lotId: string, step: number} | null>(null);
  const unread = NOTIFICATIONS.filter(n=>!n.read).length;

  // Switch to Dashboard view whenever user signs in or role changes
  useEffect(() => {
    if (user) {
      setView(role === "admin" ? "admin_dashboard" : "dashboard");
    }
  }, [user?.uid, role]);

  // ---> SUPABASE SYNC <---
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    const currentFacilityName = facility?.name || 'Green Recycle Hub';

    // Fetch initial lots from Supabase
    const fetchLots = async () => {
      setLotsLoading(true);
      const { data, error } = await supabase.from('lots')
        .select('*, collectors(name, phone)')
        .or(`recycler_name.eq.${currentFacilityName},recycler_name.is.null`)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching lots:", error);
        setLotsLoading(false);
        return;
      }
      if (data) {
        const supabaseLots: LotItem[] = data.map((row: any) => {
          let st: LotItem["status"] = "pending";
          const hs = row.handover_status;
          if (hs === "pending" || hs === "requested" || hs === "pickup_pending") st = "pending";
          else if (hs === "accepted") st = "accepted_awaiting_verification";
          else if (hs === "verified" || hs === "handed_over") st = "settling";
          else if (hs === "declined" || hs === "rejected") st = "rejected";
          else if (hs === "settled" || hs === "paid") st = "settled";
          else if (hs === "disputed") st = "disputed";

          const matLower = (row.material || "").toLowerCase();
          const emoji = matLower.includes("battery") ? "🔋"
            : matLower.includes("cable") ? "🔌"
            : matLower.includes("pcb") ? "🖥️"
            : matLower.includes("motor") ? "⚙️"
            : matLower.includes("plastic") ? "♻️"
            : matLower.includes("crt") ? "📺"
            : matLower.includes("lcd") ? "📱"
            : matLower.includes("metal") ? "🥫"
            : "💻";
          
          return {
            id: row.lot_id,
            emoji,
            cat: row.material || "Unknown",
            collector: row.collectors?.name || "Unknown Collector",
            collectorName: row.collectors?.name || "Unknown Collector",
            phone: row.collectors?.phone || "0000000000",
            estimatedWeight: row.declared_weight || 0,
            actualWeight: row.verified_weight ? Number(row.verified_weight) : null,
            finalWeight: null,
            rate: row.indicative_value && row.declared_weight ? Math.round(row.indicative_value / row.declared_weight) : 150,
            cpcbRate: 150,
            arrival: new Date(row.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            date: new Date(row.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            status: st,
            hazard: false,
            rejectionReason: null,
            condition: row.condition,
            imageUrl: row.image_url,
            variancePercent: null
          };
        });
        
        setLots(supabaseLots);
      }
      setLotsLoading(false);
    };

    fetchLots();
    const syncInterval = setInterval(fetchLots, 3000);

    // Subscribe to real-time inserts, updates, and deletes
    const channel = supabase
      .channel('public:lots')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'lots' }, () => {
        fetchLots(); // Instant refresh on any change
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      clearInterval(syncInterval);
    };
  }, [facility?.name]);

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const pendingLotsCount = lots.filter(l => l.status === "pending" || l.status === "requested").length;
  const awaitingVerificationCount = lots.filter(l => l.status === "accepted_awaiting_verification" || l.status === "accepted").length;
  const settlingLotsCount = lots.filter(l => l.status === "settling" || l.status === "verified").length;
  const lotsTotalWeightKg = useMemo(() => {
    return lots.reduce((acc, l) => acc + (l.actualWeight !== null ? l.actualWeight : l.estimatedWeight), 0).toFixed(1);
  }, [lots]);
  const lotsEstimatedTotalValue = useMemo(() => {
    return lots.reduce((acc, l) => acc + ((l.actualWeight !== null ? l.actualWeight : l.estimatedWeight) * l.rate), 0);
  }, [lots]);
  const [pulseLotsQueue, setPulseLotsQueue] = useState(false);
  const prevLotsCount = React.useRef(pendingLotsCount);

  useEffect(() => {
    if (pendingLotsCount > prevLotsCount.current) {
      setPulseLotsQueue(true);
      const t = setTimeout(() => setPulseLotsQueue(false), 1500);
      prevLotsCount.current = pendingLotsCount;
      return () => clearTimeout(t);
    } else {
      prevLotsCount.current = pendingLotsCount;
    }
  }, [pendingLotsCount]);

  const activeNavConfig = role === "admin" ? ADMIN_NAV_GROUPS : RECYCLER_NAV_GROUPS;

  const dynamicNavGroups = activeNavConfig.map(grp => ({
    ...grp,
    items: grp.items.map(n => {
      let badge = n.badge;
      if (role === "recycler") {
        if (n.id === "scan") badge = awaitingVerificationCount;
        if (n.id === "lots") badge = pendingLotsCount;
        if (n.id === "payments") badge = settlingLotsCount;
      }
      return { ...n, badge };
    })
  }));

  const VIEW_MAP: Record<View, React.ReactNode> = {
    dashboard:             <Dashboard lots={lots} setLots={setLots} setView={v => setView(v as View)} lotsLoading={lotsLoading} />,
    admin_dashboard:       <AdminDashboard onNavigate={v => setView(v as View)} pendingFacilitiesCount={3} openDisputesCount={2} totalFacilitiesCount={24} totalCollectorsCount={318} />,
    facility_verification: <FacilityVerification />,
    dispute_overrides:     <DisputeOverrides />,
    facilities:            <Inventory />,
    scan:                  <ScanVerify lots={lots} setLots={setLots} transactions={transactions} setTransactions={setTransactions} scanRoute={scanRoute} setScanRoute={setScanRoute} />,
    lots:                  <LotsQueue lots={lots} setLots={setLots} setView={v => setView(v as View)} registerModalOpen={registerModalOpen} setRegisterModalOpen={setRegisterModalOpen} transactions={transactions} setTransactions={setTransactions} />,
    inventory:             <Inventory />,
    settlement:            <Settlement />,
    payments:              <Payments lots={lots} setLots={setLots} setView={v => setView(v as View)} setScanRoute={setScanRoute} transactions={transactions} setTransactions={setTransactions} />,
    trends:                <MarketTrends />,
    rates:                 <RatesCard />,
    analytics:             <Analytics />,
    epr:                   <EprTracker auditLogs={auditLogs} />,
    collectors:            <Collectors collectors={collectorsState} setCollectors={setCollectorsState} />,
    notifications:         <NotificationsView />,
    profile:               <Profile />,
  };

  const VIEW_TITLE: Record<View, string> = {
    dashboard: "Dashboard",
    admin_dashboard: "Admin Dashboard",
    facility_verification: "Facility Verification",
    dispute_overrides: "Dispute Overrides",
    facilities: "Registered Facilities",
    scan: "Scan & Verify",
    lots: "Lots Queue",
    inventory: "Inventory",
    settlement: "Settlement",
    payments: "Payments & Settlements",
    trends: "Market Trends",
    rates: "Rates Card",
    analytics: "Analytics & Reports",
    epr: "EPR & Compliance",
    collectors: "Collectors",
    notifications: "Notifications",
    profile: "Profile & Settings",
  };

  // Route Protection: Show loading state or standalone Login when unauthenticated
  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0c1a12] text-white font-sans">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mb-4 shadow-lg">
          <Icon name="leaf" size={26} color="#34d399" />
        </div>
        <div className="flex items-center gap-3 text-emerald-400 font-mono text-xs">
          <svg className="animate-spin h-4 w-4 text-emerald-400" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Authenticating Session...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login onSuccess={(loggedInRole) => setView(loggedInRole === "admin" ? "admin_dashboard" : "dashboard")} />;
  }

  if (role === "admin") {
    return <AdminPanel />;
  }

  return (
    <div className="h-full flex" style={{ background: G.bg }}>
      {/* ── Sidebar ── */}
      <aside className="flex-shrink-0 flex flex-col justify-between overflow-y-auto" style={{ width: 220, background: "#061d12" }}>
        <div>
          {/* Logo & Org area */}
          <div className="px-4 py-4 border-b border-[#133322]">
            <div className="flex items-center gap-2.5 mb-3.5">
              <div className="w-10 h-10 rounded-[10px] flex items-center justify-center bg-white shadow-sm flex-shrink-0 overflow-hidden border border-[#1f3329]"><img src={appLogo} alt="Logo" className="w-full h-full object-cover" /></div><div><p className="text-xs font-bold tracking-wider text-white">ECOSETU</p><p className="text-[8px] tracking-[0.2em] text-emerald-400">CONNECT · RECYCLE · REUSE</p></div>
            </div>

            {/* Facility Dropdown */}
            <div 
              onClick={() => setView("profile")}
              className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-[#0e2c1c] border border-[#1b442d] cursor-pointer hover:border-emerald-500/40 transition-colors"
              title="Click to view/edit Facility Profile"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Icon name="settings" size={13} color="#34d399" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-100 truncate">{facility?.name || "EcoGreen E-Waste"}</p>
                  <p className="text-[10px] text-emerald-400 truncate">{facility?.location ? `${facility.location} • Active` : "MIDC Andheri • Active"}</p>
                </div>
              </div>
              <span className="text-[10px] text-gray-400">▼</span>
            </div>
          </div>

          {/* Nav groups */}
          <nav className="px-2.5 py-3 flex flex-col gap-4">
            {dynamicNavGroups.map(grp => (
              <div key={grp.label}>
                <p className="px-2.5 mb-1 text-[9px] font-bold uppercase tracking-widest text-emerald-600/70">{grp.label}</p>
                {grp.items.map(n => {
                  const active = view === n.id;
                  return (
                    <button key={n.id} onClick={() => setView(n.id)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-left w-full mb-1 transition-all cursor-pointer ${
                        active 
                          ? "bg-[#143d26] border border-emerald-500/40 text-white shadow-xs font-semibold" 
                          : "text-[#82a390] hover:text-white hover:bg-[#0c2618]"
                      }`}>
                      <span className="w-4 flex items-center justify-center flex-shrink-0">
                        <Icon name={n.icon} size={15} color={active ? "#34d399" : "currentColor"} />
                      </span>
                      <span className="flex-1 text-xs truncate">{n.label}</span>
                      {n.badge > 0 && (
                        <span className={`font-mono text-[9.5px] font-bold px-1.5 py-0.5 rounded-full ${
                          active ? "bg-emerald-600 text-white" : "bg-amber-500/20 text-amber-400"
                        } ${(n.id === "lots" || n.id === "payments") ? "animate-pulse-badge" : ""}`}>
                          {n.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Sidebar Bottom: Brand Leaf Graphic */}
        <div className="p-3.5 border-t border-[#133322]">
          <div className="flex items-center gap-2.5 px-2 py-1.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
              <Icon name="leaf" size={15} color="#34d399" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-emerald-300 leading-tight">Small Steps</p>
              <p className="text-[10px] text-emerald-500/90 leading-tight">Big Impact</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#f7f6f2]">
        {/* Topbar */}
        <header className="flex items-center justify-between px-6 py-2.5 flex-shrink-0 bg-white border-b border-gray-100 shadow-xs">
          {/* Search bar */}
          <div className="relative w-80 sm:w-96">
            <input placeholder="Search lot ID, collector, item, facility..." className="w-full pl-9 pr-14 py-2 rounded-xl text-xs bg-gray-50 border border-gray-200/80 text-gray-800 placeholder:text-gray-400 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all" />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Icon name="search" size={14} color="currentColor" />
            </span>
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-gray-200/70 text-[10px] font-mono text-gray-500 border border-gray-300/50 pointer-events-none">
              <kbd className="font-sans">Ctrl</kbd> <kbd className="font-sans">K</kbd>
            </span>
          </div>

          {/* Right Tools & User Profile */}
          <div className="flex items-center gap-3">
            <button onClick={() => setView("notifications")} className="relative w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
              <Icon name="bell" size={16} color="currentColor" />
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full font-mono text-[9px] font-bold flex items-center justify-center bg-red-500 text-white shadow-xs">
                  {unread}
                </span>
              )}
            </button>

            {/* Profile pill with Dropdown */}
            <div className="relative">
              <div 
                onClick={() => setProfileMenuOpen(prev => !prev)} 
                className="flex items-center gap-2.5 pl-2 py-1 px-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors select-none"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  {facility?.adminName ? facility.adminName.slice(0, 2).toUpperCase() : user?.displayName ? user.displayName.slice(0, 2).toUpperCase() : "RK"}
                </div>
                <div className="text-left hidden sm:block max-w-[150px]">
                  <p className="text-xs font-bold text-gray-900 leading-tight truncate">
                    {facility?.adminName || user?.displayName || "Ravi Kumar"}
                  </p>
                  <p className="text-[10px] text-gray-500 leading-tight truncate">
                    {facility?.name ? facility.name.split(" - ")[0] : "Facility Staff"}
                  </p>
                </div>
                <span className="text-[10px] text-gray-400 hidden sm:inline">▼</span>
              </div>

              {/* Profile Dropdown Menu */}
              {profileMenuOpen && (
                <div 
                  className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-gray-100 shadow-xl p-2 z-50 animate-fadeIn"
                  onClick={() => setProfileMenuOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-gray-100 mb-1">
                    <p className="text-xs font-bold text-gray-900 truncate">
                      {facility?.adminName || user?.displayName || "Facility Staff"}
                    </p>
                    <p className="text-[11px] font-semibold text-emerald-700 truncate">
                      {facility?.name || "Authorized Facility"}
                    </p>
                    <p className="text-[10.5px] text-gray-400 truncate mt-0.5">
                      {user?.email || "facility@recycler.in"}
                    </p>
                  </div>
                  <button
                    onClick={() => setView("profile")}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Icon name="settings" size={14} color="#4b5563" />
                    <span>Profile & Settings</span>
                  </button>
                  <button
                    onClick={() => logout()}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-2 transition-colors cursor-pointer mt-0.5"
                  >
                    <svg className="w-3.5 h-3.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-6 py-5">
          {Object.entries(VIEW_MAP).map(([k, comp]) => (
            <div key={k} style={{ display: view === k ? "block" : "none" }} className="h-full">
              {comp}
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}

// ─── Root Export with Shared Auth Context ─────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <DashboardApp />
    </AuthProvider>
  );
}

