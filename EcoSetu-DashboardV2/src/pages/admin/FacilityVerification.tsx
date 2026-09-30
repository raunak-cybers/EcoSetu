import React, { useState } from "react";

interface PendingFacility {
  id: string;
  name: string;
  category: string;
  location: string;
  cpcbNumber: string;
  adminName: string;
  email: string;
  phone: string;
  appliedDate: string;
  status: "pending" | "approved" | "rejected";
}

const INITIAL_PENDING_FACILITIES: PendingFacility[] = [
  {
    id: "FAC-MH-8812",
    name: "Apex Metal Refiners Pvt Ltd",
    category: "Metals (Copper & Aluminium)",
    location: "MIDC Taloja, Navi Mumbai, Maharashtra",
    cpcbNumber: "MPCB/RO/NM/2026/CTO-1029",
    adminName: "Vikram Shah",
    email: "vikram@apexrefiners.com",
    phone: "+91 98220 19283",
    appliedDate: "Today, 10:30 AM",
    status: "pending",
  },
  {
    id: "FAC-TN-4910",
    name: "Southern E-Waste Solutions",
    category: "E-Waste & Lithium Batteries",
    location: "Ambattur Industrial Estate, Chennai, Tamil Nadu",
    cpcbNumber: "TNPCB/EWM/2026/AUTH-441",
    adminName: "K. Swaminathan",
    email: "swami@southernewaste.in",
    phone: "+91 94441 82739",
    appliedDate: "Yesterday, 04:15 PM",
    status: "pending",
  },
  {
    id: "FAC-KA-3012",
    name: "Bangalore Green Polymers",
    category: "Rigid & Flexible Plastics",
    location: "Peenya Industrial Area, Bengaluru, Karnataka",
    cpcbNumber: "KSPCB/PL/2026/REG-908",
    adminName: "Ananya Hegde",
    email: "ananya@bgp-recycling.com",
    phone: "+91 98801 39201",
    appliedDate: "24 Sep 2026",
    status: "pending",
  },
];

export default function FacilityVerification() {
  const [facilities, setFacilities] = useState<PendingFacility[]>(INITIAL_PENDING_FACILITIES);
  const [selectedFacility, setSelectedFacility] = useState<PendingFacility | null>(null);

  const handleApprove = (id: string) => {
    setFacilities(prev => prev.map(f => f.id === id ? { ...f, status: "approved" as const } : f));
    setSelectedFacility(null);
  };

  const handleReject = (id: string) => {
    setFacilities(prev => prev.map(f => f.id === id ? { ...f, status: "rejected" as const } : f));
    setSelectedFacility(null);
  };

  const pendingList = facilities.filter(f => f.status === "pending");

  return (
    <div className="space-y-6 pb-12 font-sans antialiased text-gray-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900">
            Facility Verification
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Review and validate CPCB/SPCB consent orders before onboarding recycling facilities.
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-800">
          {pendingList.length} Pending Approvals
        </span>
      </div>

      {/* Facilities List Table */}
      <div className="bg-white rounded-xl border border-[#e7e2d9]/80 shadow-[0_2px_12px_rgb(0,0,0,0.03)] overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900">
            Verification Queue
          </h2>
          <span className="text-xs text-gray-400">
            Click any row to inspect CPCB authorization details
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#faf9f6] border-b border-[#e7e2d9]/60 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-4 py-3">Facility ID & Name</th>
                <th className="px-4 py-3">Waste Stream</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">CPCB / SPCB Consent</th>
                <th className="px-4 py-3">Applicant</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {facilities.map((fac) => (
                <tr
                  key={fac.id}
                  className="hover:bg-gray-50/80 transition-colors cursor-pointer"
                  onClick={() => setSelectedFacility(fac)}
                >
                  <td className="px-4 py-3">
                    <p className="font-bold text-gray-900">{fac.name}</p>
                    <p className="font-mono text-[10px] text-gray-400">{fac.id}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-medium text-[10.5px]">
                      {fac.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 max-w-xs truncate">
                    {fac.location}
                  </td>
                  <td className="px-4 py-3 font-mono text-gray-700">
                    {fac.cpcbNumber}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">{fac.adminName}</p>
                    <p className="text-[10px] text-gray-400">{fac.phone}</p>
                  </td>
                  <td className="px-4 py-3">
                    {fac.status === "pending" && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 font-semibold text-[10px]">
                        Pending Review
                      </span>
                    )}
                    {fac.status === "approved" && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold text-[10px]">
                        Approved
                      </span>
                    )}
                    {fac.status === "rejected" && (
                      <span className="px-2 py-0.5 rounded-full bg-red-50 border border-red-200 text-red-700 font-semibold text-[10px]">
                        Rejected
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                    {fac.status === "pending" ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleApprove(fac.id)}
                          className="px-2.5 py-1 rounded-md bg-[#133e29] hover:bg-[#0f3221] text-white font-semibold text-[11px] shadow-xs cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReject(fac.id)}
                          className="px-2.5 py-1 rounded-md bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-[11px] border border-red-200 cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-gray-400 italic">Completed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Facility Inspection Drawer/Modal */}
      {selectedFacility && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400">
                  {selectedFacility.id}
                </span>
                <h3 className="text-lg font-bold text-gray-900">
                  {selectedFacility.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedFacility(null)}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center cursor-pointer font-bold"
              >
                ×
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#faf9f6] rounded-xl border border-[#e7e2d9] space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Waste Category:</span>
                  <span className="font-semibold text-gray-900">{selectedFacility.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">CPCB Consent CTO:</span>
                  <span className="font-mono font-bold text-emerald-800">{selectedFacility.cpcbNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Location:</span>
                  <span className="font-medium text-gray-900 text-right">{selectedFacility.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Manager & Email:</span>
                  <span className="font-medium text-gray-900">{selectedFacility.adminName} ({selectedFacility.email})</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                onClick={() => setSelectedFacility(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                Close
              </button>
              {selectedFacility.status === "pending" && (
                <>
                  <button
                    onClick={() => handleReject(selectedFacility.id)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 cursor-pointer"
                  >
                    Reject Consent
                  </button>
                  <button
                    onClick={() => handleApprove(selectedFacility.id)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#133e29] hover:bg-[#0f3221] shadow-xs cursor-pointer"
                  >
                    Authorize Facility
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
