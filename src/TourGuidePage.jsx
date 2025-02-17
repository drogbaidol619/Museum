import { useState, useEffect, React } from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";
import TourGuide from "./components/TourGuide";

const scrollToTop = (event) => {
  window.scrollTo({
    top: 0,
    behavior: "smooth", // Optional: For smooth scrolling
  });
};

function TourGuidePage() {
  return (
    <div className="flex flex-col max-w-screen overflow-x-clip">
      <NavBar />
      <TourGuide />
      <Footer />
      <BackToTop onCheck={scrollToTop} />
    </div>
  );
}

export default TourGuidePage;
