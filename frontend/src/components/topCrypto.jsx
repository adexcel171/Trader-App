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

  // Fetch top 5 cryptos from your backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/top-cryptos");
        setCryptos(response.data.data); // Assuming the data is in response.data.data
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
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderWidth: 2,
          tension: 0.4, // Smooth line
        },
      ],
    };
  };

  if (loading) {
    return <Loader />; // Show a loading spinner while fetching data
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>; // Show error message
  }

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl text-center  font-bold mb-6">
        Coin Market Cap Top 5{" "}
      </h2>

      {/* Crypto List */}
      <div className="space-y-6">
        {cryptos.map((crypto) => (
          <div
            key={crypto.id}
            className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                {crypto.name} ({crypto.symbol})
              </h3>
              <p className="text-gray-300">
                Price: ${crypto.quote.USD.price.toFixed(2)}
              </p>
            </div>

            {/* Chart */}
            <div className="h-48">
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
                      enabled: true,
                    },
                  },
                  scales: {
                    x: {
                      grid: {
                        display: false, // Hide x-axis grid lines
                      },
                      ticks: {
                        color: "rgba(255, 255, 255, 0.7)", // White text for x-axis
                      },
                    },
                    y: {
                      grid: {
                        color: "rgba(255, 255, 255, 0.1)", // Light grid lines for y-axis
                      },
                      ticks: {
                        color: "rgba(255, 255, 255, 0.7)", // White text for y-axis
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopCryptos;
