import { useState, React } from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import Collections from "./components/Collections";
import BackToTop from "./components/BackToTop";

const scrollToTop = (event) => {
  window.scrollTo({
    top: 0,
    behavior: "smooth", // Optional: For smooth scrolling
  });
};

function CollectionsPage() {
  const [searchText, setSearchText] = useState("");
  const [filteredGallery, setFilteredGallery] = useState([]);
  const [isAdvancedSearch, setIsAdvancedSearch] = useState(false);

  const handleAdvancedSearch = (gallery, searchBarValue) => {
    setFilteredGallery(gallery);
    setIsAdvancedSearch(searchBarValue);
  };

  const handleTextSearch = (text) => {
    setSearchText(text);
    setIsAdvancedSearch(false); // Reset isAdvancedSearch khi tìm kiếm bằng searchText
    setFilteredGallery([]); // Reset filteredGallery khi tìm kiếm bằng searchText
  };

  return (
    <div className="flex flex-col max-w-screen overflow-x-clip">
      <NavBar />
      <SearchBar
        onText={handleTextSearch}
        onAdvancedClick={handleAdvancedSearch}
      />
      <Collections
        searchText={searchText}
        filteredGallery={filteredGallery}
        isAdvancedSearch={isAdvancedSearch}
      />
      <Footer />
      <BackToTop onCheck={scrollToTop} />
    </div>
  );
}

export default CollectionsPage;
