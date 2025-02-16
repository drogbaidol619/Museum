import { useState, useEffect, React } from "react";
import "../App.css";
import aboutMuseum from "../assets/about-museum.jpg";
import grandOpening from "../assets/grand-opening.jpg";
import galleryPicture from "../assets/gallery.jpg";
import icom from "../assets/icom.jpg";

function AboutMuseum() {
  const Intro = (event) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Optional: For smooth scrolling
    });
  };
  const Rule = (event) => {
    window.scrollTo({
      top: 3180,
      behavior: "smooth", // Optional: For smooth scrolling
    });
  };
  const Price = (event) => {
    window.scrollTo({
      top: 3714,
      behavior: "smooth", // Optional: For smooth scrolling
    });
  };

  return (
    <div className="pl-12 pr-14 py-10 min-w-screen flex flex-col max-h-fit">
      <h1 className="text-3xl font-normal roboto mb-4">
        Giới thiệu về Bảo Tàng Liên Quốc Tế
      </h1>
      <div className="grid grid-cols-3 gap-10">
        {/*Cột trái*/}
        <div className="col-span-2 flex flex-col gap-5">
          <img
            className="object-center object-cover col-span-2"
            src={aboutMuseum}
            alt="none"
          />
          <p className="text-justify indent-8 roboto">
            Bảo Tàng Liên Quốc Tế tọa lạc tại trung tâm thành phố Hà Nội, là một
            điểm đến văn hóa độc đáo và hấp dẫn, nơi hội tụ tinh hoa văn hóa và
            sản vật từ khắp nơi trên thế giới. Bảo tàng được thành lập với mục
            tiêu kết nối các nền văn hóa, giới thiệu những giá trị nghệ thuật và
            lịch sử đặc sắc của các quốc gia, đồng thời tôn vinh sự đa dạng và
            phong phú của thế giới.
          </p>
          <p className="text-justify indent-8 roboto">
            Bảo Tàng Liên Quốc Tế được khởi nguồn từ ý tưởng của nhà sưu tầm
            Nguyễn Quang, một người có niềm đam mê sâu sắc với văn hóa và lịch
            sử thế giới. Ông đã dành nhiều năm sưu tầm các sản vật quý giá từ
            khắp nơi trên thế giới, từ những món đồ cổ kính đến những tác phẩm
            nghệ thuật đương đại. Với mong muốn chia sẻ những giá trị này với
            công chúng, ông đã quyết định thành lập Bảo Tàng Liên Quốc Tế. Bảo
            tàng chính thức mở cửa đón khách vào năm 2023, sau nhiều năm chuẩn
            bị và xây dựng. Với sự hỗ trợ của các tổ chức văn hóa quốc tế và sự
            chung tay của cộng đồng, Bảo Tàng Liên Quốc Tế đã trở thành một điểm
            đến văn hóa quan trọng của Việt Nam.
          </p>
          <img
            className="object-center object-cover col-span-2"
            src={grandOpening}
            alt="none"
          />
          <p className="text-justify indent-8 roboto">
            Bảo Tàng Liên Quốc Tế hiện đang trưng bày hơn 10.000 sản vật độc
            đáo, đại diện cho nhiều nền văn hóa khác nhau trên thế giới. Các sản
            vật được trưng bày bao gồm:
          </p>
          <p className="text-justify roboto">
            <i className="bi bi-dot"></i>Đồ cổ: Các hiện vật có giá trị lịch sử
            và văn hóa cao, như đồ gốm sứ cổ, đồ đồng, đồ trang sức, và các vật
            dụng sinh hoạt của các nền văn minh cổ đại.
          </p>
          <p className="text-justify roboto">
            <i className="bi bi-dot"></i>Tác phẩm nghệ thuật: Các tác phẩm hội
            họa, điêu khắc, và các loại hình nghệ thuật khác, được sáng tác bởi
            các nghệ sĩ nổi tiếng trên thế giới.
          </p>
          <p className="text-justify roboto">
            <i className="bi bi-dot"></i>Sản vật văn hóa: Các sản vật thủ công
            mỹ nghệ, trang phục truyền thống, và các vật dụng văn hóa khác, thể
            hiện nét đặc trưng của từng quốc gia.
          </p>
          <img
            className="object-center object-cover col-span-2"
            src={galleryPicture}
            alt="none"
          />
          <p className="text-justify indent-8 roboto">
            Bảo Tàng Liên Quốc Tế đã nhận được nhiều chứng nhận và giải thưởng
            uy tín từ các tổ chức trong nước và quốc tế, bao gồm: Chứng nhận của
            Hiệp hội Bảo tàng Thế giới (ICOM): Công nhận Bảo Tàng Liên Quốc Tế
            là một thành viên chính thức, thể hiện sự chuyên nghiệp và uy tín
            của bảo tàng trong lĩnh vực bảo tồn và trưng bày di sản văn hóa.
            Giải thưởng "Bảo tàng của năm": Được trao tặng bởi một tổ chức văn
            hóa quốc tế, ghi nhận những đóng góp của bảo tàng trong việc giới
            thiệu và quảng bá văn hóa thế giới. Nhiều giải thưởng và bằng khen
            khác: Từ các tổ chức và hiệp hội văn hóa trong nước, ghi nhận những
            nỗ lực của bảo tàng trong việc bảo tồn và phát huy giá trị di sản
            văn hóa.
          </p>
          <img
            className="object-center object-cover col-span-2"
            src={icom}
            alt="none"
          />
          <p className="text-justify indent-8 roboto">
            Bảo Tàng Liên Quốc Tế cam kết không ngừng nâng cao chất lượng dịch
            vụ và mở rộng hoạt động, nhằm trở thành một điểm đến văn hóa hàng
            đầu của Việt Nam và khu vực. Bảo tàng luôn nỗ lực để giới thiệu đến
            công chúng những giá trị văn hóa độc đáo và đa dạng của thế giới,
            góp phần vào sự hiểu biết và giao lưu văn hóa giữa các quốc gia.
          </p>
          <p className="text-justify indent-8 roboto">
            Xin cảm ơn sự quan tâm và cộng tác của quý vị và các bạn!
          </p>
        </div>
        {/*Cột phải*/}
        <div className="bg-slate-200 max-h-fit roboto py-10 px-8 flex flex-col gap-4 items-start">
          <h1 className="text-xl font-bold">Khung điều hướng</h1>
          <button onClick={Intro} style={{ cursor: "pointer" }}>
            Giới thiệu Bảo Tàng
          </button>
          <button onClick={Rule} style={{ cursor: "pointer" }}>
            Nội quy tham quan Bảo Tàng
          </button>
          <button onClick={Price} style={{ cursor: "pointer" }}>
            Bảng giá tham quan Bảo Tàng
          </button>
        </div>
      </div>
      <h1 className="text-3xl font-normal roboto my-4">
        Nội quy tham quan Bảo Tàng
      </h1>
      <div className="grid grid-cols-3 gap-10">
        {/*Cột trái*/}
        <div className="col-span-2 flex flex-col gap-5">
          <ol className="flex flex-col gap-5 roboto text-justify list-inside list-decimal">
            <li>
              Trang phục lịch sự, cư xử đúng mực khi vào tham quan Bảo tàng.
            </li>
            <li>Để xe đúng nơi quy định; giữ gìn trật tự, vệ sinh.</li>
            <li>
              Xếp hàng khi mua vé, dán logo lên áo và xuất trình vé cho nhân
              viên kiểm soát trước khi vào tham quan.
            </li>
            <li>
              Gửi lại hành lý cồng kềnh (nếu có) tại phòng trực và tự bảo quản
              tiền, tư trang.
            </li>
            <li>
              Tuân thủ sự hướng dẫn của nhân viên và các bảng hướng dẫn trong
              quá trình tham quan.
            </li>
            <li>
              Không mang theo vũ khí, chất độc, chất cấm, chất dễ cháy/nổ vào
              Bảo tàng.
            </li>
            <li>
              Không hút thuốc trong khuôn viên nhà trưng bày; không viết hoặc vẽ
              lên hiện vật.
            </li>
            <li>
              Mọi hoạt động ghi âm, ghi hình có chủ đề hoặc tổ chức các hoạt
              động khác phải được sự cho phép của Bảo tàng.
            </li>
            <li>
              Liên hệ nhân viên để được hỗ trợ khi có nhu cầu đăng ký hướng dẫn
              tham quan, có thắc mắc cần được giải đáp hoặc có nhu cầu khác.
            </li>
            <li>
              Chịu trách nhiệm bồi thường nếu gây ra bất cứ tổn thất nào cho Bảo
              tàng.
            </li>
          </ol>
        </div>
        {/*Cột phải*/}
        <div></div>
      </div>
      <h1 className="text-3xl font-normal roboto my-4">
        Bảng giá tham quan Bảo Tàng
      </h1>
      <div className="grid grid-cols-3 gap-10">
        {/*Cột trái*/}
        <div className="col-span-2 flex flex-col gap-5">
          <ol className="upperRoman list-inside roboto">
            <li>GIÁ VÉ: 40.000 ĐỒNG/NGƯỜI/LƯỢT</li>
            <li>
              CHẾ ĐỘ MIỄN, GIẢM:
              <ol className="list-inside list-decimal indent-8">
                <li>
                  Miễn phí tham quan đối với các trường hợp sau:
                  <ol className="list-inside list-disc indent-8">
                    <li>Trẻ em dưới 6 tuổi;</li>
                    <li>
                      Người khuyết tật đặc biệt nặng quy định tại Khoản 1 Điều
                      11 Nghị định số 28/2012/NĐ-CP ngày 10/4/2012 của Chính
                      phủ;
                    </li>
                    <li>
                      Hộ nghèo: quy định tại Quyết định số 59/2015/QĐ-TTg ngày
                      19/11/2015 của Thủ tướng Chính phủ.
                    </li>
                  </ol>
                </li>
                <li>
                  Giảm 50% phí tham quan đối với các trường hợp sau:
                  <ol className="list-inside list-disc indent-8">
                    <li>Trẻ em từ 6 tuổi đến dưới 16 tuổi.</li>
                    <li>
                      Sinh viên, học sinh đang học tại các trường thuộc hệ thống
                      giáo dục quốc dân Việt Nam;
                    </li>
                    <li>
                      Người cao tuổi: là công dân Việt Nam từ đủ 60 tuổi trở
                      lên, quy định tại Điều 2 - Luật Người cao tuổi;
                    </li>
                    <li>
                      Người khuyết tật nặng: quy định tại Khoản 2 Điều 11 Nghị
                      định số 28/2012/NĐ-CP ngày 10/4/2012 của Chính phủ;
                    </li>
                    <li>
                      Các đối tượng được hưởng chính sách ưu đãi hưởng thụ văn
                      hóa theo Điều 2 QĐ170/2003/QĐ-TTg ngày 14/8/2003 của Thủ
                      tướng Chính phủ
                    </li>
                  </ol>
                </li>
              </ol>
            </li>
          </ol>
        </div>
        {/*Cột phải*/}
        <div></div>
      </div>
    </div>
  );
}

export default AboutMuseum;
