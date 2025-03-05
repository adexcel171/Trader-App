import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  useRouteError,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./app/store";
import "./index.css";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Market from "./pages/Market";
import Home from "./pages/Home";
import CryptoPortfolio from "./pages/Portfolio";
import WalletAccounts from "./pages/Wallet";
import Profile from "./pages/Profile";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import UserActivities from "./pages/UserActivities";
import PageNotFound from "./components/pageNotFound";

const ErrorBoundary = () => {
  const error = useRouteError();
  console.error("Route error:", error);
  return (
    <div>
      <h1>Something went wrong</h1>
      <p>{error?.message || "Unknown error"}</p>
      <pre>{JSON.stringify(error, null, 2)}</pre>
    </div>
  );
};

const withErrorBoundary = (Component) => {
  return (props) => {
    try {
      console.log(`Rendering ${Component.name} with props:`, props);
      return <Component {...props} />;
    } catch (err) {
      console.error(`Error in ${Component.name}:`, err);
      throw err;
    }
  };
};

const router = createBrowserRouter([
  {
    path: "/",
    element: withErrorBoundary(Layout),
    errorElement: <ErrorBoundary />,
    children: [
      { path: "/", element: withErrorBoundary(Home) },
      { path: "/login", element: withErrorBoundary(Login) },
      { path: "/register", element: withErrorBoundary(Register) },
      { path: "/dashboard", element: withErrorBoundary(Dashboard) },
      { path: "/markets", element: withErrorBoundary(Market) },
      { path: "/portfolio", element: withErrorBoundary(CryptoPortfolio) },
      { path: "/wallet", element: withErrorBoundary(WalletAccounts) },
      { path: "/profile", element: withErrorBoundary(Profile) },
      { path: "/activities", element: withErrorBoundary(UserActivities) },
      { path: "*", element: withErrorBoundary(PageNotFound) },
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
