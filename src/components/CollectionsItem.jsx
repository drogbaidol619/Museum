import "bootstrap-icons/font/bootstrap-icons.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../App.css";

function CollectionsItem(props) {
  return (
    <button style={{ cursor: "pointer" }} className="relative max-h-fit">
      <img
        className="object-center object-cover"
        src={props.image}
        alt="none"
      />
      <div className="absolute min-h-10 p-2 bg-gray-800 left-0 top-0 roboto font-medium text-white">
        On Display
      </div>
    </button>
  );
}
export default CollectionsItem;
