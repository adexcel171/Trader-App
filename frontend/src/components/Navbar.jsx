import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../services/authSlice";
import { updateTransactionStatus } from "../services/tansactionSlice"; // Corrected import
import { Link, useNavigate } from "react-router-dom";
import {
  FaChartLine,
  FaWallet,
  FaCoins,
  FaUser,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const transactions = useSelector((state) => state.transactions.transactions);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleProfileModal = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    setIsProfileOpen(false);
  };

  const handleUpdateStatus = (id, status) => {
    if (userInfo?.isAdmin) {
      dispatch(updateTransactionStatus({ id, status }));
      toast.success(`Transaction marked as ${status}`);
    } else {
      toast.error("Only admins can update transaction status");
    }
  };

  const userTransactions = userInfo
    ? transactions.filter((t) => t.userId === userInfo._id).slice(0, 3)
    : [];

  const modalVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden lg:block bg-white text-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link
            to="/"
            className="text-2xl font-extrabold flex items-center tracking-tight text-gray-900"
          >
            <FaCoins className="mr-2 text-yellow-500" /> Trade Crypto
          </Link>
          <nav className="flex space-x-6 items-center">
            {[
              { to: "/dashboard", icon: FaChartLine, label: "Dashboard" },
              { to: "/markets", icon: FaChartLine, label: "Markets" },
              { to: "/wallet", icon: FaWallet, label: "Wallet" },
              ...(userInfo?.isAdmin
                ? [
                    {
                      to: "/admin/transactions",
                      icon: FaCoins,
                      label: "Manage Transactions",
                    },
                  ]
                : []),
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-all duration-300"
              >
                <item.icon className="mr-2 text-blue-500" /> {item.label}
              </Link>
            ))}
            <button
              onClick={toggleProfileModal}
              className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-all duration-300"
            >
              <FaUser className="mr-2 text-blue-500" />{" "}
              {userInfo?.username || "Guest"}
            </button>
          </nav>
        </div>

        {/* Profile Modal */}
        {isProfileOpen && (
          <motion.div
            className="fixed top-16 right-6 w-80 bg-white text-gray-800 p-6 rounded-xl shadow-2xl z-50 border border-gray-200"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="flex items-center mb-6">
              <FaUser className="text-2xl mr-3 text-blue-500" />
              <h3 className="text-lg font-semibold">
                {userInfo?.username || "Guest"}
              </h3>
            </div>
            <div>
              <h4 className="text-md font-bold mb-4 text-gray-700">
                Recent Activities
              </h4>
              {userTransactions.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  {userInfo
                    ? "No recent activities."
                    : "Login to view activities."}
                </p>
              ) : (
                <ul className="space-y-3">
                  {userTransactions.map((transaction) => (
                    <li
                      key={transaction.id}
                      className="text-sm bg-gray-50 p-3 rounded-lg shadow-sm"
                    >
                      <p>
                        Sold {transaction.quantity} {transaction.cryptoName}
                      </p>
                      <p className="text-gray-500">
                        ₦{transaction.totalAmount.toLocaleString()} -{" "}
                        <span
                          className={
                            transaction.status === "pending"
                              ? "text-yellow-600"
                              : "text-green-600"
                          }
                        >
                          {transaction.status}
                        </span>
                      </p>
                      {userInfo?.isAdmin &&
                        transaction.status === "pending" && (
                          <button
                            onClick={() =>
                              handleUpdateStatus(transaction.id, "completed")
                            }
                            className="mt-2 text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition-all"
                          >
                            Mark Completed
                          </button>
                        )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="mt-4 w-full flex items-center justify-center p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300"
            >
              <FaSignOutAlt className="mr-2" /> Logout
            </button>
          </motion.div>
        )}
      </div>

      {/* Tablet & Mobile Layout */}
      <div className="lg:hidden">
        <div className="bg-white text-gray-800 p-4 flex justify-between items-center shadow-md">
          <Link
            to="/"
            className="text-xl font-extrabold flex items-center tracking-tight text-gray-900"
          >
            <FaCoins className="mr-2 text-yellow-500" /> Trade Crypto
          </Link>
          <button
            onClick={toggleMobileMenu}
            className="text-gray-600 focus:outline-none"
          >
            <FaBars className="h-6 w-6" />
          </button>
        </div>
        <div className="fixed bottom-0 left-0 right-0 bg-white text-gray-800 p-2 flex justify-around items-center shadow-xl z-50 md:max-w-2xl md:mx-auto md:rounded-t-xl border-t border-gray-200">
          <Link
            to="/dashboard"
            className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-500 transition-all duration-300"
          >
            <FaChartLine className="h-5 w-5 md:h-6 md:w-6" />
            <span className="text-xs md:text-sm">Dashboard</span>
          </Link>
          <Link
            to="/markets"
            className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-500 transition-all duration-300"
          >
            <FaChartLine className="h-5 w-5 md:h-6 md:w-6" />
            <span className="text-xs md:text-sm">Markets</span>
          </Link>
          <Link
            to="/wallet"
            className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-500 transition-all duration-300"
          >
            <FaWallet className="h-5 w-5 md:h-6 md:w-6" />
            <span className="text-xs md:text-sm">Wallet</span>
          </Link>
          <Link
            to="/profile"
            className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-500 transition-all duration-300"
          >
            <FaUser className="h-5 w-5 md:h-6 md:w-6" />
            <span className="text-xs md:text-sm">Profile</span>
          </Link>
        </div>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-white text-gray-800 flex flex-col overflow-y-auto" // Added overflow-y-auto to allow scrolling
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <Link
                to="/"
                className="text-xl font-extrabold flex items-center tracking-tight text-gray-900"
              >
                <FaCoins className="mr-2 text-yellow-500" /> Trade Crypto
              </Link>
              <button onClick={toggleMobileMenu} className="text-gray-600">
                <FaSignOutAlt className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 flex-1 overflow-y-auto min-h-0">
              {" "}
              {/* Added overflow-y-auto and min-h-0 to ensure content can scroll */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold flex items-center text-gray-900">
                  <FaUser className="mr-2 text-blue-500" />{" "}
                  {userInfo?.username || "Guest"}
                </h3>
              </div>
              <nav className="space-y-4">
                {[
                  { to: "/dashboard", icon: FaChartLine, label: "Dashboard" },
                  { to: "/markets", icon: FaChartLine, label: "Markets" },
                  { to: "/wallet", icon: FaWallet, label: "Wallet" },
                  ...(userInfo?.isAdmin
                    ? [
                        {
                          to: "/admin/transactions",
                          icon: FaCoins,
                          label: "Manage Transactions",
                        },
                      ]
                    : []),
                  { to: "/profile", icon: FaUser, label: "Profile" },
                ].map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="flex items-center p-3 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-300"
                    onClick={toggleMobileMenu}
                  >
                    <item.icon className="mr-3 text-blue-500" /> {item.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-6">
                <h4 className="text-md font-bold mb-4 text-gray-700">
                  Recent Activities
                </h4>
                {userTransactions.length === 0 ? (
                  <p className="text-gray-500 text-sm">
                    {userInfo
                      ? "No recent activities."
                      : "Login to view activities."}
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {userTransactions.map((transaction) => (
                      <li
                        key={transaction.id}
                        className="text-sm bg-gray-50 p-3 rounded-lg shadow-sm"
                      >
                        <p>
                          Sold {transaction.quantity} {transaction.cryptoName}
                        </p>
                        <p className="text-gray-500">
                          ₦{transaction.totalAmount.toLocaleString()} -{" "}
                          <span
                            className={
                              transaction.status === "pending"
                                ? "text-yellow-600"
                                : "text-green-600"
                            }
                          >
                            {transaction.status}
                          </span>
                        </p>
                        {userInfo?.isAdmin &&
                          transaction.status === "pending" && (
                            <button
                              onClick={() =>
                                handleUpdateStatus(transaction.id, "completed")
                              }
                              className="mt-2 text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition-all"
                            >
                              Mark Completed
                            </button>
                          )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="m-6 flex items-center p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300"
            >
              <FaSignOutAlt className="mr-2" /> Logout
            </button>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default Navbar;
