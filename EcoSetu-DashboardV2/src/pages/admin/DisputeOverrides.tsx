import React, { useState } from "react";

interface AdminDisputeItem {
  id: string;
  facility: string;
  collector: string;
  category: string;
  estWeight: number;
  actWeight: number;
  variancePercent: number;
  rate: number;
  reason: string;
  date: string;
  status: "open" | "settled" | "dismissed";
}

const INITIAL_DISPUTES: AdminDisputeItem[] = [
  {
    id: "DSP-9921",
    facility: "Metro Recycling Solutions - Mumbai",
    collector: "Pooja E-Waste Aggregators",
    category: "Mixed PCB Boards (Grade A)",
    estWeight: 180,
    actWeight: 142,
    variancePercent: -21.1,
    rate: 95,
    reason: "Moisture & heavy non-PCB casing contamination deducted during weighbridge inspection",
    date: "Today, 11:20 AM",
    status: "open",
  },
  {
    id: "DSP-8412",
    facility: "EcoGreen Recyclers Pune",
    collector: "Suresh Metal Scrap",
    category: "Lithium-Ion Battery Modules",
    estWeight: 250,
    actWeight: 205,
    variancePercent: -18.0,
    rate: 110,
    reason: "Lead-acid casing found mixed in batch; hazardous sorting adjustment applied",
    date: "Yesterday, 02:45 PM",
    status: "open",
  },
];

export default function DisputeOverrides() {
  const [disputes, setDisputes] = useState<AdminDisputeItem[]>(INITIAL_DISPUTES);
  const [selectedDispute, setSelectedDispute] = useState<AdminDisputeItem | null>(null);

  const handleResolve = (id: string) => {
    setDisputes(prev => prev.map(d => d.id === id ? { ...d, status: "settled" as const } : d));
    setSelectedDispute(null);
  };

  const handleDismiss = (id: string) => {
    setDisputes(prev => prev.map(d => d.id === id ? { ...d, status: "dismissed" as const } : d));
    setSelectedDispute(null);
  };

  const openCount = disputes.filter(d => d.status === "open").length;

  return (
    <div className="space-y-6 pb-12 font-sans antialiased text-gray-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900">
            Dispute Overrides & Mediation
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Admin arbitration for lots where weight or grade variance exceeded facility tolerance limits.
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-xs font-semibold text-red-800">
          {openCount} Escalated Disputes
        </span>
      </div>

      {/* Disputes Table */}
      <div className="bg-white rounded-xl border border-[#e7e2d9]/80 shadow-[0_2px_12px_rgb(0,0,0,0.03)] overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900">
            Dispute Arbitration Queue
          </h2>
          <span className="text-xs text-gray-400">
            Click row to view inspection notes & mediation options
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#faf9f6] border-b border-[#e7e2d9]/60 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-4 py-3">Dispute ID</th>
                <th className="px-4 py-3">Facility</th>
                <th className="px-4 py-3">Collector</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Weight Variance</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Arbitration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {disputes.map((dsp) => (
                <tr
                  key={dsp.id}
                  className="hover:bg-gray-50/80 transition-colors cursor-pointer"
                  onClick={() => setSelectedDispute(dsp)}
                >
                  <td className="px-4 py-3 font-mono font-bold text-gray-900">
                    {dsp.id}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {dsp.facility}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {dsp.collector}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-medium text-[10.5px]">
                      {dsp.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 font-mono">
                      <span className="font-bold text-red-600">{dsp.variancePercent.toFixed(1)}%</span>
                      <span className="text-gray-400 text-[10.5px]">({dsp.actWeight}kg vs {dsp.estWeight}kg)</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {dsp.status === "open" && (
                      <span className="px-2 py-0.5 rounded-full bg-red-50 border border-red-200 text-red-700 font-semibold text-[10px]">
                        Open Dispute
                      </span>
                    )}
                    {dsp.status === "settled" && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold text-[10px]">
                        Settled by Admin
                      </span>
                    )}
                    {dsp.status === "dismissed" && (
                      <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-semibold text-[10px]">
                        Dismissed
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                    {dsp.status === "open" ? (
                      <button
                        type="button"
                        onClick={() => setSelectedDispute(dsp)}
                        className="px-2.5 py-1 rounded-md bg-[#133e29] hover:bg-[#0f3221] text-white font-semibold text-[11px] shadow-xs cursor-pointer"
                      >
                        Mediate
                      </button>
                    ) : (
                      <span className="text-[11px] text-gray-400 italic">Resolved</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mediation Modal */}
      {selectedDispute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-red-600 font-bold">
                  {selectedDispute.id} · Variance {selectedDispute.variancePercent.toFixed(1)}%
                </span>
                <h3 className="text-lg font-bold text-gray-900">
                  {selectedDispute.collector} vs {selectedDispute.facility}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDispute(null)}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center cursor-pointer font-bold"
              >
                ×
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#faf9f6] rounded-xl border border-[#e7e2d9] space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Material Category:</span>
                  <span className="font-semibold text-gray-900">{selectedDispute.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Claimed vs Verified Weight:</span>
                  <span className="font-mono font-bold text-gray-900">{selectedDispute.estWeight} kg → {selectedDispute.actWeight} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Rate:</span>
                  <span className="font-mono text-gray-900">₹{selectedDispute.rate}/kg (Est: ₹{(selectedDispute.estWeight * selectedDispute.rate).toLocaleString("en-IN")})</span>
                </div>
                <div className="pt-2 border-t border-gray-200/60">
                  <p className="text-gray-500 font-semibold mb-1">Inspection & Dispute Notes:</p>
                  <p className="text-gray-700 italic bg-white p-2 rounded-lg border border-gray-100">
                    "{selectedDispute.reason}"
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                onClick={() => setSelectedDispute(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              {selectedDispute.status === "open" && (
                <>
                  <button
                    onClick={() => handleDismiss(selectedDispute.id)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 cursor-pointer"
                  >
                    Dismiss Dispute
                  </button>
                  <button
                    onClick={() => handleResolve(selectedDispute.id)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#133e29] hover:bg-[#0f3221] shadow-xs cursor-pointer"
                  >
                    Approve Override & Settle
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
