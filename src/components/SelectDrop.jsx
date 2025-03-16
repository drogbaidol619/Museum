import { useState, useEffect, React } from "react";
import "../App.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Devices from "../contents/Device";

function handleShow() {
  let dropdownitems = document.getElementById("dropdownitems");
  dropdownitems.classList.toggle("hidden");
}

function SelectDrop(props) {
  const [select, setSelect] = useState("null");

  return (
    <div className="relative inline-block">
      <button
        onClick={handleShow}
        className="inline-flex w-full rounded-md p-3 text-base font-semibold justify-between bg-white text-gray-900 hover:bg-gray-50 roboto cursor-pointer select-none"
      >
        {select !== "null" ? select : <p>Lựa chọn thiết bị</p>}
        <i className="bi bi-chevron-down"></i>
      </button>
      <div
        id="dropdownitems"
        className="absolute right-0 z-10 mt-2 w-full text-sm font-semibold roboto rounded-md bg-white hidden max-h-40 overflow-y-auto"
      >
        {Devices.map((item, index) => {
          return (
            <button
              onClick={() => {
                props.HandleClick(item.name);
                setSelect(item.name);
              }}
              key={index}
              className="block w-full p-2 hover:bg-gray-100 hover:text-gray-900 text-left border-0"
            >
              {item.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default SelectDrop;
