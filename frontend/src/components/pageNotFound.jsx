// src/pages/PageNotFound.js
import React from "react";
import { Link } from "react-router-dom";

// Bitcoin SVG as inline JSX for simplicity
const BitcoinIcon = () => (
  <svg
    width="100"
    height="100"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      margin: "0 auto 20px",
      display: "block",
      filter: "drop-shadow(0 0 10px rgba(255, 215, 0, 0.5))",
    }}
  >
    <path
      d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm2.858 15.346c-.93 0-1.578-.637-1.578-1.567v-3.558c0-.93.648-1.567 1.578-1.567h.93v-1.5h-.93c-1.86 0-3.146 1.237-3.146 3.067v3.558c0 1.83 1.286 3.067 3.146 3.067h.93v-1.5h-.93z"
      fill="#FFD700"
    />
  </svg>
);

const PageNotFound = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        color: "#fff",
        fontFamily: "'Arial', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ textAlign: "center", zIndex: 1 }}>
        {/* Floating Bitcoin Icon */}
        <div
          style={{
            animation: "float 3s ease-in-out infinite",
          }}
        >
          <BitcoinIcon />
        </div>

        {/* 404 Error Code */}
        <h1
          style={{
            fontSize: "8rem",
            fontWeight: "bold",
            background: "linear-gradient(to right, #4facfe 0%, #00f2fe 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: "0",
            lineHeight: "1",
          }}
        >
          404
        </h1>

        {/* Error Message */}
        <h2
          style={{
            fontSize: "2.5rem",
            fontWeight: "600",
            margin: "20px 0",
          }}
        >
          Lost in the Blockchain?
        </h2>

        {/* Description */}
        <p
          style={{
            fontSize: "1.2rem",
            color: "#b0b0b0",
            maxWidth: "400px",
            margin: "0 auto 30px",
          }}
        >
          The page you're looking for doesn't exist. Let's get you back to
          trading!
        </p>

        {/* Call to Action Button */}
        <Link
          to="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "12px 24px",
            background: "linear-gradient(to right, #4facfe 0%, #00f2fe 100%)",
            color: "#fff",
            fontWeight: "600",
            textDecoration: "none",
            borderRadius: "8px",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
            transition: "transform 0.3s ease, background 0.3s ease",
          }}
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
        >
          <span style={{ marginRight: "8px" }}>🚀</span>
          Back to Home
        </Link>
      </div>

      {/* Background Decorative Elements */}
      <div
        style={{
          position: "absolute",
          width: "300px",
          height: "300px",
          background:
            "radial-gradient(circle, rgba(79, 172, 254, 0.2), transparent)",
          borderRadius: "50%",
          top: "20%",
          left: "20%",
          animation: "spin 20s linear infinite",
          filter: "blur(50px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "200px",
          height: "200px",
          background:
            "radial-gradient(circle, rgba(255, 215, 0, 0.2), transparent)",
          borderRadius: "50%",
          bottom: "20%",
          right: "20%",
          animation: "spin 20s linear infinite reverse",
          filter: "blur(50px)",
          pointerEvents: "none",
        }}
      />

      {/* Inline keyframes for animations */}
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
            100% { transform: translateY(0); }
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default PageNotFound;
