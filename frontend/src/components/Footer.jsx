import React from "react";
import {
  FaBitcoin,
  FaEthereum,
  FaTelegram,
  FaTwitter,
  FaGithub,
  FaLinkedin,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12 mt-auto">
      <div className="container mx-auto px-6">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold flex items-center">
              <FaBitcoin className="mr-2 text-yellow-500" />
              Crypto Trader
            </h3>
            <p className="text-gray-400">
              Your gateway to the world of cryptocurrency trading. Trade,
              invest, and grow with us.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/dashboard"
                  className="text-gray-400 hover:text-white transition-all"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href="/wallet"
                  className="text-gray-400 hover:text-white transition-all"
                >
                  Wallet
                </a>
              </li>
              <li>
                <a
                  href="/markets"
                  className="text-gray-400 hover:text-white transition-all"
                >
                  Markets
                </a>
              </li>
              <li>
                <a
                  href="/profile"
                  className="text-gray-400 hover:text-white transition-all"
                >
                  Profile
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/blog"
                  className="text-gray-400 hover:text-white transition-all"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="/faq"
                  className="text-gray-400 hover:text-white transition-all"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="/support"
                  className="text-gray-400 hover:text-white transition-all"
                >
                  Support
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="text-gray-400 hover:text-white transition-all"
                >
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-all"
              >
                <FaTwitter className="w-6 h-6" />
              </a>
              <a
                href="https://telegram.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-all"
              >
                <FaTelegram className="w-6 h-6" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-all"
              >
                <FaGithub className="w-6 h-6" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-all"
              >
                <FaLinkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} Crypto Trader. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
