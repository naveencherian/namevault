"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsModalOpen(false);
    };

    if (isModalOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) setIsModalOpen(false);
  };

  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
        <div className="max-w-4xl w-full text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            NameVault
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
            Never lose track of a domain again
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A dashboard to track domains, expiry dates, and renewal alerts. Stay on
            top of your domain portfolio with ease.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gray-900 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            Join the waitlist
          </button>
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={handleBackdropClick}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600 transition-colors duration-200 bg-white rounded-full p-2 shadow-md hover:bg-gray-50"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-6">
              <iframe
                src="https://tally.so/r/EkdEQ2"
                className="w-full h-[75vh] sm:h-[520px] border-0 rounded-lg"
                title="Join the waitlist"
                allow="clipboard-write"
              />
              <p className="text-sm text-gray-500 text-center mt-4">
                No spam. Just product updates.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
