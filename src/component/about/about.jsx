import React from "react";
import "./about.css";

export default function About() {
  return (
    <section className="about-section animation select">
      <div className="about-container">
        <h2 className="about-head">
          About <span>Prisus.ai</span>
        </h2>
        <p className="paragraph res">
          Prisus.ai is an AI-powered platform that helps educators and learners
          generate smart quizzes in seconds. Whether you're preparing for a test
          or building an interactive learning experience, Prisus.ai gives you
          the tools to create, customize, and share quizzes effortlessly.
        </p>
        <div className="about-div-container">
          <div className="about-div_div animate">
            <div className="contents">
              <h3>10k+</h3>
              <p>Quizes Generated</p>
            </div>
          </div>
          <div className="about-div_div animate">
            <div className="contents">
              <h3>5k+</h3>
              <p>Active Users</p>
            </div>
          </div>
          <div className="about-div_div animate">
            <div className="contents">
              <h3>99%</h3>
              <p>User satisfaction</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
