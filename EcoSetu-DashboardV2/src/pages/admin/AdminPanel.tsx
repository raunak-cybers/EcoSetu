import React, { useState, useMemo } from "react";
import { useAuth } from "../../hooks/useAuth";

// ─── TYPES ───────────────────────────────────────────────────────────────────
export type AdminTab = "overview" | "verification" | "flagged" | "directory";

export type RecyclerStatus = "pending" | "verified" | "rejected" | "suspended";

export interface RecyclerRecord {
  id: string;
  name: string;
  location: string;
  category: string;
  submittedDate: string;
  cpcbNumber: string;
  expiryDate: string;
  documentName: string;
  documentSize: string;
  status: RecyclerStatus;
  flagCount: number;
  adminName: string;
  phone: string;
  email: string;
}

export type FlagReason = "Below Market Price" | "Weight Variance" | "Marked Incorrect by Collector";
export type FlagStatus = "unreviewed" | "reviewed" | "resolved";

export interface FlaggedTransaction {
  id: string;
  collectorName: string;
  collectorPhone: string;
  recyclerName: string;
  recyclerPhone: string;
  material: string;
  flagReason: FlagReason;
  date: string;
  timestamp: string;
  estWeight: number;
  finalWeight: number;
  rate: number;
  marketRate?: number;
  estAmount: number;
  finalAmount: number;
  status: FlagStatus;
  gpsLocation: string;
  coordinates: string;
  notes: string;
  photoDescription: string;
}

// ─── INITIAL MOCK DATA ───────────────────────────────────────────────────────
const INITIAL_RECYCLERS: RecyclerRecord[] = [
  {
    id: "REC-MH-1092",
    name: "Apex Metal Refiners Pvt Ltd",
    location: "MIDC Taloja, Navi Mumbai, Maharashtra",
    category: "Non-Ferrous Metals (Copper & Brass)",
    submittedDate: "26 Sep 2026, 09:30 AM",
    cpcbNumber: "MPCB/RO/NM/2026/CTO-1029",
    expiryDate: "31 Mar 2028",
    documentName: "MPCB_Consent_To_Operate_Apex2026.pdf",
    documentSize: "2.4 MB",
    status: "pending",
    flagCount: 0,
    adminName: "Vikram Shah",
    phone: "+91 98220 19283",
    email: "vikram@apexrefiners.com",
  },
  {
    id: "REC-TN-4910",
    name: "Southern E-Waste Solutions",
    location: "Ambattur Industrial Estate, Chennai, Tamil Nadu",
    category: "E-Waste & Lithium Batteries",
    submittedDate: "25 Sep 2026, 03:15 PM",
    cpcbNumber: "TNPCB/EWM/2026/AUTH-441",
    expiryDate: "15 Jun 2027",
    documentName: "TNPCB_EWM_Authorization_Cert.pdf",
    documentSize: "3.1 MB",
    status: "pending",
    flagCount: 0,
    adminName: "K. Swaminathan",
    phone: "+91 94441 82739",
    email: "swami@southernewaste.in",
  },
  {
    id: "REC-KA-3012",
    name: "Bangalore Green Polymers",
    location: "Peenya Industrial Area, Bengaluru, Karnataka",
    category: "Rigid & Flexible Polymers (HDPE/PP)",
    submittedDate: "24 Sep 2026, 11:45 AM",
    cpcbNumber: "KSPCB/PL/2026/REG-908",
    expiryDate: "30 Sep 2027",
    documentName: "KSPCB_Plastic_Recycling_Registration.pdf",
    documentSize: "1.8 MB",
    status: "pending",
    flagCount: 0,
    adminName: "Ananya Hegde",
    phone: "+91 98801 39201",
    email: "ananya@bgp-recycling.com",
  },
  {
    id: "REC-MH-0442",
    name: "Metro Recycling Solutions",
    location: "MIDC Andheri East, Mumbai, Maharashtra",
    category: "E-Waste & Li-Ion Batteries",
    submittedDate: "12 Jan 2025",
    cpcbNumber: "CPCB-EWM-MH-04421",
    expiryDate: "31 Mar 2027",
    documentName: "CPCB_National_Consent_Metro.pdf",
    documentSize: "4.2 MB",
    status: "verified",
    flagCount: 2,
    adminName: "Ravi Kumar",
    phone: "+91 22 6812 4400",
    email: "admin@ecogreen-recyclers.in",
  },
  {
    id: "REC-DL-8821",
    name: "Northern Scrap Processors",
    location: "Okhla Industrial Area, New Delhi",
    category: "Metals & Industrial Scrap",
    submittedDate: "05 Mar 2025",
    cpcbNumber: "DPCC/WMC/2025/AUTH-771",
    expiryDate: "31 Dec 2026",
    documentName: "DPCC_Consent_NorthernScrap.pdf",
    documentSize: "2.1 MB",
    status: "verified",
    flagCount: 1,
    adminName: "Harpreet Singh",
    phone: "+91 98110 55421",
    email: "harpreet@northernscrap.in",
  },
  {
    id: "REC-GJ-5510",
    name: "Gujarat Polymer Recyclers",
    location: "GIDC Vatva, Ahmedabad, Gujarat",
    category: "Industrial Plastic Pellets",
    submittedDate: "18 Jun 2025",
    cpcbNumber: "GPCB/PWM/2025/CTO-339",
    expiryDate: "30 Apr 2028",
    documentName: "GPCB_Plastic_Pellet_CTO.pdf",
    documentSize: "3.5 MB",
    status: "verified",
    flagCount: 0,
    adminName: "Bhavesh Patel",
    phone: "+91 98250 88190",
    email: "bhavesh@gujaratpolymers.com",
  },
  {
    id: "REC-WB-2201",
    name: "Bengal Green Eco-Hub",
    location: "Howrah Industrial Belt, Kolkata, West Bengal",
    category: "Batteries & Lead Acid Recovery",
    submittedDate: "02 Feb 2025",
    cpcbNumber: "WBPCB/BWM/2025/REG-110",
    expiryDate: "15 Oct 2026",
    documentName: "WBPCB_Battery_Recycling_Auth.pdf",
    documentSize: "2.9 MB",
    status: "suspended",
    flagCount: 5,
    adminName: "Subhashis Roy",
    phone: "+91 98300 44210",
    email: "subhashis@bengalgreen.in",
  },
  {
    id: "REC-UP-9104",
    name: "Yamuna Metal Smelters",
    location: "UPSIDC Industrial Zone, Ghaziabad, Uttar Pradesh",
    category: "Heavy Metal Scrap",
    submittedDate: "10 Aug 2026",
    cpcbNumber: "UPPCB/IND/2026/REJ-09",
    expiryDate: "Expired 2025",
    documentName: "UPPCB_Invalid_Submission.pdf",
    documentSize: "1.1 MB",
    status: "rejected",
    flagCount: 0,
    adminName: "Manoj Tripathi",
    phone: "+91 98910 11290",
    email: "manoj@yamunasmelt.in",
  },
];

