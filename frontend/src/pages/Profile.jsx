import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  useGetUserTransactionsQuery,
  useGetAllTransactionsQuery,
  useUpdateTransactionStatusMutation,
} from "../services/transactionApi";
import { toast } from "react-toastify";
import { FaUser } from "react-icons/fa";
import socket from "../services/socket";
import { CSVLink } from "react-csv";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const queryParams = { page, limit, startDate, endDate, search };
  const { data, isLoading, error, refetch, isFetching } = userInfo?.isAdmin
    ? useGetAllTransactionsQuery(queryParams)
    : useGetUserTransactionsQuery(queryParams, { skip: !userInfo }); // Skip query if not logged in
  const [updateTransactionStatus] = useUpdateTransactionStatusMutation();

  const [localTransactions, setLocalTransactions] = useState(
    Array.isArray(data?.transactions) ? data.transactions : []
  );

  // Sync localTransactions with data when it changes
  useEffect(() => {
    if (userInfo) {
      setLocalTransactions(
        Array.isArray(data?.transactions) ? data.transactions : []
      );
    }
  }, [data, userInfo]);

  useEffect(() => {
    if (userInfo) {
      socket.on("transactionUpdated", () => {
        refetch();
      });
    }

    return () => {
      socket.off("transactionUpdated");
    };
  }, [refetch, userInfo]);

  const handleUpdateStatus = async (id, status) => {
    if (!userInfo?.isAdmin) {
      toast.error("Only admins can update transaction status");
      return;
    }

    // Optimistic update
    setLocalTransactions((prev) =>
      prev.map((t) => (t._id === id ? { ...t, status } : t))
    );

    try {
      await updateTransactionStatus({ id, status }).unwrap();
      toast.success(`Transaction marked as ${status}`, {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      // Revert on failure
      setLocalTransactions((prev) =>
        prev.map((t) => (t._id === id ? { ...t, status: "pending" } : t))
      );
      toast.error(err?.data?.message || "Failed to update status");
    }
  };

  // Redirect or block guests
  if (!userInfo) {
    return (
      <div className="p-4 sm:p-6 text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
          Please Log In
        </h2>
        <p className="text-gray-600 mb-4">
          You need to be logged in to view your transaction history.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (isLoading || isFetching)
    return <div className="text-center p-4">Loading...</div>;
  if (error)
    return (
      <div className="text-center p-4 text-red-600">
        Error loading transactions:{" "}
        {error?.data?.message || error?.message || "Unknown error"}
      </div>
    );

  const csvData = localTransactions.map((t) => ({
    Crypto: t.cryptoName || "N/A",
    Quantity: t.quantity || 0,
    "Total Amount": t.totalAmount
      ? `₦${t.totalAmount.toLocaleString()}`
      : "N/A",
    Status: t.status || "N/A",
    User: t.userId?.email || t.userId?.username || t.userName || "Unknown",
    Date: t.createdAt ? new Date(t.createdAt).toLocaleString() : "N/A",
  }));

  const totalPages = Number.isInteger(data?.totalPages) ? data.totalPages : 0;

  return (
    <div className="p-4 sm:p-6 bg-white rounded-lg shadow-lg max-w-full mx-auto">
      <div className="mb-6 flex items-center flex-col sm:flex-row gap-4">
        <FaUser className="text-2xl sm:text-3xl text-blue-500" />
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 text-center">
          {userInfo.username}'s Profile
        </h2>
      </div>

      <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-700 text-center">
        Recent Transactions
      </h3>

      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:flex-wrap">
        <input
          type="text"
          placeholder="Search by crypto or user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-64 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full sm:w-40 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-40 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <CSVLink
            data={csvData}
            filename={`transactions_${startDate || "all"}_to_${
              endDate || "now"
            }.csv`}
            className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors text-center"
          >
            Download CSV
          </CSVLink>
        </div>
      </div>

      {localTransactions.length === 0 ? (
        <p className="text-center text-gray-500">No transactions found.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 text-sm sm:text-base">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-2 sm:px-4 border-b text-left">
                    Crypto
                  </th>
                  <th className="py-2 px-2 sm:px-4 border-b text-left">
                    Quantity
                  </th>
                  <th className="py-2 px-2 sm:px-4 border-b text-left">
                    Total Amount
                  </th>
                  <th className="py-2 px-2 sm:px-4 border-b text-left">
                    Status
                  </th>
                  <th className="py-2 px-2 sm:px-4 border-b text-left">User</th>
                  <th className="py-2 px-2 sm:px-4 border-b text-left">Date</th>
                  {userInfo.isAdmin && (
                    <th className="py-2 px-2 sm:px-4 border-b text-left">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {localTransactions.map((transaction) => (
                  <tr key={transaction._id} className="hover:bg-gray-50">
                    <td className="py-2 px-2 sm:px-4 border-b truncate max-w-[100px] sm:max-w-[150px]">
                      {transaction.cryptoName || "N/A"}
                    </td>
                    <td className="py-2 px-2 sm:px-4 border-b">
                      {transaction.quantity || 0}
                    </td>
                    <td className="py-2 px-2 sm:px-4 border-b truncate max-w-[120px] sm:max-w-[200px]">
                      {transaction.totalAmount
                        ? `₦${transaction.totalAmount.toLocaleString()}`
                        : "N/A"}
                    </td>
                    <td className="py-2 px-2 sm:px-4 border-b">
                      <span
                        className={`px-2 py-1 rounded text-xs sm:text-sm ${
                          transaction.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : transaction.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {transaction.status || "N/A"}
                      </span>
                    </td>
                    <td className="py-2 px-2 sm:px-4 border-b truncate max-w-[100px] sm:max-w-[150px]">
                      {transaction.userId?.email ||
                        transaction.userId?.username ||
                        transaction.userName ||
                        "Unknown"}
                    </td>
                    <td className="py-2 px-2 sm:px-4 border-b truncate max-w-[120px] sm:max-w-[200px]">
                      {transaction.createdAt
                        ? new Date(transaction.createdAt).toLocaleString()
                        : "N/A"}
                    </td>
                    {userInfo.isAdmin && (
                      <td className="py-2 px-2 sm:px-4 border-b">
                        {transaction.status === "pending" && (
                          <button
                            onClick={() =>
                              handleUpdateStatus(transaction._id, "delivered")
                            }
                            className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition-colors whitespace-nowrap"
                          >
                            Mark Delivered
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="w-full sm:w-auto px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50 hover:bg-gray-300 transition-colors"
            >
              Previous
            </button>
            <span className="text-gray-700">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="w-full sm:w-auto px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50 hover:bg-gray-300 transition-colors"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
