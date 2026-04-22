import React, { useState } from "react";
import { Activity, AlertCircle, CheckCircle, Stethoscope, Bell, User, Zap } from "lucide-react";

const SYMPTOMS = [
  "Fever", "Cough", "Headache", "Fatigue", "Sore Throat",
  "Body Aches", "Shortness of Breath", "Nausea", "Dizziness", "Chest Pain",
  "Runny Nose", "Loss of Appetite",
];

const SEVERITY = {
  Mild:     { cls: "bg-green-100 text-green-700 border-green-200",  dot: "bg-green-500"  },
  Moderate: { cls: "bg-orange-100 text-orange-700 border-orange-200", dot: "bg-orange-500" },
  Severe:   { cls: "bg-red-100 text-red-700 border-red-200",        dot: "bg-red-500"    },
};

export function SymptomChecker({ navigateTo }) {
  const [sel,    setSel]    = useState([]);
  const [info,   setInfo]   = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggle = (s) =>
    setSel(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);

  const predict = () => {
    if (!sel.length) return;
    setLoading(true);
    setTimeout(() => {
      setResult({
        condition: sel.includes("Chest Pain") ? "Cardiac Concern" : sel.includes("Fever") && sel.includes("Cough") ? "Viral Infection" : "Common Cold",
        severity:  sel.length >= 5 ? "Moderate" : "Mild",
        confidence: `${70 + sel.length * 3}%`,
        tips: [
          "Rest and stay well-hydrated",
          "Monitor your temperature regularly",
          sel.includes("Chest Pain") ? "Seek emergency care immediately" : "Take over-the-counter medication if needed",
          "Consult a doctor if symptoms persist beyond 5 days",
        ],
      });
      setLoading(false);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4">
          <div className="pl-10 lg:pl-0">
            <h1 className="text-gray-800 font-bold text-lg">Symptom Checker</h1>
            <p className="text-gray-400 text-xs hidden sm:block">AI-powered health insights</p>
          </div>
          <button className="relative p-2 hover:bg-gray-100 rounded-xl">
            <Bell className="w-5 h-5 text-gray-500" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
          </button>
        </div>
      </header>

      <main className="px-4 sm:px-6 py-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* ── Left: inputs ── */}
          <div className="space-y-4">

            {/* Selected count */}
            {sel.length > 0 && (
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200
                rounded-xl px-4 py-3 text-sm text-emerald-700">
                <Zap className="w-4 h-4" />
                <span><strong>{sel.length}</strong> symptom{sel.length > 1 ? "s" : ""} selected</span>
                <button onClick={() => setSel([])} className="ml-auto text-xs text-emerald-500 hover:text-emerald-700 underline">
                  Clear all
                </button>
              </div>
            )}

            {/* Symptom grid */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Activity className="w-4 h-4 text-blue-600" />
                </div>
                <h2 className="text-gray-800 font-semibold text-sm">Select Your Symptoms</h2>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {SYMPTOMS.map(s => {
                  const active = sel.includes(s);
                  return (
                    <button key={s} onClick={() => toggle(s)}
                      className={`
                        flex items-center justify-between gap-2 p-3 rounded-xl border-2
                        text-xs font-medium transition-all duration-150
                        ${active
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"}
                      `}>
                      <span className="text-left">{s}</span>
                      {active && <CheckCircle className="w-4 h-4 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Additional info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h2 className="text-gray-800 font-semibold text-sm mb-3">Additional Notes</h2>
              <textarea
                value={info} onChange={e => setInfo(e.target.value)}
                placeholder="Describe any other symptoms, duration, or concerns…"
                rows={3}
                className="w-full p-3 border border-gray-200 rounded-xl text-sm resize-none
                  focus:outline-none focus:ring-2 focus:ring-emerald-400 placeholder-gray-400
                  text-gray-700"
              />
            </div>

            {/* Predict button */}
            <button onClick={predict} disabled={!sel.length || loading}
              className={`w-full py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2
                transition-all duration-200 shadow-sm
                ${sel.length > 0
                  ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:from-violet-600 hover:to-purple-700 shadow-violet-200"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}>
              {loading
                ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Analysing…</span>
                : <><Stethoscope className="w-5 h-5" /> Analyse Symptoms</>
              }
            </button>
          </div>

          {/* ── Right: results ── */}
          <div className="space-y-4">
            {result ? (
              <>
                {/* Result card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-violet-500 to-purple-600 p-5 text-white">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-bold">Analysis Result</span>
                    </div>
                    <p className="text-violet-100 text-xs">Based on selected symptoms</p>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-gray-400 text-xs font-medium mb-1">Possible Condition</p>
                      <p className="text-gray-800 font-bold text-lg">{result.condition}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-blue-50 rounded-xl text-center">
                        <p className="text-blue-400 text-xs mb-1">Confidence</p>
                        <p className="text-blue-700 font-bold text-lg">{result.confidence}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-xl text-center">
                        <p className="text-gray-400 text-xs mb-2">Severity</p>
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold ${SEVERITY[result.severity].cls}`}>
                          <span className={`w-2 h-2 rounded-full ${SEVERITY[result.severity].dot}`} />
                          {result.severity}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <h3 className="text-gray-800 font-semibold text-sm mb-4">Recommendations</h3>
                  <ul className="space-y-2.5">
                    {result.tips.map((t, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center
                          justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        </div>
                        <span className="text-gray-600 text-sm leading-relaxed">{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button onClick={() => navigateTo("appointments")}
                  className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white
                    rounded-2xl text-sm font-bold flex items-center justify-center gap-2
                    hover:from-emerald-600 hover:to-teal-600 transition-all shadow-sm">
                  <User className="w-5 h-5" /> Consult a Doctor
                </button>
              </>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 flex flex-col
                items-center justify-center text-center min-h-64">
                <div className="w-16 h-16 bg-violet-50 rounded-2xl flex items-center justify-center mb-4">
                  <Activity className="w-8 h-8 text-violet-300" />
                </div>
                <p className="text-gray-500 font-medium text-sm">Select symptoms</p>
                <p className="text-gray-400 text-xs mt-1">and click "Analyse" to see results</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}