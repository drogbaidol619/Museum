import { useState, React } from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";

function CollectionsPage() {
  return (
    <div className="flex flex-col max-w-screen overflow-x-clip">
      <NavBar />
      <SearchBar />
      <Footer />
    </div>
  );
}

export default CollectionsPage;
