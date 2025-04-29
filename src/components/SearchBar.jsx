import "bootstrap-icons/font/bootstrap-icons.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import Form from "react-bootstrap/Form";
import AdvancedSearch from "./AdvancedSearch";
import AdvancedSearchOption from "./AdvancedSearchOption";
import Gallery from "../contents/Gallery";

function SearchBar(props) {
  const [searchBar, setSearchBar] = useState(false);
  const [inputValue, setInputValue] = useState(""); // Lưu trữ giá trị input tạm thời

  const handleInputChange = (event) => {
    setInputValue(event.target.value); // Cập nhật inputValue khi input thay đổi
  };
  const handleSearchClick = () => {
    props.onText(inputValue); // Gọi hàm onText với giá trị inputValue
  };

  const [searchCriteria, setSearchCriteria] = useState({
    country: "",
    type: "",
    artist: "",
    genre: "",
  });
  // xử lí dữ liệu dạng option
  const handleOptionChange = (optionName, value) => {
    setSearchCriteria({ ...searchCriteria, [optionName.toLowerCase()]: value });
  };
  //xử lí dữ liệu text
  const handleAdvancedTextChange = (value) => {
    setSearchCriteria({ ...searchCriteria, artist: value });
  };
  // xử lí khi nhấn nút advanced search
  const handleAdvancedSearchClick = () => {
    const filteredGallery = Gallery.filter((item) => {
      const countryMatch =
        searchCriteria.country === "" ||
        item.country
          .toLowerCase()
          .includes(searchCriteria.country.toLowerCase());
      const typeMatch =
        searchCriteria.type === "" ||
        item.type.toLowerCase().includes(searchCriteria.type.toLowerCase());
      const artistMatch =
        searchCriteria.artist === "" ||
        item.artist.name
          .toLowerCase()
          .includes(searchCriteria.artist.toLowerCase());
      const genreMatch =
        searchCriteria.genre === "" ||
        item.genre.toLowerCase().includes(searchCriteria.genre.toLowerCase());

      return countryMatch && typeMatch && artistMatch && genreMatch;
    });
    // Sử dụng filteredGallery để hiển thị kết quả
    console.log("Filtered Gallery:", filteredGallery);
    // render kết quả tìm kiếm
    props.onAdvancedClick(filteredGallery, searchBar);
  };

  return (
    <div className=" pl-12 pr-14 pt-10 flex flex-col flex-auto gap-8 items-center border-1">
      <p className="text-center roboto text-sm font-normal">
        View approximately 500 outstanding works owned by the National Museum in
        fields such as paintings, calligraphy, sculpture, decorative arts, and
        archaeology. Works can be scrolled in lists by type or on current
        display, or searched by artist or region.
      </p>
      <div className="flex flex-auto justify-between border-1 roboto w-[80%] mb-10">
        <input
          onChange={handleInputChange}
          className="w-[60%] pl-6 border-r-1 bg-gray-200"
          list="suggestions"
          type="search"
          placeholder="Keywords"
          value={inputValue}
        />
        <datalist id="suggestions">
          {Gallery.map((item, index) => (
            <option key={index} value={item.title}>
              {item.title}
            </option>
          ))}
        </datalist>
        <div className="grid grid-cols-4 items-center w-[40%] overflow-hidden">
          <button
            onClick={() => setSearchBar(!searchBar)}
            className="col-span-3 px-3 py-2 gap-2 flex items-center justify-center border-r-1 min-h-15"
            style={{ cursor: "pointer" }}
          >
            <p className="font-bold">Advanced Search</p>
            <i className="bi bi-chevron-down"></i>
          </button>
          <button
            onClick={handleSearchClick}
            className="text-2xl font-bold text-white min-h-15 bg-neutral-700"
            style={{ cursor: "pointer" }}
          >
            <i className="bi bi-search"></i>
          </button>
        </div>
      </div>
      {/*Advanced search*/}
      {searchBar ? (
        <div className="flex flex-col pl-12 pr-14 pb-4 pt-10 gap-4 bg-gray-200 min-w-screen items-center">
          <div className="grid grid-rows-2">
            {/*Hàng 1*/}
            <div className="grid grid-cols-2 gap-10">
              <AdvancedSearchOption
                name="Country"
                onOptionChange={handleOptionChange}
              />
              <AdvancedSearchOption
                name="Type"
                onOptionChange={handleOptionChange}
              />
            </div>
            {/*Hàng 2*/}
            <div className="grid grid-cols-2 gap-10">
              <AdvancedSearch
                name="Artist"
                onChangeAdvancedText={handleAdvancedTextChange}
              />
              <AdvancedSearchOption
                name="Genre"
                onOptionChange={handleOptionChange}
              />
            </div>
          </div>
          <button
            onClick={handleAdvancedSearchClick}
            className="bg-gray-800 text-white text-xl roboto min-h-10 py-2 px-4 max-w-fit"
          >
            Search
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default SearchBar;
