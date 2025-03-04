// import { createSlice } from "@reduxjs/toolkit";

// // Load transactions from localStorage
// const loadTransactions = () => {
//   const savedTransactions = localStorage.getItem("transactions");
//   return savedTransactions ? JSON.parse(savedTransactions) : [];
// };

// const initialState = {
//   transactions: loadTransactions(),
// };

// const transactionsSlice = createSlice({
//   name: "transactions",
//   initialState,
//   reducers: {
//     addTransaction: (state, action) => {
//       const transaction = {
//         ...action.payload,
//         userId: action.payload.userId, // Ensure userId is included
//         id: action.payload.id || Date.now().toString(), // Generate ID if not provided
//         status: action.payload.status || "pending", // Default status
//       };
//       state.transactions.push(transaction);
//       localStorage.setItem("transactions", JSON.stringify(state.transactions));
//     },
//     updateTransactionStatus: (state, action) => {
//       const { id, status } = action.payload;
//       const transaction = state.transactions.find((t) => t.id === id);
//       if (transaction) {
//         transaction.status = status;
//         localStorage.setItem(
//           "transactions",
//           JSON.stringify(state.transactions)
//         );
//       }
//     },
//     clearTransactions: (state) => {
//       state.transactions = [];
//       localStorage.setItem("transactions", JSON.stringify(state.transactions));
//     },
//   },
// });

// export const { addTransaction, updateTransactionStatus, clearTransactions } =
//   transactionsSlice.actions;
// export default transactionsSlice.reducer;
