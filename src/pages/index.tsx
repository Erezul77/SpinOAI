
import React, { useState } from "react";
import axios from "axios";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Main() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Welcome to your 1:1 session with SpiñO. What's troubling you?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user" as const, content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const res = await axios.post("/api/chat", { messages: newMessages });
      const reply = res.data.reply?.content || "No reply.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Error." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 font-serif">
      <header className="bg-white shadow p-4 text-center text-2xl font-bold tracking-wide text-indigo-700">
        SpiñO – Your Reflection Companion
      </header>
      <div className="max-w-2xl mx-auto bg-white mt-6 p-6 rounded-2xl shadow-md">
        <div className="space-y-4 mb-6 max-h-[60vh] overflow-y-auto pr-2">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-3 rounded-xl whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-blue-100 text-right ml-12"
                  : "bg-gray-200 text-left mr-12"
              }`}
            >
              <div className="text-sm text-gray-700">
                <strong>{msg.role === "user" ? "You" : "SpiñO"}:</strong>{" "}
                {msg.content}
              </div>
            </div>
          ))}
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={3}
          placeholder="Type and press Enter..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          className="w-full p-3 border border-gray-300 rounded-xl resize-none"
        />
        <div className="text-right mt-2">
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Thinking..." : "Send"}
          </button>
        </div>
      </div>
    </main>
  );
}
