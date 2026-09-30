import React from "react";

interface AdminDashboardProps {
  onNavigate?: (view: string) => void;
  pendingFacilitiesCount?: number;
  openDisputesCount?: number;
  totalFacilitiesCount?: number;
  totalCollectorsCount?: number;
}

export default function AdminDashboard({
  onNavigate,
  pendingFacilitiesCount = 3,
  openDisputesCount = 2,
  totalFacilitiesCount = 24,
  totalCollectorsCount = 318,
}: AdminDashboardProps) {

  const STAT_CARDS = [
    {
      title: "Facilities Pending Verification",
      value: pendingFacilitiesCount,
      subtext: "Requires compliance review",
      icon: (
        <svg className="w-5 h-5 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5m-4 0h4" />
        </svg>
      ),
      iconBg: "bg-amber-50 border border-amber-200/60",
      actionView: "facility_verification",
    },
    {
      title: "Open Disputes",
      value: openDisputesCount,
      subtext: "Across 2 facilities",
      icon: (
        <svg className="w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
      iconBg: "bg-red-50 border border-red-200/60",
      actionView: "dispute_overrides",
    },
    {
      title: "Total Active Facilities",
      value: totalFacilitiesCount,
      subtext: "+2 onboarded this month",
      icon: (
        <svg className="w-5 h-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 21h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
        </svg>
      ),
      iconBg: "bg-emerald-50 border border-emerald-200/60",
      actionView: "facilities",
    },
    {
      title: "Total Active Collectors",
      value: totalCollectorsCount,
      subtext: "+14 registered this week",
      icon: (
        <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      iconBg: "bg-blue-50 border border-blue-200/60",
      actionView: "collectors",
    },
  ];

  return (
    <div className="space-y-6 pb-12 font-sans antialiased text-gray-900">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Platform-wide oversight and verification.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-semibold text-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            System Status: Healthy
          </span>
        </div>
      </div>

      {/* Summary Cards Row (4 Cards matching existing recycler style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((card, idx) => (
          <div
            key={idx}
            onClick={() => onNavigate && card.actionView && onNavigate(card.actionView)}
            className="bg-white rounded-xl p-5 border border-[#e7e2d9]/80 shadow-[0_2px_12px_rgb(0,0,0,0.03)] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {card.title}
                </p>
                <p className="text-3xl font-black text-gray-900 tracking-tight mt-2 font-mono">
                  {card.value}
                </p>
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${card.iconBg}`}>
                {card.icon}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-gray-500 font-medium">
                {card.subtext}
              </span>
              <span className="text-[#133e29] font-bold hover:underline inline-flex items-center gap-0.5">
                View →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Two Empty-State Panels Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left Panel: Pending Facility Verifications */}
        <div className="bg-white rounded-xl border border-[#e7e2d9]/80 shadow-[0_2px_12px_rgb(0,0,0,0.03)] overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <h2 className="text-sm font-bold text-gray-900">
                Pending Facility Verifications
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate && onNavigate("facility_verification")}
              className="text-xs font-semibold text-[#133e29] hover:underline cursor-pointer"
            >
              Open Queue ({pendingFacilitiesCount})
            </button>
          </div>

          <div className="p-8 flex-1 flex flex-col items-center justify-center text-center min-h-[260px]">
            <div className="w-12 h-12 rounded-full bg-[#faf9f6] border border-[#e7e2d9] flex items-center justify-center text-gray-400 mb-3 shadow-xs">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-500">
              No items to review right now
            </p>
            <p className="text-xs text-gray-400 max-w-xs mt-1">
              New facility onboarding submissions and CPCB consent certificates will populate here for compliance authorization.
            </p>
            {pendingFacilitiesCount > 0 && (
              <button
                type="button"
                onClick={() => onNavigate && onNavigate("facility_verification")}
                className="mt-4 px-3.5 py-1.5 rounded-lg bg-[#133e29] hover:bg-[#0f3221] text-white text-xs font-semibold shadow-xs cursor-pointer transition-colors"
              >
                Review {pendingFacilitiesCount} Pending Submissions
              </button>
            )}
          </div>
        </div>

        {/* Right Panel: Open Disputes */}
        <div className="bg-white rounded-xl border border-[#e7e2d9]/80 shadow-[0_2px_12px_rgb(0,0,0,0.03)] overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <h2 className="text-sm font-bold text-gray-900">
                Open Disputes
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate && onNavigate("dispute_overrides")}
              className="text-xs font-semibold text-[#133e29] hover:underline cursor-pointer"
            >
              Open Queue ({openDisputesCount})
            </button>
          </div>

          <div className="p-8 flex-1 flex flex-col items-center justify-center text-center min-h-[260px]">
            <div className="w-12 h-12 rounded-full bg-[#faf9f6] border border-[#e7e2d9] flex items-center justify-center text-gray-400 mb-3 shadow-xs">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-500">
              No items to review right now
            </p>
            <p className="text-xs text-gray-400 max-w-xs mt-1">
              Lots with weight/grade variances exceeding configured tolerance limits will appear here for admin override or mediation.
            </p>
            {openDisputesCount > 0 && (
              <button
                type="button"
                onClick={() => onNavigate && onNavigate("dispute_overrides")}
                className="mt-4 px-3.5 py-1.5 rounded-lg bg-[#133e29] hover:bg-[#0f3221] text-white text-xs font-semibold shadow-xs cursor-pointer transition-colors"
              >
                Inspect {openDisputesCount} Escalated Disputes
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
