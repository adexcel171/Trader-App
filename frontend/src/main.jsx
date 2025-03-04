import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./app/store";
import "./index.css";
import Layout from "./components/Layout"; // ✅ Import the Layout
import Dashboard from "./pages/Dashboard";
import Market from "./pages/Market";
import Home from "./pages/Home";
import CryptoPortfolio from "./pages/Portfolio";
import WalletAccounts from "./pages/Wallet";
import Profile from "./pages/Profile";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import UserActivities from "./pages/UserActivities";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // ✅ Use Layout for all routes
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/markets", element: <Market /> },
      { path: "/portfolio", element: <CryptoPortfolio /> },
      { path: "/wallet", element: <WalletAccounts /> },
      { path: "/profile", element: <Profile /> },

      { path: "/activities", element: <UserActivities /> },
      { path: "*", element: <PageNotFound /> },
    ],
  },
]);

const App = () => {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
