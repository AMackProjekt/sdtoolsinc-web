"use client";

import { useState } from "react";
import { Send, Phone, Video, MoreVertical, Search, CheckCircle2, Bot } from "lucide-react";

export default function MessagesChannel() {
  const [activeChat, setActiveChat] = useState("A3");
  const [messagePrompt, setMessagePrompt] = useState("");
  
  const [chats, setChats] = useState({
    "A3": [
      { sender: "client", name: "Brett Purettman", time: "10:14 AM", text: "Hey Mack, I got the paperwork for Section 8 you left me." },
      { sender: "staff", name: "Mack", time: "10:20 AM", text: "Great. Please sign pages 3 and 4 where highlighted, and I'll scoop it up at 2 PM." },
      { sender: "client", name: "Brett Purettman", time: "10:25 AM", text: "Will do, thanks man." }
    ],
    "J8": [
      { sender: "staff", name: "Mack", time: "Yesterday", text: "Alisa, reminder that your DMV voucher expires on Friday. We need to go tomorrow." },
      { sender: "client", name: "Alisa Foster", time: "Yesterday", text: "I know, I have it in my bag. I'll be ready at 9 AM." }
    ],
    "D10": [
      { sender: "client", name: "Anthony Jones", time: "Tuesday", text: "Are there any updates on my medical assessment review?" }
    ]
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messagePrompt.trim()) return;

    setChats(prev => ({
      ...prev,
      [activeChat]: [
        ...(prev[activeChat as keyof typeof prev] || []),
        { sender: "staff", name: "Mack", time: "Just now", text: messagePrompt }
      ]
    }));
    setMessagePrompt("");
  };

  return (
    <div className="h-[calc(100vh-8rem)] min-h-[600px] flex animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      
      {/* Sidebar: Conversation List */}
      <div className="w-80 border-r border-slate-100 flex flex-col bg-slate-50/50 shrink-0">
        <div className="p-4 border-b border-slate-100 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg text-charcoal-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span> Google Chat
            </h2>
            <button 
              onClick={() => window.open('https://chat.google.com/u/1/app/chat/AAQABMc-VMI', '_blank')}
              className="px-2.5 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-blue-100 hover:bg-blue-100 transition shadow-sm"
            >
              Launch App
            </button>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search Workspace..." 
              className="w-full bg-slate-100 border-none text-slate-700 rounded-xl pl-9 pr-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 transition text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto w-full custom-scrollbar">
          {/* Main CaseFlow Channel */}
          <div className="p-4 bg-teal-50 border-b border-teal-100 cursor-pointer flex gap-3 relative">
            <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white shrink-0 shadow-sm">
              <span className="font-bold text-sm">A3</span>
              <div className="absolute right-auto bottom-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-0.5">
                <h3 className="text-sm font-bold text-teal-900 truncate">Brett Purettman</h3>
                <span className="text-xs font-semibold text-teal-600">10:25 AM</span>
              </div>
              <p className="text-xs text-teal-700/80 truncate font-semibold">Will do, thanks man.</p>
            </div>
          </div>

          <div className="p-4 hover:bg-slate-50 border-b border-slate-100 cursor-pointer flex gap-3 transition">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 shrink-0">
              <span className="font-bold text-sm">J8</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-0.5">
                <h3 className="text-sm font-bold text-charcoal-900 truncate">Alisa Foster</h3>
                <span className="text-xs text-slate-400">Yesterday</span>
              </div>
              <p className="text-xs text-slate-500 truncate">I know, I have it in my bag...</p>
            </div>
          </div>

          <div className="p-4 hover:bg-slate-50 border-b border-slate-100 cursor-pointer flex gap-3 transition">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 shrink-0">
              <span className="font-bold text-sm">D10</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-0.5">
                <h3 className="text-sm font-bold text-charcoal-900 truncate">Anthony Jones</h3>
                <span className="text-xs text-slate-400">Tuesday</span>
              </div>
              <p className="text-xs text-slate-500 truncate">Are there any updates on my m...</p>
            </div>
          </div>
          
          {/* AI Channel */}
          <div className="p-4 hover:bg-indigo-50 border-b border-slate-100 cursor-pointer flex gap-3 transition mt-8 rounded-t-xl bg-slate-50">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-sm">
              <Bot className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-0.5">
                <h3 className="text-sm font-bold text-indigo-900 truncate">CaseFlow Bot</h3>
                <span className="text-xs text-indigo-400 font-semibold text-right">System</span>
              </div>
              <p className="text-xs text-indigo-700/70 truncate">Ready to draft SOPs or run queries...</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
        
        {/* Chat Header */}
        <div className="h-16 border-b border-slate-100 bg-white/80 backdrop-blur-sm px-6 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-SM border border-teal-200">
              A3
            </div>
            <div>
              <h2 className="font-bold text-lg text-charcoal-900 flex items-center gap-2">
                Brett Purettman <span className="w-2 h-2 rounded-full bg-green-500 mt-1"></span>
              </h2>
              <p className="text-xs text-slate-500 font-medium tracking-wide">Secure SMS / CaseFlow App Connected</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition">
              <Phone className="w-5 h-5" />
            </button>
            <button className="p-2.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition">
              <Video className="w-5 h-5" />
            </button>
            <div className="w-px h-6 bg-slate-200 mx-2"></div>
            <button className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Messages Log */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 custom-scrollbar">
          {chats["A3"].map((msg, idx) => (
            <div key={idx} className={`flex flex-col ${msg.sender === 'staff' ? 'items-end' : 'items-start'}`}>
              <div className="flex items-end gap-2 max-w-[75%]">
                {msg.sender === 'client' && (
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 shrink-0 mb-5">
                    BP
                  </div>
                )}
                
                <div className={`flex flex-col ${msg.sender === 'staff' ? 'items-end' : 'items-start'}`}>
                  <span className="text-[11px] font-semibold text-slate-400 mb-1 px-1">
                    {msg.sender === 'staff' ? `You (${msg.time})` : `${msg.name} (${msg.time})`}
                  </span>
                  <div className={`px-5 py-3 text-sm font-medium leading-relaxed shadow-sm ${
                    msg.sender === 'staff' 
                      ? 'bg-teal-600 text-white rounded-2xl rounded-br-sm' 
                      : 'bg-white border border-slate-200 text-slate-700 rounded-2xl rounded-bl-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>

                {msg.sender === 'staff' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-600 to-indigo-600 border border-white flex items-center justify-center text-xs font-bold text-white shrink-0 mb-5 shadow-sm">
                    M
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Message Input Box */}
        <div className="p-4 bg-white border-t border-slate-100 shrink-0">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input 
              type="text" 
              value={messagePrompt}
              onChange={(e) => setMessagePrompt(e.target.value)}
              placeholder="Message Brett securely..." 
              className="w-full bg-slate-100 border-none text-slate-700 placeholder:text-slate-400 rounded-2xl pl-5 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-teal-500/30 transition text-sm shadow-inner"
            />
            <button 
              type="submit" 
              disabled={!messagePrompt.trim()} 
              className="absolute right-2 p-2.5 bg-teal-600 text-white rounded-xl hover:bg-teal-500 disabled:opacity-50 disabled:hover:bg-teal-600 transition shadow-md shadow-teal-500/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="mt-3 flex items-center justify-between text-[11px] font-semibold text-slate-400 px-2">
            <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-500"/> Sent over End-to-End Encryption</div>
            <span>Press Enter to send</span>
          </div>
        </div>

      </div>
    </div>
  );
}
