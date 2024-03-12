import "react-calendar/dist/Calendar.css";
import { useParams } from "react-router-dom";
import Loader from "../../components/Loader";
import { useShop } from "../../hooks/useShop";
import {
  FaLocationDot,
  FaSquareParking,
  FaWifi,
  FaCreditCard,
  FaCat,
  FaBowlFood,
} from "react-icons/fa6";
import { MdTableBar } from "react-icons/md";
import Button from "../../components/Button";
import { useCatByShop } from "../../hooks/useCatByShop";
import Empty from "../../components/Empty";
import CarouselImgae from "../../components/CarouselImgae";
import Map from "../../components/Map";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useCallback, useState } from "react";
import CatList from "../../components/CatList";
import PaginationCustom from "../../components/PaginationCustom";
import { useItemByShop } from "../../hooks/useItemByShop";
import ItemList from "../../components/ItemList";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import emptyImg from "../../assets/EmptyImg.jpg";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import Card from "../../components/Card";
import { useAllShop } from "../../hooks/useAllShop";
import { useEffect } from "react";
const ShopDetails = () => {
  const navigate = useNavigate();
  const { shopId } = useParams();

  //* Tab
  const [tabValue, setTabValue] = useState(0);
  //* Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const handleTabChange = useCallback((event, newValue) => {
    setTabValue(newValue);
    setCurrentPage(0);
  }, []);
  const handlePageChange = useCallback((value) => {
    setCurrentPage(value);
  }, []);

  //* Get Shop Detail
  const { isLoading: isShopLoading, shop, error: shopError } = useShop(shopId);

  //* Get Cat By Shopid
  const {
    isLoading: isCatLoading,
    cat,
    error: catError,
  } = useCatByShop(shopId);

  //* Get Item By Shopid
  const {
    isLoading: isItemLoading,
    item,
    error: itemError,
  } = useItemByShop(shopId);

  //filter item by status after fetch
  // const items = item.data.items.filter((item) => item.status === "active");
  useEffect(() => {
    console.log(item);
    if (item) {
      const items = item.data.items.filter((item) => item.status === "active");
      item.data.items = items;
    }
  }, [item]);

  //* Get all shop
  const { allShop } = useAllShop();
  const otherShops = allShop?.data?.filter((shop) => shop._id !== shopId);

  if (isCatLoading || isShopLoading || isItemLoading) {
    return <Loader />;
  }

  const shopGroups = [];
  for (let i = 0; i < otherShops?.length; i += 3) {
    shopGroups.push(otherShops.slice(i, i + 3));
  }

  if (catError || shopError || itemError) {
    return <div>Something went wrong</div>;
  }

  //* Shop Object
  const {
    address,
    images: shopImages,
    openTime,
    shopName,
    status,
    phone,
    email,
    description: shopDescription,
  } = shop;
  const { lat, lng } = address.coordinates;

  //* Address
  const addressFull = `${address.houseNumber}, ${address.street}, ${address.district}, ${address.city}`;

  //* Check Login
  const user = JSON.parse(localStorage.getItem("user")) || null;
  const handleBookNow = () => {
    if (!user) {
      localStorage.setItem("redirectAfterLogin", `/coffeeShops/${shopId}`);
      navigate("/login", { replace: true });
    } else {
      navigate(`/coffeeShops/${shopId}/booking`);
    }
  };

  return (
    <>
      <div className="grid grid-cols-[1fr_1fr]  px-[5rem] gap-2 bg-orange-50 pt-3 pb-10">
        {/* Section 1 */}
        <div className="flex flex-col">
          {/* Images + Shop */}
          <div className="bg-white px-5 flex flex-col gap-5">
            {/* Slide */}
            {shopImages.length === 0 ? (
              <Splide
                options={{
                  type: "loop",
                  gap: "3rem",
                  autoplay: shopImages.length > 0,
                  arrows: shopImages.length > 0,
                }}
                className="my-carousel"
              >
                <SplideSlide
                  className={`flex justify-center items-center w-96 h-96`}
                >
                  <img
                    src={emptyImg}
                    alt="No images available"
                    className="object-cover object-center w-full h-full"
                  />
                </SplideSlide>
              </Splide>
            ) : (
              <CarouselImgae images={shopImages} altText={`${shop.shopName}`} />
            )}

            {/* Shop Name */}
            <div>
              {/* Name */}
              <h1 className="text-4xl font-semibold">{shopName}</h1>
              {/* Address */}
              <span className="flex items-center gap-3">
                <FaLocationDot className="inline" />
                <span className="text-gray-400">{addressFull}</span>
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white px-5 flex flex-col mt-5 py-2 text-xl">
            {/* First Des */}
            <div className="mt-5">
              <Typography>
                <span className="font-bold"> Drinks: </span>
                {item.data.items.filter(
                  (item) => item.itemTypeId.itemTypeName === "drink"
                ).length > 0
                  ? [
                      ...new Set(
                        item.data.items
                          .filter(
                            (item) => item.itemTypeId.itemTypeName === "drink"
                          )
                          .map((item) => item.name)
                      ),
                    ]
                      .slice(0, 4)
                      .join(", ") +
                    (item.data.items &&
                    item.data.items[item.data.items.length - 1]
                      ? "..."
                      : "")
                  : "Not available"}
              </Typography>
              <Typography>
                {" "}
                <span className="font-bold"> Cats: </span>
                {cat.data.length > 0
                  ? [...new Set(cat.data.map((item) => item.breed))]
                      .slice(0, 4)
                      .join(", ") +
                    (cat.data && cat.data[cat.data.length - 1] ? "c..." : "")
                  : "Not available"}
              </Typography>
            </div>

            {/* Second desc */}
            <div>
              {/* {description} */}
              <Typography>
                <div
                  className="border-t-2 pt-2 mt-2"
                  dangerouslySetInnerHTML={{ __html: shopDescription }}
                ></div>
              </Typography>
            </div>
          </div>

          {/* Map */}
          <div className="AAbg-white px-5 flex flex-col mt-5 py-2 text-xl">
            <MapContainer center={[lat, lng]} zoom={16} scrollWheelZoom={false}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[lat, lng]}>
                <Popup>
                  A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>

        {/* Section 2 */}
        <div className="h-auto w-auto flex flex-col gap-3 ">
          {/* Booking section */}
          <div className=" bg-white flex flex-col gap-2 justify-center items-center">
            <h1 className="font-semibold text-center text-primary">
              {shopName}
            </h1>
            <Button
              type="medium"
              levelType="primary"
              to={`/coffeeShops/${shopId}/booking`}
              onClick={handleBookNow}
            >
              Book now
            </Button>

            <div className="text-center">
              Or call us at{" "}
              <span className="font-semibold text-primary ">{phone}</span>
              <p>To get your reservation and support</p>
            </div>
          </div>

          {/* Opening time */}
          <div className="flex gap-5 justify-center align-middle">
            {" "}
            <div className="bg-white w-[20rem] px-3 py-2">
              <h2 className="text-center text-3xl text-primary">
                Opening Times:{" "}
              </h2>
              <ul>
                {openTime.map((time, index) => (
                  <li
                    key={index}
                    className="grid grid-cols-2 items-center text-secondary"
                  >
                    <span className="font-bold">{time.day}:</span>
                    <span>
                      {" "}
                      {time.openHour} - {time.closeHour}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white w-[22rem] px-3 py-2">
              <h2 className="text-center text-3xl text-primary">
                Additional Information:{" "}
              </h2>
              <div className="grid grid-cols-2 text-secondary">
                <div>
                  <span className="flex items-center gap-2 text-xl">
                    <FaSquareParking />
                    <Typography>Parking Lot</Typography>
                  </span>

                  <span className="flex items-center gap-2 text-xl">
                    <FaWifi />
                    <Typography>Wifi Free</Typography>
                  </span>

                  <span className="flex items-center gap-2 text-xl">
                    <MdTableBar />
                    <Typography>Outdoor Table</Typography>
                  </span>
                </div>

                <div>
                  <span className="flex items-center gap-2 text-xl">
                    <FaCreditCard />
                    <Typography>Card Payment</Typography>
                  </span>

                  <span className="flex items-center gap-2 text-xl">
                    <FaCat />
                    <Typography>Cute cats</Typography>
                  </span>

                  <span className="flex items-center gap-2 text-xl">
                    <FaBowlFood />
                    <Typography>Food & drinks</Typography>
                  </span>
                </div>
              </div>
              <h3 className="text-center">
                For more details contact us at{" "}
                <span className="text-primary font-bold">{phone}</span>
              </h3>
            </div>
          </div>

          {/* Cat + Food */}
          <div className="w-auto bg-white h-auto">
            {/* Tab */}
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              textColor="secondary"
              indicatorColor="secondary"
            >
              <Tab label="Cats" />
              <Tab label="Drinks" />
              <Tab label="Foods" />
              <Tab label="Cat Foods" />
              <Tab label="Cat Toys" />
            </Tabs>
            <div className="mt-4">
              {/* Cat Tab */}
              {tabValue === 0 && (
                <>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-4 px-3">
                    {cat.data.length > 0 &&
                      cat.data
                        .slice(currentPage * 4, (currentPage + 1) * 4)
                        .map((cat, index) => (
                          <CatList
                            key={index}
                            shopId={shopId}
                            catId={cat._id}
                            img={cat.images[0]?.url}
                            catName={cat.name}
                            catGender={cat.gender}
                            catKind={cat.breed}
                          />
                        ))}
                  </div>

                  {cat.data.length === 0 && <Empty object="cats" />}

                  {/* Pagination */}
                  {cat.data.length > 4 && ( // Change this line
                    <PaginationCustom
                      count={Math.ceil(cat.data.length / 4)}
                      page={currentPage}
                      onPageChange={handlePageChange}
                    />
                  )}
                </>
              )}

              {/* Drinks Tab */}
              {tabValue === 1 && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    {item.data.items.filter(
                      (item) => item.itemTypeId.itemTypeName === "drink"
                    ).length > 0 &&
                      item.data.items
                        .filter(
                          (item) => item.itemTypeId.itemTypeName === "drink"
                        )
                        .slice(currentPage * 4, (currentPage + 1) * 4)
                        .map((item, index) => (
                          <ItemList
                            key={index}
                            img={item.images[0]?.url}
                            itemName={item.name}
                            itemPrice={item.price}
                            itemDescription={item.description}
                          />
                        ))}
                  </div>

                  {item.data.items.filter(
                    (item) => item.itemTypeId.itemTypeName === "drink"
                  ).length === 0 && <Empty object="drinks" />}

                  {/* Pagination */}
                  {item.data.items.filter(
                    (item) => item.itemTypeId.itemTypeName === "drink"
                  ).length > 4 && ( // Change this line
                    <PaginationCustom
                      count={Math.ceil(
                        item.data.items.filter(
                          (item) => item.itemTypeId.itemTypeName === "drink"
                        ).length / 4
                      )}
                      page={currentPage}
                      onPageChange={handlePageChange}
                    />
                  )}
                </>
              )}

              {/* Foods Tab */}
              {tabValue === 2 && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    {item.data.items.filter(
                      (item) => item.itemTypeId.itemTypeName === "foods"
                    ).length > 0 &&
                      item.data.items
                        .filter(
                          (item) => item.itemTypeId.itemTypeName === "foods"
                        )
                        .slice(currentPage * 4, (currentPage + 1) * 4)
                        .map((item, index) => (
                          <ItemList
                            key={index}
                            img={item.images[0]?.url}
                            itemName={item.name}
                            itemPrice={item.price}
                            itemDescription={item.description}
                          />
                        ))}
                  </div>
                  {item.data.items.filter(
                    (item) => item.itemTypeId.itemTypeName === "foods"
                  ).length === 0 && <Empty object="foods" />}

                  {/* Pagination */}
                  {item.data.items.filter(
                    (item) => item.itemTypeId.itemTypeName === "foods"
                  ).length > 4 && ( // Change this line
                    <PaginationCustom
                      count={Math.ceil(
                        item.data.items.filter(
                          (item) => item.itemTypeId.itemTypeName === "foods"
                        ).length / 4
                      )}
                      page={currentPage}
                      onPageChange={handlePageChange}
                    />
                  )}
                </>
              )}

              {/* Cat Food Tab */}
              {tabValue === 3 && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    {item.data.items.filter(
                      (item) => item.itemTypeId.itemTypeName === "cat foods"
                    ).length > 0 &&
                      item.data.items
                        .filter(
                          (item) => item.itemTypeId.itemTypeName === "cat foods"
                        )
                        .slice(currentPage * 4, (currentPage + 1) * 4)
                        .map((item, index) => (
                          <ItemList
                            key={index}
                            img={item.images[0]?.url}
                            itemName={item.name}
                            itemPrice={item.price}
                            itemDescription={item.description}
                          />
                        ))}
                  </div>
                  {item.data.items.filter(
                    (item) => item.itemTypeId.itemTypeName === "cat foods"
                  ).length === 0 && <Empty object="cat foods" />}

                  {/* Pagination */}
                  {item.data.items.filter(
                    (item) => item.itemTypeId.itemTypeName === "cat foods"
                  ).length > 4 && ( // Change this line
                    <PaginationCustom
                      count={Math.ceil(
                        item.data.items.filter(
                          (item) => item.itemTypeId.itemTypeName === "cat foods"
                        ).length / 4
                      )}
                      page={currentPage}
                      onPageChange={handlePageChange}
                    />
                  )}
                </>
              )}

              {/* Cat TOYS Tab */}
              {tabValue === 4 && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    {item.data.items.filter(
                      (item) => item.itemTypeId.itemTypeName === "toys"
                    ).length > 0 &&
                      item.data.items
                        .filter(
                          (item) => item.itemTypeId.itemTypeName === "toys"
                        )
                        .slice(currentPage * 4, (currentPage + 1) * 4)
                        .map((item, index) => (
                          <ItemList
                            key={index}
                            img={item.images[0]?.url}
                            itemName={item.name}
                            itemPrice={item.price}
                            itemDescription={item.description}
                          />
                        ))}
                  </div>
                  {item.data.items.filter(
                    (item) => item.itemTypeId.itemTypeName === "toys"
                  ).length === 0 && <Empty object="toys" />}

                  {/* Pagination */}
                  {item.data.items.filter(
                    (item) => item.itemTypeId.itemTypeName === "toys"
                  ).length > 4 && ( // Change this line
                    <PaginationCustom
                      count={Math.ceil(
                        item.data.items.filter(
                          (item) => item.itemTypeId.itemTypeName === "toys"
                        ).length / 4
                      )}
                      page={currentPage}
                      onPageChange={handlePageChange}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <h1 className="text-center text-4xl text-primary font-bold py-4 uppercase">
        Check out our other shops
      </h1>

      <div className="flex justify-center items-start flex-col w-[100vw] h-[90vh] mx-auto bg-orange-50">
        <Splide
          className="w-full my-carousel"
          options={{
            type: "loop",
            gap: "1rem",
            perPage: 1,
            autoplay: true,
            padding: "1rem",
          }}
        >
          {shopGroups.map((group, index) => (
            <SplideSlide key={index}>
              <div className="flex justify-center gap-9">
                {group.map((shop) => (
                  <Card
                    key={shop.id}
                    image={
                      shop.images.find((img) => img.name !== "placeholder")
                        ? shop.images.find((img) => img.name !== "placeholder")
                            .url
                        : emptyImg
                    }
                    header={shop.shopName}
                    content={shop.description}
                    to={`/coffeeShops/${shop._id}`}
                    shopId={shop._id}
                    className="mx-4 rounded-full" // This will add a 1em margin to the left and right of each card and make the card round
                  />
                ))}
              </div>
            </SplideSlide>
          ))}
        </Splide>
      </div>
    </>
  );
};

export default ShopDetails;
