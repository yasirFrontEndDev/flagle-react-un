import React from "react";
import dailyImage from "../images/homepage/daily.png";
import { Link } from "react-router-dom";
const HomePage = () => {
  return (
    <div style={{ backgroundColor: "#0B0D12", minHeight: "100vh", color: "#FFFFFF", padding: "20px" }}>
      {/* Header */}
      <header style={{ borderBottom: "1px solid #464646", display: "flex", justifyContent: "center", padding: "10px 0" }}>
        <div style={{ maxWidth: "1024px", width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* Logo */}
          <div style={{ display: "flex", gap: "4px" }}>
            {"FLAGLE".split("").map((letter, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: index >= 3 ? "#2161BA" : "#538D4E",
                  color: "#FFFFFF",
                  padding: "4px 8px",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                {letter}
              </div>
            ))}
          </div>

          {/* Navigation */}
          <nav style={{ display: "flex", gap: "20px", fontSize: "14px" }}>
            <a href="about.html" style={{ textDecoration: "none", color: "#FFFFFF" }}>
              How to Play?
            </a>
            <a href="mailto:mythomasgames@gmail.com" style={{ textDecoration: "none", color: "#FFFFFF" }}>
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: "550px", margin: "40px auto", textAlign: "center" }}>
        {/* Card 1 */}
        <div
          style={{
            background: "linear-gradient(141deg, rgba(8, 51, 134, 0.29) 0%, rgba(21, 24, 32, 0.6) 100%)",
            border: "1px solid rgba(33, 97, 186, 0.2)",
            borderRadius: "8px",
            padding: "20px",
            marginBottom: "20px",
            position: "relative",
             textAlign: "left"
          }}
        >
          <img
           src={dailyImage}
            alt="Daily Game"
            style={{ position: "absolute", top: 0, right: 0, height: "100%" }}
          />
          <div style={{ color: "#D0D0D0", fontSize: "14px", marginBottom: "10px" }}>Play once daily</div>
          <div style={{ color: "#FFFFFF", fontSize: "18px", fontWeight: "bold", marginBottom: "20px" }}>Daily Crissle Crossle</div>
          <Link
            to="/daily"
            style={{
              display: "inline-block",
              padding: "10px 20px",
              border: "1px solid #2161BA",
              borderRadius: "4px",
              textDecoration: "none",
              color: "#FFFFFF",
              backgroundColor: "transparent",
              transition: "background-color 0.3s",
            }}
          > 
            Play Now
          </Link>
        </div>

        {/* Card 2 */}
        <div
          style={{
            background: "linear-gradient(141deg, rgba(8, 51, 134, 0.29) 0%, rgba(21, 24, 32, 0.6) 100%)",
            border: "1px solid rgba(33, 97, 186, 0.2)",
            borderRadius: "8px",
            padding: "20px",
            position: "relative",
            textAlign: "left"
          }}
        >
          <img
            src={dailyImage}
            alt="Practice Game"
            style={{ position: "absolute", top: 0, right: 0, height: "100%" }}
          />
          <div style={{ color: "#D0D0D0", fontSize: "14px", marginBottom: "10px" }}>Play unlimited</div>
          <div style={{ color: "#FFFFFF", fontSize: "18px", fontWeight: "bold", marginBottom: "20px" }}>Practice Crissle Crossle</div>
          <Link
          to="/unlimited"
            style={{
              display: "inline-block",
              padding: "10px 20px",
              border: "1px solid #2161BA",
              borderRadius: "4px",
              textDecoration: "none",
              color: "#FFFFFF",
              backgroundColor: "transparent",
              transition: "background-color 0.3s",
            }}
          >
            Play Now
          </Link>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
