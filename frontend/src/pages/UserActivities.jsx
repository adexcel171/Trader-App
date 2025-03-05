import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useGetUserTransactionsQuery } from "../services/transactionApi";
import socket from "../services/socket";

const UserActivities = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const {
    data: transactions,
    isLoading,
    error,
    refetch, // Add refetch from RTK Query
  } = useGetUserTransactionsQuery();

  useEffect(() => {
    socket.on("transactionUpdated", () => {
      refetch(); // Refetch transactions when updated
    });

    return () => {
      socket.off("transactionUpdated");
    };
  }, [refetch]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading transactions: {error.message}</div>;

  // Log for debugging
  console.log("UserInfo:", userInfo);
  console.log("Transactions from API:", transactions);

  // No need to filter client-side since backend already filters by userId
  const userTransactions = transactions || [];

  return (
    <div
      style={{
        padding: "1.5rem",
        backgroundColor: "white",
        borderRadius: "0.5rem",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2
        style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}
      >
        Your Transactions
      </h2>
      {userTransactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              minWidth: "100%",
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f3f4f6" }}>
                <th
                  style={{
                    padding: "0.5rem 1rem",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  Crypto
                </th>
                <th
                  style={{
                    padding: "0.5rem 1rem",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  Quantity
                </th>
                <th
                  style={{
                    padding: "0.5rem 1rem",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  Total Amount
                </th>
                <th
                  style={{
                    padding: "0.5rem 1rem",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  Status
                </th>
                <th
                  style={{
                    padding: "0.5rem 1rem",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {userTransactions.map((transaction) => (
                <tr
                  key={transaction._id}
                  style={{ "&:hover": { backgroundColor: "#f9fafb" } }}
                >
                  <td
                    style={{
                      padding: "0.5rem 1rem",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    {transaction.cryptoName}
                  </td>
                  <td
                    style={{
                      padding: "0.5rem 1rem",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    {transaction.quantity}
                  </td>
                  <td
                    style={{
                      padding: "0.5rem 1rem",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    ₦{transaction.totalAmount.toLocaleString()}
                  </td>
                  <td
                    style={{
                      padding: "0.5rem 1rem",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    <span
                      style={{
                        padding: "0.25rem 0.5rem",
                        borderRadius: "0.25rem",
                        backgroundColor:
                          transaction.status === "pending"
                            ? "#fef9c3"
                            : "#dcfce7",
                        color:
                          transaction.status === "pending"
                            ? "#854d0e"
                            : "#15803d",
                      }}
                    >
                      {transaction.status}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "0.5rem 1rem",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    {new Date(transaction.createdAt).toLocaleString()}
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
