import { useState, React } from "react";
import "../App.css";

function Picture(props) {
  return <img src={props.url} alt={props.alt}></img>;
}
export default Picture;
