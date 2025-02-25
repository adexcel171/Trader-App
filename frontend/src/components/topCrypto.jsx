import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "./Loader"; // Assuming you have a Loader component
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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

  // Generate random price data for the chart (for demonstration purposes)
  const generatePriceData = () => {
    const data = [];
    for (let i = 0; i < 7; i++) {
      data.push(Math.floor(Math.random() * 10000) + 50000); // Random prices between 50,000 and 60,000
    }
    return data;
  };

  // Prepare chart data for each crypto
  const getChartData = (crypto) => {
    return {
      labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"], // X-axis labels
      datasets: [
        {
          label: "Price (USD)",
          data: generatePriceData(), // Replace with real data if available
          borderColor:
            crypto.quote.USD.percent_change_24h > 0 ? "#10B981" : "#EF4444", // Green for increase, red for decrease
          backgroundColor: "transparent",
          borderWidth: 2,
          tension: 0.4, // Smooth line
          pointRadius: 0, // Hide points
        },
      ],
    };
  };

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

      {/* Crypto List */}
      <div className="space-y-4">
        {cryptos.map((crypto) => (
          <div
            key={crypto.id}
            className="bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-center">
              {/* Coin Name and Price */}
              <div className="flex flex-col">
                <h3 className="text-xl font-bold">
                  {crypto.name} ({crypto.symbol})
                </h3>
                <p className="text-gray-300 font-semibold">
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

              {/* Small Graph */}
              <div className="w-24 h-16">
                <Line
                  data={getChartData(crypto)}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false, // Hide legend
                      },
                      tooltip: {
                        enabled: false, // Disable tooltips
                      },
                    },
                    scales: {
                      x: {
                        display: false, // Hide x-axis
                      },
                      y: {
                        display: false, // Hide y-axis
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopCryptos;
