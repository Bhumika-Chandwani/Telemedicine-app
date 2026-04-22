import React, { useState, useRef, useEffect } from "react";
import { Bell, User, Send, Search, Clock, CheckCheck, ArrowLeft, Circle } from "lucide-react";

const CONVOS = [
  { id:1, doctor:"Dr. Sarah Johnson",  spec:"Cardiology",       last:"Your test results look good.",         time:"10:30 AM",   unread:2, online:true  },
  { id:2, doctor:"Dr. Michael Chen",   spec:"General Medicine", last:"Please schedule a follow-up.",         time:"Yesterday",  unread:0, online:false },
  { id:3, doctor:"Dr. Emily Davis",    spec:"Dermatology",      last:"Apply the cream twice daily.",         time:"2 days ago", unread:0, online:true  },
  { id:4, doctor:"Dr. Robert Wilson",  spec:"Pediatrics",       last:"Thank you for your update.",           time:"3 days ago", unread:1, online:false },
];

const INITIAL_MSGS = [
  { from:"doctor",  text:"Hello! How are you feeling today?",                             time:"10:00 AM" },
  { from:"patient", text:"Hi Doctor, I'm feeling much better now.",                       time:"10:15 AM" },
  { from:"doctor",  text:"That's great to hear! Have you been taking your medication?",   time:"10:20 AM" },
  { from:"patient", text:"Yes, exactly as prescribed.",                                   time:"10:25 AM" },
  { from:"doctor",  text:"Your test results look good. Keep up with your medication.",    time:"10:30 AM" },
];

export function Messages() {
  const [conv,   setConv]   = useState(CONVOS[0]);
  const [msgs,   setMsgs]   = useState(INITIAL_MSGS);
  const [input,  setInput]  = useState("");
  const [q,      setQ]      = useState("");
  const [showList, setShowList] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  const send = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMsgs(m => [...m, { from:"patient", text:input.trim(), time: new Date().toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" }) }]);
    setInput("");
  };

  const selectConv = (c) => { setConv(c); setMsgs(INITIAL_MSGS); setShowList(false); };

  const filtered = CONVOS.filter(c =>
    c.doctor.toLowerCase().includes(q.toLowerCase()) ||
    c.spec.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4">
          <div className="pl-10 lg:pl-0">
            <h1 className="text-gray-800 font-bold text-lg">Messages</h1>
            <p className="text-gray-400 text-xs hidden sm:block">Chat with your healthcare team</p>
          </div>
          <button className="relative p-2 hover:bg-gray-100 rounded-xl">
            <Bell className="w-5 h-5 text-gray-500" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden" style={{ height: "calc(100vh - 73px)" }}>

        {/* ── Conversation list ── */}
        <div className={`
          ${showList ? "flex" : "hidden"} sm:flex
          w-full sm:w-72 lg:w-80 bg-white border-r border-gray-200 flex-col flex-shrink-0
        `}>
          {/* Search */}
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={q} onChange={e => setQ(e.target.value)}
                placeholder="Search doctors…"
                className="w-full pl-9 pr-4 py-2.5 bg-gray-100 rounded-xl text-sm
                  focus:outline-none focus:ring-2 focus:ring-emerald-400 placeholder-gray-400"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filtered.map(c => (
              <button key={c.id} onClick={() => selectConv(c)}
                className={`w-full px-4 py-3.5 border-b border-gray-50 hover:bg-gray-50
                  transition-colors text-left
                  ${conv.id === c.id ? "bg-emerald-50 border-l-2 border-l-emerald-500" : ""}`}>
                <div className="flex items-start gap-3">
                  <div className="relative flex-shrink-0">
                    <div className="w-11 h-11 bg-gradient-to-br from-violet-400 to-purple-500
                      rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    {c.online && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5
                        bg-emerald-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-gray-800 font-semibold text-sm truncate">{c.doctor}</p>
                      <span className="text-gray-400 text-xs flex-shrink-0 ml-2">{c.time}</span>
                    </div>
                    <p className="text-emerald-600 text-xs">{c.spec}</p>
                    <p className="text-gray-400 text-xs truncate mt-0.5">{c.last}</p>
                  </div>
                  {c.unread > 0 && (
                    <span className="w-5 h-5 bg-emerald-500 text-white text-xs rounded-full
                      flex items-center justify-center flex-shrink-0 font-semibold">
                      {c.unread}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Chat area ── */}
        <div className={`${!showList ? "flex" : "hidden"} sm:flex flex-1 flex-col min-w-0 bg-gray-50`}>

          {/* Chat header */}
          <div className="bg-white border-b border-gray-200 px-4 sm:px-5 py-3.5 flex items-center gap-3">
            <button onClick={() => setShowList(true)}
              className="sm:hidden p-2 hover:bg-gray-100 rounded-xl">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-purple-500
                rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              {conv.online && (
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3
                  bg-emerald-500 border-2 border-white rounded-full" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-800 font-semibold text-sm">{conv.doctor}</p>
              <p className="text-gray-400 text-xs flex items-center gap-1">
                {conv.online
                  ? <><Circle className="w-2 h-2 text-emerald-500 fill-emerald-500" />Online</>
                  : <><Circle className="w-2 h-2 text-gray-400 fill-gray-400" />Offline</>
                }
                · {conv.spec}
              </p>
            </div>
            <button className="px-3 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-semibold
              hover:bg-emerald-100 transition-colors hidden sm:block">
              View Profile
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.from === "patient" ? "justify-end" : "justify-start"}`}>
                {m.from === "doctor" && (
                  <div className="w-8 h-8 bg-gradient-to-br from-violet-400 to-purple-500
                    rounded-full flex items-center justify-center flex-shrink-0 mr-2 mt-auto">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className="max-w-[75%] sm:max-w-sm">
                  <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed
                    ${m.from === "patient"
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-br-md"
                      : "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-md"}`}>
                    {m.text}
                  </div>
                  <div className={`flex items-center gap-1 mt-1
                    ${m.from === "patient" ? "justify-end" : "justify-start"}`}>
                    <Clock className="w-3 h-3 text-gray-300" />
                    <span className="text-gray-300 text-xs">{m.time}</span>
                    {m.from === "patient" && <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="bg-white border-t border-gray-200 p-3 sm:p-4">
            <form onSubmit={send} className="flex gap-2">
              <input
                value={input} onChange={e => setInput(e.target.value)}
                placeholder="Type your message…"
                className="flex-1 bg-gray-100 text-gray-800 rounded-xl px-4 py-3 text-sm
                  focus:outline-none focus:ring-2 focus:ring-emerald-400 placeholder-gray-400"
              />
              <button type="submit"
                className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white
                  rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all
                  shadow-sm flex-shrink-0 disabled:opacity-50"
                disabled={!input.trim()}>
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}