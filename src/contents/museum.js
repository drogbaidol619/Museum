const exhibitions = [
  // Thứ 2
  /*
  {
    id: 1,
    title: "Triển lãm Thường Xuyên",
    days: 1,
    times: "9:30 - 20:00",
    description: "Nhận khách cuối 30 phút trước giờ đóng cửa.",
    image: "",
  },
  {
    id: 2,
    title: 'Triển lãm Ảnh "Khoảnh Khắc Cuộc Sống"',
    days: 1,
    times: "10:00 - 17:00",
    description: "Những khoảnh khắc đáng nhớ được ghi lại qua ống kính.",
    image: "",
  },
  {
    id: 3,
    title: 'Triển Lãm Điêu Khắc "Không Gian và Hình Khối"',
    days: 1,
    times: "11:00 - 19:00",
    description: "Những tác phẩm điêu khắc độc đáo và ấn tượng.",
    image: "",
  },
  */
  // Thứ 3
  {
    id: 4,
    title: "Triển lãm Hello Kitty: Khi Tôi Thay Đổi, Cô Ấy Cũng Vậy.",
    days: 2,
    times: "9:30 - 19:00",
    description: "Nhận khách cuối 30 phút trước giờ đóng cửa.",
    image: "",
  },
  {
    id: 5,
    title: "Buổi Biểu Diễn Âm Nhạc Cổ Điển",
    days: 2,
    times: "19:00 - 21:00",
    description: "Thưởng thức những giai điệu tuyệt vời.",
    image: "",
  },
  {
    id: 6,
    title: 'Triển lãm Ảnh "Khoảnh Khắc Cuộc Sống"',
    days: 2,
    times: "10:00 - 17:00",
    description: "Những khoảnh khắc đáng nhớ được ghi lại qua ống kính.",
    image: "",
  },

  // Thứ 4
  {
    id: 7,
    title: "Triển lãm Thường Xuyên",
    days: 3,
    times: "9:30 - 20:00",
    description: "Nhận khách cuối 30 phút trước giờ đóng cửa.",
    image: "",
  },
  {
    id: 8,
    title: "Triển Lãm Đặc Biệt Kỷ Niệm 1150 Năm Thành Lập Daikakuji",
    days: 3,
    times: "9:30 - 17:00",
    description:
      "Từ Biệt Thự Hoàng Gia Đến Chùa Phật Giáo. Nhận khách cuối 30 phút trước giờ đóng cửa.",
    image: "",
  },
  {
    id: 9,
    title: 'Triển lãm Ảnh "Khoảnh Khắc Cuộc Sống"',
    days: 3,
    times: "10:00 - 18:00",
    description: "Những khoảnh khắc đáng nhớ được ghi lại qua ống kính.",
    image: "",
  },

  // Thứ 5
  /*
  {
    id: 10,
    title: "Triển lãm Hello Kitty: Khi Tôi Thay Đổi, Cô Ấy Cũng Vậy.",
    days: 4,
    times: "9:30 - 19:00",
    description: "Nhận khách cuối 30 phút trước giờ đóng cửa.",
    image: "",
  },
  {
    id: 11,
    title: "Buổi Biểu Diễn Âm Nhạc Cổ Điển",
    days: 4,
    times: "19:00 - 21:00",
    description: "Thưởng thức những giai điệu tuyệt vời.",
    image: "",
  },
  {
    id: 12,
    title: 'Triển lãm Ảnh "Khoảnh Khắc Cuộc Sống"',
    days: 4,
    times: "10:00 - 17:00",
    description: "Những khoảnh khắc đáng nhớ được ghi lại qua ống kính.",
    image: "",
  },
  */
  // Thứ 6
  {
    id: 13,
    title: "Triển lãm Thường Xuyên",
    days: 5,
    times: "9:30 - 20:00",
    description: "Nhận khách cuối 30 phút trước giờ đóng cửa.",
    image: "",
  },
  {
    id: 14,
    title: "Triển Lãm Đặc Biệt Kỷ Niệm 1150 Năm Thành Lập Daikakuji",
    days: 5,
    times: "9:30 - 17:00",
    description:
      "Từ Biệt Thự Hoàng Gia Đến Chùa Phật Giáo. Nhận khách cuối 30 phút trước giờ đóng cửa.",
    image: "",
  },
  {
    id: 15,
    title: 'Triển lãm Ảnh "Khoảnh Khắc Cuộc Sống"',
    days: 5,
    times: "10:00 - 17:00",
    description: "Những khoảnh khắc đáng nhớ được ghi lại qua ống kính.",
    image: "",
  },

  // Thứ 7
  {
    id: 16,
    title: "Triển lãm Hello Kitty: Khi Tôi Thay Đổi, Cô Ấy Cũng Vậy.",
    days: 6,
    times: "9:30 - 19:00",
    description: "Nhận khách cuối 30 phút trước giờ đóng cửa.",
    image: "",
  },
  {
    id: 17,
    title: "Workshop Vẽ Tranh Dành Cho Trẻ Em",
    days: 6,
    times: "14:00 - 16:00",
    description: "Thỏa sức sáng tạo với màu sắc và cọ vẽ.",
    image: "",
  },
  {
    id: 18,
    title: "Giao Lưu Văn Hóa Việt - Nhật",
    days: 6,
    times: "15:00 - 18:00",
    description: "Tìm hiểu về văn hóa và nghệ thuật của hai quốc gia.",
    image: "",
  },
  /*
  {
    id: 19,
    title: "Triển lãm Thường Xuyên",
    days: 0,
    times: "9:30 - 20:00",
    description: "Nhận khách cuối 30 phút trước giờ đóng cửa.",
    image: "",
  },
  {
    id: 20,
    title: "Triển Lãm Đặc Biệt Kỷ Niệm 1150 Năm Thành Lập Daikakuji",
    days: 0,
    times: "9:30 - 17:00",
    description:
      "Từ Biệt Thự Hoàng Gia Đến Chùa Phật Giáo. Nhận khách cuối 30 phút trước giờ đóng cửa.",
    image: "",
  },
  {
    id: 21,
    title: "Chương Trình Khuyến Mãi Đặc Biệt",
    days: 0,
    times: "9:00 - 12:00",
    description: "Giảm giá vé vào cửa cho tất cả khách tham quan.",
    image: "",
  },
  */
];

export default exhibitions;
