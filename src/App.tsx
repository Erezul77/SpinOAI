
import React from "react";
import Chat from "./components/Chat";
import TopBar from "./components/Header";
import AboutModal from "./components/AboutModal";

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-black">
      <TopBar />
      <main className="flex flex-col items-center justify-center p-4">
        <Chat />
      </main>
      <AboutModal />
    </div>
  );
};

export default App;
