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

  const { data, isLoading, error, refetch } = useGetUserTransactionsQuery({
    page,
    limit,
    startDate,
    endDate,
    search,
  });

  const transactions = data?.transactions || [];
  const totalPages = data?.totalPages || 0;

  useEffect(() => {
    socket.on("transactionUpdated", () => {
      refetch();
    });

    return () => {
      socket.off("transactionUpdated");
    };
  }, [refetch]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading transactions: {error.message}</div>;

  const csvData = transactions.map((t) => ({
    Crypto: t.cryptoName,
    Quantity: t.quantity,
    "Total Amount": `₦${t.totalAmount.toLocaleString()}`,
    Status: t.status,
    User: t.userId?.email || t.userId?.username || t.userName, // Updated
    Date: new Date(t.createdAt).toLocaleString(),
  }));

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

      <div
        style={{
          marginBottom: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        <input
          type="text"
          placeholder="Search by crypto or user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "0.5rem",
            border: "1px solid #e5e7eb",
            borderRadius: "0.25rem",
          }}
        />
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{
              padding: "0.5rem",
              border: "1px solid #e5e7eb",
              borderRadius: "0.25rem",
            }}
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{
              padding: "0.5rem",
              border: "1px solid #e5e7eb",
              borderRadius: "0.25rem",
            }}
          />
          <CSVLink
            data={csvData}
            filename={`transactions_${startDate || "all"}_to_${
              endDate || "now"
            }.csv`}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#3b82f6",
              color: "white",
              borderRadius: "0.25rem",
              textDecoration: "none",
            }}
          >
            Download CSV
          </CSVLink>
        </div>
      </div>

      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <>
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
                    User
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
                {transactions.map((transaction) => (
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
                      {transaction.userId?.email ||
                        transaction.userId?.username ||
                        transaction.userName}
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

          <div
            style={{
              marginTop: "1rem",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#e5e7eb",
                borderRadius: "0.25rem",
                opacity: page === 1 ? 0.5 : 1,
              }}
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#e5e7eb",
                borderRadius: "0.25rem",
                opacity: page === totalPages ? 0.5 : 1,
              }}
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