const INITIAL_FLAGGED_TRANSACTIONS: FlaggedTransaction[] = [
  {
    id: "TXN-FLG-8821",
    collectorName: "Ramesh Pawar",
    collectorPhone: "+91 98201 55410",
    recyclerName: "Metro Recycling Solutions",
    recyclerPhone: "+91 22 6812 4400",
    material: "Copper Scrap (Grade A Clean Wire)",
    flagReason: "Weight Variance",
    date: "26 Sep 2026",
    timestamp: "26 Sep 2026, 11:20 AM",
    estWeight: 150,
    finalWeight: 114,
    rate: 420,
    estAmount: 63000,
    finalAmount: 47880,
    status: "unreviewed",
    gpsLocation: "MIDC Andheri Gate 4, Mumbai, MH",
    coordinates: "19.1136° N, 72.8697° E",
    notes: "Variance of -24.0% detected at weighbridge. Collector claimed full wire bundles; recycler deducted for plastic core insulation.",
    photoDescription: "High-resolution weighbridge load cell photo showing unstripped copper wire coils in blue crates.",
  },
  {
    id: "TXN-FLG-7940",
    collectorName: "Savitri Devi",
    collectorPhone: "+91 98190 22314",
    recyclerName: "Northern Scrap Processors",
    recyclerPhone: "+91 98110 55421",
    material: "Rigid HDPE Plastic Crates",
    flagReason: "Below Market Price",
    date: "25 Sep 2026",
    timestamp: "25 Sep 2026, 04:45 PM",
    estWeight: 320,
    finalWeight: 320,
    rate: 18,
    marketRate: 28,
    estAmount: 5760,
    finalAmount: 5760,
    status: "unreviewed",
    gpsLocation: "Okhla Phase II Yard, New Delhi",
    coordinates: "28.5355° N, 77.2732° E",
    notes: "Payout rate ₹18/kg is 35.7% below the CPCB minimum benchmark rate (₹28/kg) for clean sorted HDPE.",
    photoDescription: "Baled blue and red HDPE beverage crates on delivery flatbed.",
  },
  {
    id: "TXN-FLG-6512",
    collectorName: "Kishore Kumar",
    collectorPhone: "+91 94440 33819",
    recyclerName: "Bengal Green Eco-Hub",
    recyclerPhone: "+91 98300 44210",
    material: "Lead-Acid Inverter Batteries",
    flagReason: "Marked Incorrect by Collector",
    date: "25 Sep 2026",
    timestamp: "25 Sep 2026, 01:10 PM",
    estWeight: 280,
    finalWeight: 210,
    rate: 90,
    estAmount: 25200,
    finalAmount: 18900,
    status: "unreviewed",
    gpsLocation: "Howrah Scrap Depot, Kolkata, WB",
    coordinates: "22.5958° N, 88.2636° E",
    notes: "Collector disputed ₹6,300 deduction; reported facility staff altered scale tare weight without showing digital display.",
    photoDescription: "Four heavy commercial lead-acid batteries with serial tags visible on inspection floor.",
  },
  {
    id: "TXN-FLG-5109",
    collectorName: "Mohd. Salim",
    collectorPhone: "+91 98211 77012",
    recyclerName: "Metro Recycling Solutions",
    recyclerPhone: "+91 22 6812 4400",
    material: "Telecom PCB Motherboards",
    flagReason: "Weight Variance",
    date: "24 Sep 2026",
    timestamp: "24 Sep 2026, 02:30 PM",
    estWeight: 95,
    finalWeight: 78,
    rate: 140,
    estAmount: 13300,
    finalAmount: 10920,
    status: "reviewed",
    gpsLocation: "MIDC Andheri Yard 2, Mumbai, MH",
    coordinates: "19.1140° N, 72.8702° E",
    notes: "17.9% moisture & aluminium frame deduction. Recycler submitted tare photos and calibration certificate.",
    photoDescription: "De-populated motherboard lot with disassembled heat sinks.",
  },
  {
    id: "TXN-FLG-4402",
    collectorName: "Sunil Gokhale",
    collectorPhone: "+91 98690 12044",
    recyclerName: "Gujarat Polymer Recyclers",
    recyclerPhone: "+91 98250 88190",
    material: "PP Flexible Bags & Sacks",
    flagReason: "Below Market Price",
    date: "22 Sep 2026",
    timestamp: "22 Sep 2026, 10:15 AM",
    estWeight: 450,
    finalWeight: 450,
    rate: 14,
    marketRate: 20,
    estAmount: 6300,
    finalAmount: 6300,
    status: "resolved",
    gpsLocation: "GIDC Vatva Phase IV, Ahmedabad, GJ",
    coordinates: "22.9568° N, 72.6369° E",
    notes: "Resolved: Price adjustment credited. Recycler reimbursed ₹2,700 difference to collector wallet directly.",
    photoDescription: "Compressed PP woven sack bales loaded into shredder intake bay.",
  },
];

