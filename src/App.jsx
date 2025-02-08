import { useState, React } from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import LandingPage from "./components/LandingPage";
import Highlight from "./components/Highlight";

function App() {
  return (
    <div className="flex flex-col max-w-screen overflow-x-clip">
      <NavBar />
      <LandingPage />
      <Highlight />
    </div>
  );
}
export default App;
