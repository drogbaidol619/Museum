import "bootstrap-icons/font/bootstrap-icons.css";
import { useState } from "react";
import "../App.css";

function NewCards(props) {
  return (
    <div className="flex flex-col flex-auto gap-4 items-center px-10 border-x-2 border-l-white">
      <img
        className="object-cover object-center max-h-screen rounded-md"
        src={props.image}
        alt="none"
      />
      <div className="roboto text-2xl font-bold text-center">{props.title}</div>
      <div className="roboto text-balance font-light text-justify">
        {props.description}
      </div>
    </div>
  );
}

export default NewCards;
