import { useQuery } from "@tanstack/react-query";
import CustomDataTable from "../../components/CustomDataTable";
import { adminGetCat } from "../../services/apiCat";
import Loader from "../../components/Loader";
import { useState } from "react";

const eliminateUnnecessaryKeys = (data) => {
  return data.map((item) => {
    const {
      coffeeShopId,
      isDeleted,
      updatedAt,
      createdAt,
      areaCats,
      __v,
      ...rest
    } = item;
    const images = rest.images.map((image) => {
      return { _id: image._id, url: image.url, name: image.name };
    });
    const area = areaCats[0]?.areaId.name || "No area assigned yet";
    return { images, area, ...rest };
  });
};

const extractKeys = (data) => {
  const headTable = [];
  if (Array.isArray(data) && data.length > 0) {
    const firstItem = data[0];
    for (const key in firstItem) {
      switch (key) {
        case "_id":
          continue;
        case "images":
          headTable.push("Image");
          break;
        case "createAt":
          headTable.push("Create At");
          break;
        case "dateOfBirth":
          headTable.push("Date Of Birth");
          break;
        case "area":
          headTable.push("Area");
          break;
        case "breed":
          headTable.push("Breed");
          break;
        case "gender":
          headTable.push("Gender");
          break;
        case "description":
          headTable.push("Description");
          break;
        case "favorite":
          headTable.push("Favorite");
          break;
        case "status":
          headTable.push("Status");
          break;
        case "name":
          headTable.push("Name");
          break;
        default:
          break;
      }
    }
  }
  return headTable;
};

const CatList = () => {
  const {
    isLoading,
    error,
    data: cats,
    refetch,
  } = useQuery({
    queryKey: ["cats"],
    queryFn: () => adminGetCat(),
  });
  const [selectedCat, setSelectedCat] = useState({});
  console.log(cats);
  if (isLoading) return <Loader />;
  if (error) return <div>Error: {error.message}</div>;
  const headData = eliminateUnnecessaryKeys(cats.data || []);
  const tableData = extractKeys(headData);

  return (
    <div>
      <CustomDataTable
        headData={headData}
        tableData={tableData}
        selectedData={selectedCat}
        setSelectedData={setSelectedCat}
      />
    </div>
  );
};

export default CatList;
