import "bootstrap-icons/font/bootstrap-icons.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Gallery from "../contents/Gallery";
import "../App.css";

function AdvancedSearch(props) {
  const [advancedText, setAdvancedText] = useState("");
  function changeAdvancedText(event) {
    setAdvancedText(event.target.value);
    props.onChangeAdvancedText(event.target.value);
  }

  return (
    <div className="grid grid-cols-2 roboto border-t-1 py-4 px-4">
      <label className="flex flex-auto w-full items-center">
        <p className="text-balance font-bold">
          <i className="bi bi-card-text"></i> {props.name}
        </p>
      </label>
      <input
        onChange={changeAdvancedText}
        value={advancedText}
        className="min-h-12 bg-white pl-4 roboto border-1 px-2"
        type="search"
        list="artistsuggestions"
      />
      <datalist id="artistsuggestions">
        {Gallery.map((item, index) => (
          <option key={index} value={item.artist.name}></option>
        ))}
      </datalist>
    </div>
  );
}

export default AdvancedSearch;
