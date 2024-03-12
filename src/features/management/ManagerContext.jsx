import { useQuery } from "@tanstack/react-query";
import { createContext, useEffect, useState } from "react";
import { getShopByUserId } from "../../services/apiShops";
import Loader from "../../components/Loader";
import { set } from "react-hook-form";

const ManagerContext = createContext();

const ManagerProvider = ({ children }) => {
  // const [coffeeShopId, setCoffeeShopId] = useState("65d373fde8facd7ed62dcbbd");
  const {
    isLoading,
    data: coffeeShop,
    error,
  } = useQuery({
    queryKey: ["shop"],
    queryFn: getShopByUserId,
  });
  const [coffeeShopId, setCoffeeShopId] = useState();

  useEffect(() => {
    setCoffeeShopId(coffeeShop?.data ? coffeeShop?.data._id : "");
  }, [coffeeShop]);
  
  if (isLoading) return <Loader />;
  if (error) return <p>error</p>;
  return (
    <ManagerContext.Provider value={{ coffeeShopId, setCoffeeShopId }}>
      {children}
    </ManagerContext.Provider>
  );
};
export { ManagerProvider, ManagerContext };
