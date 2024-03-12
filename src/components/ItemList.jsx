import FormatNumber from "../utils/NumberFormatter";
import LazyLoadImage from "./LazyLoadImage";
import { Typography } from "@mui/material";

const ItemList = ({ img, itemName, itemPrice, itemDescription }) => {
  return (
    <div className="border-2 rounded-lg p-2">
      <div className="w-full h-[20vh]">
        <LazyLoadImage
          src={img}
          className="rounded-full w-full h-full object-cover"
        ></LazyLoadImage>
      </div>
      <div className="flex flex-col items-start justify-between gap-1 p-2">
        <h1 className="text-primary text-2xl font-bold">{itemName}</h1>
        <Typography className="text-sm text-gray-600">
          <span className="font-bold">Price: </span>
          <span className="italic">{FormatNumber(itemPrice)} VND</span>
        </Typography>
        <Typography className="text-justify text-sm text-gray-700">
          {itemDescription}
        </Typography>
      </div>
    </div>
  );
};

export default ItemList;
