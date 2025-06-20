import React from "react";

export default function TopBar({ onAboutClick, onLanguageToggle }: {
  onAboutClick: () => void;
  onLanguageToggle: () => void;
}) {
  return (
    <div className="flex justify-between items-center px-4 py-2 border-b border-gray-300 bg-white shadow-sm">
      <button
        onClick={onLanguageToggle}
        className="text-sm text-gray-700 hover:text-black"
      >
        🌐 Language
      </button>
      <button
        onClick={onAboutClick}
        className="text-sm text-gray-700 hover:text-black"
      >
        ℹ️ About
      </button>
    </div>
  );
}
