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
  const [sortOrder, setSortOrder] = useState("desc");

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

  // Log for debugging
  console.log("UserActivities - userInfo:", userInfo);
  console.log(
    "UserActivities - isLoading:",
    isLoading,
    "isFetching:",
    isFetching
  );
  console.log("UserActivities - error:", error);
  console.log("UserActivities - data:", data);
  console.log("UserActivities - transactions:", transactions);

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
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            style={{
              padding: "0.5rem",
              border: "1px solid #e5e7eb",
              borderRadius: "0.25rem",
            }}
          >
            <option value="desc">Latest First</option>
            <option value="asc">Oldest First</option>
          </select>
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
                      {transaction.cryptoName || "N/A"}
                    </td>
                    <td
                      style={{
                        padding: "0.5rem 1rem",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      {transaction.quantity || 0}
                    </td>
                    <td
                      style={{
                        padding: "0.5rem 1rem",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      {transaction.totalAmount
                        ? `₦${transaction.totalAmount.toLocaleString()}`
                        : "N/A"}
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
                        {transaction.status || "N/A"}
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
                        transaction.userName ||
                        "Unknown"}
                    </td>
                    <td
                      style={{
                        padding: "0.5rem 1rem",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      {transaction.createdAt
                        ? new Date(transaction.createdAt).toLocaleString()
                        : "N/A"}
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
