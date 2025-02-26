import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import { useGetCryptosQuery } from "../services/cryptoApi"; // Ensure correct import
import {
  ArrowUp,
  ArrowDown,
  TrendingUp,
  Info,
  Search,
  Filter,
  Star,
  ChevronDown,
} from "lucide-react";
import Loader from "../components/Loader";
import Swal from "sweetalert2";
import TopCryptos from "../components/topCrypto";

const Home = () => {
  const { data: cryptos, isLoading, isError } = useGetCryptosQuery();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("rate");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("NGN");
  const adminWhatsAppBase = "https://wa.me/2348119223162?text=";

  // Animation controls
  const controls = useAnimation();
  const [ref, inView] = useInView();

  // Trigger animation when in view
  useEffect(() => {
    controls.start("visible"); // Start animation immediately
  }, []);

  // Handle errors
  if (isError) {
    return (
      <div className="text-center py-10 text-red-600">
        <p>Failed to load cryptocurrencies. Please try again later.</p>
      </div>
    );
  }

  // Filter and sort cryptos
  const filteredCryptos = cryptos
    ?.filter((crypto) =>
      crypto.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "rate") return b.rate - a.rate;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  const handleBuyClick = (cryptoName) => {
    Swal.fire({
      title: "Buy Cryptocurrency",
      html:
        `<input id="swal-input1" class="swal2-input" placeholder="Coin Name" value="${cryptoName}" readonly>` +
        `<input id="swal-input2" class="swal2-input" placeholder="Rate">`,
      focusConfirm: false,
      preConfirm: () => {
        return [
          document.getElementById("swal-input1").value,
          document.getElementById("swal-input2").value,
        ];
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const [coinName, rate] = result.value;
        const message = `Hello%2C%20I%20want%20to%20buy%20${encodeURIComponent(
          coinName
        )}%20at%20the%20rate%20of%20₦${rate}`;
        window.open(`${adminWhatsAppBase}${message}`, "_blank");
      }
    });
  };

  if (isLoading)
    return (
      <div>
        <Loader />{" "}
      </div>
    );

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="text-center mt-7 mb-12">
        <h1 className="text-4xl text-center mt-6  font-extrabold mb-4 text-gray-800">
          Your Trusted Marketplace for Buying and Selling Cryptocurrency
        </h1>
        <p className="text-lg text-gray-600">
          Get the best deals! Click ‘Buy’ or ‘Sell’ now to trade with trusted
          sellers at great rates
        </p>
      </div>
      <TopCryptos />

      {/* Search, Sort, and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search cryptocurrencies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 pl-10 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-3 pr-8 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
          >
            <option value="rate">Sort by Rate</option>
            <option value="name">Sort by Name</option>
          </select>
          <ChevronDown
            className="absolute right-3 top-3 text-gray-400 pointer-events-none"
            size={20}
          />
        </div>

        {/* Filters Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2"
        >
          <Filter size={20} className="text-gray-600" />
          <span>Filters</span>
        </button>
      </div>

      {/* Filters Dropdown */}
      {showFilters && (
        <div className="mb-8 p-6 bg-white rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Currency Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency
              </label>
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="w-full p-2 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="NGN">NGN</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Crypto Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCryptos?.map((crypto, index) => {
          const message = `Hello%2C%20I%20want%20to%20sell%20${encodeURIComponent(
            crypto.name
          )}%20at%20the%20rate%20of%20₦${crypto.rate}`;

          const priceChange = crypto.priceChange24h || 0;
          const isPositiveChange = priceChange >= 0;

          return (
            <motion.div
              ref={ref}
              initial={{ opacity: 0, y: 20 }}
              animate="visible"
              transition={{ duration: 0.3, ease: "easeOut" }}
              variants={{
                visible: { opacity: 1, y: 0 },
              }}
              className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200"
            >
              {/* Crypto Name and Icon */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-800">
                  {crypto.name}
                </h3>
                <div className="p-2 bg-blue-50 rounded-full">
                  <TrendingUp className="text-blue-500" size={24} />
                </div>
              </div>

              {/* Rate and Price Change */}
              <div className="space-y-2">
                <p className="text-gray-600 font-medium">
                  Rate: ₦{crypto.rate.toLocaleString()}
                </p>
                <div className="flex items-center">
                  <span
                    className={`flex items-center text-sm font-medium ${
                      isPositiveChange ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isPositiveChange ? (
                      <ArrowUp className="mr-1" size={16} />
                    ) : (
                      <ArrowDown className="mr-1" size={16} />
                    )}
                    {Math.abs(priceChange).toFixed(2)}%
                  </span>
                  <span className="text-sm text-gray-500 ml-2">(24h)</span>
                </div>
              </div>

              {/* Buy Now Button */}
              <div className="flex justify-center items-center">
                <butt
                  onClick={() => handleBuyClick(crypto.name)}
                  className="mt-6 mx-3.5 w-full h-[60px] flex justify-center items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-center rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                >
                  Buy Now
                </butt

                {/* Sell Now Button */}
                <a
                  href={adminWhatsAppBase + message}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 w-full mx-3  h-[60px] flex justify-center items-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white text-center rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300"
                >
                  Sell Now
                </a>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
