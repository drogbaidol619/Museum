import "bootstrap-icons/font/bootstrap-icons.css";
import { useState, useEffect } from "react";
import "../App.css";
import NewCards from "./NewCards";
import Info from "../contents/Info.js";

function News() {
  const [showNews, setShowNews] = useState([]);
  useEffect(() => {
    let infoCount = parseInt(localStorage.getItem("infoCount"));
    if (isNaN(infoCount)) {
      infoCount = 0;
    }
    const newShowNews = [];
    for (let i = 0; i < 6; i++) {
      if (Info[infoCount + i]) {
        newShowNews.push(Info[infoCount + i]);
      } else {
        console.log("phần tử không tồn tại ");
        break;
      }
    }

    infoCount += newShowNews.length;
    if (infoCount >= Info.length) {
      infoCount = 0;
    }

    localStorage.setItem("infoCount", infoCount);
    setShowNews(newShowNews);
  }, []);

  return (
    <div className="bg-neutral-900 text-white min-w-screen max-h-fit pl-20 pr-14 py-28 flex flex-col flex-auto">
      <h1 className="text-5xl font-normal roboto mb-10">Tin Tức</h1>
      <div className="grid grid-rows-2 gap-28">
        {/*Hàng 1*/}
        <div className="grid grid-cols-3 max-h-fit">
          {showNews.length > 0 && (
            <NewCards
              image={showNews[0].image}
              title={showNews[0].title}
              description={showNews[0].description}
            />
          )}
          {showNews.length > 0 && (
            <NewCards
              image={showNews[1].image}
              title={showNews[1].title}
              description={showNews[1].description}
            />
          )}
          {showNews.length > 0 && (
            <NewCards
              image={showNews[2].image}
              title={showNews[2].title}
              description={showNews[2].description}
            />
          )}
        </div>
        {/*Hàng 2*/}
        <div className="grid grid-cols-3 max-h-fit">
          {showNews.length > 0 && (
            <NewCards
              image={showNews[3].image}
              title={showNews[3].title}
              description={showNews[3].description}
            />
          )}
          {showNews.length > 0 && (
            <NewCards
              image={showNews[4].image}
              title={showNews[4].title}
              description={showNews[4].description}
            />
          )}
          {showNews.length > 0 && (
            <NewCards
              image={showNews[5].image}
              title={showNews[5].title}
              description={showNews[5].description}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default News;
