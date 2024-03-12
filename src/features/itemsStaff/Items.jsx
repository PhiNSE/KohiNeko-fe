import {
  Box,
  Button,
  Grid,
  IconButton,
  InputBase,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { orange } from "@mui/material/colors";
import { useForm } from "react-hook-form";
import { HiOutlineSearch } from "react-icons/hi";
import RenderItems from "./RenderItems";
import Cart from "./Cart";
import { useQuery } from "@tanstack/react-query";
import { getItemsInShop } from "../../services/apiItems";
import Loader from "../../components/Loader";
import { useParams } from "react-router-dom";
import { SlArrowLeftCircle } from "react-icons/sl";
import { useNavigate } from "react-router-dom";

const theme = createTheme({
  palette: {
    primary: orange,
  },
});
const Items = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  const { coffeeShopId } = user;

  const { data: items, isLoading } = useQuery({
    queryKey: ["items", coffeeShopId._id],
    queryFn: () => getItemsInShop(coffeeShopId._id),
  });
  const [tab, setTab] = useState(1);
  const [selectedItems, setSelectedItems] = useState([]);
  const catToys = items?.data?.items.filter(
    (item) => item.itemTypeId.itemTypeName === "toys"
  );
  const drinks = items?.data?.items.filter(
    (item) => item.itemTypeId.itemTypeName === "drink"
  );
  const catFoods = items?.data?.items.filter(
    (item) => item.itemTypeId.itemTypeName === "cat foods"
  );
  const foods = items?.data?.items.filter(
    (item) => item.itemTypeId.itemTypeName === "foods"
  );
  const { register: register1, handleSubmit: handleSubmit1 } = useForm();
  useEffect(() => {
    const selectedItems = JSON.parse(localStorage.getItem("items"));
    if (selectedItems) {
      setSelectedItems(selectedItems);
    }
  }, []);

  if (isLoading) return <Loader />;

  const handleChooseItem = (item) => {
    const itemIndex = selectedItems.findIndex(
      (selected) => selected._id === item._id
    );
    if (itemIndex !== -1) {
      const updatedSelectedItems = [...selectedItems];
      updatedSelectedItems[itemIndex] = {
        ...updatedSelectedItems[itemIndex],
        quantity:
          Number(updatedSelectedItems[itemIndex].quantity) + item.quantity,
      };
      setSelectedItems(updatedSelectedItems);
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };
  const handleUpdateItem = (id, quantity) => {
    setSelectedItems((prevItems) =>
      prevItems.map((item) =>
        item._id === id ? { ...item, quantity: quantity } : item
      )
    );
  };

  return (
    <>
      <div className="absolute top-2 left-56">
        <SlArrowLeftCircle
          size={50}
          onClick={() => navigate(`/staff/booking/${bookingId}`)}
          style={{ cursor: "pointer", transition: "0.3s", color: "black" }}
          onMouseOver={(e) => (e.currentTarget.style.color = "white")}
          onMouseOut={(e) => (e.currentTarget.style.color = "black")}
        />
      </div>
      <ThemeProvider theme={theme}>
        {/* Tab group */}
        <div className="mx-4 flex flex-row justify-between">
          <Box>
            <Tabs
              value={tab}
              onChange={(e, newTab) => setTab(newTab)}
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab value={1} label="Drink" />
              <Tab value={2} label="Food" />
              <Tab value={3} label="Cat Food" />
              <Tab value={4} label="Cat Toy" />
            </Tabs>
          </Box>
          {/* Search form */}
          <div className="p-2 w-fit bg-gray-100">
            <form
              onSubmit={handleSubmit1((data) => {
                console.log(data);
              })}
            >
              <Paper
                sx={{
                  p: "2px 4px",
                  display: "flex",
                  alignItems: "center",
                  width: 400,
                }}
              >
                <IconButton
                  type="button"
                  sx={{ p: "10px" }}
                  aria-label="search"
                >
                  <HiOutlineSearch />
                </IconButton>
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="Search"
                  {...register1("keyword")}
                />
              </Paper>
            </form>
          </div>
        </div>
        <Grid container sx={{ mt: 2 }}>
          <Grid item xs={12} md={7}>
            {/* Drink */}
            {tab === 1 && (
              <RenderItems
                data={drinks}
                handleChooseItem={handleChooseItem}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
              />
            )}
            {tab === 2 && (
              <RenderItems
                data={foods}
                handleChooseItem={handleChooseItem}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
              />
            )}
            {tab === 3 && (
              <RenderItems
                data={catFoods}
                handleChooseItem={handleChooseItem}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
              />
            )}
            {tab === 4 && (
              <RenderItems
                data={catToys}
                handleChooseItem={handleChooseItem}
                selectedItems={selectedItems}
              />
            )}
          </Grid>
          <Grid item xs={12} md={5}>
            <div className="mx-4 px-6 border-solid border-2 rounded-large">
              <Cart
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
                handleUpdateItem={handleUpdateItem}
              />
            </div>
          </Grid>
        </Grid>
      </ThemeProvider>
    </>
  );
};

export default Items;
