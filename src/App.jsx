import { useState, React } from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import LandingPage from "./components/LandingPage";
import Highlight from "./components/Highlight";
import News from "./components/News";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";

const scrollToTop = (event) => {
  window.scrollTo({
    top: 0,
    behavior: "smooth", // Optional: For smooth scrolling
  });
};

function App() {
  return (
    <div>
      <BackToTop onCheck={scrollToTop} />
      <div className="flex flex-col max-w-screen overflow-x-clip">
        <NavBar />
        <LandingPage />
        <Highlight />
        <News />
        <Footer />
      </div>
      {/*nút nhấn về đầu trang*/}
    </div>
  );
}
export default App;
