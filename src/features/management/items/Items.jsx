import {
  HiOutlineSearch,
  HiOutlinePlus,
  HiOutlineChartBar,
  HiOutlineCalculator,
  HiOutlineFilter,
  HiOutlineTrash,
  HiPencilAlt,
  HiChevronDown,
  HiOutlineX,
  HiOutlineCheck,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
} from "react-icons/hi";
import {
  Typography,
  Paper,
  InputBase,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
  Menu,
  MenuItem,
} from "@mui/material";
import { set, useForm } from "react-hook-form";
// import CatTest from "../../../assets/CatTest.png";
import { useState, useEffect, useContext } from "react";
import CustomDataTable from "../../../components/CustomDataTable";
import CustomDrawer from "../../../components/CustomDrawer";
import { useMutation, useQuery } from "@tanstack/react-query";
import Loader from "../../../components/Loader";
import EmptyBox from "../../../assets/empty_box.png";
import {
  createItem,
  deleteItem,
  getItemsInShop,
  searchItem,
  updateItem,
} from "../../../services/apiItems";
import AddItem from "./AddItem";
import UpdateItem from "./UpdateItem";
import { ManagerContext } from "../ManagerContext";
import { toastError, toastSuccess } from "../../../components/Toast";
import { createItemImage, deleteItemImage } from "../../../services/apiImage";
import FilterList from "../../../components/FilterList";

const eliminateUnnecessaryKeys = (data) => {
  return data.map((item) => {
    const { itemTypeId, isDeleted, ...rest } = item;
    const images = rest.images.map((image) => {
      return { _id: image._id, url: image.url, name: image.name };
    });
    const itemType = itemTypeId.itemTypeName;
    return { images, ...rest, itemType };
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
        case "name":
          headTable.push("Name");
          break;
        case "itemType":
          headTable.push("Item type");
          break;
        case "status":
          headTable.push("Status");
          break;
        case "price":
          headTable.push("Price (VND)");
          break;
        case "description":
          headTable.push("Description");
          break;
        default:
          break;
      }
    }
  }
  return headTable;
};

