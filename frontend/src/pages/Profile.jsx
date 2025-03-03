import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaCoins, FaSun, FaMoon } from "react-icons/fa"; // Added icons for theme toggle
import Loader from "../components/Loader";
import { useProfileMutation } from "../services/userApi";
import { setCredentials } from "../services/authSlice";
import { useNavigate } from "react-router-dom";
import { updateTransactionStatus } from "../services/tansactionSlice";

const Profile = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [theme, setTheme] = useState("light"); // Theme state (light or dark)

  const { userInfo } = useSelector((state) => state.auth);
  const transactions = useSelector((state) => state.transactions.transactions);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else {
      setUserName(userInfo.username || "");
      setEmail(userInfo.email || "");
    }
  }, [userInfo, navigate]);

  // Toggle between light and dark mode
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // Determine which transactions to show based on user role and sort by date (earliest first)
  const displayedTransactions = userInfo?.isAdmin
    ? [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date)) // Admin sees all, sorted
    : transactions
        .filter((transaction) => transaction.userId === userInfo?._id)
        .sort((a, b) => new Date(a.date) - new Date(b.date)); // Users see own, sorted

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          username,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success("Profile updated successfully");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const handleUpdateStatus = (id, status) => {
    if (userInfo?.isAdmin) {
      dispatch(updateTransactionStatus({ id, status }));
      toast.success(`Transaction status updated to ${status}`);
    } else {
      toast.error("Only admin can update transaction status.");
    }
  };

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  if (!userInfo) {
    return <Loader />;
  }

  return (
    <div
      className={`flex-1 p-6 min-h-screen ${
        theme === "light" ? "bg-gray-100" : "bg-gray-900 text-white"
      }`}
    >
      <div className="container mx-auto">
        {/* Header with Theme Toggle */}
        <div className="flex justify-between items-center mb-6">
          <h1
            className={`text-3xl font-bold flex items-center ${
              theme === "light" ? "text-gray-800" : "text-gray-100"
            }`}
          >
            <FaCoins className="mr-2 text-yellow-500" /> Crypto Trader Profile
          </h1>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full ${
              theme === "light"
                ? "bg-gray-200 text-gray-800"
                : "bg-gray-700 text-gray-200"
            } hover:bg-opacity-80 transition-all`}
          >
            {theme === "light" ? <FaMoon size={20} /> : <FaSun size={20} />}
          </button>
        </div>

        {/* Transactions Section */}
        <div
          className={`p-6 rounded-lg shadow-lg mb-6 ${
            theme === "light" ? "bg-white" : "bg-gray-800"
          }`}
        >
          <h2
            className={`text-xl font-bold mb-4 ${
              theme === "light" ? "text-gray-800" : "text-gray-100"
            }`}
          >
            {userInfo?.isAdmin ? "All Transactions" : "Your Transactions"}
          </h2>
          {displayedTransactions.length === 0 ? (
            <p
              className={theme === "light" ? "text-gray-500" : "text-gray-400"}
            >
              No transactions found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table
                className={`min-w-full ${
                  theme === "light"
                    ? "bg-white text-gray-800"
                    : "bg-gray-800 text-gray-200"
                }`}
              >
                <thead>
                  <tr
                    className={
                      theme === "light"
                        ? "bg-gray-200 text-gray-700"
                        : "bg-gray-700 text-gray-300"
                    }
                  >
                    <th className="py-3 px-4 border-b text-left">Crypto</th>
                    <th className="py-3 px-4 border-b text-left">Quantity</th>
                    <th className="py-3 px-4 border-b text-left">
                      Total Amount
                    </th>
                    <th className="py-3 px-4 border-b text-left">Status</th>
                    <th className="py-3 px-4 border-b text-left">User</th>
                    <th className="py-3 px-4 border-b text-left">
                      Date & Time
                    </th>
                    {userInfo?.isAdmin && (
                      <th className="py-3 px-4 border-b text-left">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {displayedTransactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className={`hover:${
                        theme === "light" ? "bg-gray-50" : "bg-gray-700"
                      } transition-all`}
                    >
                      <td className="py-3 px-4 border-b">
                        {transaction.cryptoName}
                      </td>
                      <td className="py-3 px-4 border-b">
                        {transaction.quantity}
                      </td>
                      <td className="py-3 px-4 border-b">
                        ₦{transaction.totalAmount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 border-b">
                        <span
                          className={`px-2 py-1 rounded text-sm ${
                            transaction.status === "pending"
                              ? theme === "light"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-yellow-900 text-yellow-300"
                              : theme === "light"
                              ? "bg-green-100 text-green-800"
                              : "bg-green-900 text-green-300"
                          }`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 border-b">
                        {transaction.userName}
                      </td>
                      <td className="py-3 px-4 border-b">
                        {formatDateTime(transaction.date)}
                      </td>
                      {userInfo?.isAdmin && (
                        <td className="py-3 px-4 border-b">
                          {transaction.status === "pending" && (
                            <button
                              onClick={() =>
                                handleUpdateStatus(transaction.id, "completed")
                              }
                              className={`${
                                theme === "light"
                                  ? "bg-green-500 hover:bg-green-600"
                                  : "bg-green-600 hover:bg-green-700"
                              } text-white px-3 py-1 rounded-lg transition-all`}
                            >
                              Mark as Completed
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Update Profile Form */}
        <div
          className={`p-6 rounded-lg shadow-lg ${
            theme === "light" ? "bg-white" : "bg-gray-800"
          }`}
        >
          <h2
            className={`text-xl font-bold mb-4 ${
              theme === "light" ? "text-gray-800" : "text-gray-100"
            }`}
          >
            Update Profile
          </h2>
          <form onSubmit={submitHandler} className="space-y-6">
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  theme === "light" ? "text-gray-700" : "text-gray-300"
                }`}
              >
                Username
              </label>
              <input
                type="text"
                placeholder="Enter your username"
                className={`w-full p-3 rounded-lg border ${
                  theme === "light"
                    ? "border-gray-300 text-gray-800 focus:ring-blue-500"
                    : "border-gray-600 bg-gray-700 text-gray-200 focus:ring-blue-400"
                } focus:outline-none focus:ring-2`}
                value={username}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  theme === "light" ? "text-gray-700" : "text-gray-300"
                }`}
              >
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className={`w-full p-3 rounded-lg border ${
                  theme === "light"
                    ? "border-gray-300 text-gray-800 focus:ring-blue-500"
                    : "border-gray-600 bg-gray-700 text-gray-200 focus:ring-blue-400"
                } focus:outline-none focus:ring-2`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  theme === "light" ? "text-gray-700" : "text-gray-300"
                }`}
              >
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className={`w-full p-3 rounded-lg border ${
                  theme === "light"
                    ? "border-gray-300 text-gray-800 focus:ring-blue-500"
                    : "border-gray-600 bg-gray-700 text-gray-200 focus:ring-blue-400"
                } focus:outline-none focus:ring-2`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  theme === "light" ? "text-gray-700" : "text-gray-300"
                }`}
              >
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm your password"
                className={`w-full p-3 rounded-lg border ${
                  theme === "light"
                    ? "border-gray-300 text-gray-800 focus:ring-blue-500"
                    : "border-gray-600 bg-gray-700 text-gray-200 focus:ring-blue-400"
                } focus:outline-none focus:ring-2`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className={`w-full py-3 rounded-lg transition-all ${
                theme === "light"
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Update Profile
            </button>
            {loadingUpdateProfile && <Loader />}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
