import React, { useState } from "react";
import { Copy, Check, Search } from "lucide-react";

const wallets = [
  { name: "Trust Wallet", address: "0x1234abcd5678efgh9012ijkl" },
  { name: "Binance Wallet", address: "bnb1234abcd5678efgh9012ijkl" },
  { name: "Metamask", address: "0x9876mnop3456qrst7890uvwx" },
];

export default function WalletAccounts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedAddress, setCopiedAddress] = useState(null);
  const whatsappLink =
    "https://wa.me/2348119223162?text=Payment%20Proof%20Screenshot";

  // Filter wallets based on search query
  const filteredWallets = wallets.filter((wallet) =>
    wallet.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Copy wallet address to clipboard
  const handleCopyAddress = (address) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000); // Reset after 2 seconds
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 bg-gray-900 text-white rounded-lg shadow-lg">
      {/* Header */}
      <h2 className="text-2xl font-bold text-center">Wallet Accounts</h2>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search wallets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 pl-10 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
      </div>

      {/* Wallet List */}
      <div className="space-y-4">
        {filteredWallets.length > 0 ? (
          filteredWallets.map((wallet, index) => (
            <div
              key={index}
              className="p-4 bg-gray-800 rounded-lg flex justify-between items-center hover:bg-gray-750 transition-colors"
            >
              <div>
                <h3 className="text-lg font-semibold">{wallet.name}</h3>
                <p className="text-gray-400 text-sm">{wallet.address}</p>
              </div>
              <button
                className="px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded-lg text-white flex items-center"
                onClick={() => handleCopyAddress(wallet.address)}
              >
                {copiedAddress === wallet.address ? (
                  <Check className="mr-2" size={16} />
                ) : (
                  <Copy className="mr-2" size={16} />
                )}
                {copiedAddress === wallet.address ? "Copied!" : "Copy"}
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400">No wallets found.</p>
        )}
      </div>

      {/* WhatsApp Payment Proof */}
      <div className="text-center mt-6">
        <p className="text-gray-400 mb-2">Send payment proof screenshot:</p>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white inline-block transition-colors"
        >
          Send to WhatsApp
        </a>
      </div>
    </div>
  );
}
