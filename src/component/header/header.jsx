import React from "react";
import "./header.css";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  return (
    <header className="header select animation">
      <div className="header-container">
        <div className="head-container">
          <span className="header-head">Transform Your Learning with</span>
          <span className="ai">AI-Powered Education</span>
        </div>
        <p className="paragraph">
          Upload your study materials and let our AI generate personalized tests
          to help you master any subject.
        </p>

        <div className="btn-container">
          <button
            className="btn"
            style={{ cursor: "pointer" }}
            onClick={() => {
              navigate("/signup");
            }}
          >
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
}
