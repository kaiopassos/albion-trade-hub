"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, Bot, User, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "Qual a melhor cidade para minha ilha?",
  "Como funciona city flip?",
  "O que plantar na ilha para lucrar mais?",
  "Quais os melhores itens para flip agora?",
  "Vale a pena craftar T4 bags?",
  "Como calcular margem de lucro?",
];

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const content = text || input;
    if (!content.trim()) return;

    const userMessage: Message = { role: "user", content };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();

      if (data.error) {
        setMessages([...newMessages, { role: "assistant", content: `Erro: ${data.error}` }]);
      } else {
        setMessages([...newMessages, { role: "assistant", content: data.reply }]);
      }
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Erro de conexao. Tente novamente." }]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="rounded-lg bg-[#c8a84e]/10 p-2 border border-[#c8a84e]/20">
          <MessageCircle className="h-6 w-6 text-[#c8a84e]" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#e8dcc8]">Assistente IA</h2>
          <p className="text-[#8b7635] text-sm">Tire duvidas sobre mercado, ilha, builds e estrategias.</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto rounded-lg border border-[#2a2f3e] bg-[#12151e] p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full space-y-6">
            <div className="rounded-full bg-[#c8a84e]/10 p-6 border border-[#c8a84e]/20">
              <Bot className="h-12 w-12 text-[#c8a84e]" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-[#e8dcc8] font-medium">Como posso te ajudar?</p>
              <p className="text-xs text-[#8b7635]">Tenho acesso aos dados de mercado em tempo real.</p>
            </div>
            <div className="grid grid-cols-2 gap-2 max-w-lg">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="rounded-lg border border-[#2a2f3e] bg-[#181c28] px-3 py-2 text-xs text-[#a89878] hover:border-[#c8a84e]/30 hover:text-[#c8a84e] transition-colors text-left"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
            {msg.role === "assistant" && (
              <div className="shrink-0 h-8 w-8 rounded-lg bg-[#c8a84e]/10 flex items-center justify-center border border-[#c8a84e]/20">
                <Bot className="h-4 w-4 text-[#c8a84e]" />
              </div>
            )}
            <div className={`rounded-lg px-4 py-3 max-w-[75%] text-sm ${
              msg.role === "user"
                ? "bg-[#c8a84e]/10 text-[#e8dcc8] border border-[#c8a84e]/20"
                : "bg-[#181c28] text-[#a89878] border border-[#2a2f3e]"
            }`}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
            {msg.role === "user" && (
              <div className="shrink-0 h-8 w-8 rounded-lg bg-[#2a2f3e] flex items-center justify-center">
                <User className="h-4 w-4 text-[#a89878]" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="shrink-0 h-8 w-8 rounded-lg bg-[#c8a84e]/10 flex items-center justify-center border border-[#c8a84e]/20">
              <Bot className="h-4 w-4 text-[#c8a84e]" />
            </div>
            <div className="rounded-lg bg-[#181c28] border border-[#2a2f3e] px-4 py-3">
              <Loader2 className="h-4 w-4 text-[#c8a84e] animate-spin" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Pergunte sobre mercado, ilha, builds..."
          className="flex-1 rounded-lg border border-[#2a2f3e] bg-[#181c28] px-4 py-3 text-sm text-[#e8dcc8] placeholder:text-[#8b7635] focus:border-[#c8a84e] focus:outline-none"
          disabled={loading}
        />
        <button
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          className="rounded-lg bg-[#c8a84e] px-4 py-3 text-[#0c0e14] hover:bg-[#d4b85e] disabled:opacity-50 transition-colors"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
