import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Loader from "./Loader"; // Assuming you have a Loader component
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./topcrypto.css"; // We'll modify the CSS below

const TopCryptos = () => {
  const [cryptos, setCryptos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState("");
  const intervalRef = useRef(null);

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

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (cryptos.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === cryptos.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);

      return () => clearInterval(intervalRef.current); // Cleanup on unmount
    }
  }, [cryptos]);

  // Navigate to the previous crypto
  const handlePrev = () => {
    clearInterval(intervalRef.current); // Reset auto-slide on manual navigation
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? cryptos.length - 1 : prevIndex - 1
    );
    restartAutoSlide();
  };

  // Navigate to the next crypto
  const handleNext = () => {
    clearInterval(intervalRef.current); // Reset auto-slide on manual navigation
    setCurrentIndex((prevIndex) =>
      prevIndex === cryptos.length - 1 ? 0 : prevIndex + 1
    );
    restartAutoSlide();
  };

  // Restart auto-slide after manual navigation
  const restartAutoSlide = () => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === cryptos.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
  };

  // Handle dot navigation
  const handleDotClick = (index) => {
    clearInterval(intervalRef.current); // Reset auto-slide on dot click
    setCurrentIndex(index);
    restartAutoSlide();
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

  if (cryptos.length === 0) {
    return <div className="text-center text-gray-500">No data available</div>;
  }

  return (
    <div className="bg-gray-900 text-white p-4 rounded-lg shadow-lg relative">
      {/* Last Updated */}
      <p className="text-center text-sm text-gray-400 mb-6">
        Last Updated: {lastUpdated}
      </p>

      {/* Carousel Container */}
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {cryptos.map((crypto) => (
            <div
              key={crypto.id}
              className="min-w-full flex justify-center items-center p-4"
            >
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">
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
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 transition-all duration-300"
        >
          <ChevronLeft className="text-white" size={24} />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 transition-all duration-300"
        >
          <ChevronRight className="text-white" size={24} />
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-4 space-x-2">
        {cryptos.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentIndex === index ? "bg-blue-500" : "bg-gray-500"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default TopCryptos;
