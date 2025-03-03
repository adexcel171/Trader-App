export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://trader-xewp.onrender.com" // Replace with your Render backend URL
    : "http://localhost:5000";
export const USERS_URL = "/api/users";