const filterData = [
  { itemTypeName: ["foods", "drink", "cat foods", "toys"] },
  { status: ["active", "inactive"] },
];
const Items = () => {
  const { coffeeShopId } = useContext(ManagerContext);
  const {
    isLoading,
    error,
    data: items,
    refetch,
  } = useQuery({
    queryKey: ["items", coffeeShopId],
    queryFn: () => getItemsInShop(coffeeShopId),
  });
  const CreateItem = useMutation({ mutationFn: createItem });
  const CreateItemImage = useMutation({ mutationFn: createItemImage });
  const UpdateItemInfo = useMutation({ mutationFn: updateItem });
  const DeleteItem = useMutation({ mutationFn: deleteItem });
  const DeleteItemImage = useMutation({ mutationFn: deleteItemImage });
  const SearchItem = useMutation({ mutationFn: searchItem });
  const [showAddItem, setShowAddItem] = useState(false);
  const [showUpdateItem, setShowUpdateItem] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [filteredItems, setFilteredItems] = useState([]);
  const [openDeletePopUp, setOpenDeletePopUp] = useState(false);
  const [openDisablePopUp, setOpenDisablePopUp] = useState(false);
  const [isAddFormFilled, setIsAddFormFilled] = useState(false);
  const [isUpdateFormFilled, setUpdateIsFormFilled] = useState(false);

  const [item, setItem] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const open = Boolean(anchorEl);
  const [searchBy, setSearchBy] = useState("name");
  // this form is for search
  const {
    register: register1,
    handleSubmit: handleSubmit1,
    setValue: setValue1,
    watch: watch1,
  } = useForm();
  const keyword = watch1("keyword");
  const filter = watch1("filter");
  // this form is for add item
  const {
    register: register2,
    handleSubmit: handleSubmit2,
    reset: reset2,
    setValue: setValue2,
    watch: watch2,
  } = useForm();
  // this form is for update item
  const {
    register: register3,
    handleSubmit: handleSubmit3,
    reset: reset3,
    setValue: setValue3,
    watch: watch3,
    control: control3,
  } = useForm();

  useEffect(() => {
    reset3(selectedItem);
  }, [selectedItem, reset3]);

  useEffect(() => {
    const fetchData = async () => {
      if (keyword === "") {
        setItem([]);
      }
      if (keyword) {
        const response = await SearchItem.mutateAsync([
          coffeeShopId,
          keyword,
          searchBy,
        ]);
        if (response.status === 200) {
          setItem(response.data);
        } else {
          console.log(response.message);
        }
      }
    };
    fetchData();
  }, [keyword]);

  useEffect(() => {
    setFilteredItems(
      items?.data?.items?.filter((item) => {
        for (const key in filter) {
          if (filter[key].length > 0) {
            if (
              filter[key] === item.itemTypeId[key] ||
              filter[key] === item[key]
            ) {
              return item;
            }
          }
        }
      })
    );
  }, [filter]);

  // useEffect(() => {
  //   if (selectedItem && Object.keys(selectedItem).length !== 0) {
  //     if (action === "update") {
  //       setShowUpdateItem(true);
  //     } else if (action === "delete") {
  //       setOpenPopUp(true);
  //     }
  //   }
  // }, [selectedItem]);

  if (isLoading) return <Loader />;
  if (error) return "An error has occurred: " + error.message;
  const highlightedData = { searchBy: searchBy, keyword: keyword };

  const tableData = eliminateUnnecessaryKeys(
    ((item ?? []).length === 0
      ? (filteredItems ?? []).length === 0
        ? items?.data?.items || []
        : filteredItems
      : item) || []
  );
  const headData = extractKeys(tableData || []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpenModal(true);
  };
  const handleClose = (choice) => {
    setAnchorEl(null);
    setOpenModal(false);
    if (typeof choice === "object" && choice.nativeEvent !== undefined) {
      console.log("Ignoring SyntheticEvent");
    } else {
      setSearchBy(Object.keys(choice).length > 0 ? choice : "name");
    }
  };

  const totalActiveItems = items.data?.items.reduce((sum, item) => {
    if (item.status === "active") {
      return sum + 1;
    }
    return sum;
  }, 0);
  const totalInactiveItems = items.data?.items.reduce((sum, item) => {
    if (item.status === "inactive") {
      return sum + 1;
    }
    return sum;
  }, 0);

  const addItem = async (data) => {
    const { images, itemType, ...rest } = data;
    const payload = {
      ...rest,
      status: "active",
    };
    console.log(payload);
    try {
      const response = await CreateItem.mutateAsync([coffeeShopId, payload]);
      if (response.status === 200) {
        if (images.length > 0) {
          const itemId = response.data._id;
          const res = await CreateItemImage.mutateAsync([
            coffeeShopId,
            itemId,
            images,
          ]);
          if (res.status === 200) {
            toastSuccess("Create item successfully");
            refetch();
          } else {
            toastError(res.message);
          }
        }
      } else {
        toastError(response.message);
      }
    } catch (error) {
      toastError(error.message);
    }
  };

  const editItem = async (data) => {
    const { _id, images, itemType, ...rest } = data;
    console.log(rest);
    try {
      const filterImages = selectedItem.images.filter((image) =>
        images.includes(image.url)
      );
      if (filterImages.length === 0) {
        selectedItem.images.map(async (image) => {
          console.log(image._id);
          const res = await DeleteItemImage.mutateAsync([
            selectedItem._id,
            image._id,
          ]);
          if (res.status === 200) {
            console.log("Delete image successfully");
          } else {
            toastError(res.message);
          }
        });
        if (images.length > 0) {
          const res = await CreateItemImage.mutateAsync([
            coffeeShopId,
            selectedItem._id,
            images,
          ]);
          if (res.status === 200) {
            console.log("Create image successfully");
          } else {
            toastError(res.message);
          }
        }
      }
      if (filterImages.length > 0) {
        const newImages = images.filter((image) => {
          return !selectedItem.images.some(
            (oldImage) => oldImage.url === image
          );
        });
        if (newImages.length === 0) {
          const deletedImages = selectedItem.images.filter((image) => {
            return !images.some((newImage) => newImage === image.url);
          });
          deletedImages &&
            deletedImages.map(async (deletedImage) => {
              const res = await DeleteItemImage.mutateAsync([
                selectedItem._id,
                deletedImage._id,
              ]);
              if (res.status === 200) {
                console.log("Delete image successfully");
                refetch();
              } else {
                toastError(res.message);
              }
            });
        }
        if (newImages.length > 0) {
          images.filter(async (image) => {
            if (typeof image === "object") {
              if (images.length > 0) {
                const res = await CreateItemImage.mutateAsync([
                  coffeeShopId,
                  selectedItem._id,
                  images,
                ]);
                if (res.status === 200) {
                  console.log("Create image successfully");
                  refetch();
                } else {
                  toastError(res.message);
                }
              }
            }
          });
        }
      }
      const newInfo = Object.keys(rest).filter((key) => {
        return rest[key] !== selectedItem[key];
      });
      if (newInfo.length > 0) {
        const response = await UpdateItemInfo.mutateAsync([rest, _id]);
        if (response.status === 200) {
          console.log("Update Item successfully");
        } else {
          toastError(response.message);
        }
      }
      toastSuccess("Update item successfully");
      setSelectedItem({});
      refetch();
    } catch (error) {
      toastError(error.message);
    }
  };

  const removeItem = async () => {
    setOpenDeletePopUp(false);
    try {
      if (selectedItem.images.length > 0) {
        selectedItem.images.map(async (image) => {
          const res = await DeleteItemImage.mutateAsync([
            selectedItem._id,
            image._id,
          ]);
          if (res.status === 200) {
            console.log("Delete image successfully");
          } else {
            toastError(res.message);
          }
        });
      }
      const response = await DeleteItem.mutateAsync([
        coffeeShopId,
        selectedItem._id,
      ]);
      if (response.status === 200) {
        toastSuccess("Delete Item successfully");
        refetch();
      } else {
        toastError(response.message);
      }
    } catch (error) {
      toastError(error.message);
    }
  };

  const updateItemStatus = async () => {
    setOpenDisablePopUp(false);
    try {
      const response = await UpdateItemInfo.mutateAsync([
        { status: selectedItem.status === "active" ? "inactive" : "active" },
        selectedItem._id,
      ]);
      if (response.status === 200) {
        toastSuccess("Update item status successfully");
        setSelectedItem({});
        refetch();
      } else {
        toastError(response.message);
      }
    } catch (error) {
      toastError(error.message);
    }
  };
  return (
    <div className="h-fit">
      {items.data?.items.length === 0 && (
        <div className="w-full flex flex-col justify-center items-center">
          <img src={EmptyBox} alt="empty box" />
          <Typography variant="h6">No item now</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<HiOutlinePlus />}
            onClick={() => setShowAddItem(true)}
          >
            Add item
          </Button>
        </div>
      )}
      {coffeeShopId && items.data?.items.length > 0 && (
        <>
          {/* Overall statistic */}
          <div className="mx-4 my-2">
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6} md={4}>
                <div className="h-24 flex items-center justify-around bg-white rounded-lg">
                  <div className="p-2 bg-orange-200 rounded-3xl">
                    <HiOutlineChartBar size={40} />
                  </div>
                  <div className="flex flex-col ml-2">
                    <p className="text-lg font-semibold">Total Item</p>
                    <p className="text-2xl font-semibold">
                      {items.data?.items.length}
                    </p>
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <div className="h-24 flex items-center justify-around bg-white rounded-lg">
                  <div className="bg-lime-500 rounded-3xl p-2">
                    <HiOutlineCheckCircle size={40} />
                  </div>
                  <div className="flex flex-col ml-2">
                    <p className="text-lg font-semibold">Active Item</p>
                    <p className="text-2xl font-semibold">{totalActiveItems}</p>
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <div className="h-24 flex items-center justify-around bg-white rounded-lg">
                  <div className="bg-lime-500 rounded-3xl p-2">
                    <HiOutlineXCircle size={40} />
                  </div>
                  <div className="flex flex-col ml-2">
                    <p className="text-lg font-semibold">Inactive Item</p>
                    <p className="text-2xl font-semibold">
                      {totalInactiveItems}
                    </p>
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>

          <div className="flex flex-row justify-between items-center">
            <p className="mx-4 text-4xl font-semibold">Item List</p>
            <div className="p-2">
              {items.data.items.length > 0 && (
                <div className="flex">
                  <Button
                    variant="contained"
                    color={
                      selectedItem.status === "active" ? "error" : "success"
                    }
                    startIcon={
                      selectedItem.status === "active" ? (
                        <HiOutlineX />
                      ) : (
                        <HiOutlineCheck />
                      )
                    }
                    sx={{ mx: 1 }}
                    onClick={() => setOpenDisablePopUp(true)}
                    disabled={Object.keys(selectedItem).length === 0}
                  >
                    {selectedItem.status === "active"
                      ? "Disable item"
                      : "Enable item"}
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<HiPencilAlt />}
                    sx={{ mx: 1 }}
                    onClick={() => setShowUpdateItem(true)}
                    disabled={Object.keys(selectedItem).length === 0}
                  >
                    Update item
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<HiOutlineTrash />}
                    sx={{ mx: 1 }}
                    onClick={() => setOpenDeletePopUp(true)}
                    disabled={Object.keys(selectedItem).length === 0}
                  >
                    Delete item
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<HiOutlinePlus />}
                    onClick={() => setShowAddItem(true)}
                  >
                    Add item
                  </Button>
                </div>
              )}

              {showUpdateItem && (
                <form onSubmit={handleSubmit3(editItem)}>
                  <CustomDrawer
                    id="updateItemDrawer"
                    styles={{ width: "25%" }}
                    showModel={showUpdateItem}
                    setShowModel={setShowUpdateItem}
                    isFormFilled={isUpdateFormFilled}
                    renderBody={
                      <UpdateItem
                        register={register3}
                        reset={reset3}
                        watch={watch3}
                        setValue={setValue3}
                        onFormUpdate={(newState) =>
                          setUpdateIsFormFilled(newState)
                        }
                        selectedItem={selectedItem}
                      />
                    }
                    message={{
                      header: "Update item",
                      primaryBtn: "Done",
                    }}
                  />
                </form>
              )}
            </div>
          </div>
          {items.data?.items.length > 0 && (
            <div className="m-4">
              <form>
                <div className="flex items-center justify-between">
                  <Paper
                    sx={{
                      p: "2px 4px",
                      display: "flex",
                      flexDirection: "row",
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
                      placeholder={"Search by " + searchBy}
                      inputProps={{ maxLength: 30 }}
                      {...register1("keyword")}
                    />
                    <div
                      onClick={handleClick}
                      className={`transform transition-transform duration-300 ${
                        openModal ? "rotate-180" : ""
                      }`}
                    >
                      <HiChevronDown size="2rem" />
                    </div>
                    <Menu
                      id="basic-menu"
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                      MenuListProps={{
                        "aria-labelledby": "basic-button",
                      }}
                    >
                      <MenuItem onClick={() => handleClose("name")}>
                        Name
                      </MenuItem>
                      <MenuItem onClick={() => handleClose("price")}>
                        Price
                      </MenuItem>
                      <MenuItem onClick={() => handleClose("description")}>
                        Description
                      </MenuItem>
                    </Menu>
                  </Paper>
                  <FilterList filterData={filterData} setValue={setValue1} />
                </div>
              </form>
            </div>
          )}
          <div className="m-4 rounded-lg">
            {items.data && items.data.items.length > 0 && (
              <CustomDataTable
                headData={headData}
                tableData={tableData}
                selectedData={selectedItem}
                setSelectedData={setSelectedItem}
                highlightedData={highlightedData}
              />
            )}
          </div>

          <Dialog
            open={openDeletePopUp}
            onClose={() => setOpenDeletePopUp(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            disableBackdropClick={true} // Disable closing dialog by clicking outside
            disableEscapeKeyDown={true} // Disable closing dialog by pressing Escape key
          >
            <div className="flex flex-col items-center justify-center">
              <DialogTitle id="alert-dialog-title">
                <p className="text-3xl">Delete confirmation</p>
              </DialogTitle>
              <DialogContent className="flex flex-col items-center justify-center">
                <DialogContentText id="alert-dialog-description">
                  <p className="text-2xl">Do you want to delete this item?</p>
                </DialogContentText>
              </DialogContent>
            </div>
            <DialogActions>
              <Button
                color="secondary"
                onClick={() => {
                  setOpenDeletePopUp(false);
                }}
              >
                Cancel
              </Button>
              <Button
                color="error"
                variant="contained"
                onClick={() => removeItem()}
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={openDisablePopUp}
            onClose={() => setOpenDisablePopUp(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            disableBackdropClick={true} // Disable closing dialog by clicking outside
            disableEscapeKeyDown={true} // Disable closing dialog by pressing Escape key
          >
            <div className="flex flex-col items-center justify-center">
              <DialogTitle id="alert-dialog-title">
                <p className="text-3xl">
                  {selectedItem.status === "active" ? "Disable" : "Enable"}{" "}
                  confirmation
                </p>
              </DialogTitle>
              <DialogContent className="flex flex-col items-center justify-center">
                <DialogContentText id="alert-dialog-description">
                  <p className="text-2xl">
                    {selectedItem.status === "active"
                      ? "Disable is set item status to inactive"
                      : "Enable is set item status to active"}
                  </p>
                </DialogContentText>
                <DialogContentText id="alert-dialog-description">
                  <p className="text-2xl">
                    Do you want to{" "}
                    {selectedItem.status === "active" ? "disable" : "enable"}{" "}
                    this item?
                  </p>
                </DialogContentText>
              </DialogContent>
            </div>
            <DialogActions>
              <Button
                color="secondary"
                onClick={() => {
                  setOpenDisablePopUp(false);
                }}
              >
                Cancel
              </Button>
              <Button
                color={selectedItem.status === "active" ? "error" : "success"}
                variant="contained"
                onClick={() => updateItemStatus()}
              >
                {selectedItem.status === "active" ? "Disable" : "Enable"}
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
      {showAddItem && (
        <form onSubmit={handleSubmit2(addItem)}>
          <CustomDrawer
            id="addItemDrawer"
            styles={{ width: "25%" }}
            showModel={showAddItem} // show drawer
            setShowModel={setShowAddItem} // set show drawer
            isFormFilled={isAddFormFilled} // check if form is filled to show submit button
            renderBody={
              // content of drawer
              <AddItem
                register={register2} // get the register function from useForm
                reset={reset2} // reset data after submit
                watch={watch2} // get value of each field when it change
                setValue={setValue2} // set value for image field (if form don't contain image field, this line can be removed)
                onFormUpdate={(newState) => setIsAddFormFilled(newState)} // update form state to true if all fields are filled
              />
            }
            message={{
              header: "Add Item",
              primaryBtn: "Done", // text of submit button (show when isFormFilled is true)
            }}
          />
        </form>
      )}
    </div>
  );
};

export default Items;
