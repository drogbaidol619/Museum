import "bootstrap-icons/font/bootstrap-icons.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Gallery from "../contents/Gallery";
import "../App.css";
import CollectionsItem from "./CollectionsItem";

function Collections(props) {
  const { searchText, filteredGallery, isAdvancedSearch } = props;

  const galleryToDisplay =
    isAdvancedSearch && filteredGallery && filteredGallery.length > 0 // khi người dùng nhấn Advanced Search và phần tử mảng có tồn tại
      ? filteredGallery // Ưu tiên filteredGallery (Advanced Search)
      : searchText === ""
      ? Gallery // Nếu searchText rỗng, trả về mảng rỗng
      : Gallery.filter((item) => {
          // Nếu không, lọc theo searchText
          const itemTitleLower = item.title.toLowerCase();
          const searchTextLower = searchText.toLowerCase();
          return itemTitleLower.includes(searchTextLower);
        });

  const columns = [[], [], [], []]; // Khởi tạo 4 cột rỗng

  for (let i = 0; i < galleryToDisplay.length; i++) {
    const item = galleryToDisplay[i];
    const columnIndex = i % 4; // Chia lấy dư để xác định cột
    columns[columnIndex].push(item);
  }

  return (
    <div className="pl-12 pr-14 py-10 grid grid-cols-4 min-w-screen gap-8">
      {columns.map((column, index) => (
        <div key={index} className="flex flex-col gap-8">
          {column.map((item) => (
            <CollectionsItem
              key={item.id}
              image={item.image}
              name={item.title}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Collections;
