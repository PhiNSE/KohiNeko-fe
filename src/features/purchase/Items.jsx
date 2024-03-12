import { Grid, TextField, Typography, Button } from "@mui/material";
import FormatNumber from "../../utils/NumberFormatter";
import { HiOutlineCheckCircle, HiOutlineChevronRight } from "react-icons/hi";
import EmptyBox from "../../assets/empty_box.png";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";
const Items = ({ items, coffeeShopId }) => {
  const navigate = useNavigate();
  return (
    <>
      {items.length > 0 ? (
        items.map((product, index) => {
          return (
            <>
              <div
                key={index}
                className="flex flex-row justify-between items-center"
              >
                <Grid container>
                  <Grid item xs={2}>
                    <TextField
                      color="warning"
                      type="number"
                      variant="standard"
                      sx={{ width: "30px" }}
                      focused
                      defaultValue={product.quantity}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={7} alignSelf="center">
                    <Typography variant="h6">{product.name}</Typography>
                  </Grid>
                  <Grid item xs={2} alignSelf="center" textAlign="center">
                    <Typography variant="h6">
                      {FormatNumber(product.price)}
                    </Typography>
                  </Grid>
                  <Grid item xs={1} alignSelf="center">
                    <HiOutlineCheckCircle color="orange" size={24} />
                  </Grid>
                </Grid>
              </div>
            </>
          );
        })
      ) : (
        <div className="flex flex-col justify-center items-center">
          <div>
            <img src={EmptyBox} alt="empty box" />
          </div>
          <Button
            variant="outlined"
            color="warning"
            endIcon={<HiOutlineChevronRight />}
            onClick={() => navigate(`/coffeeShops/${coffeeShopId}/items`)}
          >
            Explore our products
          </Button>
        </div>
      )}
    </>
  );
};

export default Items;
