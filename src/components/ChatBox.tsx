import React, { useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatBox() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Welcome to your 1:1 session with SpiñO. What's troubling you?",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!input.trim()) return;

    const updatedMessages = [...messages, { role: "user" as const, content: input }];
    setMessages(updatedMessages);
    setInput("");
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await res.json();

      if (res.ok && typeof data.result === "string") {
        const assistantMessage = { role: "assistant" as const, content: data.result };
        setMessages([...updatedMessages, assistantMessage]);
      } else {
        setError("SpiñO could not generate a reply.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while communicating with SpiñO.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div>
      <h1>
        <strong>SpiñO AI</strong>
      </h1>
      {messages.map((msg, index) => (
        <p key={index}>
          <strong>{msg.role === "user" ? "You" : "SpiñO"}:</strong> {msg.content}
        </p>
      ))}
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={3}
        cols={80}
        style={{ display: "block", marginTop: "1em" }}
      />
      <button onClick={handleSubmit} disabled={loading || !input.trim()}>
        Send
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
