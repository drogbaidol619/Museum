import "bootstrap-icons/font/bootstrap-icons.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../App.css";

function AdvancedSearch(props) {
  return (
    <div className="grid grid-cols-2 roboto border-t-1 py-4 px-4">
      <label className="flex flex-auto w-full items-center">
        {" "}
        <p className="text-balance font-bold">
          <i className="bi bi-card-text"></i> {props.name}
        </p>
      </label>
      <input
        className="min-h-12 bg-white pl-4 roboto border-1 px-2"
        placeholder=""
        type="search"
      />
    </div>
  );
}

export default AdvancedSearch;
