import { useEffect, useState } from "react";
import { useShops } from "../../hooks/useShops";
import emptyImg from "../../assets/EmptyImg.jpg";
import {
  Grid,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { Box } from "@mui/system";
import Status from "../../components/Status";
import Loader from "../../components/Loader";
import { approveShop, getShopByAdmin } from "../../services/apiShops";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toastError, toastSuccess } from "../../components/Toast";

const CoffeeShop = () => {
  const {
    isLoading,
    error,
    data: shops,
    refetch,
  } = useQuery({
    quueryKey: ["coffeeShops"],
    queryFn: () => getShopByAdmin(),
  });
  const ApproveShop = useMutation({ mutationFn: approveShop });

  if (isLoading) return <Loader />;
  if (error) return "An error has occurred: " + error.message;

  const handleChangeStatus = async (id) => {
    try {
      const response = await ApproveShop.mutateAsync(id);
      if (response.status === 200) {
        toastSuccess("Approve Shop successfully");
        refetch();
      } else {
        toastError(response.message);
      }
    } catch (error) {
      toastError(error.message);
    }
  };

  return (
    <Grid container spacing={3} alignItems="center" justifyContent="center">
      <Grid container item xs={12} style={{ width: "100%" }}>
        <Grid item xs={2}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="100%"
          >
            <Typography
              variant="h6"
              textAlign="center"
              style={{ textTransform: "uppercase" }}
            >
              Shop Name
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={2}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="100%"
          >
            <Typography
              variant="h6"
              textAlign="center"
              style={{ textTransform: "uppercase" }}
            >
              Location
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={2}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="100%"
          >
            <Typography
              variant="h6"
              textAlign="center"
              style={{ textTransform: "uppercase" }}
            >
              Status
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={2}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="100%"
          >
            <Typography
              variant="h6"
              textAlign="center"
              style={{ textTransform: "uppercase" }}
            >
              Created At
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {shops?.data.length > 0 &&
        shops?.data.map((shop, idx) => (
          <Grid
            container
            item
            xs={12}
            key={idx}
            style={{ marginBottom: "20px" }}
          >
            <Grid
              item
              xs={2}
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
            >
              <div className="flex flex-col items-center justify-between">
                <div className="h-20 w-20">
                  <img
                    src={shop.images[0]?.url || emptyImg}
                    alt={shop.shopName}
                    className="h-full w-full object-cover rounded-large"
                  />
                </div>
                <span className="text-l text-center font-semibold">
                  {shop.shopName}
                </span>
              </div>
            </Grid>
            <Grid
              item
              xs={2}
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
            >
              <h3>{shop.address?.city}</h3>
            </Grid>

            <Grid
              item
              xs={2}
              textAlign="center"
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
            >
              <Status name={shop.status} />
            </Grid>
            <Grid
              item
              xs={2}
              textAlign="center"
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
            >
              <Typography variant="h6">
                {new Date(shop.createdAt).toLocaleTimeString()}{" "}
                {new Date(shop.createdAt).toLocaleDateString()}
              </Typography>
            </Grid>
            <Grid
              item
              xs={2}
              textAlign="center"
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
            >
              {shop.status === "unavailable" ? (
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "green",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "darkgreen",
                    },
                  }}
                  onClick={() => handleChangeStatus(shop._id)}
                >
                  Approve
                </Button>
              ) : (
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "red",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "darkred",
                    },
                  }}
                  onClick={() => handleChangeStatus(shop._id)}
                >
                  Disapprove
                </Button>
              )}
            </Grid>
          </Grid>
        ))}
    </Grid>
  );
};

export default CoffeeShop;
