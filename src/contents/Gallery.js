import img1 from "../assets/img1.jpg";
import img2 from "../assets/img2.jpg";
import img3 from "../assets/img3.jpg";
import img4 from "../assets/img4.jpg";
import img5 from "../assets/img5.jpg";
import img6 from "../assets/img6.jpg";
import img7 from "../assets/img7.jpg";
import img8 from "../assets/img8.jpg";
import img9 from "../assets/img9.jpg";
import img10 from "../assets/img10.jpg";
import img11 from "../assets/img11.jpg";
import img12 from "../assets/img12.jpg";
import img13 from "../assets/img13.jpg";
import img14 from "../assets/img14.jpg";
import img15 from "../assets/img15.jpg";

const Gallery = [
  {
    id: 1,
    title: "The Death of Saint Francis",
    artist: "Giotto di Bondone",
    description:
      "Bức tranh tường thể hiện cảnh Thánh Francis qua đời, đánh dấu bước tiến quan trọng trong hội họa Ý.",
    image: img1,
    type: "Exhibition",
    genre: "Religious Art",
    artist: {
      name: "Giotto di Bondone",
      lifespan: "1267-1337",
      nationality: "Italian",
    },
    country: "Italy",
    period: "14th Century",
    story:
      "Câu chuyện về bức tranh gắn liền với cuộc đời của Thánh Francis, một người đàn ông giàu lòng nhân ái và tình yêu thương. Bức tranh thể hiện sự tiếc thương của người dân đối với vị thánh của họ, đồng thời ca ngợi những phẩm chất cao đẹp của ông. Phong cách vẽ của Giotto đã mang đến một luồng gió mới cho hội họa Ý, với sự chân thực và biểu cảm hơn. Bức tranh này có ý nghĩa quan trọng trong việc chuyển đổi từ phong cách Byzantine sang phong cách Phục hưng, đánh dấu một bước ngoặt trong lịch sử nghệ thuật.",
  },
  {
    id: 2,
    title: "Arnolfini Portrait",
    artist: "Jan van Eyck",
    description:
      "Chân dung đôi nổi tiếng với nhiều chi tiết ẩn dụ, minh chứng cho kỹ thuật vẽ sơn dầu tuyệt vời của Van Eyck.",
    image: img2,
    type: "Lectures",
    genre: "Portrait",
    artist: {
      name: "Jan van Eyck",
      lifespan: "1390-1441",
      nationality: "Dutch",
    },
    country: "Netherlands",
    period: "15th Century",
    story:
      "Câu chuyện về bức tranh xoay quanh cuộc hôn nhân của Arnolfini và Costanza. Bức tranh được coi là một bằng chứng pháp lý về cuộc hôn nhân của họ, đồng thời thể hiện sự giàu có và địa vị xã hội của gia đình Arnolfini. Các chi tiết ẩn dụ trong tranh mang nhiều ý nghĩa sâu sắc, thể hiện những giá trị đạo đức và tôn giáo của thời kỳ đó. Kỹ thuật vẽ sơn dầu của Van Eyck đã tạo ra một bức tranh chân thực và sống động, với những chi tiết tinh xảo và màu sắc tươi tắn.",
  },
  {
    id: 3,
    title: "The Garden of Earthly Delights",
    artist: "Hieronymus Bosch",
    description:
      "Bức tranh ba tấm phức tạp và đầy bí ẩn, thể hiện những hình ảnh siêu thực và kỳ quái về tội lỗi và trừng phạt.",
    image: img3,
    type: "Gallery Talks",
    genre: "Religious Art/Fantasy",
    artist: {
      name: "Hieronymus Bosch",
      lifespan: "1450-1516",
      nationality: "Dutch",
    },
    country: "Netherlands",
    period: "15th-16th Century",
    story:
      "Câu chuyện về bức tranh vẫn còn là một điều bí ẩn, với nhiều cách diễn giải khác nhau. Tuy nhiên, hầu hết các nhà nghiên cứu đều cho rằng bức tranh thể hiện một cái nhìn bi quan về cuộc sống và số phận của con người. Những hình ảnh kỳ quái và siêu thực trong tranh có thể là biểu tượng cho những nỗi sợ hãi và ám ảnh của Bosch, cũng như những vấn đề xã hội và tôn giáo của thời kỳ đó. Bức tranh này có ảnh hưởng lớn đến các họa sĩ siêu thực sau này, và vẫn còn gây nhiều tranh cãi và tò mò cho đến ngày nay.",
  },
  {
    id: 4,
    title: "Self-Portrait at Old Age",
    artist: "Rembrandt van Rijn",
    description:
      "Bức chân dung tự họa cuối cùng của Rembrandt, thể hiện sự sâu sắc và trải nghiệm của cuộc đời họa sĩ.",
    image: img4,
    type: "Exhibition",
    genre: "Self Portrait",
    artist: {
      name: "Rembrandt van Rijn",
      lifespan: "1606-1669",
      nationality: "Dutch",
    },
    country: "Netherlands",
    period: "17th Century",
    story:
      "Câu chuyện về bức chân dung tự họa này gắn liền với những thăng trầm trong cuộc đời của Rembrandt. Ông đã trải qua nhiều khó khăn và mất mát, nhưng vẫn giữ vững niềm đam mê và tài năng của mình. Bức chân dung này thể hiện sự sâu sắc và trải nghiệm của một người nghệ sĩ đã đi qua nhiều thử thách. Nó cũng là một lời nhắn nhủ về giá trị của thời gian và sự trân trọng cuộc sống. Rembrandt đã để lại cho hậu thế một di sản nghệ thuật vô giá, và bức chân dung tự họa này là một trong những tác phẩm tiêu biểu nhất của ông.",
  },
  {
    id: 5,
    title: "View of Toledo",
    artist: "El Greco",
    description:
      "Bức tranh phong cảnh độc đáo với phong cách biểu cảm và màu sắc rực rỡ, thể hiện lòng yêu nước của El Greco.",
    image: img5,
    type: "Visitor trail",
    genre: "Landscape",
    artist: {
      name: "El Greco",
      lifespan: "1541-1614",
      nationality: "Greek-Spanish",
    },
    country: "Spain",
    period: "16th Century",
    story:
      "Câu chuyện về bức tranh bắt nguồn từ tình yêu của El Greco đối với thành phố Toledo, nơi ông đã sống và làm việc trong phần lớn cuộc đời mình. Bức tranh không chỉ là một bản vẽ chân thực về thành phố, mà còn là một biểu hiện của cảm xúc và tâm trạng của họa sĩ. Phong cách vẽ độc đáo của El Greco đã tạo ra một bức tranh phong cảnh đầy ấn tượng và khác biệt so với các tác phẩm khác cùng thời. Bức tranh này được coi là một trong những kiệt tác của hội họa Tây Ban Nha, và là một biểu tượng cho vẻ đẹp và sự độc đáo của thành phố Toledo.",
  },
  {
    id: 6,
    title: "Las Meninas",
    artist: "Diego Velázquez",
    description:
      "Kiệt tác của hội họa Tây Ban Nha, với bố cục phức tạp và đầy bí ẩn, thể hiện vai trò của nghệ thuật và nghệ sĩ.",
    image: img6,
    type: "Concerts",
    genre: "Court Painting",
    artist: {
      name: "Diego Velázquez",
      lifespan: "1599-1660",
      nationality: "Spanish",
    },
    country: "Spain",
    period: "17th Century",
    story:
      "Câu chuyện về bức tranh vẫn còn là một điều bí ẩn, với nhiều giả thuyết và tranh cãi khác nhau. Tuy nhiên, hầu hết các nhà nghiên cứu đều cho rằng bức tranh thể hiện một cái nhìn sâu sắc về cuộc sống trong cung điện hoàng gia Tây Ban Nha vào thế kỷ 17. Velázquez đã sử dụng tài năng của mình để tạo ra một bức tranh phức tạp và đầy ẩn ý, với nhiều lớp nghĩa và cách diễn giải khác nhau. Bức tranh này không chỉ là một bức chân dung tập thể, mà còn là một lời tự vấn về vai trò của nghệ thuật và nghệ sĩ trong xã hội. Nó cũng là một minh chứng cho tài năng và sự sáng tạo của Velázquez, người được coi là một trong những họa sĩ vĩ đại nhất của Tây Ban Nha.",
  },
  {
    id: 7,
    title: "The Swing",
    artist: "Jean-Honoré Fragonard",
    description:
      "Tác phẩm tiêu biểu của phong cách Rococo, thể hiện sự nhẹ nhàng, duyên dáng và tinh tế của giới quý tộc Pháp.",
    image: img7,
    type: "Exhibition",
    genre: "Rococo",
    artist: {
      name: "Jean-Honoré Fragonard",
      lifespan: "1732-1806",
      nationality: "French",
    },
    country: "France",
    period: "18th Century",
    story:
      "Câu chuyện về bức tranh xoay quanh một cô gái trẻ thuộc giới quý tộc Pháp. Cô đang chơi xích đu trong khu vườn của gia đình, với sự quan sát của một chàng trai trẻ. Bức tranh thể hiện sự nhẹ nhàng, duyên dáng, và tinh tế của giới quý tộc Pháp, cũng như những thú vui và trò tiêu khiển của họ. Phong cách vẽ của Fragonard mang đậm dấu ấn của phong cách Rococo, với những đường cong mềm mại, màu sắc tươi tắn, và ánh sáng lung linh. Bức tranh này được coi là một trong những tác phẩm tiêu biểu của phong cách Rococo, và là một minh chứng cho tài năng của Fragonard.",
  },
  {
    id: 8,
    title: "The Third of May 1808",
    artist: "Francisco Goya",
    description:
      "Bức tranh thể hiện sự tàn bạo của chiến tranh và lòng dũng cảm của người dân Tây Ban Nha, là lời tố cáo chiến tranh đanh thép.",
    image: img8,
    type: "Lectures",
    genre: "Historical Painting",
    artist: {
      name: "Francisco Goya",
      lifespan: "1746-1828",
      nationality: "Spanish",
    },
    country: "Spain",
    period: "19th Century",
    story:
      "Câu chuyện về bức tranh bắt nguồn từ sự kiện lịch sử có thật, đó là cuộc nổi dậy của người dân Madrid chống lại quân đội Pháp vào ngày 2 tháng 5 năm 1808. Goya đã chứng kiến những cảnh tượng tàn bạo của cuộc chiến tranh, và ông đã quyết định vẽ bức tranh này để tưởng nhớ các nạn nhân và lên án sự tàn bạo của chiến tranh. Bức tranh thể hiện sự căm phẫn của Goya đối với quân đội Pháp, cũng như lòng dũng cảm của người dân Tây Ban Nha. Phong cách vẽ của Goya mang đậm dấu ấn của chủ nghĩa lãng mạn, với những đường nét mạnh mẽ, màu sắc u ám, và ánh sáng tương phản. Bức tranh này được coi là một trong những tác phẩm chống chiến tranh vĩ đại nhất trong lịch sử nghệ thuật.",
  },
  {
    id: 9,
    title: "Rain Steam and Speed",
    artist: "J.M.W. Turner",
    description:
      "Bức tranh phong cảnh ấn tượng với ánh sáng và màu sắc tuyệt đẹp, thể hiện sự phát triển của khoa học và công nghệ.",
    image: img9,
    type: "Other Events",
    genre: "Landscape",
    artist: {
      name: "J.M.W. Turner",
      lifespan: "1775-1851",
      nationality: "British",
    },
    country: "United Kingdom",
    period: "19th Century",
    story:
      "Câu chuyện về bức tranh bắt nguồn từ sự kiện ra đời của đoàn tàu hỏa, một phương tiện giao thông mới mẻ và hiện đại vào thế kỷ 19. Turner đã rất ấn tượng với tốc độ và sức mạnh của đoàn tàu, và ông đã quyết định vẽ bức tranh này để thể hiện sự kỳ diệu của công nghệ. Bức tranh không chỉ là một bản vẽ chân thực về đoàn tàu, mà còn là một biểu tượng cho sự tiến bộ của xã hội. Phong cách vẽ của Turner mang đậm dấu ấn của chủ nghĩa lãng mạn, với những màu sắc tươi tắn, ánh sáng lung linh, và bút pháp phóng khoáng. Bức tranh này được coi là một trong những tác phẩm tiêu biểu của Turner, và là một minh chứng cho tài năng và sự sáng tạo của ông.",
  },
  {
    id: 10,
    title: "The Gleaners",
    artist: "Jean-François Millet",
    description:
      "Bức tranh thể hiện cuộc sống khó khăn của những người nông dân nghèo khổ, là lời kêu gọi sự chú ý đến các vấn đề xã hội.",
    image: img10,
    type: "Visitor trail",
    genre: "Realism",
    artist: {
      name: "Jean-François Millet",
      lifespan: "1814-1875",
      nationality: "French",
    },
    country: "France",
    period: "19th Century",
    story:
      "Câu chuyện về bức tranh bắt nguồn từ cuộc sống nghèo khó của những người nông dân Pháp vào thế kỷ 19. Millet đã chứng kiến những cảnh tượng vất vả và khó khăn của họ, và ông đã quyết định vẽ bức tranh này để thể hiện sự đồng cảm và chia sẻ. Bức tranh không chỉ là một bản vẽ chân thực về cuộc sống nông dân, mà còn là một lời kêu gọi sự công bằng và nhân đạo. Phong cách vẽ của Millet mang đậm dấu ấn của chủ nghĩa hiện thực, với những đường nét chân thực, màu sắc giản dị, và bố cục chặt chẽ. Bức tranh này được coi là một trong những tác phẩm tiêu biểu của Millet, và là một minh chứng cho tài năng và tấm lòng của ông.",
  },
  {
    id: 11,
    title: "A Sunday Afternoon on the Island of La Grande Jatte",
    artist: "Georges Seurat",
    description:
      "Bức tranh theo phong cách Pointillism độc đáo, thể hiện cuộc sống và xã hội của người dân Paris vào thế kỷ 19.",
    image: img11,
    type: "Gallery",
    genre: "Post-Impressionism",
    artist: {
      name: "Georges Seurat",
      lifespan: "1859-1891",
      nationality: "French",
    },
    country: "France",
    period: "19th Century",
    story:
      "Câu chuyện về bức tranh bắt nguồn từ cuộc sống thường nhật của người dân Paris vào cuối thế kỷ 19. Seurat đã quan sát và ghi chép lại những khoảnh khắc đời thường của họ, và ông đã quyết định vẽ bức tranh này để thể hiện sự đa dạng và phong phú của cuộc sống. Bức tranh không chỉ là một bản vẽ chân thực về cảnh vật và con người, mà còn là một biểu hiện của cảm xúc và tâm trạng của họa sĩ. Phong cách vẽ Pointillism của Seurat đã tạo ra một bức tranh độc đáo và ấn tượng, với những chấm màu nhỏ tạo nên hình ảnh sắc nét và sống động. Bức tranh này được coi là một trong những tác phẩm tiêu biểu của Seurat, và là một minh chứng cho tài năng và sự sáng tạo của ông.",
  },
  {
    id: 12,
    title: "The Bathers",
    artist: "Pierre-Auguste Renoir",
    description:
      "Bức tranh thể hiện vẻ đẹp khỏe mạnh và đầy sức sống của cơ thể phụ nữ, là biểu tượng cho vẻ đẹp và sức sống.",
    image: img12,
    type: "Workshops",
    genre: "Impressionism",
    artist: {
      name: "Pierre-Auguste Renoir",
      lifespan: "1841-1919",
      nationality: "French",
    },
    country: "France",
    period: "19th Century",
    story:
      "Câu chuyện về bức tranh bắt nguồn từ niềm đam mê của Renoir đối với vẻ đẹp của cơ thể phụ nữ. Ông đã vẽ rất nhiều bức tranh về chủ đề này, và bức tranh 'The Bathers' là một trong những tác phẩm tiêu biểu nhất của ông. Bức tranh không chỉ là một bản vẽ chân thực về những người phụ nữ, mà còn là một biểu hiện của cảm xúc và tâm trạng của họa sĩ. Phong cách vẽ của Renoir mang đậm dấu ấn của trường phái Ấn tượng, với những đường nét mềm mại, màu sắc tươi tắn, và ánh sáng lung linh. Bức tranh này được coi là một trong những tác phẩm nổi tiếng nhất của Renoir, và là một minh chứng cho tài năng và sự sáng tạo của ông.",
  },
  {
    id: 13,
    title: "Mont Sainte-Victoire",
    artist: "Paul Cézanne",
    description:
      "Bức tranh phong cảnh nổi tiếng với phong cách trừu tượng và cấu trúc hình học, thể hiện sự quan tâm của Cézanne đối với hình dạng và màu sắc.",
    image: img13,
    type: "Exhibition",
    genre: "Post-Impressionism",
    artist: {
      name: "Paul Cézanne",
      lifespan: "1839-1906",
      nationality: "French",
    },
    country: "France",
    period: "19th-20th Century",
    story:
      "Câu chuyện về bức tranh bắt nguồn từ tình yêu của Cézanne đối với núi Sainte-Victoire, ngọn núi đã trở thành nguồn cảm hứng bất tận cho ông trong suốt sự nghiệp của mình. Cézanne đã vẽ rất nhiều bức tranh về ngọn núi này, và bức tranh 'Mont Sainte-Victoire' là một trong những tác phẩm tiêu biểu nhất của ông. Bức tranh không chỉ là một bản vẽ chân thực về ngọn núi, mà còn là một biểu hiện của cảm xúc và tâm trạng của họa sĩ. Phong cách vẽ của Cézanne mang đậm dấu ấn của trường phái Hậu ấn tượng, với những hình dạng trừu tượng, màu sắc tươi tắn, và bố cục chặt chẽ. Bức tranh này được coi là một trong những tác phẩm quan trọng nhất của Cézanne, và là một minh chứng cho tài năng và sự sáng tạo của ông.",
  },
  {
    id: 14,
    title: "Sleeping Gypsy",
    artist: "Henri Rousseau",
    description:
      "Bức tranh với phong cách ngây thơ và đầy màu sắc, thể hiện sự quan tâm của Rousseau đối với những điều bình dị và giản dị.",
    image: img14,
    type: "Gallery Talks",
    genre: "Post-Impressionism/Naive Art",
    artist: {
      name: "Henri Rousseau",
      lifespan: "1844-1910",
      nationality: "French",
    },
    country: "France",
    period: "19th-20th Century",
    story:
      "Câu chuyện về bức tranh bắt nguồn từ cuộc sống của Rousseau, một người đàn ông bình dị và giản dị, với niềm đam mê lớn đối với nghệ thuật. Ông đã tự học vẽ và vẽ theo phong cách riêng của mình, không theo bất kỳ trường phái hay quy tắc nào. Bức tranh 'Sleeping Gypsy' là một trong những tác phẩm tiêu biểu của ông, thể hiện sự quan tâm của ông đối với những người du mục và cuộc sống tự do của họ. Phong cách vẽ của Rousseau mang đậm dấu ấn của sự ngây thơ và chân thành, với những hình ảnh đơn giản, màu sắc tươi tắn, và bố cục hài hòa. Bức tranh này được coi là một trong những tác phẩm nổi tiếng nhất của Rousseau, và là một minh chứng cho tài năng và sự độc đáo của ông.",
  },
  {
    id: 15,
    title: "Composition VII",
    artist: "Wassily Kandinsky",
    description:
      "Bức tranh trừu tượng thể hiện sự tự do và biểu cảm của màu sắc và hình dạng, là tuyên ngôn về sự tự do và sáng tạo.",
    image: img15,
    type: "Concerts",
    genre: "Abstract Art",
    artist: {
      name: "Wassily Kandinsky",
      lifespan: "1866-1944",
      nationality: "Russian",
    },
    country: "Russia",
    period: "20th Century",
    story:
      "Câu chuyện về bức tranh bắt nguồn từ sự quan tâm của Kandinsky đối với âm nhạc và tâm linh. Ông tin rằng nghệ thuật có thể biểu đạt những cảm xúc và ý tưởng sâu sắc, không cần phải dựa trên những hình ảnh cụ thể. Bức tranh 'Composition VII' là một trong những tác phẩm tiêu biểu của ông, thể hiện sự tự do và biểu cảm của màu sắc và hình dạng. Phong cách vẽ của Kandinsky mang đậm dấu ấn của sự trừu tượng và biểu cảm, với những đường nét mạnh mẽ, màu sắc tươi tắn, và bố cục phi tuyến tính. Bức tranh này được coi là một trong những tác phẩm quan trọng nhất của Kandinsky, và là một minh chứng cho tài năng và sự новаторство của ông.",
  },
];
export default Gallery;
