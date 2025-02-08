import { useState, React } from "react";
import "../App.css";

function Contents(props) {
  return (
    <div className="grid grid-rows-2 border-l-4 border-l-indigo-500 pl-4 gap-2 roboto">
      <div className="text-lg font-bold roboto">{props.title}</div>
      <div className="text-base roboto">
        {props.times} {props.description}
      </div>
    </div>
  );
}
export default Contents;
