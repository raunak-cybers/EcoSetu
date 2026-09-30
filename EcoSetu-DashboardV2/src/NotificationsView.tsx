import React, { useState, useMemo } from "react";
import { NOTIFICATIONS } from "./mockData";

function Icon({ name, color = "currentColor", size = 16 }: { name: string; color?: string; size?: number }) {
  const iconPaths: Record<string, React.ReactNode> = {
    bell: <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></>,
    leaf: <><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><line x1="2" y1="22" x2="11" y2="13"/></>,
    mail: <><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></>,
    alert: <><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    box: <><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></>,
    card: <><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></>,
    "trend-down": <><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/></>,
    "file-text": <><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></>,
    clock: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    settings: <><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></>,
    "chevron-right": <><polyline points="9 18 15 12 9 6"/></>,
    "arrow-up-down": <><path d="m21 16-4 4-4-4"/><path d="M17 20V4"/><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/></>,
    lock: <><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>,
  };

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      {iconPaths[name] || iconPaths["box"]}
    </svg>
  );
}

export default function NotificationsView() {
  const [notifs, setNotifs] = useState(NOTIFICATIONS);
  const [catFilter, setCatFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest" | "unread">("latest");
  const [sortOpen, setSortOpen] = useState(false);
  const [enabledCats, setEnabledCats] = useState({
    alert: true,
    request: true,
    payment: true,
    system: true,
  });

  const markRead = (id: number) => setNotifs(n => n.map(x => x.id === id ? { ...x, read: true } : x));
  const markAll  = () => setNotifs(n => n.map(x => ({ ...x, read: true })));

  const toggleCategory = (cat: keyof typeof enabledCats) => {
    setEnabledCats(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  // Filter based on active tab and enabled category switches
  const filtered = useMemo(() => {
    return notifs.filter(n => {
      const isEnabled = enabledCats[n.cat as keyof typeof enabledCats] ?? true;
      if (!isEnabled) return false;

      if (catFilter === "all") return true;
      return n.cat === catFilter;
    }).sort((a, b) => {
      if (sortOrder === "oldest") return a.id - b.id;
      if (sortOrder === "unread") {
        if (a.read === b.read) return b.id - a.id;
        return a.read ? 1 : -1;
      }
      return b.id - a.id; // latest
    });
  }, [notifs, catFilter, enabledCats, sortOrder]);

  const totalUnread = notifs.filter(n => !n.read).length;
  const unreadAlerts = notifs.filter(n => n.cat === "alert" && !n.read).length;
  const unreadRequests = notifs.filter(n => n.cat === "request" && !n.read).length;
  const unreadPayments = notifs.filter(n => n.cat === "payment" && !n.read).length;

  const categories = [
    { id: "all", label: "All", count: notifs.length },
    { id: "alert", label: "Alert", count: unreadAlerts },
    { id: "request", label: "Request", count: unreadRequests },
    { id: "payment", label: "Payment", count: unreadPayments },
    { id: "system", label: "System", count: undefined },
  ];

  return (
    <div className="flex flex-col gap-6 slide-in max-w-7xl mx-auto pb-10">
      {/* ── Page Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#dcfce7]/70 border border-emerald-200/80 flex items-center justify-center text-emerald-800 shadow-xs">
            <Icon name="bell" size={26} color="#065f46" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Notification Center</h1>
            <p className="text-xs text-gray-500 mt-0.5 font-normal">Stay updated on important activities across your facility</p>
          </div>
        </div>

        {/* Smarter Recycling banner */}
        <div className="hidden sm:flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-50 to-emerald-100/40 border border-emerald-200/60 shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-emerald-600/10 flex items-center justify-center">
            <Icon name="leaf" size={18} color="#059669" />
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-emerald-900 leading-tight">Smarter Recycling</p>
            <p className="text-[10px] font-semibold text-emerald-600/90 leading-tight">Stronger Tomorrow</p>
          </div>
        </div>
      </div>

      {/* ── 4 Top KPI Metric Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Unread */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#ecfdf5] border border-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
            <Icon name="mail" size={20} color="#059669" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-500">Unread</p>
            <p className="text-2xl font-bold text-gray-900 leading-tight my-0.5">{totalUnread}</p>
            <p className="text-[11px] text-gray-400 truncate">of {notifs.length} notifications</p>
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-500 flex-shrink-0">
            <Icon name="alert" size={20} color="#dc2626" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-500">Alerts</p>
            <p className="text-2xl font-bold text-gray-900 leading-tight my-0.5">{unreadAlerts}</p>
            <p className="text-[11px] text-gray-400 truncate">Requires attention</p>
          </div>
        </div>

        {/* Requests */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500 flex-shrink-0">
            <Icon name="box" size={20} color="#2563eb" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-500">Requests</p>
            <p className="text-2xl font-bold text-gray-900 leading-tight my-0.5">{unreadRequests}</p>
            <p className="text-[11px] text-gray-400 truncate">Awaiting action</p>
          </div>
        </div>

        {/* Payments */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#ecfdf5] border border-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
            <Icon name="card" size={20} color="#059669" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-500">Payments</p>
            <p className="text-2xl font-bold text-gray-900 leading-tight my-0.5">{unreadPayments}</p>
            <p className="text-[11px] text-gray-400 truncate">Recently processed</p>
          </div>
        </div>
      </div>

      {/* ── Main 2-Column Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Filters & List */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Category Filter Pills + Sort Dropdown */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              {categories.map(c => {
                const isActive = catFilter === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setCatFilter(c.id)}
                    className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#064e3b] text-white shadow-xs font-semibold"
                        : "bg-white border border-gray-200/80 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {c.label} {c.count !== undefined ? `(${c.count})` : ""}
                  </button>
                );
              })}
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white border border-gray-200/80 text-gray-700 hover:bg-gray-50 shadow-xs cursor-pointer"
              >
                <Icon name="arrow-up-down" size={13} color="#475569" />
                <span>{sortOrder === "latest" ? "Latest first" : sortOrder === "oldest" ? "Oldest first" : "Unread first"}</span>
                <span className="text-[10px] text-gray-400 ml-0.5">▼</span>
              </button>
              {sortOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-36 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-20">
                  <button onClick={() => { setSortOrder("latest"); setSortOpen(false); }} className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 cursor-pointer ${sortOrder === "latest" ? "font-bold text-emerald-700 bg-emerald-50/50" : "text-gray-700"}`}>Latest first</button>
                  <button onClick={() => { setSortOrder("oldest"); setSortOpen(false); }} className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 cursor-pointer ${sortOrder === "oldest" ? "font-bold text-emerald-700 bg-emerald-50/50" : "text-gray-700"}`}>Oldest first</button>
                  <button onClick={() => { setSortOrder("unread"); setSortOpen(false); }} className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 cursor-pointer ${sortOrder === "unread" ? "font-bold text-emerald-700 bg-emerald-50/50" : "text-gray-700"}`}>Unread first</button>
                </div>
              )}
            </div>
          </div>

          {/* List of Notification Cards */}
          <div className="flex flex-col gap-2.5">
            {filtered.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-gray-200/80">
                <p className="text-sm font-semibold text-gray-600">No notifications found</p>
                <p className="text-xs text-gray-400 mt-1">Try changing category filter or enabling categories in settings</p>
              </div>
            ) : (
              filtered.map(n => {
                const isUnread = !n.read;
                let iconBg = "bg-gray-50 border-gray-100";
                let iconColor = "#475569";
                let badgeStyle = "bg-gray-100 text-gray-700";
                let badgeText = n.cat.toUpperCase();
                let iconName = n.icon || "box";

                if (n.cat === "alert") {
                  iconBg = "bg-red-50 border border-red-100";
                  iconColor = "#dc2626";
                  badgeStyle = "bg-red-100/70 text-red-600";
                  badgeText = "ALERT";
                } else if (n.cat === "request") {
                  iconBg = "bg-blue-50 border border-blue-100";
                  iconColor = "#2563eb";
                  badgeStyle = "bg-blue-100/70 text-blue-600";
                  badgeText = "REQUEST";
                } else if (n.cat === "payment") {
                  iconBg = "bg-[#ecfdf5] border border-emerald-100";
                  iconColor = "#059669";
                  badgeStyle = "bg-emerald-100/80 text-emerald-700";
                  badgeText = "PAYMENT";
                } else if (n.cat === "system") {
                  iconBg = "bg-purple-50 border border-purple-100";
                  iconColor = "#7c3aed";
                  badgeStyle = "bg-slate-100 text-slate-700";
                  badgeText = "SYSTEM";
                }

                if (n.icon === "clock") {
                  iconBg = "bg-amber-50 border border-amber-100";
                  iconColor = "#d97706";
                }

                return (
                  <div
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer shadow-xs ${
                      isUnread
                        ? "bg-[#f2faf5] border-emerald-200/90 hover:border-emerald-400"
                        : "bg-white border-gray-200/80 hover:border-gray-300"
                    }`}
                  >
                    {/* Left category icon */}
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
                      <Icon name={iconName} size={20} color={iconColor} />
                    </div>

                    {/* Notification info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-gray-900 leading-snug">{n.title}</span>
                        <span className={`text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-md ${badgeStyle}`}>
                          {badgeText}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{n.body}</p>
                    </div>

                    {/* Right side status, time & chevron */}
                    <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                      {isUnread && (
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                      )}
                      <span className="text-xs text-gray-400 font-normal whitespace-nowrap">{n.time}</span>
                      <span className="text-gray-400">
                        <Icon name="chevron-right" size={16} color="currentColor" />
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Settings + Eco Banner */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          {/* Card 1: Notification Settings */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100/80 flex items-center justify-center text-emerald-800 flex-shrink-0">
                <Icon name="settings" size={18} color="#065f46" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 leading-tight">Notification Settings</h3>
                <p className="text-[11px] text-gray-500 leading-tight">Choose what notifications to see</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 divide-y divide-gray-100">
              {/* Toggle 1: Alerts */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center flex-shrink-0">
                    <Icon name="alert" size={16} color="#dc2626" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">Alerts</p>
                    <p className="text-[10px] text-gray-400">Get notified about critical issues</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleCategory("alert")}
                  className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                    enabledCats.alert ? "bg-[#065f46]" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow-xs ${
                      enabledCats.alert ? "left-5.5" : "left-0.5"
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 2: Requests */}
              <div className="flex items-center justify-between pt-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                    <Icon name="box" size={16} color="#2563eb" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">Requests</p>
                    <p className="text-[10px] text-gray-400">New lots and action requests</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleCategory("request")}
                  className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                    enabledCats.request ? "bg-[#065f46]" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow-xs ${
                      enabledCats.request ? "left-5.5" : "left-0.5"
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 3: Payments */}
              <div className="flex items-center justify-between pt-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#ecfdf5] border border-emerald-100 flex items-center justify-center flex-shrink-0">
                    <Icon name="card" size={16} color="#059669" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">Payments</p>
                    <p className="text-[10px] text-gray-400">Payouts and settlements</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleCategory("payment")}
                  className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                    enabledCats.payment ? "bg-[#065f46]" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow-xs ${
                      enabledCats.payment ? "left-5.5" : "left-0.5"
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 4: System */}
              <div className="flex items-center justify-between pt-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center flex-shrink-0">
                    <Icon name="file-text" size={16} color="#7c3aed" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">System</p>
                    <p className="text-[10px] text-gray-400">Reports, reminders and updates</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleCategory("system")}
                  className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                    enabledCats.system ? "bg-[#065f46]" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow-xs ${
                      enabledCats.system ? "left-5.5" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>

            <button
              onClick={markAll}
              className="mt-1 w-full py-2.5 px-4 rounded-xl bg-[#eafaf1] border border-emerald-200/80 text-[#065f46] font-bold text-xs flex items-center justify-center gap-2 hover:bg-emerald-100/80 transition-colors cursor-pointer"
            >
              <Icon name="bell" size={14} color="#065f46" />
              <span>Mark all as read</span>
            </button>
          </div>

          {/* Card 2: Environmental Promo Card with Truck Illustration */}
          <div className="rounded-2xl p-5 border border-emerald-200/70 bg-gradient-to-b from-[#f2faf5] via-[#eaf7ef] to-[#e1f3e8] relative overflow-hidden shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-xl bg-emerald-600/10 flex items-center justify-center mb-3">
                <Icon name="leaf" size={20} color="#059669" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 leading-snug">Together for<br />a Cleaner Tomorrow</h3>
              <p className="text-[11px] text-gray-600 mt-1.5 leading-relaxed">
                Every notification helps keep recycling transparent and accountable.
              </p>
            </div>

            {/* SVG Eco Landscape & Recycling Truck */}
            <div className="mt-4 pt-1 -mx-5 -mb-5">
              <svg viewBox="0 0 320 120" className="w-full h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Subtle City Silhouettes */}
                <rect x="180" y="42" width="20" height="58" rx="3" fill="#cbf3dd" fillOpacity="0.7"/>
                <rect x="204" y="28" width="24" height="72" rx="3" fill="#a7f0c6" fillOpacity="0.6"/>
                <rect x="232" y="50" width="18" height="50" rx="3" fill="#cbf3dd" fillOpacity="0.7"/>
                <rect x="254" y="35" width="26" height="65" rx="3" fill="#a7f0c6" fillOpacity="0.6"/>
                <circle cx="275" cy="22" r="12" fill="#ecfdf5" fillOpacity="0.8"/>

                {/* Soft Hill Ground */}
                <path d="M0 98 Q120 72 320 94 L320 120 L0 120 Z" fill="#d1fae5" fillOpacity="0.9"/>
                <path d="M0 106 Q160 88 320 104 L320 120 L0 120 Z" fill="#a7f3d0"/>

                {/* Trees on Left */}
                <circle cx="28" cy="85" r="16" fill="#10b981"/>
                <circle cx="20" cy="80" r="12" fill="#059669"/>
                <rect x="26" y="93" width="4" height="14" fill="#047857"/>

                <circle cx="50" cy="90" r="11" fill="#34d399"/>
                <rect x="49" y="98" width="3" height="10" fill="#059669"/>

                {/* Tree on Right */}
                <circle cx="295" cy="80" r="15" fill="#059669"/>
                <circle cx="298" cy="74" r="11" fill="#10b981"/>
                <rect x="296" y="88" width="4" height="16" fill="#047857"/>

                {/* Eco Recycling Truck */}
                <g transform="translate(142, 60)">
                  {/* Truck Cab */}
                  <path d="M72 25 L88 25 Q96 25 98 32 L102 44 L102 54 Q102 56 100 56 L72 56 Z" fill="#065f46"/>
                  {/* Truck Window */}
                  <path d="M75 28 L86 28 Q91 28 93 33 L96 42 L75 42 Z" fill="#e0f2fe"/>
                  {/* Cab Bumper/Light */}
                  <rect x="99" y="48" width="4" height="4" rx="1" fill="#fef08a"/>
                  
                  {/* Cargo Body */}
                  <rect x="18" y="14" width="52" height="42" rx="5" fill="#059669"/>
                  <rect x="20" y="16" width="48" height="38" rx="4" fill="#10b981"/>
                  
                  {/* White Recycle Symbol on Cargo Body */}
                  <g transform="translate(37, 27) scale(0.68)">
                    <path d="M12 2 L16 8 H13 V12 H11 V8 H8 L12 2 Z" fill="#ffffff"/>
                    <path d="M21 16 L17 21 L15 19 L17 15 L14 13 L15 11 L20 12 L21 16 Z" fill="#ffffff"/>
                    <path d="M4 17 L8 12 L10 14 L8 18 L11 20 L10 22 L5 21 L4 17 Z" fill="#ffffff"/>
                  </g>

                  {/* Mudguards & Undercarriage */}
                  <rect x="14" y="52" width="86" height="4" fill="#064e3b"/>

                  {/* Truck Wheels */}
                  <circle cx="34" cy="56" r="8" fill="#1f2937"/>
                  <circle cx="34" cy="56" r="3.5" fill="#9ca3af"/>
                  <circle cx="86" cy="56" r="8" fill="#1f2937"/>
                  <circle cx="86" cy="56" r="3.5" fill="#9ca3af"/>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
