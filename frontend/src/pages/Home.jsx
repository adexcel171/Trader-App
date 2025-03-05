import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import { useGetCryptosQuery } from "../services/cryptoApi";
import { Search, Filter, ChevronDown, Copy } from "lucide-react";
import Loader from "../components/Loader";
import Swal from "sweetalert2";
import socket from "../services/socket";
import { useSelector } from "react-redux";
import { useCreateTransactionMutation } from "../services/transactionApi";

// Crypto logos
const cryptoImages = {
  Bitcoin: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
  Ethereum:
    "https://cryptologos.cc/logos/versions/ethereum-eth-logo-colored.svg?v=040",
  Tether: "https://cryptologos.cc/logos/tether-usdt-logo.png?v=040",
  "Binance Coin": "https://cryptologos.cc/logos/binance-coin-bnb-logo.png",
  Cardano: "https://cryptologos.cc/logos/cardano-ada-logo.png",
  XRP: "https://cryptologos.cc/logos/xrp-xrp-logo.png",
  Solana: "https://cryptologos.cc/logos/solana-sol-logo.png",
  Polkadot: "https://cryptologos.cc/logos/polkadot-new-dot-logo.png",
  Dogecoin: "https://cryptologos.cc/logos/dogecoin-doge-logo.png",
  "USD Coin": "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
};

const FALLBACK_IMAGE_URL = "https://placehold.co/48x48";

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.5, ease: "easeOut" },
  }),
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const CryptoCard = ({ crypto, index, handleTradeClick }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [imageSrc, setImageSrc] = useState(
    cryptoImages[crypto.name] || FALLBACK_IMAGE_URL
  );
  const [hasFailed, setHasFailed] = useState(false);

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [controls, inView]);

  const handleImageError = (e) => {
    if (!hasFailed) {
      setHasFailed(true);
      setImageSrc(FALLBACK_IMAGE_URL);
    }
  };

  return (
    <motion.div
      ref={ref}
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate={controls}
      className="relative p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
      whileHover={{ scale: 1.05 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-gray-900">{crypto.name}</h3>
        <motion.img
          src={imageSrc}
          alt={crypto.name}
          className="w-12 h-12 object-contain"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.8 }}
          onError={handleImageError}
        />
      </div>
      <div className="space-y-4">
        <p className="text-gray-600 font-medium">
          Rate:{" "}
          <span className="text-blue-500">₦{crypto.rate.toLocaleString()}</span>
        </p>
      </div>
      <motion.button
        onClick={() => handleTradeClick(crypto)}
        className="mt-6 w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-xl shadow-md hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 relative overflow-hidden group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="relative z-10">Sell Now</span>
        <span className="absolute inset-0 bg-white opacity-20 transform scale-0 group-hover:scale-150 rounded-full transition-transform duration-300 ease-out"></span>
        <motion.span
          className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-20"
          initial={{ scale: 0 }}
          whileHover={{ scale: 2 }}
          transition={{ duration: 0.5 }}
        />
      </motion.button>
    </motion.div>
  );
};

