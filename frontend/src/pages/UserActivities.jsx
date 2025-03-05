import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useGetUserTransactionsQuery } from "../services/transactionApi";
import socket from "../services/socket";
import { CSVLink } from "react-csv";

const UserActivities = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [search, setSearch] = useState("");

  const { data, isLoading, error, refetch, isFetching } =
    useGetUserTransactionsQuery({ page, limit, startDate, endDate, search });

  const transactions = Array.isArray(data?.transactions)
    ? data.transactions
    : [];
  const totalPages = Number.isInteger(data?.totalPages) ? data.totalPages : 0;

  useEffect(() => {
    socket.on("transactionUpdated", () => {
      refetch();
    });

    return () => {
      socket.off("transactionUpdated");
    };
  }, [refetch]);

  if (isLoading || isFetching) return <div>Loading...</div>;
  if (error)
    return (
      <div>Error loading transactions: {error?.message || "Unknown error"}</div>
    );

  const csvData = transactions.map((t) => ({
    Crypto: t.cryptoName || "N/A",
    Quantity: t.quantity || 0,
    "Total Amount": t.totalAmount
      ? `₦${t.totalAmount.toLocaleString()}`
      : "N/A",
    Status: t.status || "N/A",
    User: t.userId?.email || t.userId?.username || t.userName || "Unknown",
    Date: t.createdAt ? new Date(t.createdAt).toLocaleString() : "N/A",
  }));

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Your Transactions</h2>

      <div className="mb-4 flex flex-col gap-2">
        <input
          type="text"
          placeholder="Search by crypto or user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded"
        />
        <div className="flex gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 border rounded"
          />
          <CSVLink
            data={csvData}
            filename={`transactions_${startDate || "all"}_to_${
              endDate || "now"
            }.csv`}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Download CSV
          </CSVLink>
        </div>
      </div>

      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b">Crypto</th>
                  <th className="py-2 px-4 border-b">Quantity</th>
                  <th className="py-2 px-4 border-b">Total Amount</th>
                  <th className="py-2 px-4 border-b">Status</th>
                  <th className="py-2 px-4 border-b">User</th>
                  <th className="py-2 px-4 border-b">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction._id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">
                      {transaction.cryptoName || "N/A"}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {transaction.quantity || 0}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {transaction.totalAmount
                        ? `₦${transaction.totalAmount.toLocaleString()}`
                        : "N/A"}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <span
                        className={`px-2 py-1 rounded ${
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
                    <td className="py-2 px-4 border-b">
                      {transaction.userId?.email ||
                        transaction.userId?.username ||
                        transaction.userName ||
                        "Unknown"}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {transaction.createdAt
                        ? new Date(transaction.createdAt).toLocaleString()
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-between">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserActivities;
