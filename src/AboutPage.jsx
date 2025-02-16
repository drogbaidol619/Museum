import { useState, React } from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";
import AboutMuseum from "./components/AboutMuseum";

const scrollToTop = (event) => {
  window.scrollTo({
    top: 0,
    behavior: "smooth", // Optional: For smooth scrolling
  });
};

function AboutPage() {
  return (
    <div className="flex flex-col max-w-screen overflow-x-clip">
      <NavBar />
      <AboutMuseum />
      <Footer />
      <BackToTop onCheck={scrollToTop} />
    </div>
  );
}

export default AboutPage;
