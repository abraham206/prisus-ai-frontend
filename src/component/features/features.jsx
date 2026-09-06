import React from "react";
import "./features.css";
import image from "../../assets/hero.png";
// import data from "../../features-data";
import data from "../../../features-data";
export default function Features() {
  console.log(data);
  return (
    <section className="features-section animation select">
      <div className="features-section-container">
        <h3 className="features-head">features</h3>
        <p className="features-paragraph">
          Everything you need to excel in your exams
        </p>
        <div className="features-section_container">
          {data?.map((el, n) => {
            return (
              <div className="features-section-div animate2" key={n}>
                <div className="features_container">
                  <div className="image_container">
                    {/* <img src={image} /> */}
                    <el.image color="white" size={30} />
                  </div>
                  <div className="features_about">
                    <h2 className="feature">{el.feature}</h2>
                    <p className="about-word">{el.about}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
