import "bootstrap-icons/font/bootstrap-icons.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import AdvancedSearch from "./AdvancedSearch";
import AdvancedSearchOption from "./AdvancedSearchOption";

function SearchBar(props) {
  const [searchBar, setSearchBar] = useState(false);
  const [inputValue, setInputValue] = useState(""); // Lưu trữ giá trị input tạm thời

  const handleInputChange = (event) => {
    setInputValue(event.target.value); // Cập nhật inputValue khi input thay đổi
  };
  const handleSearchClick = () => {
    props.onText(inputValue); // Gọi hàm onText với giá trị inputValue
  };

  return (
    <div className=" pl-12 pr-14 pt-10 flex flex-col flex-auto gap-8 items-center border-1">
      <p className="text-center roboto text-sm font-normal">
        View approximately 500 outstanding works owned by the Tokyo National
        Museum in fields such as paintings, calligraphy, sculpture, decorative
        arts, and archaeology. Works can be scrolled in lists by type or on
        current display, or searched by artist or region.
      </p>
      <div className="flex flex-auto justify-between border-1 roboto w-[80%] mb-10">
        <input
          onChange={handleInputChange}
          className="w-[60%] pl-6 border-r-1 bg-gray-200"
          type="search"
          placeholder="Keywords"
          value={inputValue}
        />
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
          <div className="grid grid-rows-3">
            {/*Hàng 1*/}
            <div className="grid grid-cols-2 gap-10">
              <AdvancedSearch name="Title" />
              <AdvancedSearchOption name="Type" />
            </div>
            {/*Hàng 2*/}
            <div className="grid grid-cols-2 gap-10">
              <AdvancedSearch name="Artist" />
              <AdvancedSearchOption name="Genre" />
            </div>
            {/*Hàng 3*/}
            <div className="grid grid-cols-2 gap-10">
              <AdvancedSearchOption name="Country" />
            </div>
          </div>
          <button className="bg-gray-800 text-white text-xl roboto min-h-10 py-2 px-4 max-w-fit">
            Search
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default SearchBar;