const Home = () => {
  const { data: cryptos, isLoading, isError } = useGetCryptosQuery();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("rate");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("NGN");
  const [filteredCryptos, setFilteredCryptos] = useState([]);
  const adminWhatsAppBase = "https://wa.me/2348119223162?text=";

  const { userInfo } = useSelector((state) => state.auth);
  const [createTransaction, { isLoading: isCreatingTransaction }] =
    useCreateTransactionMutation();

  useEffect(() => {
    if (cryptos) {
      setFilteredCryptos(
        cryptos
          .filter((crypto) =>
            crypto.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .sort((a, b) =>
            sortBy === "rate" ? b.rate - a.rate : a.name.localeCompare(b.name)
          )
      );
    }
  }, [cryptos, searchQuery, sortBy]);

  useEffect(() => {
    socket.on("cryptoAdded", (newCrypto) => {
      setFilteredCryptos((prev) => [...prev, newCrypto]);
    });
    socket.on("cryptoUpdated", (updatedCrypto) => {
      setFilteredCryptos((prev) =>
        prev.map((crypto) =>
          crypto._id === updatedCrypto._id ? updatedCrypto : crypto
        )
      );
    });
    socket.on("cryptoDeleted", (deletedCryptoId) => {
      setFilteredCryptos((prev) =>
        prev.filter((crypto) => crypto._id !== deletedCryptoId)
      );
    });
    socket.on("transactionCreated", () => {});
    socket.on("transactionUpdated", () => {});

    return () => {
      socket.off("cryptoAdded");
      socket.off("cryptoUpdated");
      socket.off("cryptoDeleted");
      socket.off("transactionCreated");
      socket.off("transactionUpdated");
    };
  }, []);

  const handleTradeClick = (crypto) => {
    Swal.fire({
      title: `Sell ${crypto.name}`,
      html: `
        <div class="space-y-4">
          <div class="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
            <span class="text-sm text-gray-700">Wallet Address:</span>
            <div class="flex items-center">
              <span class="text-sm font-mono text-gray-900">${crypto.walletAddress}</span>
              <button id="swal-copy-button" class="ml-2 p-1 bg-gray-200 rounded hover:bg-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </button>
            </div>
          </div>
          <div class="space-y-2">
            <label class="block text-sm text-gray-700">Quantity to Sell</label>
            <input
              id="swal-quantity"
              type="number"
              placeholder="Enter quantity"
              class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              step="0.01"
            />
          </div>
          <div class="space-y-2">
            <label class="block text-sm text-gray-700">Total Amount</label>
            <input
              id="swal-total-amount"
              type="text"
              readonly
              class="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none"
            />
          </div>
          <button id="swal-sell-button" class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
            Sell ${crypto.name}
          </button>
        </div>
      `,
      didOpen: () => {
        const quantityInput = document.getElementById("swal-quantity");
        const totalAmountInput = document.getElementById("swal-total-amount");

        quantityInput.addEventListener("input", () => {
          const quantity = parseFloat(quantityInput.value) || 0;
          const totalAmount = (quantity * crypto.rate).toLocaleString("en-US", {
            style: "currency",
            currency: "NGN",
          });
          totalAmountInput.value = totalAmount;
        });

        document.getElementById("swal-copy-button").onclick = () => {
          navigator.clipboard.writeText(crypto.walletAddress);
          Swal.fire(
            "Copied!",
            "Wallet address copied to clipboard.",
            "success"
          );
        };

        document.getElementById("swal-sell-button").onclick = async () => {
          const quantity = parseFloat(quantityInput.value) || 0;
          if (quantity <= 0) {
            Swal.fire("Error", "Please enter a valid quantity.", "error");
            return;
          }

          const totalAmount = quantity * crypto.rate;
          const transaction = {
            cryptoName: crypto.name,
            quantity,
            totalAmount,
            type: "crypto",
            userName: userInfo?.username || "guest", // Send "guest" if no userInfo
          };

          try {
            console.log("Creating transaction:", transaction);
            await createTransaction(transaction).unwrap();

            const message = `Hello%2C%20I%20want%20to%20sell%20${encodeURIComponent(
              crypto.name
            )}%20crypto%20at%20the%20rate%20of%20₦${crypto.rate.toLocaleString()}%20for%20${quantity.toLocaleString()}%20units%20(total%20amount%3A%20₦${totalAmount.toLocaleString()})%20by%20${
              userInfo?.username || "guest"
            }`;
            window.open(`${adminWhatsAppBase}${message}`, "_blank");

            Swal.fire(
              "Success!",
              `Your request to sell ${quantity} ${crypto.name} has been submitted.`,
              "success"
            ).then(() => {
              Swal.close();
            });
          } catch (error) {
            console.error("Transaction error:", error);
            Swal.fire(
              "Error",
              error?.data?.message || "Failed to create transaction",
              "error"
            );
          }
        };
      },
      showConfirmButton: false,
      customClass: {
        popup: "rounded-lg shadow-xl",
        htmlContainer: "text-left",
      },
    });
  };

  if (isError) {
    return (
      <div className="text-center py-10 text-red-600">
        <p>Failed to load cryptocurrencies. Please try again later.</p>
      </div>
    );
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 p-6">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mt-10 mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900">
            Crypto Trading Hub
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-600 font-light">
            Sell your cryptocurrencies instantly at competitive rates.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col md:flex-row gap-4 mb-10"
        >
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search cryptocurrencies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-4 pl-12 bg-gray-100 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
            />
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
              size={22}
            />
          </div>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="p-4 pr-10 bg-gray-100 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm appearance-none"
            >
              <option value="rate">Sort by Rate</option>
              <option value="name">Sort by Name</option>
            </select>
            <ChevronDown
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
              size={22}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-4 bg-gray-100 border border-gray-200 rounded-xl hover:bg-gray-200 text-gray-800 flex items-center gap-2 shadow-sm transition-all duration-300"
          >
            <Filter size={22} className="text-gray-600" />
            <span>Filters</span>
          </button>
        </motion.div>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.5 }}
            className="mb-10 p-6 bg-gray-50 rounded-xl border border-gray-200 shadow-md"
          >
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Filters
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  className="w-full p-3 bg-white border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
                >
                  <option value="NGN">NGN</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredCryptos.map((crypto, index) => (
              <CryptoCard
                key={crypto._id}
                crypto={crypto}
                index={index}
                handleTradeClick={handleTradeClick}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
