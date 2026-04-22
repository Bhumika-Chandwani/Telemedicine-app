import React, { useState } from "react";
import { FileText, Lock, Eye, Calendar, User, Bell, Search, Shield } from "lucide-react";

const RECORDS = [
  { id:"1", date:"Nov 28, 2024", doctor:"Dr. Sarah Johnson",  type:"Cardiology Consultation",  diagnosis:"Regular checkup – Heart function normal",     prescription:"Continue regular exercise and maintain healthy diet" },
  { id:"2", date:"Nov 15, 2024", doctor:"Dr. Michael Chen",   type:"General Consultation",      diagnosis:"Common cold with mild fever",                   prescription:"Paracetamol 500mg – 3 times daily for 5 days, rest and hydration" },
  { id:"3", date:"Oct 22, 2024", doctor:"Dr. Emily Davis",    type:"Dermatology Consultation",  diagnosis:"Mild skin allergy",                             prescription:"Antihistamine cream – Apply twice daily, avoid allergens" },
  { id:"4", date:"Sep 10, 2024", doctor:"Dr. Sarah Johnson",  type:"Follow-up Consultation",    diagnosis:"Blood pressure within normal range",             prescription:"Continue current medication" },
  { id:"5", date:"Aug 05, 2024", doctor:"Dr. Robert Wilson",  type:"Annual Physical Exam",      diagnosis:"Overall health good, minor vitamin D deficiency",prescription:"Vitamin D supplements – 1000 IU daily" },
];

const TYPE_COLOR = {
  "Cardiology Consultation":  "bg-red-100 text-red-600",
  "General Consultation":     "bg-blue-100 text-blue-600",
  "Dermatology Consultation": "bg-purple-100 text-purple-600",
  "Follow-up Consultation":   "bg-orange-100 text-orange-600",
  "Annual Physical Exam":     "bg-green-100 text-green-600",
};

export function MedicalRecords({ navigateTo }) {
  const [q, setQ] = useState("");

  const filtered = RECORDS.filter(r =>
    r.doctor.toLowerCase().includes(q.toLowerCase()) ||
    r.type.toLowerCase().includes(q.toLowerCase()) ||
    r.date.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">

      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4">
          <div className="pl-10 lg:pl-0">
            <h1 className="text-gray-800 font-bold text-lg">Medical Records</h1>
            <p className="text-gray-400 text-xs hidden sm:block">Your encrypted health history</p>
          </div>
          <button className="relative p-2 hover:bg-gray-100 rounded-xl">
            <Bell className="w-5 h-5 text-gray-500" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
          </button>
        </div>
      </header>

      <main className="px-4 sm:px-6 py-6 max-w-4xl mx-auto space-y-5">

        {/* Security notice */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200
          rounded-2xl p-4 flex items-start gap-3">
          <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-gray-800 font-semibold text-sm">Secure & Encrypted</p>
            <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">
              All records are end-to-end encrypted. Only you and your authorized healthcare providers can access them.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search by doctor, type or date…"
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm
              focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent
              shadow-sm placeholder-gray-400"
          />
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium">No records match your search</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(r => (
              <div key={r.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100
                  hover:shadow-md hover:border-emerald-200 transition-all duration-200 overflow-hidden">
                <div className="flex items-start gap-4 p-4 sm:p-5">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
                    ${TYPE_COLOR[r.type] || "bg-gray-100 text-gray-500"}`}>
                    <FileText className="w-6 h-6" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 font-semibold text-sm">{r.type}</p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/>{r.date}</span>
                      <span className="flex items-center gap-1"><User className="w-3 h-3"/>{r.doctor}</span>
                      <span className="flex items-center gap-1 text-green-600">
                        <Lock className="w-3 h-3"/>Encrypted
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs mt-1.5 line-clamp-1">{r.diagnosis}</p>
                  </div>

                  {/* Button */}
                  <button
                    onClick={() => navigateTo("recordDetails", { selectedRecord: r })}
                    className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500 hover:bg-emerald-600
                      text-white rounded-xl text-xs font-semibold transition-colors flex-shrink-0"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">View</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}