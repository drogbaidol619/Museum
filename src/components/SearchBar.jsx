import "bootstrap-icons/font/bootstrap-icons.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../App.css";

function SearchBar() {
  return (
    <div className=" pl-12 pr-14 py-20 flex flex-col flex-auto gap-4 items-center">
      <p className="text-center roboto text-sm font-normal">
        View approximately 500 outstanding works owned by the Tokyo National
        Museum in fields such as paintings, calligraphy, sculpture, decorative
        arts, and archaeology. Works can be scrolled in lists by type or on
        current display, or searched by artist or region.
      </p>
      <div className="flex flex-auto justify-between border-1 roboto w-[80%]">
        <input
          className="pl-10 w-[60%] text-balance bg-neutral-200 border-r-1"
          type="search"
          placeholder="Keywords"
        />
        <div className="grid grid-cols-3 items-center w-[40%] overflow-hidden">
          <button
            className="col-span-2 px-3 py-2 gap-2 flex items-center justify-center border-r-1 min-h-15"
            style={{ cursor: "pointer" }}
          >
            <p className="font-bold">Advanced Search</p>
            <i className="bi bi-chevron-down"></i>
          </button>
          <button
            className="text-2xl font-bold text-white min-h-15 bg-neutral-700"
            style={{ cursor: "pointer" }}
          >
            <i className="bi bi-search"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
