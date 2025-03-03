import React from "react";
import { useSelector } from "react-redux";

const UserActivities = () => {
  // Get transactions from the Redux store
  const transactions = useSelector((state) => state.transactions.transactions);
  // Get the logged-in user's information
  const userInfo = useSelector((state) => state.auth.userInfo);

  // Filter transactions for the logged-in user (if needed)
  const userTransactions = transactions.filter(
    (transaction) => transaction.userName === userInfo?.name
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Your Transactions</h2>
      {userTransactions.length === 0 ? (
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
              </tr>
            </thead>
            <tbody>
              {userTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserActivities;
