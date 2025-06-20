import React from "react";

export default function AboutModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md text-gray-800 shadow-xl">
        <h2 className="text-lg font-semibold mb-2">About SpiñO</h2>
        <p className="text-sm mb-4">
          SpiñO is your Spinozistic AI coach. It guides you through emotional clarity
          using structured reasoning inspired by Baruch Spinoza’s philosophy.
        </p>
        <button
          onClick={onClose}
          className="text-sm text-blue-600 hover:underline"
        >
          Close
        </button>
      </div>
    </div>
  );
}
