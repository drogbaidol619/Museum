import { useState, React } from "react";
import "../App.css";

function Picture(props) {
  return <img className="w-full h-full" src={props.url} alt={props.alt}></img>;
}
export default Picture;
