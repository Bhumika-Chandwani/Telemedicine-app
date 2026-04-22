import React from "react";
import {
  FileText, Calendar, User, Stethoscope, Pill,
  Lock, Bell, ArrowLeft, Download, Share2, CheckCircle,
} from "lucide-react";

export function RecordDetails({ record, navigateTo }) {
  if (!record) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No record selected.</p>
          <button onClick={() => navigateTo("records")}
            className="mt-4 px-5 py-2.5 bg-emerald-500 text-white rounded-xl text-sm hover:bg-emerald-600">
            Back to Records
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3 pl-10 lg:pl-0">
            <button onClick={() => navigateTo("records")}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-gray-800 font-bold text-lg">Record Details</h1>
              <p className="text-gray-400 text-xs hidden sm:block">Consultation #{record.id}</p>
            </div>
          </div>
          <button className="relative p-2 hover:bg-gray-100 rounded-xl">
            <Bell className="w-5 h-5 text-gray-500" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
          </button>
        </div>
      </header>

      <main className="px-4 sm:px-6 py-6 max-w-2xl mx-auto space-y-4">

        {/* Secure badge */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200
          rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center">
              <Lock className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-gray-800 font-semibold text-sm">Encrypted Record</p>
              <p className="text-gray-400 text-xs">Securely stored and verified</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1.5 rounded-xl text-xs font-semibold">
            <CheckCircle className="w-3.5 h-3.5" /> Verified
          </div>
        </div>

        {/* Consultation info */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-purple-600" />
            </div>
            <h2 className="text-gray-800 font-semibold text-sm">Consultation Information</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-5">
            {[
              { icon: Calendar, label: "Date",              value: record.date,   color: "text-blue-600",   bg: "bg-blue-50"   },
              { icon: User,     label: "Doctor",            value: record.doctor, color: "text-purple-600", bg: "bg-purple-50" },
              { icon: FileText, label: "Consultation Type", value: record.type,   color: "text-orange-600", bg: "bg-orange-50", full: true },
            ].map(({ icon: Icon, label, value, color, bg, full }) => (
              <div key={label} className={`p-4 bg-gray-50 rounded-xl ${full ? "sm:col-span-2" : ""}`}>
                <div className={`flex items-center gap-2 mb-2`}>
                  <div className={`w-6 h-6 ${bg} rounded-md flex items-center justify-center`}>
                    <Icon className={`w-3.5 h-3.5 ${color}`} />
                  </div>
                  <p className="text-gray-400 text-xs font-medium">{label}</p>
                </div>
                <p className="text-gray-800 font-semibold text-sm">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Diagnosis */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Stethoscope className="w-4 h-4 text-blue-600" />
            </div>
            <h2 className="text-gray-800 font-semibold text-sm">Diagnosis</h2>
          </div>
          <div className="p-5">
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <p className="text-gray-700 text-sm leading-relaxed">{record.diagnosis}</p>
            </div>
          </div>
        </div>

        {/* Prescription */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Pill className="w-4 h-4 text-green-600" />
            </div>
            <h2 className="text-gray-800 font-semibold text-sm">Prescription & Recommendations</h2>
          </div>
          <div className="p-5">
            <div className="p-4 bg-green-50 border border-green-100 rounded-xl">
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{record.prescription}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pb-6">
          <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r
            from-emerald-500 to-teal-500 text-white rounded-xl text-sm font-semibold
            hover:from-emerald-600 hover:to-teal-600 transition-all shadow-sm">
            <Download className="w-4 h-4" /> Download PDF
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border-2
            border-gray-200 text-gray-700 rounded-xl text-sm font-semibold
            hover:bg-gray-50 transition-colors">
            <Share2 className="w-4 h-4" /> Share
          </button>
        </div>
      </main>
    </div>
  );
}