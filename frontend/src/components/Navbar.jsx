import React, { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-900 text-white p-4 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <a href="/" className="text-white font-bold flex items-center">
              {/* <img src="/logo.png" alt="Trader Logo" className="h-8 w-8 mr-2" /> */}
              TRADE CRYPTO
            </a>
          </div>

          {/* Hamburger Menu for Mobile */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <a
              href="/dashboard"
              className="text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <span className="mr-2">📊</span> Dashboard
            </a>
            <a
              href="/markets"
              className="text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <span className="mr-2">📈</span> Markets
            </a>
            <a
              href="/portfolio"
              className="text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <span className="mr-2">💼</span> Portfolio
            </a>
            <a
              href="/wallet"
              className="text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <span className="mr-2">💰</span> Wallet
            </a>
            <a
              href="/profile"
              className="text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <span className="mr-2">👤</span> Profile
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Menu (Opens from the Left) */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          {/* Overlay Background */}
          <div
            className="fixed inset-0 bg-gray-800 bg-opacity-75"
            onClick={toggleMenu}
          ></div>

          {/* Menu Container */}
          <div className="fixed inset-y-0 right-0 w-64 bg-gray-900 shadow-lg transform transition-transform duration-300 ease-in-out">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
              <span className="text-white font-bold flex items-center">
                {/* <img
                  src="/logo.png"
                  alt="Trader Logo"
                  className="h-8 w-8 mr-2"
                /> */}
                TRADE CRYPTO
              </span>
              <button
                onClick={toggleMenu}
                className="text-gray-400 hover:text-white focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Menu Links */}
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a
                href="/dashboard"
                className="text-gray-300 hover:text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium flex items-center"
              >
                <span className="mr-2">📊</span> Dashboard
              </a>
              <a
                href="/markets"
                className="text-gray-300 hover:text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium flex items-center"
              >
                <span className="mr-2">📈</span> Markets
              </a>
              <a
                href="/portfolio"
                className="text-gray-300 hover:text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium flex items-center"
              >
                <span className="mr-2">💼</span> Portfolio
              </a>
              <a
                href="/wallet"
                className="text-gray-300 hover:text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium flex items-center"
              >
                <span className="mr-2">💰</span> Wallet
              </a>
              <a
                href="/profile"
                className="text-gray-300 hover:text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium flex items-center"
              >
                <span className="mr-2">👤</span> Profile
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
