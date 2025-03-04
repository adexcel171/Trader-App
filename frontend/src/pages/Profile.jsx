// src/pages/Profile.js
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  useGetUserTransactionsQuery,
  useUpdateTransactionStatusMutation,
} from "../services/transactionApi"; // Correct import
import { toast } from "react-toastify";
import { FaUser } from "react-icons/fa";

const Profile = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const {
    data: transactions,
    isLoading,
    error,
  } = useGetUserTransactionsQuery();
  const [updateTransactionStatus] = useUpdateTransactionStatusMutation();

  const handleUpdateStatus = async (id, status) => {
    if (userInfo?.isAdmin) {
      try {
        await updateTransactionStatus({ id, status }).unwrap();
        toast.success(`Transaction marked as ${status}`);
      } catch (error) {
        toast.error(error?.data?.message || "Failed to update status");
      }
    } else {
      toast.error("Only admins can update transaction status");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error)
    return (
      <div>
        Error loading transactions: {error?.data?.message || "Unknown error"}
      </div>
    );

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6 flex items-center">
        <FaUser className="text-2xl mr-3 text-blue-500" />
        <h2 className="text-2xl font-bold">
          {userInfo?.username || "Guest"}'s Profile
        </h2>
      </div>

      <h3 className="text-xl font-semibold mb-4">Recent Transactions</h3>
      {transactions?.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b">Crypto</th>
                <th className="py-2 px-4 border-b">Quantity</th>
                <th className="py-2 px-4 border-b">Total Amount</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Date</th>
                {userInfo?.isAdmin && (
                  <th className="py-2 px-4 border-b">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {transactions?.map((transaction) => (
                <tr key={transaction._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">
                    {transaction.cryptoName}
                  </td>
                  <td className="py-2 px-4 border-b">{transaction.quantity}</td>
                  <td className="py-2 px-4 border-b">
                    ₦{transaction.totalAmount.toLocaleString()}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <span
                      className={`px-2 py-1 rounded ${
                        transaction.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b">
                    {new Date(transaction.date).toLocaleString()}
                  </td>
                  {userInfo?.isAdmin && (
                    <td className="py-2 px-4 border-b">
                      {transaction.status === "pending" && (
                        <button
                          onClick={() =>
                            handleUpdateStatus(transaction._id, "completed")
                          }
                          className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition-all"
                        >
                          Mark Completed
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
  );
};

export default Profile;
