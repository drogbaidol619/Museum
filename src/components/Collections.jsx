import "bootstrap-icons/font/bootstrap-icons.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Gallery from "../contents/Gallery";
import "../App.css";
import CollectionsItem from "./CollectionsItem";

function Collections(props) {
  const filteredGallery = Gallery.filter((item) => {
    const itemTitleLower = item.title.toLowerCase();
    const searchTextLower = props.searchText.toLowerCase();
    // Nếu searchText là rỗng, trả về true để hiển thị tất cả sản phẩm
    if (props.searchText === "") {
      return true;
    }
    // Nếu searchText không rỗng, lọc sản phẩm theo searchText
    return itemTitleLower.includes(searchTextLower);
  });

  const itemsPerColumn = Math.ceil(filteredGallery.length / 4); // Tính số lượng item tối đa cho mỗi cột

  return (
    <div className="pl-12 pr-14 py-10 grid grid-cols-4 min-w-screen gap-8">
      {/*Cột 1*/}
      <div className="flex flex-col gap-8">
        {filteredGallery.slice(0, itemsPerColumn).map((item) => (
          <CollectionsItem key={item.id} image={item.image} name={item.title} />
        ))}
      </div>
      {/*Cột 2*/}
      <div className="flex flex-col gap-8">
        {filteredGallery
          .slice(itemsPerColumn, itemsPerColumn * 2)
          .map((item) => (
            <CollectionsItem
              key={item.id}
              image={item.image}
              name={item.title}
            />
          ))}
      </div>
      {/*Cột 3*/}
      <div className="flex flex-col gap-8">
        {filteredGallery
          .slice(itemsPerColumn * 2, itemsPerColumn * 3)
          .map((item) => (
            <CollectionsItem
              key={item.id}
              image={item.image}
              name={item.title}
            />
          ))}
      </div>
      {/*Cột 4*/}
      <div className="flex flex-col gap-8">
        {filteredGallery
          .slice(itemsPerColumn * 3, filteredGallery.length)
          .map((item) => (
            <CollectionsItem
              key={item.id}
              image={item.image}
              name={item.title}
            />
          ))}
      </div>
    </div>
  );
}

export default Collections;
