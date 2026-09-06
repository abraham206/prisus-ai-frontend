import React from "react";
import Header from "./header/header";
import Features from "./features/features";
import About from "./about/about";
import Howitworks from "./howitworks/howitworks";
import Student from "./students/student";
import SubFooter from "./subFooter/subFooter";
import Footer from "./footer/footer";
import { useEffect } from "react";
export default function Home() {
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
    <main className="main">
      <Header />
      <Features />
      <About />
      <Howitworks />
      <Student />
      <SubFooter />
      <Footer />
    </main>
  );
}
