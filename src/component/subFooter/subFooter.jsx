import React from "react";
import "./subFooter.css";

export default function SubFooter() {
  return (
    <div className="subFooter animation select">
      <div className="subFooter-container">
        <h2 className="about-head font">Ready to Boost Learning with AI?</h2>
        <p className="subfooter-paragraph">
          Join Prisus.ai today and transform the way quizzes are created.
        </p>
        <div className="button_container">
          <button className="join">Join Waitlist</button>
          <button className="learn">Learn More</button>
        </div>
      </div>
    </div>
  );
}
