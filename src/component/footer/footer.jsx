import React from "react";
import "./footer.css";
import { Link } from "react-router-dom";
import { LuBadgeCheck } from "react-icons/lu";
import { LuShieldCheck } from "react-icons/lu";
import { LuSparkles } from "react-icons/lu";
export default function Footer() {
  return (
    <footer>
      <div className="footer-container">
        <h2>Prisus AI</h2>
        <div className="app-features">
          <div className="app-features-item">
            <LuShieldCheck size={30} color="#9857ff" />
            <div className="footer-features-words">
              <span className="footer-feature-head">Secure & Private.</span>
              <span className="footer-feature-span">
                Your data is encrypted and secure.
              </span>
            </div>
          </div>
          <div className="app-features-item">
            <LuBadgeCheck size={30} color="#9857ff" />
            <div className="footer-features-words">
              <span className="footer-feature-head">Trusted by Students.</span>
              <span className="footer-feature-span">
                Join thousands of learners worldwide.
              </span>
            </div>
          </div>
          <div className="app-features-item">
            <LuSparkles size={30} color="#9857ff" />
            <div className="footer-features-words">
              <span className="footer-feature-head">Powered by AI.</span>
              <span className="footer-feature-span">
                Advanced AI models to accelerate learning.
              </span>
            </div>
          </div>
        </div>
        <p className="mt">© 2026 Prisus.ai — All rights reserved.</p>
      </div>
    </footer>
  );
}
