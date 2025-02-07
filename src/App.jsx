import { useState, React } from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import LandingPage from "./components/LandingPage";

function App() {
  return (
    <div className="flex flex-col max-w-screen overflow-x-clip">
      <NavBar />
      <LandingPage />
    </div>
  );
}
export default App;
