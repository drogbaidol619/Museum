import "bootstrap-icons/font/bootstrap-icons.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import Gallery from "../contents/Gallery";

function AdvancedSearchOption(props) {
  const [options, setOptions] = useState([]); // State để lưu các option đã xử lý
  const [selectedValue, setSelectedValue] = useState(""); // Giá trị ban đầu là ""

  useEffect(() => {
    if (props.name === "Genre") {
      const uniqueGenres = [...new Set(Gallery.map((item) => item.genre))];
      setOptions(uniqueGenres);
    } else if (props.name === "Type") {
      const uniqueTypes = [...new Set(Gallery.map((item) => item.type))];
      setOptions(uniqueTypes);
    } else if (props.name === "Country") {
      const uniqueCountries = [...new Set(Gallery.map((item) => item.country))];
      setOptions(uniqueCountries);
    }
  }, [props.name]); // Chạy useEffect mỗi khi props.name thay đổi

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
    props.onOptionChange(props.name, event.target.value);
  };

  return (
    <div className="grid grid-cols-2 roboto border-t-1 py-4 px-4">
      <label className="flex flex-auto w-full items-center">
        <p className="text-balance font-bold">
          <i className="bi bi-card-text"></i> {props.name}
        </p>
      </label>
      <select
        value={selectedValue}
        onChange={handleChange}
        className="min-h-12 bg-white pl-4 roboto border-1 px-2"
      >
        <option value="">{/* Option rỗng ban đầu */} </option>{" "}
        {/* Thêm option này */}
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default AdvancedSearchOption;
