// src/pages/index.tsx

import React, { useState } from "react";
import Head from "next/head";
import axios from "axios";

interface Message {
  sender: "user" | "bot";
  text: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "bot", text: "How do you feel today?" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessage: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    try {
      const res = await axios.post("/api/chat", {
        messages: [...messages, newMessage],
      });

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: res.data.reply || "..." },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "SpiñO: No reply." },
      ]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <Head>
        <title>SpiñO – Your Reflection Companion</title>
      </Head>
      <div className="min-h-screen bg-gray-100 p-4">
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">
          SpiñO – Your Reflection Companion
        </h1>
        <div className="max-w-3xl mx-auto bg-white p-4 rounded-lg shadow-lg">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-3 rounded-md ${
                  msg.sender === "user"
                    ? "bg-blue-100 text-right"
                    : "bg-gray-200 text-left"
                }`}
              >
                <strong>{msg.sender === "user" ? "You" : "SpiñO"}:</strong>{" "}
                {msg.text}
              </div>
            ))}
          </div>
          <div className="mt-6">
            <textarea
              className="w-full p-3 border rounded-md"
              rows={3}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type and press Enter..."
            />
            <div className="text-right mt-2">
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                onClick={sendMessage}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
