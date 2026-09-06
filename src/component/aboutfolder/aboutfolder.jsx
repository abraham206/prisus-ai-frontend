import React from "react";
import "./aboutfolder.css";
import image from "../../assets/sarah.jfif";
import { useEffect } from "react";
import Footer from "../footer/footer";

export default function AboutPage() {
  useEffect(() => {
    const allSection = document.querySelectorAll(".select");

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        console.log(entries);
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("animation");
          }
        });
      },
      {
        threshold: 0.2,
      },
    );

    allSection.forEach((section) => sectionObserver.observe(section));
    return () => sectionObserver.disconnect();
  }, []);
  useEffect(() => {
    const allSection = document.querySelectorAll(".select");

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        console.log(entries);
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("animation");
          }

          if (!entry.isIntersecting) {
            entry.target.classList.add("animation");
          }
        });
      },
      {
        threshold: 0.2,
      },
    );

    allSection.forEach((section) => sectionObserver.observe(section));
    return () => sectionObserver.disconnect();
  }, []);

  return (
    <main>
      <section className="about-page">
        <div className="aboutpage-container select animation">
          <h2 className="about">
            About <span>Prisus.ai</span>
          </h2>
          <p className="p">
            Prisus.ai is an AI-powered platform transforming the way students
            learn and educators teach. We bring smart automation, simplicity,
            and engagement into the heart of learning through AI-generated
            quizzes and interactive study tools.
          </p>
          <div className="about-div-container">
            <div className="about-div_div animate2">
              <div className="contents">
                <h3>10k+</h3>
                <p>Quizes Generated</p>
              </div>
            </div>
            <div className="about-div_div animate2">
              <div className="contents">
                <h3>5k+</h3>
                <p>Active Users</p>
              </div>
            </div>
            <div className="about-div_div animate2">
              <div className="contents">
                <h3>99%</h3>
                <p>User satisfaction</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mission select animation">
          <div className="mission-container">
            <h2 className="mission-head">Our Mission</h2>
            <p className="mission-paragraph">
              To make learning smarter, faster, and more adaptive for every
              student. Prisus aims to bridge the gap between curiosity and
              comprehension by offering AI tools that make studying engaging and
              effective.
            </p>
          </div>
        </div>

        <div className="mission select animation">
          <div className="mission-container">
            <h2 className="mission-head">Our Vision</h2>
            <p className="mission-paragraph">
              We envision an educational ecosystem where every learner has
              access to a personalized study experience — one that evolves with
              them, motivates them, and helps them grow beyond limitations.
            </p>
          </div>
        </div>
        <div className="meet-the-team select animation">
          <div className="mission_container">
            <h2 className="mission-head">Meet the team</h2>
            <div className="developer">
              <div className="image-background">
                <img src={image} />
              </div>
              <h2 className="abraham">Amaize Abraham</h2>
              <p className="role">
                <b>Frontent & backend developer</b>
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
