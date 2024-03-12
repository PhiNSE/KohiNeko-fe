import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getCoffeeShopBookingHistory,
  getTotalCoffeeShopBookingHistory,
} from "../../services/apiBooking";
import { Card } from "flowbite-react";
import Button from "../../components/Button";
import { Grid } from "@mui/material";
import { Typography } from "@mui/material";
import Loader from "../../components/Loader";
import Status from "../../components/Status";
import { FaSearch } from "react-icons/fa";
import { useDebounce } from "@uidotdev/usehooks";
import { TfiReload } from "react-icons/tfi";

const BookingPage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const coffeeShopId = user.coffeeShopId;

  const endOfPageRef = useRef();
  //State
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(4);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [bookingStatus, setBookingStatus] = useState("in progress");
  const [sort, setSort] = useState("desc");
  const [key, setKey] = useState("");
  const {
    data: booking,
    isLoading,
    refetch: refetchBooking,
  } = useQuery({
    queryKey: ["boooking", page, limit, bookingStatus, sort, debouncedSearch],
    queryFn: () =>
      getCoffeeShopBookingHistory(
        page + 1,
        limit,
        bookingStatus,
        sort,
        debouncedSearch
      ),
    keepPreviousData: true,
  });

  useEffect(() => {
    endOfPageRef.current?.scrollIntoView({ behavior: "auto" });
  }, [booking]);

  const { data: bookingCount, refetch: refetchBookingCount } = useQuery({
    queryKey: ["boookingCount", bookingStatus, debouncedSearch],
    queryFn: () =>
      getTotalCoffeeShopBookingHistory(bookingStatus, sort, debouncedSearch),
    keepPreviousData: true,
  });
  console.log(bookingCount);

  // if (isLoading) {
  //   return <Loader />;
  // }
  useEffect(() => {
    // Calculate the time remaining until the next half hour
    const now = new Date();
    const delay = 30 - (now.getMinutes() % 30);

    // Set a timeout to start the interval at the next half hour
    const timeoutId = setTimeout(() => {
      // Refetch the data immediately
      refetchBooking();
      refetchBookingCount();

      // Then start an interval to refetch the data every half hour
      const intervalId = setInterval(() => {
        refetchBooking();
        refetchBookingCount();
      }, 30 * 60 * 1000); // 30 minutes in milliseconds

      // Clear the interval when the component unmounts
      return () => clearInterval(intervalId);
    }, delay * 60 * 1000); // delay in milliseconds

    // Clear the timeout when the component unmounts
    return () => clearTimeout(timeoutId);
  }, [refetchBooking, refetchBookingCount]);
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // console.log(booking.data);
  return (
    <>
      <div className=" w-full h-full border-2 rounded-lg  ">
        <div className="flex justify-between align-middle items-center sticky top-0 mb-5 bg-slate-200">
          <div className="ml-1 my-3 xl:w-96 ">
            <div className="relative  flex items-center align-middle w-full flex-wrap gap-x-4">
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="relative m-0 block flex-auto rounded placeholder-gray-600 ring-orange-500 ring-2 bg-transparent bg-clip-padding px-3 py-[0.25rem] font-semibold leading-[1.6] text-xl outline-none transition duration-200 ease-in-out focus:rounded focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] dark:border-neutral-600 dark:text-neutral-600 dark:placeholder-gray-400 dark:focus:border-primary "
                placeholder="Search Booking Id"
                aria-label="Search"
                aria-describedby="button-addon2"
              />
              <FaSearch size={35} />
            </div>
          </div>
          {/* <div className="mr-52">
            <TfiReload size={35} />
          </div> */}
          <div>
            <select
              className="mt-3 text-lg py-2 px-3 border border-gray-300 rounded-sm bg-gray-100 font-medium shadow-sm"
              value={bookingStatus}
              onChange={(e) => setBookingStatus(e.target.value)}
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="in progress">In progress</option>
              <option value="finished">Finished</option>
              <option value="refund">Refund</option>
              {/* // Add more options as needed */}
            </select>
          </div>
        </div>
        {booking && booking.data.length > 0 ? (
          <div className="grid grid-cols-2 gap-16 px-2 py-5">
            {booking.data.map((booking) => (
              <Card
                className="max-w-screen-xl bg-white dark:bg-white border-orange-300 border-2"
                key={booking._id}
              >
                <Typography variant="h5" fontWeight="bold">
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span>Booking ID:</span>
                    <span className="text-yellow-600">
                      {booking._id.slice(-4)}
                    </span>
                  </div>
                </Typography>
                <div className="flex justify-between text-2xl">
                  <Typography variant="h6" fontWeight="bold">
                    Status:
                  </Typography>
                  <Status name={booking.status} />
                </div>
                <Typography variant="h6" fontWeight="bold">
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span>Customer Name:</span>
                    <span className="font-semibold">
                      {booking.customerId.lastName}{" "}
                      {booking.customerId.firstName}
                    </span>
                  </div>
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span>Customer Phone Number:</span>
                    <span className="font-semibold">
                      {booking.customerId.phoneNumber}
                    </span>
                  </div>
                </Typography>
                <Button
                  className="text-blue-400 border-orange-500 border-2"
                  to={`${booking._id}`}
                >
                  <span className="text-2xl">View Detail</span>
                </Button>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex justify-center pb-4">
            <Button
              levelType="secondary"
              className="text-blue-400 border-orange-500 border-2"
              onClick={() => refetchBooking() && refetchBookingCount()}
            >
              <span className="text-2xl">Reload data</span>
            </Button>
          </div>
        )}
        {booking?.data?.length !== bookingCount?.data && (
          <div className="flex justify-center mt-5 ">
            <Button
              levelType="secondary"
              className="text-blue-400 border-orange-500 border-2"
              onClick={() => setLimit(limit + 4)}
            >
              <span className="text-2xl">
                Load More [ {booking?.data?.length} of {bookingCount?.data} ]
              </span>
            </Button>
            <div ref={endOfPageRef} />
          </div>
        )}
      </div>
    </>
  );
};
export default BookingPage;
