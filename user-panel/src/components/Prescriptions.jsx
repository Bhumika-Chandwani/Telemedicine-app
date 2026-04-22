import React, { useState } from "react";
import { Bell, Pill, Download, Calendar, Clock, AlertCircle, CheckCircle, User, Activity } from "lucide-react";

const RX = [
  { id:1, medication:"Lisinopril",  dosage:"10mg",    frequency:"Once daily",       duration:"30 days",  doctor:"Dr. Sarah Johnson", date:"Nov 28, 2024", status:"Active",    instructions:"Take in the morning with water",              refills:2 },
  { id:2, medication:"Metformin",   dosage:"500mg",   frequency:"Twice daily",      duration:"90 days",  doctor:"Dr. Michael Chen",  date:"Nov 15, 2024", status:"Active",    instructions:"Take with meals",                             refills:1 },
  { id:3, medication:"Amoxicillin", dosage:"250mg",   frequency:"Three times daily",duration:"7 days",   doctor:"Dr. Emily Davis",   date:"Nov 10, 2024", status:"Completed", instructions:"Complete the full course",                     refills:0 },
  { id:4, medication:"Vitamin D3",  dosage:"1000 IU", frequency:"Once daily",       duration:"180 days", doctor:"Dr. Robert Wilson", date:"Oct 20, 2024", status:"Active",    instructions:"Take with a fatty meal for better absorption", refills:3 },
  { id:5, medication:"Ibuprofen",   dosage:"400mg",   frequency:"As needed",        duration:"30 days",  doctor:"Dr. Sarah Johnson", date:"Oct 05, 2024", status:"Expired",   instructions:"Do not exceed 3 doses per day",               refills:0 },
];

const TABS = ["All", "Active", "Completed", "Expired"];

const STATUS = {
  Active:    { cls: "bg-emerald-100 text-emerald-700 border border-emerald-200", dot: "bg-emerald-500" },
  Completed: { cls: "bg-blue-100 text-blue-700 border border-blue-200",         dot: "bg-blue-500"    },
  Expired:   { cls: "bg-gray-100 text-gray-600 border border-gray-200",         dot: "bg-gray-400"    },
};

const PILL_BG = { Active: "bg-emerald-100", Completed: "bg-blue-100", Expired: "bg-gray-100" };
const PILL_IC = { Active: "text-emerald-600", Completed: "text-blue-600", Expired: "text-gray-500" };

export function Prescriptions() {
  const [tab, setTab] = useState("All");

  const list = tab === "All" ? RX : RX.filter(r => r.status === tab);
  const active    = RX.filter(r => r.status === "Active").length;
  const refills   = RX.reduce((s, r) => s + r.refills, 0);

  return (
    <div className="min-h-screen bg-gray-50">

      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4">
          <div className="pl-10 lg:pl-0">
            <h1 className="text-gray-800 font-bold text-lg">Prescriptions</h1>
            <p className="text-gray-400 text-xs hidden sm:block">Manage your medications</p>
          </div>
          <button className="relative p-2 hover:bg-gray-100 rounded-xl">
            <Bell className="w-5 h-5 text-gray-500" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
          </button>
        </div>
      </header>

      <main className="px-4 sm:px-6 py-6 max-w-5xl mx-auto space-y-5">

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {[
            { val: active,   label: "Active",    icon: CheckCircle, from:"from-emerald-500", to:"to-teal-500"   },
            { val: RX.length,label: "Total",     icon: Pill,        from:"from-blue-500",    to:"to-indigo-500" },
            { val: refills,  label: "Refills",   icon: Activity,    from:"from-orange-500",  to:"to-amber-500"  },
          ].map(({ val, label, icon: Icon, from, to }) => (
            <div key={label}
              className={`bg-gradient-to-br ${from} ${to} rounded-2xl p-4 sm:p-5 text-white shadow-sm`}>
              <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                <Icon className="w-4 h-4" />
              </div>
              <p className="text-2xl font-bold">{val}</p>
              <p className="text-white/80 text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex overflow-x-auto">
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 min-w-0 py-3.5 px-2 sm:px-5 text-xs sm:text-sm font-semibold
                  whitespace-nowrap transition-colors
                  ${tab === t
                    ? "border-b-2 border-emerald-500 text-emerald-600 bg-emerald-50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Cards */}
        {list.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Pill className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium">No {tab.toLowerCase()} prescriptions</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {list.map(rx => {
              const s = STATUS[rx.status];
              return (
                <div key={rx.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100
                    hover:shadow-md hover:border-emerald-200 transition-all p-5">

                  {/* Top row */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${PILL_BG[rx.status]}`}>
                        <Pill className={`w-6 h-6 ${PILL_IC[rx.status]}`} />
                      </div>
                      <div>
                        <p className="text-gray-800 font-bold text-sm">{rx.medication}</p>
                        <p className="text-gray-400 text-xs mt-0.5">{rx.dosage} · {rx.frequency}</p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold ${s.cls}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                      {rx.status}
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="space-y-2 text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-gray-400" />{rx.doctor}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />Prescribed: {rx.date}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />Duration: {rx.duration}
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="p-3 bg-violet-50 border border-violet-100 rounded-xl mb-4">
                    <p className="text-violet-800 text-xs leading-relaxed">
                      <span className="font-semibold">Instructions: </span>{rx.instructions}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold ${rx.refills > 0 ? "text-emerald-600" : "text-gray-400"}`}>
                      {rx.refills > 0 ? `${rx.refills} refill${rx.refills > 1 ? "s" : ""} left` : "No refills"}
                    </span>
                    <div className="flex gap-2">
                      {rx.refills > 0 && rx.status === "Active" && (
                        <button className="px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white
                          rounded-xl text-xs font-semibold transition-colors">
                          Refill
                        </button>
                      )}
                      <button className="px-3 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50
                        rounded-xl text-xs font-semibold transition-colors flex items-center gap-1">
                        <Download className="w-3 h-3" /> PDF
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}