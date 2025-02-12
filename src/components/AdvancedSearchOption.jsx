import "bootstrap-icons/font/bootstrap-icons.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import Gallery from "../contents/Gallery";

function AdvancedSearchOption(props) {
  const getOptions = () => {
    if (props.name === "Genre") {
      const uniqueGenres = [...new Set(Gallery.map((item) => item.genre))]; // Lọc giá trị trùng lặp
      return uniqueGenres.map((genre) => (
        <option key={genre} value={genre}>
          {genre}
        </option>
      ));
    } else if (props.name === "Type") {
      const uniqueTypes = [...new Set(Gallery.map((item) => item.type))]; // Lọc giá trị trùng lặp
      return uniqueTypes.map((type) => (
        <option key={type} value={type}>
          {type}
        </option>
      ));
    } else if (props.name === "Country") {
      const uniqueTypes = [...new Set(Gallery.map((item) => item.country))]; // Lọc giá trị trùng lặp
      return uniqueTypes.map((type) => (
        <option key={type} value={type}>
          {type}
        </option>
      ));
    }
    return null;
  };

  return (
    <div className="grid grid-cols-2 roboto border-t-1 py-4 px-4">
      <label className="flex flex-auto w-full items-center">
        {" "}
        <p className="text-balance font-bold">
          <i className="bi bi-card-text"></i> {props.name}
        </p>
      </label>
      <select className="min-h-12 bg-white pl-4 roboto border-1 px-2">
        {" "}
        {getOptions()}
      </select>
    </div>
  );
}

export default AdvancedSearchOption;
