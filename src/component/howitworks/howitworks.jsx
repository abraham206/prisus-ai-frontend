import React from "react";
import { FaFile } from "react-icons/fa";
import { MdAutoAwesome } from "react-icons/md";
import { FaPaperPlane } from "react-icons/fa";

import "./howitworks.css";
export default function () {
  return (
    <section className="how-it-works-section animation select">
      <div className="how-it-works-container">
        <h2 className="about-head">
          How <span>Prisus.ai</span> Works
        </h2>
        <p className="paragraph">
          Generate smart, customized quizzes in just a few clicks.
        </p>

        <div className="howitworks-container">
          <div className="container-1 animate2">
            <div className="background">
              <MdAutoAwesome color="white" size={30} />
            </div>
            <p className="step">
              <b>Step 1: Enter a Topic</b>
            </p>
            <p className="guide">
              Type in your preferred subject or paste any text. Prisus.ai will
              analyze it intelligently.
            </p>
          </div>
          <div className="container-1 animate2">
            <div className="background">
              <FaFile color="white" size={30} />
            </div>
            <p className="step">
              <b>Step 2: AI Generates quiz</b>
            </p>
            <p className="guide">
              Our AI instantly creates relevant and challenging quiz questions
              for you.
            </p>
          </div>
          <div className="container-1 animate2">
            <div className="background">
              <FaPaperPlane color="white" size={30} />
            </div>
            <p className="step">
              <b>Step 3: Share & learn</b>
            </p>
            <p className="guide">
              Download, share, or use your quiz to boost learning and
              engagement.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
