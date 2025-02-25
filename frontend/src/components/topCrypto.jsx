import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "./Loader"; // Assuming you have a Loader component
import "./topcrypto.css";

const TopCryptos = () => {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState("");

  // Fetch top 5 cryptos from your backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/top-cryptos");
        setCryptos(response.data.data); // Assuming the data is in response.data.data
        setLastUpdated(new Date().toLocaleTimeString());
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Determine if the price is increasing or decreasing
  const getPriceChangeIndicator = (crypto) => {
    const priceChange = crypto.quote.USD.percent_change_24h;
    if (priceChange > 0) {
      return "▲"; // Up arrow for increase
    } else if (priceChange < 0) {
      return "▼"; // Down arrow for decrease
    } else {
      return "●"; // Circle for no change
    }
  };

  if (loading) {
    return <Loader />; // Show a loading spinner while fetching data
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>; // Show error message
  }

  return (
    <div className="bg-gray-900 text-white p-4 rounded-lg shadow-lg">
      <h2 className="text-2xl text-center font-bold mb-4">
        Coin Market Cap Top 5
      </h2>
      <p className="text-center text-sm text-gray-400 mb-6">
        Last Updated: {lastUpdated}
      </p>

      {/* Marquee Container */}
      <div className="overflow-hidden whitespace-nowrap">
        <div className="inline-block animate-marquee">
          {cryptos.map((crypto) => (
            <div key={crypto.id} className="inline-block mx-4">
              <h3 className="text-xl font-bold inline">
                {crypto.name} ({crypto.symbol}):
              </h3>
              <p className="text-gray-300 font-semibold inline">
                ${crypto.quote.USD.price.toFixed(2)}{" "}
                <span
                  className={`text-sm ${
                    crypto.quote.USD.percent_change_24h > 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {getPriceChangeIndicator(crypto)}{" "}
                  {Math.abs(crypto.quote.USD.percent_change_24h).toFixed(2)}%
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopCryptos;
