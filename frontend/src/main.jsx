import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./app/store.jsx";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    {" "}
    {/* Wrap your App component with Provider */}
    <App />
  </Provider>
);
