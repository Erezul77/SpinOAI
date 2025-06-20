import { useEffect, useRef, useState } from "react";
import Chat from "./components/Chat";
import TopBar from "./components/TopBar";
import AboutModal from "./components/AboutModal";

export default function App() {
  const [showAbout, setShowAbout] = useState(false);
  const [language, setLanguage] = useState("en");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  });

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <TopBar
        onAboutClick={() => setShowAbout(true)}
        onLanguageChange={() => {
          setLanguage((prev) => (prev === "en" ? "he" : "en"));
        }}
        currentLanguage={language}
      />
      <main className="flex-1 overflow-y-auto px-4 py-2">
        <Chat language={language} />
        <div ref={messagesEndRef} />
      </main>
      <AboutModal isOpen={showAbout} onClose={() => setShowAbout(false)} />
    </div>
  );
}
