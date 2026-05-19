import { Bot, SendHorizontal, Sparkles } from "lucide-react";
import { useState } from "react";
import { useAssistant } from "../../hooks/useAssistant";

export default function FloatingAssistant() {
  const { isOpen, setIsOpen, messages, sendMessage, sending, contextData } = useAssistant();
  const [input, setInput] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!input.trim()) return;
    const message = input.trim();
    setInput("");
    await sendMessage(message);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {isOpen ? (
        <div className="mb-3 w-[min(92vw,380px)] overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/95 shadow-panel backdrop-blur-xl">
          <div className="border-b border-slate-800 bg-gradient-to-r from-indigo-500/15 to-cyan-400/10 px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500 text-white">
                <Bot size={18} />
              </div>
              <div>
                <p className="font-display text-lg font-bold text-white">Workspace Assistant</p>
                <p className="text-sm text-slate-400">Tasks, projects, deadlines, and focus</p>
              </div>
            </div>
            {contextData?.guidance ? (
              <div className="mt-3 rounded-2xl border border-slate-800 bg-slate-950/50 px-3 py-3 text-sm text-slate-300">
                <div className="mb-1 flex items-center gap-2 text-cyan-300">
                  <Sparkles size={14} />
                  <span className="text-xs font-semibold uppercase tracking-[0.2em]">Context</span>
                </div>
                {contextData.guidance}
              </div>
            ) : null}
          </div>

          <div className="max-h-80 space-y-3 overflow-y-auto px-4 py-4">
            {messages.slice(-8).map((message) => (
              <div
                className={`rounded-2xl px-3 py-3 text-sm ${
                  message.role === "assistant" ? "bg-slate-950 text-slate-200" : "ml-8 bg-indigo-500/15 text-white"
                }`}
                key={message.id}
              >
                {message.text}
              </div>
            ))}
          </div>

          <form className="border-t border-slate-800 px-4 py-4" onSubmit={handleSubmit}>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-950/70 px-3 py-2">
              <input
                className="flex-1 bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
                placeholder="Ask about overdue tasks, priorities, or your day..."
                value={input}
                onChange={(event) => setInput(event.target.value)}
              />
              <button className="rounded-xl bg-indigo-500 p-2 text-white transition hover:bg-indigo-400 disabled:opacity-60" disabled={sending} type="submit">
                <SendHorizontal size={16} />
              </button>
            </div>
          </form>
        </div>
      ) : null}

      <button
        className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500 text-white shadow-panel transition hover:bg-indigo-400"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <Bot size={20} />
      </button>
    </div>
  );
}
