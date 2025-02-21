import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const portfolioData = [
  { name: "Bitcoin", symbol: "BTC", price: 48752, change: 2.3, balance: 0.5 },
  { name: "Ethereum", symbol: "ETH", price: 3205, change: -1.2, balance: 2 },
  { name: "BNB", symbol: "BNB", price: 405, change: 0.5, balance: 5 },
];

export default function CryptoPortfolio() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 bg-gray-900 text-white rounded-lg shadow-lg">
      {/* Portfolio Summary */}
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-xl font-semibold">Portfolio Overview</h2>
        <div className="flex justify-between mt-4">
          <div>
            <p className="text-gray-400">Total Balance</p>
            <h3 className="text-2xl font-bold">$56,230.00</h3>
          </div>
          <div>
            <p className="text-gray-400">Profit/Loss</p>
            <h3 className="text-2xl font-bold text-green-500">+5.4%</h3>
          </div>
        </div>
      </div>

      {/* Portfolio List */}
      <div className="space-y-4">
        {portfolioData.map((asset, index) => (
          <div
            key={index}
            className="p-4 bg-gray-800 rounded-lg flex justify-between items-center"
          >
            <div>
              <h3 className="text-lg font-semibold">
                {asset.name} ({asset.symbol})
              </h3>
              <p className="text-gray-400">
                Balance: {asset.balance} {asset.symbol}
              </p>
            </div>
            <div>
              <p className="text-lg font-bold">
                ${asset.price.toLocaleString()}
              </p>
              <p
                className={
                  asset.change >= 0 ? "text-green-500" : "text-red-500"
                }
              >
                {asset.change >= 0 ? (
                  <ArrowUpRight className="inline-block" />
                ) : (
                  <ArrowDownRight className="inline-block" />
                )}
                {asset.change}%
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex justify-center space-x-4 mt-6">
        <button className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white">
          Deposit
        </button>
        <button className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white">
          Withdraw
        </button>
      </div>
    </div>
  );
}
