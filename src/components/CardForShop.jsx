import { Link } from "react-router-dom";
import Button from "./Button";
import LazyLoadImage from "./LazyLoadImage";

const CardForShop = ({
  image,
  header,
  content,
  to,
  shopId,
  onClick,
  role = "user",
  children,
}) => {
  let contentWithoutH1 = content.replace(/<h1.*?>.*?<\/h1>/gi, "");

  let truncatedContent = `<div class="text-2xl">${
    contentWithoutH1.split(" ").reduce((prev, curr) => {
      return prev.length + curr.length + 1 <= 90 ? prev + " " + curr : prev;
    }, "") + (contentWithoutH1.length > 105 ? "..." : "")
  }</div>`;

  return (
    <div className="max-w-sm bg-white border border-gray-200 ring-2 ring-gray-200 p-3 rounded-lg mb-10 flex flex-col md:flex-wrap justify-between">
      <div className="mb-3 md:h-[30vh] xl:h-[40vh] overflow-hidden">
        {/* <LazyLoadImage
          src={image}
          classNameProps='h-full w-full object-cover'
        /> */}
        <img src={image} className="h-full w-full object-cover" />
      </div>
      <div className="h-[20vh] overflow-auto text-xl">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">
          {header}
        </h5>
        <div dangerouslySetInnerHTML={{ __html: truncatedContent }}></div>
      </div>

      {/* User role */}
      {role === "user" && (
        <div className="grid grid-cols-2 gap-5">
          <Button type="small" to={to} levelType="primary">
            Read More
          </Button>
          <Button
            type="medium"
            levelType="secondary"
            to={`/coffeeShops/${shopId}/booking`}
            onClick={onClick}
          >
            Book now
          </Button>
        </div>
      )}

      {/* Admin role */}
      {role === "admin" && (
        <Button type="large" levelType="primary">
          Approve
        </Button>
      )}

      {/* About */}
      {role === "about" && (
        <Button type="large" to={to} levelType="primary">
          Read More
        </Button>
      )}
    </div>
  );
};

export default CardForShop;
