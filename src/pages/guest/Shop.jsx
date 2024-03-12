import PageTransition from "../PageTransition";
import { useShops } from "../../hooks/useShops";
import Card from "../../components/Card";
import AboutDetails from "../../components/AboutDetails";
import Loader from "../../components/Loader";
import { useNavigate } from "react-router-dom";
import PaginationAPI from "../../components/PaginationAPI";
import { useEffect, useState } from "react";
import emptyImg from "../../assets/EmptyImg.jpg";
import { FaSearch } from "react-icons/fa";
import { useDebounce } from "@uidotdev/usehooks";
import { debounce } from "@mui/material";
import { MdError } from "react-icons/md";

const Shop = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const { isLoading, shops, total } = useShops(
    currentPage,
    itemsPerPage,
    debouncedSearch
  );
  console.log(shops);
  //* When the user click on the "Ourshops link the carousel reset to 1"
  useEffect(() => {
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  if (isLoading) return <Loader />;

  //* Check Login
  const user = JSON.parse(localStorage.getItem("user")) || null;

  const handleBookNow = (shopId) => {
    if (!user) {
      localStorage.setItem("redirectAfterLogin", `/coffeeShops/${shopId}`);
      navigate("/login", { replace: true });
    } else {
      navigate(`/coffeeShops/${shopId}/booking`);
    }
  };
  return (
    <PageTransition>
      <AboutDetails
        backgroundImg="bg-shops"
        header="Our Coffee Shops"
        objectPosition="center 40%"
      >
        <div className="mt-10 px-[12vw]">
          <div className="mb-3 xl:w-96 flex justify-start">
            <div className="relative mb-4 flex items-center align-middle w-full flex-wrap gap-x-4 ring-orange-500 ring-2 text-secondary">
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="relative m-0 block flex-auto rounded bg-transparent bg-clip-padding px-3 py-[0.25rem] font-semibold leading-[1.6] text-xl outline-none transition duration-200 ease-in-out focus:rounded focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)]"
                placeholder="Search coffee shops"
                aria-label="Search"
                aria-describedby="button-addon2"
              />
              <FaSearch size="2rem" className="mr-3" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3" key={Math.random()}>
            {shops && shops.length > 0 ? (
              shops.map((shop) => (
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
                  onClick={() => handleBookNow(shop._id)}
                />
              ))
            ) : (
              <div className="flex items-center">
                <MdError size="5rem" className="mx-auto text-red-700" />
                <h1 className="text-bold text-4xl text-center mt-10 mb-10 text-red-700 te">
                  No shops found
                </h1>
              </div>
            )}
          </div>
          {total >= itemsPerPage && (
            <PaginationAPI
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              total={total}
            />
          )}
        </div>
      </AboutDetails>
    </PageTransition>
  );
};

export default Shop;
