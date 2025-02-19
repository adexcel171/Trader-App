import React, { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className=" bg-gradient-to-r from-white to-gray-300 text-black p-4 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <a href="/" className="text-black text-2xl font-bold">
              Trader
            </a>
          </div>

          {/* Hamburger Menu for Mobile */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-black hover:bg-gray-700 focus:outline-none"
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
          <div className="hidden md:flex md:items-center md:space-x-4">
            <a
              href="/dashboard"
              className="text-black hover:bg-gray-700 hover:text-black px-3 py-2 rounded-md text-md font-medium"
            >
              Dashboard
            </a>
            <a
              href="/markets"
              className="text-black hover:bg-gray-700 hover:text-black px-3 py-2 rounded-md text-md font-medium"
            >
              Markets
            </a>
            <a
              href="/portfolio"
              className="text-black hover:bg-gray-700 hover:text-black px-3 py-2 rounded-md text-md font-medium"
            >
              Portfolio
            </a>
            <a
              href="/wallet"
              className="text-black hover:bg-gray-700 hover:text-black px-3 py-2 rounded-md text-md font-medium"
            >
              Wallet
            </a>
            <a
              href="/profile"
              className="text-black hover:bg-gray-700 hover:text-black px-3 py-2 rounded-md text-md font-medium"
            >
              Profile
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Menu (Opens from the Left) */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          {/* Overlay Background */}
          <div
            className="fixed inset-0 bg-gray-800 bg-opacity-50"
            onClick={toggleMenu}
          ></div>

          {/* Menu Container */}
          <div className="fixed inset-y-0 right-0 w-64 bg-gray-800 shadow-lg">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
              <span className="text-black text-lg font-bold">Trader</span>
              <button
                onClick={toggleMenu}
                className="text-gray-400 hover:text-black focus:outline-none"
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
                className="text-black hover:bg-gray-700 hover:text-black block px-3 py-2 rounded-md text-base font-medium"
              >
                Dashboard
              </a>
              <a
                href="/markets"
                className="text-black hover:bg-gray-700 hover:text-black block px-3 py-2 rounded-md text-base font-medium"
              >
                Markets
              </a>
              <a
                href="/portfolio"
                className="text-black hover:bg-gray-700 hover:text-black block px-3 py-2 rounded-md text-base font-medium"
              >
                Portfolio
              </a>
              <a
                href="/wallet"
                className="text-black hover:bg-gray-700 hover:text-black block px-3 py-2 rounded-md text-base font-medium"
              >
                Wallet
              </a>
              <a
                href="/profile"
                className="text-black hover:bg-gray-700 hover:text-black block px-3 py-2 rounded-md text-base font-medium"
              >
                Profile
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
