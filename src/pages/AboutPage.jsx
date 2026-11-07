import { Link } from "react-router-dom";
import { usePageMeta } from "../hooks/usePageMeta.js";

const AboutPage = () => {
  usePageMeta("Câu chuyện từ những bữa ăn ngon");
  return (
    <>
      <section className="story-hero">
        <div className="story-copy" data-enter>
          <span className="badge">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 21S3 15.8 3 9.5a4.5 4.5 0 0 1 9-1 4.5 4.5 0 0 1 9 1C21 15.8 12 21 12 21Z"></path>
            </svg>
            {"Tân Việt Sin Foods · Từ năm 2002"}
          </span>
          <h1>
            {"Từ bữa ăn ngon,"}
            <br />
            {"đến những"}
            <br />
            <span className="display-accent">{"gắn kết."}</span>
          </h1>
          <p>
            {
              "Chúng tôi tin rằng một món ăn ngon không chỉ làm đầy chiếc đĩa. Đó còn là lời mời mọi người ngồi lại, sẻ chia và gần nhau hơn."
            }
          </p>
          <Link className="pill pill--green" to="/products">
            {"Khám phá vị ngon TVS"}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M4 12h16m-6-6 6 6-6 6"></path>
            </svg>
          </Link>
        </div>
        <div className="story-visual" data-enter>
          <img
            className="story-image"
            src="/assets/images/about/family-spring-roll-meal.jpg"
            alt="Món chả giò cho bữa ăn quây quần"
            width="600"
            height="650"
            fetchPriority="high"
          />
          <img
            className="story-small image-drift"
            src="/assets/images/products/fresh-shrimp-har-gow/fresh-shrimp-har-gow-dish.png"
            alt="Há cảo tôm tươi Tân Việt Sin"
            width="260"
            height="260"
          />
          <div className="handnote" aria-hidden="true">
            {"Một chút ngon,"}
            <br />
            {"thật nhiều thương."}
          </div>
        </div>
      </section>
      <section className="story-statement" data-reveal>
        <h2>
          {"Tiện lợi cho người nấu."}
          <br />
          <span className="display-accent">
            {"Trọn vẹn cho người thưởng thức."}
          </span>
        </h2>
        <p>
          {
            "Tân Việt Sin phát triển các sản phẩm thực phẩm chế biến cho bữa ăn gia đình Việt. Từ viên và viên nhân, chả quết, dimsum đến xúc xích, mỗi nhóm món mang thêm một lựa chọn vào thực đơn hằng ngày."
          }
        </p>
      </section>
      <section className="values-layout section">
        <figure className="values-visual" data-reveal>
          <img
            src="/assets/images/about/beef-ball-noodle-bowl.jpg"
            alt="Món nước với bò viên và rau xanh"
            width="600"
            height="680"
            loading="lazy"
          />
        </figure>
        <div data-reveal>
          <span className="badge">{"Điều chúng tôi gìn giữ"}</span>
          <h2 className="values-title">
            {"Món ngon bắt đầu"}
            <br />
            {"từ sự chăm chút."}
          </h2>
          <div className="values-list">
            <div className="value-item">
              <h3>{"Hương vị thân quen."}</h3>
              <p>
                {
                  "Những lựa chọn gần gũi với khẩu vị gia đình Việt, để bữa cơm mỗi ngày luôn có điều đáng mong chờ."
                }
              </p>
            </div>
            <div className="value-item">
              <h3>{"Tiện lợi mỗi ngày."}</h3>
              <p>
                {
                  "Dành ít thời gian chuẩn bị hơn, dành thêm thời gian cho những người bạn yêu thương."
                }
              </p>
            </div>
            <div className="value-item">
              <h3>{"Nhiều cách đổi vị."}</h3>
              <p>
                {
                  "Một danh mục đa dạng để bạn linh hoạt kết hợp, từ bữa sáng gọn nhẹ đến buổi sum họp đông vui."
                }
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="quote-block section" data-reveal>
        <h2>
          {"Một món ngon nhỏ."}
          <br />
          {"Một niềm vui lớn."}
        </h2>
        <Link className="pill pill--green" to="/recipes">
          {"Vào bếp cùng TVS"}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M4 12h16m-6-6 6 6-6 6"></path>
          </svg>
        </Link>
      </section>
    </>
  );
};

export default AboutPage;
