import React from "react";
import "./student.css";
import data from "../.././../data";

export default function Student() {
  return (
    <section className="student-section animation select">
      <div className="student-container">
        <h2 className="about-head">What Students Are Saying ✨ </h2>
        <div className="student-div">
          {data.map((el, n) => {
            return (
              <div className="content animate2" key={n}>
                <div className="image-container">
                  <img src={el.image} />
                </div>
                <p className="paragraph-1">{el.reviews}</p>
                <p className="reviewer">
                  <b>{el.reviewer}</b>
                </p>
                <p className="dept">{el.department}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