export default function AdminPanel() {
  const { logout, user } = useAuth();

  // Active Tab
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");

  // Search filter (topbar)
  const [searchQuery, setSearchQuery] = useState("");

  // Recyclers State
  const [recyclers, setRecyclers] = useState<RecyclerRecord[]>(INITIAL_RECYCLERS);

  // Flagged Transactions State
  const [flaggedTransactions, setFlaggedTransactions] = useState<FlaggedTransaction[]>(INITIAL_FLAGGED_TRANSACTIONS);

  // Directory Filter
  const [directoryStatusFilter, setDirectoryStatusFilter] = useState<string>("all");

  // Selected Transaction for Detail Drawer
  const [selectedFlaggedTxn, setSelectedFlaggedTxn] = useState<FlaggedTransaction | null>(null);

  // Selected Document for Preview Modal
  const [selectedDocPreview, setSelectedDocPreview] = useState<{ name: string; size: string; cpcb: string; recycler: string } | null>(null);

  // Verification Confirm Action Modals
  const [confirmApproveId, setConfirmApproveId] = useState<string | null>(null);
  const [confirmRejectId, setConfirmRejectId] = useState<string | null>(null);

  // Directory Impact Action Modals (Suspend / Revoke)
  const [confirmSuspendId, setConfirmSuspendId] = useState<string | null>(null);
  const [confirmRevokeId, setConfirmRevokeId] = useState<string | null>(null);

  // Notifications State
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // ─── DERIVED METRICS ────────────────────────────────────────────────────────
  const pendingRecyclers = useMemo(() => recyclers.filter((r) => r.status === "pending"), [recyclers]);
  const verifiedRecyclersCount = useMemo(() => recyclers.filter((r) => r.status === "verified").length + 42, [recyclers]); // 48 total verified
  const unreviewedFlagsCount = useMemo(() => flaggedTransactions.filter((f) => f.status === "unreviewed").length, [flaggedTransactions]);

  // Filtered Directory
  const filteredDirectory = useMemo(() => {
    return recyclers.filter((r) => {
      const matchesFilter = directoryStatusFilter === "all" || r.status === directoryStatusFilter;
      const matchesSearch =
        searchQuery === "" ||
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.cpcbNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [recyclers, directoryStatusFilter, searchQuery]);

  // Filtered Verification Queue
  const filteredVerificationQueue = useMemo(() => {
    return pendingRecyclers.filter((r) => {
      if (!searchQuery) return true;
      return (
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.cpcbNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [pendingRecyclers, searchQuery]);

  // Filtered Flagged Transactions
  const filteredFlagged = useMemo(() => {
    return flaggedTransactions.filter((f) => {
      if (!searchQuery) return true;
      return (
        f.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.collectorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.recyclerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.material.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.flagReason.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [flaggedTransactions, searchQuery]);

  // ─── HANDLERS ───────────────────────────────────────────────────────────────
  const handleApproveRecycler = (id: string) => {
    setRecyclers((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "verified" as const } : r))
    );
    setConfirmApproveId(null);
  };

  const handleRejectRecycler = (id: string) => {
    setRecyclers((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "rejected" as const } : r))
    );
    setConfirmRejectId(null);
  };

  const handleSuspendRecycler = (id: string) => {
    setRecyclers((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "suspended" as const } : r))
    );
    setConfirmSuspendId(null);
  };

  const handleRevokeRecycler = (id: string) => {
    setRecyclers((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "rejected" as const } : r))
    );
    setConfirmRevokeId(null);
  };

  const handleUpdateFlagStatus = (id: string, newStatus: FlagStatus) => {
    setFlaggedTransactions((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: newStatus } : f))
    );
    if (selectedFlaggedTxn && selectedFlaggedTxn.id === id) {
      setSelectedFlaggedTxn((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f8f7f4] font-sans text-gray-900 antialiased selection:bg-[#133e29] selection:text-white">
      
      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 1. SIDEBAR (Flat, 4 items only, Dark Forest Green)                      */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <aside className="w-[240px] flex-shrink-0 flex flex-col justify-between bg-[#061d12] border-r border-[#133322] text-white select-none">
        <div>
          {/* Top Branding */}
          <div className="p-4 border-b border-[#133322]">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                  <line x1="2" y1="22" x2="11" y2="13" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black tracking-wider text-white">KABADIWALA</p>
                <p className="text-[8px] font-semibold tracking-[0.2em] text-emerald-400">CONNECT • RECYCLE • REUSE</p>
              </div>
            </div>

            {/* Rounded Admin Badge with Shield Icon */}
            <div className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#0e2c1c] border border-emerald-500/40 text-[11px] text-emerald-300 font-medium w-full">
              <svg className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              <span className="truncate">Admin Panel · Platform Oversight</span>
            </div>
          </div>

          {/* Flat Navigation: 4 Items Only */}
          <nav className="p-3 space-y-1.5">
            {/* Nav 1: Overview */}
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "overview"
                  ? "bg-[#143d26] text-white border border-emerald-500/50 shadow-xs"
                  : "text-emerald-100/70 hover:text-white hover:bg-[#0c2618]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                <span>Overview</span>
              </div>
            </button>

            {/* Nav 2: Recycler Verification (with pending badge) */}
            <button
              type="button"
              onClick={() => setActiveTab("verification")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "verification"
                  ? "bg-[#143d26] text-white border border-emerald-500/50 shadow-xs"
                  : "text-emerald-100/70 hover:text-white hover:bg-[#0c2618]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <path d="m9 15 2 2 4-4" />
                </svg>
                <span className="truncate">Recycler Verification</span>
              </div>
              {pendingRecyclers.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-emerald-500 text-white font-mono text-[10px] font-bold">
                  {pendingRecyclers.length}
                </span>
              )}
            </button>

            {/* Nav 3: Flagged Transactions (with open count badge, amber/red) */}
            <button
              type="button"
              onClick={() => setActiveTab("flagged")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "flagged"
                  ? "bg-[#143d26] text-white border border-emerald-500/50 shadow-xs"
                  : "text-emerald-100/70 hover:text-white hover:bg-[#0c2618]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <span className="truncate">Flagged Transactions</span>
              </div>
              {unreviewedFlagsCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-black font-mono text-[10px] font-black animate-pulse">
                  {unreviewedFlagsCount}
                </span>
              )}
            </button>

            {/* Nav 4: Recycler Directory */}
            <button
              type="button"
              onClick={() => setActiveTab("directory")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "directory"
                  ? "bg-[#143d26] text-white border border-emerald-500/50 shadow-xs"
                  : "text-emerald-100/70 hover:text-white hover:bg-[#0c2618]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
                  <path d="M9 22v-4h6v4" />
                  <path d="M8 6h.01" />
                  <path d="M16 6h.01" />
                  <path d="M12 6h.01" />
                  <path d="M12 10h.01" />
                  <path d="M12 14h.01" />
                  <path d="M16 10h.01" />
                  <path d="M16 14h.01" />
                  <path d="M8 10h.01" />
                  <path d="M8 14h.01" />
                </svg>
                <span>Recycler Directory</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3.5 border-t border-[#133322]">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] text-emerald-300 font-medium">Network Guard Live</span>
            </div>
            <button
              type="button"
              onClick={() => logout()}
              title="Sign Out"
              className="text-xs text-red-400 hover:text-red-300 font-semibold cursor-pointer"
            >
              Log Out
            </button>
          </div>
        </div>
      </aside>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 2. MAIN CONTENT AREA + SHARED HEADER                                   */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Shared Top Header */}
        <header className="h-14 bg-white border-b border-[#e7e2d9] px-6 flex items-center justify-between flex-shrink-0 shadow-2xs z-10">
          {/* Search Bar */}
          <div className="relative w-80 sm:w-96">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recyclers, CPCB IDs, transactions, materials..."
              className="w-full pl-9 pr-4 py-1.5 bg-[#faf9f6] border border-[#e2ddd5] rounded-xl text-xs text-gray-900 placeholder:text-gray-400 outline-none focus:bg-white focus:border-[#133e29] focus:ring-1 focus:ring-[#133e29] transition-all"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="11" cy="11" r="8" strokeWidth="2" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold"
              >
                ×
              </button>
            )}
          </div>

          {/* Right Header: Notification Bell & Admin Avatar */}
          <div className="flex items-center gap-3">
            {/* Bell Icon */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="w-8 h-8 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center justify-center cursor-pointer transition-colors relative"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                </svg>
                {unreviewedFlagsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-black font-mono text-[9px] font-black flex items-center justify-center">
                    {unreviewedFlagsCount}
                  </span>
                )}
              </button>

              {/* Quick Notifications Popover */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl border border-gray-200 shadow-xl p-3 z-50 animate-fadeIn text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100 mb-2">
                    <span className="font-bold text-gray-900">Admin Alerts</span>
                    <span className="text-[10px] text-gray-400">{unreviewedFlagsCount} unreviewed</span>
                  </div>
                  <div className="space-y-2">
                    {flaggedTransactions.slice(0, 3).map((f) => (
                      <div
                        key={f.id}
                        onClick={() => {
                          setSelectedFlaggedTxn(f);
                          setNotificationsOpen(false);
                          setActiveTab("flagged");
                        }}
                        className="p-2 rounded-lg bg-[#faf9f6] hover:bg-[#f4f2ee] cursor-pointer transition-colors"
                      >
                        <p className="font-semibold text-gray-800 truncate">{f.id} · {f.flagReason}</p>
                        <p className="text-[10px] text-gray-500">{f.recyclerName} · {f.material}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Admin Avatar & Role */}
            <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full bg-[#133e29] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                AD
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-gray-900 leading-tight">Super Admin</p>
                <p className="text-[10px] text-emerald-800 font-semibold leading-tight">Platform Oversight</p>
              </div>
            </div>
          </div>
        </header>

        {/* ────────────────────────────────────────────────────────────────── */}
        {/* 3. PAGE BODY ROUTING                                              */}
        {/* ────────────────────────────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto p-6">

          {/* ════════════════════════════════════════════════════════════════ */}
          {/* PAGE 1: OVERVIEW                                                 */}
          {/* ════════════════════════════════════════════════════════════════ */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Header Title */}
              <div>
                <h1 className="text-2xl font-black tracking-tight text-gray-900">
                  Platform Overview
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  Platform-wide oversight and verification metrics across the KabadiwalaConnect network.
                </p>
              </div>

              {/* 4 Stat Cards in a Row (Matching existing style: white, rounded, icon in light square, bold number, muted label) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Card 1: Total Registered Collectors */}
                <div className="bg-white rounded-[12px] p-5 border border-[#e7e2d9] shadow-2xs flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                        Total Registered Collectors
                      </p>
                      <p className="text-2xl font-black text-gray-900 mt-2 font-mono">
                        1,284
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-700 flex-shrink-0">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-4 pt-3 border-t border-gray-100">
                    Active across 18 urban clusters
                  </p>
                </div>

                {/* Card 2: Total Verified Recyclers */}
                <div 
                  onClick={() => setActiveTab("directory")}
                  className="bg-white rounded-[12px] p-5 border border-[#e7e2d9] shadow-2xs flex flex-col justify-between hover:border-emerald-500/50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                        Total Verified Recyclers
                      </p>
                      <p className="text-2xl font-black text-gray-900 mt-2 font-mono">
                        {verifiedRecyclersCount}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-700 flex-shrink-0">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        <path d="m9 12 2 2 4-4" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                    <span>Authorized CPCB/SPCB units</span>
                    <span className="text-emerald-800 font-bold">View Directory →</span>
                  </p>
                </div>

                {/* Card 3: Total Transactions Completed */}
                <div className="bg-white rounded-[12px] p-5 border border-[#e7e2d9] shadow-2xs flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                        Total Transactions Completed
                      </p>
                      <p className="text-2xl font-black text-gray-900 mt-2 font-mono">
                        14,920
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200/60 flex items-center justify-center text-purple-700 flex-shrink-0">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 3v12" />
                        <path d="M18 9v12" />
                        <path d="m3 6 3-3 3 3" />
                        <path d="m15 18 3 3 3-3" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-4 pt-3 border-t border-gray-100">
                    Verified digital settlements
                  </p>
                </div>

                {/* Card 4: Total ₹ Value Transacted */}
                <div className="bg-white rounded-[12px] p-5 border border-[#e7e2d9] shadow-2xs flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                        Total ₹ Value Transacted
                      </p>
                      <p className="text-2xl font-black text-gray-900 mt-2 font-mono">
                        ₹ 4.82 Cr
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-700 flex-shrink-0">
                      <span className="font-bold text-base">₹</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-4 pt-3 border-t border-gray-100">
                    Direct collector payouts & EPR value
                  </p>
                </div>
              </div>

              {/* Trust Action Quick Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
                
                {/* Pending Verification Banner */}
                <div className="bg-white rounded-[12px] p-5 border border-[#e7e2d9] shadow-2xs flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 flex-shrink-0 font-bold text-lg font-mono">
                      {pendingRecyclers.length}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">Recycler Applications Awaiting Verification</h3>
                      <p className="text-xs text-gray-500 mt-0.5">New facility licenses require CPCB/SPCB consent review.</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab("verification")}
                    className="px-3.5 py-2 rounded-lg bg-[#133e29] hover:bg-[#0f3221] text-white text-xs font-semibold shadow-xs cursor-pointer"
                  >
                    Open Queue
                  </button>
                </div>

                {/* Flagged Transactions Banner */}
                <div className="bg-white rounded-[12px] p-5 border border-[#e7e2d9] shadow-2xs flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 flex-shrink-0 font-bold text-lg font-mono">
                      {unreviewedFlagsCount}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">Flagged Transactions Need Investigation</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Weight variance and below-market price anomalies detected.</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab("flagged")}
                    className="px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
                  >
                    Review Flags
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════ */}
          {/* PAGE 2: RECYCLER VERIFICATION QUEUE                              */}
          {/* ════════════════════════════════════════════════════════════════ */}
          {activeTab === "verification" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-gray-900">
                    Recycler Verification Queue
                  </h1>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Pending facility onboarding applications requiring license validation and authorization.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  {pendingRecyclers.length} Pending Approval
                </span>
              </div>

              {/* Data Table */}
              <div className="bg-white rounded-[12px] border border-[#e7e2d9] shadow-2xs overflow-hidden">
                {filteredVerificationQueue.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                    </div>
                    <p className="text-sm font-bold text-gray-800">Queue is Clear</p>
                    <p className="text-xs text-gray-400 mt-1">No unverified or pending recycler applications at this time.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#faf9f6] border-b border-[#e7e2d9] text-[10.5px] font-bold text-gray-500 uppercase tracking-wider">
                          <th className="px-4 py-3.5">Recycler Name</th>
                          <th className="px-4 py-3.5">Location</th>
                          <th className="px-4 py-3.5">Submitted Date</th>
                          <th className="px-4 py-3.5">Document(s)</th>
                          <th className="px-4 py-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredVerificationQueue.map((rec) => (
                          <tr key={rec.id} className="hover:bg-[#faf9f6]/70 transition-colors">
                            <td className="px-4 py-3.5">
                              <p className="font-bold text-gray-900 text-sm">{rec.name}</p>
                              <p className="text-[11px] text-emerald-800 font-medium">{rec.category}</p>
                              <p className="font-mono text-[10px] text-gray-400 mt-0.5">{rec.id}</p>
                            </td>
                            <td className="px-4 py-3.5 text-gray-600 max-w-xs">
                              {rec.location}
                            </td>
                            <td className="px-4 py-3.5 text-gray-600 font-medium">
                              {rec.submittedDate}
                            </td>
                            <td className="px-4 py-3.5">
                              <button
                                type="button"
                                onClick={() => setSelectedDocPreview({
                                  name: rec.documentName,
                                  size: rec.documentSize,
                                  cpcb: rec.cpcbNumber,
                                  recycler: rec.name,
                                })}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#faf9f6] hover:bg-emerald-50 border border-[#e2ddd5] hover:border-emerald-300 text-emerald-900 font-semibold transition-colors cursor-pointer"
                              >
                                <svg className="w-3.5 h-3.5 text-emerald-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                  <polyline points="14 2 14 8 20 8" />
                                  <line x1="16" y1="13" x2="8" y2="13" />
                                  <line x1="16" y1="17" x2="8" y2="17" />
                                </svg>
                                <span>View Documents</span>
                              </button>
                            </td>
                            <td className="px-4 py-3.5 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => setConfirmApproveId(rec.id)}
                                  className="px-3 py-1.5 rounded-lg bg-[#133e29] hover:bg-[#0f3221] text-white font-semibold text-xs shadow-xs cursor-pointer transition-colors"
                                >
                                  Approve
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmRejectId(rec.id)}
                                  className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-xs border border-red-200 cursor-pointer transition-colors"
                                >
                                  Reject
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════ */}
          {/* PAGE 3: FLAGGED TRANSACTIONS                                     */}
          {/* ════════════════════════════════════════════════════════════════ */}
          {activeTab === "flagged" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-gray-900">
                    Flagged Transactions
                  </h1>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Transactions auto-flagged by system triggers for price undercutting, weight mismatch, or collector dispute.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
                    {unreviewedFlagsCount} Unreviewed
                  </span>
                </div>
              </div>

              {/* Flagged Transactions Table */}
              <div className="bg-white rounded-[12px] border border-[#e7e2d9] shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#faf9f6] border-b border-[#e7e2d9] text-[10.5px] font-bold text-gray-500 uppercase tracking-wider">
                        <th className="px-4 py-3.5">Transaction ID</th>
                        <th className="px-4 py-3.5">Collector</th>
                        <th className="px-4 py-3.5">Recycler</th>
                        <th className="px-4 py-3.5">Material</th>
                        <th className="px-4 py-3.5">Flag Reason</th>
                        <th className="px-4 py-3.5">Date</th>
                        <th className="px-4 py-3.5 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredFlagged.map((txn) => {
                        // Tag styling
                        let tagStyle = "bg-gray-100 text-gray-700 border-gray-200";
                        if (txn.flagReason === "Below Market Price") tagStyle = "bg-amber-50 text-amber-800 border-amber-200";
                        if (txn.flagReason === "Weight Variance") tagStyle = "bg-red-50 text-red-800 border-red-200";
                        if (txn.flagReason === "Marked Incorrect by Collector") tagStyle = "bg-purple-50 text-purple-800 border-purple-200";

                        return (
                          <tr
                            key={txn.id}
                            onClick={() => setSelectedFlaggedTxn(txn)}
                            className="hover:bg-emerald-50/30 transition-colors cursor-pointer"
                          >
                            <td className="px-4 py-3.5 font-mono font-bold text-gray-900">
                              {txn.id}
                            </td>
                            <td className="px-4 py-3.5 font-medium text-gray-800">
                              {txn.collectorName}
                            </td>
                            <td className="px-4 py-3.5 text-gray-700 font-medium">
                              {txn.recyclerName}
                            </td>
                            <td className="px-4 py-3.5 text-gray-600">
                              {txn.material}
                            </td>
                            <td className="px-4 py-3.5">
                              <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold border ${tagStyle}`}>
                                {txn.flagReason}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-gray-500 font-mono text-[11px]">
                              {txn.date}
                            </td>
                            <td className="px-4 py-3.5 text-right">
                              {txn.status === "unreviewed" && (
                                <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 font-bold text-[10px]">
                                  Unreviewed
                                </span>
                              )}
                              {txn.status === "reviewed" && (
                                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                                  Reviewed
                                </span>
                              )}
                              {txn.status === "resolved" && (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                                  Resolved
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════ */}
          {/* PAGE 4: RECYCLER DIRECTORY                                       */}
          {/* ════════════════════════════════════════════════════════════════ */}
          {activeTab === "directory" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-gray-900">
                    Recycler Directory
                  </h1>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Complete registry of authorized, pending, and suspended recycling facilities on KabadiwalaConnect.
                  </p>
                </div>

                {/* Status Filter Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-500">Filter by Status:</span>
                  <select
                    value={directoryStatusFilter}
                    onChange={(e) => setDirectoryStatusFilter(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-[#e2ddd5] rounded-xl text-xs font-semibold text-gray-800 outline-none focus:border-[#133e29] cursor-pointer"
                  >
                    <option value="all">All Statuses ({recyclers.length})</option>
                    <option value="verified">Verified Only ({recyclers.filter(r => r.status === "verified").length})</option>
                    <option value="pending">Pending Only ({recyclers.filter(r => r.status === "pending").length})</option>
                    <option value="suspended">Suspended ({recyclers.filter(r => r.status === "suspended").length})</option>
                    <option value="rejected">Rejected ({recyclers.filter(r => r.status === "rejected").length})</option>
                  </select>
                </div>
              </div>

              {/* Full Directory Table */}
              <div className="bg-white rounded-[12px] border border-[#e7e2d9] shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#faf9f6] border-b border-[#e7e2d9] text-[10.5px] font-bold text-gray-500 uppercase tracking-wider">
                        <th className="px-4 py-3.5">Name & ID</th>
                        <th className="px-4 py-3.5">Location</th>
                        <th className="px-4 py-3.5">Verification Status</th>
                        <th className="px-4 py-3.5">Authorization Expiry</th>
                        <th className="px-4 py-3.5 text-center">Flag Count</th>
                        <th className="px-4 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredDirectory.map((rec) => (
                        <tr key={rec.id} className="hover:bg-[#faf9f6]/70 transition-colors">
                          <td className="px-4 py-3.5">
                            <p className="font-bold text-gray-900">{rec.name}</p>
                            <p className="font-mono text-[10px] text-gray-400">{rec.cpcbNumber}</p>
                          </td>
                          <td className="px-4 py-3.5 text-gray-600 max-w-xs">
                            {rec.location}
                          </td>
                          <td className="px-4 py-3.5">
                            {rec.status === "verified" && (
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-[10.5px] inline-flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                Verified
                              </span>
                            )}
                            {rec.status === "pending" && (
                              <span className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-bold text-[10.5px] inline-flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                Pending
                              </span>
                            )}
                            {rec.status === "suspended" && (
                              <span className="px-2.5 py-0.5 rounded-full bg-red-50 border border-red-200 text-red-800 font-bold text-[10.5px] inline-flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                Suspended
                              </span>
                            )}
                            {rec.status === "rejected" && (
                              <span className="px-2.5 py-0.5 rounded-full bg-gray-100 border border-gray-300 text-gray-700 font-bold text-[10.5px]">
                                Rejected
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3.5 font-mono text-gray-700 font-medium">
                            {rec.expiryDate}
                          </td>
                          <td className="px-4 py-3.5 text-center font-mono">
                            {rec.flagCount > 0 ? (
                              <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-700 font-bold text-xs">
                                {rec.flagCount}
                              </span>
                            ) : (
                              <span className="text-gray-400">0</span>
                            )}
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            {rec.status === "verified" && (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setConfirmSuspendId(rec.id)}
                                  className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-xs border border-red-200 cursor-pointer transition-colors"
                                >
                                  Suspend
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmRevokeId(rec.id)}
                                  className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs cursor-pointer transition-colors shadow-2xs"
                                >
                                  Revoke Verification
                                </button>
                              </div>
                            )}
                            {rec.status === "suspended" && (
                              <button
                                type="button"
                                onClick={() => handleApproveRecycler(rec.id)}
                                className="px-3 py-1 rounded-lg bg-[#133e29] hover:bg-[#0f3221] text-white font-semibold text-xs cursor-pointer"
                              >
                                Re-instate
                              </button>
                            )}
                            {rec.status === "pending" && (
                              <button
                                type="button"
                                onClick={() => setActiveTab("verification")}
                                className="text-xs text-[#133e29] font-bold hover:underline cursor-pointer"
                              >
                                Go to Queue →
                              </button>
                            )}
                            {rec.status === "rejected" && (
                              <span className="text-[11px] text-gray-400 italic">No actions available</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 4. MODALS & DETAIL DRAWERS                                             */}
      {/* ────────────────────────────────────────────────────────────────────── */}

      {/* ── Detail Drawer for Flagged Transaction ── */}
      {selectedFlaggedTxn && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-2xs animate-fadeIn">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-slideLeft">
            <div>
              {/* Drawer Top */}
              <div className="p-5 border-b border-gray-100 flex items-start justify-between bg-[#faf9f6]">
                <div>
                  <span className="font-mono text-xs font-bold text-amber-700 uppercase tracking-wider">
                    {selectedFlaggedTxn.id}
                  </span>
                  <h2 className="text-lg font-black text-gray-900 mt-0.5">
                    Flagged Transaction Audit
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedFlaggedTxn(null)}
                  className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 flex items-center justify-center font-bold cursor-pointer"
                >
                  ×
                </button>
              </div>

              {/* Drawer Content */}
              <div className="p-5 space-y-4 text-xs">
                {/* Trigger Banner */}
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80">
                  <p className="font-bold text-amber-900 text-xs flex items-center gap-1.5">
                    <span>⚠️ Trigger Reason:</span>
                    <span>{selectedFlaggedTxn.flagReason}</span>
                  </p>
                  <p className="text-amber-800/90 mt-1 leading-relaxed">
                    {selectedFlaggedTxn.notes}
                  </p>
                </div>

                {/* Scrap / Lot Inspection Photo Thumbnail */}
                <div>
                  <p className="font-bold text-gray-800 mb-1.5">Lot Inspection Evidence</p>
                  <div className="h-36 rounded-xl bg-gray-100 border border-gray-200 flex flex-col items-center justify-center p-4 text-center">
                    <svg className="w-8 h-8 text-gray-400 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                      <circle cx="9" cy="9" r="2" />
                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                    </svg>
                    <p className="text-[11px] font-semibold text-gray-700">{selectedFlaggedTxn.photoDescription}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Automated Optical Capture · Weighbridge Cam #02</p>
                  </div>
                </div>

                {/* Weight / Value Breakdown */}
                <div className="p-3.5 bg-[#faf9f6] rounded-xl border border-[#e7e2d9] space-y-2">
                  <p className="font-bold text-gray-900">Estimated vs. Final Figures</p>
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div className="p-2 bg-white rounded-lg border border-gray-100">
                      <p className="text-gray-400 text-[10px] uppercase font-semibold">Claimed / Est.</p>
                      <p className="font-mono font-bold text-gray-900 mt-0.5">{selectedFlaggedTxn.estWeight} kg</p>
                      <p className="font-mono text-gray-500">₹{selectedFlaggedTxn.estAmount.toLocaleString("en-IN")}</p>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-gray-100">
                      <p className="text-gray-400 text-[10px] uppercase font-semibold">Verified / Settled</p>
                      <p className="font-mono font-bold text-gray-900 mt-0.5">{selectedFlaggedTxn.finalWeight} kg</p>
                      <p className="font-mono text-gray-500">₹{selectedFlaggedTxn.finalAmount.toLocaleString("en-IN")}</p>
                    </div>
                  </div>
                </div>

                {/* GPS Location & Timestamp */}
                <div className="p-3.5 bg-[#faf9f6] rounded-xl border border-[#e7e2d9] space-y-1.5">
                  <p className="font-bold text-gray-900">Geo-Verification & Timestamp</p>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Facility Location:</span>
                    <span className="font-medium text-gray-900">{selectedFlaggedTxn.gpsLocation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">GPS Coordinates:</span>
                    <span className="font-mono font-medium text-gray-900">{selectedFlaggedTxn.coordinates}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Time of Log:</span>
                    <span className="font-medium text-gray-900">{selectedFlaggedTxn.timestamp}</span>
                  </div>
                </div>

                {/* Both Parties' Contact Info */}
                <div className="p-3.5 bg-[#faf9f6] rounded-xl border border-[#e7e2d9] space-y-2">
                  <p className="font-bold text-gray-900">Parties Involved</p>
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Collector:</span>
                      <span className="font-semibold text-gray-900">{selectedFlaggedTxn.collectorName} ({selectedFlaggedTxn.collectorPhone})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Recycler Facility:</span>
                      <span className="font-semibold text-gray-900">{selectedFlaggedTxn.recyclerName} ({selectedFlaggedTxn.recyclerPhone})</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Action Buttons */}
            <div className="p-4 border-t border-gray-100 bg-[#faf9f6] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedFlaggedTxn(null)}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-200 cursor-pointer"
              >
                Close
              </button>
              {selectedFlaggedTxn.status === "unreviewed" && (
                <button
                  type="button"
                  onClick={() => handleUpdateFlagStatus(selectedFlaggedTxn.id, "reviewed")}
                  className="px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
                >
                  Mark Reviewed
                </button>
              )}
              {selectedFlaggedTxn.status !== "resolved" && (
                <button
                  type="button"
                  onClick={() => handleUpdateFlagStatus(selectedFlaggedTxn.id, "resolved")}
                  className="px-3.5 py-2 rounded-lg bg-[#133e29] hover:bg-[#0f3221] text-white text-xs font-semibold shadow-xs cursor-pointer"
                >
                  Mark Resolved
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Document Preview Modal ── */}
      {selectedDocPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                  PDF
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">{selectedDocPreview.recycler}</h3>
                  <p className="text-[11px] text-gray-400">{selectedDocPreview.cpcb}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDocPreview(null)}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center font-bold cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="p-4 bg-[#faf9f6] rounded-xl border border-[#e7e2d9] space-y-2 text-xs">
              <p className="font-bold text-gray-800">{selectedDocPreview.name}</p>
              <p className="text-gray-500">File Size: {selectedDocPreview.size} · Digitally Certified</p>
              <div className="pt-2 border-t border-gray-200 flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px]">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>CPCB / SPCB Digital Watermark Valid</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedDocPreview(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#133e29] text-white hover:bg-[#0f3221] cursor-pointer"
              >
                Done Inspecting
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Confirmation Modal: Approve Recycler ── */}
      {confirmApproveId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Authorize Recycler Facility?</h3>
              <p className="text-xs text-gray-500 mt-1">
                This will activate their verified badge network-wide and grant intake authorization.
              </p>
            </div>
            <div className="flex justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmApproveId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleApproveRecycler(confirmApproveId)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#133e29] hover:bg-[#0f3221] text-white cursor-pointer shadow-xs"
              >
                Confirm & Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Confirmation Modal: Reject Recycler ── */}
      {confirmRejectId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Reject Application?</h3>
              <p className="text-xs text-gray-500 mt-1">
                The facility will be marked as rejected and removed from the verification queue.
              </p>
            </div>
            <div className="flex justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmRejectId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleRejectRecycler(confirmRejectId)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-700 text-white cursor-pointer shadow-xs"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Confirmation Modal: Suspend Recycler ── */}
      {confirmSuspendId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Suspend Recycler Facility?</h3>
              <p className="text-xs text-gray-500 mt-1">
                This will immediately disable intake of scrap lots from informal collectors at this facility.
              </p>
            </div>
            <div className="flex justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmSuspendId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSuspendRecycler(confirmSuspendId)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white cursor-pointer shadow-xs"
              >
                Confirm Suspension
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Confirmation Modal: Revoke Verification ── */}
      {confirmRevokeId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-700 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Revoke CPCB Authorization?</h3>
              <p className="text-xs text-gray-500 mt-1">
                High impact action: This completely revokes the facility's certified status and removes them from the verified network.
              </p>
            </div>
            <div className="flex justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmRevokeId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleRevokeRecycler(confirmRevokeId)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-700 text-white cursor-pointer shadow-xs"
              >
                Confirm Revocation
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
