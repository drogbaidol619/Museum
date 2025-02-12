import { useState, React } from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import Collections from "./components/Collections";

function CollectionsPage() {
  const [searchText, setSearchText] = useState("");
  console.log(searchText);
  return (
    <div className="flex flex-col max-w-screen overflow-x-clip">
      <NavBar />
      <SearchBar onText={setSearchText} />
      <Collections searchText={searchText} />
      <Footer />
    </div>
  );
}

export default CollectionsPage;
