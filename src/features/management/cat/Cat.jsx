import {
  HiOutlinePlus,
  HiOutlineUserGroup,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineTrash,
  HiPencilAlt,
  HiPencil,
  HiOutlineSearch,
  HiChevronDown,
  HiOutlineX,
  HiOutlineCheck,
} from "react-icons/hi";
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
  Divider,
  Paper,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
} from "@mui/material";
import { set, useForm } from "react-hook-form";
// import CatTest from "../../../assets/CatTest.png";
import { useState, useEffect, useContext } from "react";
import CustomDataTable from "../../../components/CustomDataTable";
import CustomDrawer from "../../../components/CustomDrawer";
import AddCat from "./AddCat";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  addCat,
  assignCatToArea,
  deleteCat,
  getCatByShop,
  searchCat,
  updateCat,
} from "../../../services/apiCat";
import UpdateCat from "./UpdateCat";
import Loader from "../../../components/Loader";
import EmptyBox from "../../../assets/empty_box.png";
import { ManagerContext } from "../ManagerContext";
import {
  toastError,
  toastSuccess,
  toastWarning,
} from "../../../components/Toast";
import { createCatImage, deleteCatImage } from "../../../services/apiImage";
import { DateTimeFormater } from "../../../utils/DateFormater";
import AssignCat from "./AssignCat";
import FilterList from "../../../components/FilterList";
import FilterCatBreed from "../../../components/FilterCatBreed";
import { getAreaById } from "../../../services/apiArea";

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
const Cat = () => {
  const [selectedBreed, setSelectedBreed] = useState("All");

  const { coffeeShopId } = useContext(ManagerContext);
  const {
    isLoading,
    error,
    data: cats,
    refetch,
  } = useQuery({
    queryKey: ["cats", coffeeShopId],
    queryFn: () => getCatByShop(coffeeShopId),
  });
  let breeds = [];
  // if (cats) {
  //   breeds = cats.map((cat) => cat.breed);
  // }

  useEffect(() => {
    if (cats) {
      console.log(cats);

      cats?.data?.map((cat) => {
        if (!breeds.includes(cat.breed)) {
          breeds.push(cat.breed);
        }
      });
    }
  }, [cats, breeds]);

  const filterData = [{ status: ["active", "inactive"] }, { breed: breeds }];

  const CreateCat = useMutation({ mutationFn: addCat });
  const CreateCatImage = useMutation({ mutationFn: createCatImage });
  const AssignCatToArea = useMutation({ mutationFn: assignCatToArea });
  const UpdateCatInfo = useMutation({ mutationFn: updateCat });
  const DeleteCat = useMutation({ mutationFn: deleteCat });
  const DeleteCatImage = useMutation({ mutationFn: deleteCatImage });
  const SearchCat = useMutation({ mutationFn: searchCat });
  const [showAddCat, setShowAddCat] = useState(false);
  const [showUpdateCat, setShowUpdateCat] = useState(false);
  const [showAssignArea, setShowAssignArea] = useState(false);
  const [selectedCat, setSelectedCat] = useState({});
  const [filteredCats, setFilteredCats] = useState([]);
  const [openDeletePopUp, setOpenDeletePopUp] = useState(false);
  const [openDisablePopUp, setOpenDisablePopUp] = useState(false);
  const [isAddFormFilled, setIsAddFormFilled] = useState(false);
  const [isUpdateFormFilled, setIsUpdateFormFilled] = useState(false);
  const [isAssignAreaFormFilled, setIsAssignAreaFormFilled] = useState(false);

  const [cat, setCat] = useState([]);
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
  // this form is for add cat
  const {
    register: register2,
    handleSubmit: handleSubmit2,
    reset: reset2,
    setValue: setValue2,
    watch: watch2,
    control: control2,
  } = useForm();
  // this form is for update cat
  const {
    register: register3,
    handleSubmit: handleSubmit3,
    reset: reset3,
    setValue: setValue3,
    watch: watch3,
    control: control3,
  } = useForm();
  // this form is for assign cat to area
  const {
    handleSubmit: handleSubmit4,
    reset: reset4,
    setValue: setValue4,
    watch: watch4,
    control: control4,
  } = useForm();

  useEffect(() => {
    reset3(selectedCat);
  }, [selectedCat, reset3]);

  useEffect(() => {
    reset4(selectedCat);
  }, [selectedCat, reset4]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const response = await SearchCat.mutateAsync([
  //       coffeeShopId,
  //       keyword,
  //       searchBy,
  //     ]);
  //     if (response.status === 200) {
  //       setCat(response.data);
  //     } else {
  //       console.log(response.message);
  //     }
  //   };
  //   fetchData();
  // }, [keyword]);

  useEffect(() => {
    let filteredCats = cats?.data;

    // Apply keyword filter
    if (keyword) {
      filteredCats = filteredCats.filter((cat) => cat.name.includes(keyword));
    }

    // Apply filter object
    if (filter) {
      filteredCats = filteredCats.filter((cat) => {
        for (const key in filter) {
          if (filter[key].length > 0) {
            if (filter[key] === cat[key]) {
              return true;
            }
          }
        }
        return false;
      });
    }
    setCat(filteredCats);
  }, [keyword, filter, cats]);
  // useEffect(() => {
  //   if (selectedCat && Object.keys(selectedCat).length !== 0) {
  //     // if (action === "update") {
  //       setShowUpdateCat(true);
  //       // setSelectedCat(selectedCat);
  //     // } else if (action === "delete") {
  //       setOpenPopUp(true);
  //     // }
  //   }
  // }, [selectedCat, action]);

  if (isLoading) return <Loader />;
  if (error) return "An error has occurred: " + error.message;
  const highlightedData = { searchBy: searchBy, keyword: keyword };

  const tableData = eliminateUnnecessaryKeys(
    ((cat ?? []).length === 0
      ? (filteredCats ?? []).length === 0
        ? cats?.data || []
        : filteredCats
      : cat) || []
  );
  // const tableData = eliminateUnnecessaryKeys(cats?.data || []);
  const headData = extractKeys(tableData || []);

  const totalActiveCats = cats.data?.reduce((sum, cat) => {
    if (cat.status === "active") {
      return sum + 1;
    }
    return sum;
  }, 0);
  const totalInactiveCats = cats.data?.reduce((sum, cat) => {
    if (cat.status === "inactive") {
      return sum + 1;
    }
    return sum;
  }, 0);

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

  const createCat = async (data) => {
    const payload = {
      ...data,
      dateOfBirth: data.dateOfBirth
        ? new Date(data.dateOfBirth).toISOString()
        : null,
      startTime: new Date().toISOString(),
      endTime: data.endTime ? new Date(data.endTime).toISOString() : null,
    };
    const { images, areaId, startTime, endTime, ...rest } = payload;
    console.log(rest);
    try {
      const response = await CreateCat.mutateAsync([rest, coffeeShopId]);
      if (response.status === 200) {
        //create cat image
        if (images.length > 0) {
          const res = await CreateCatImage.mutateAsync([
            coffeeShopId,
            response.data._id,
            images,
          ]);
          if (res.status === 200) {
            console.log("Create Cat successfully");
          } else {
            toastError(res.message);
          }
        }
        // assign cat to area if areaId is not null
        // if (areaId) {
        //   const catId = response.data._id;
        //   const res = await AssignCatToArea.mutateAsync([
        //     areaId,
        //     catId,
        //     startTime,
        //     endTime,
        //   ]);
        //   if (res.status === 200) {
        //     console.log("Assign cat to area successfully");
        //   } else {
        //     toastError(res.message);
        //   }
        // }
        toastSuccess("Create Cat successfully");
        refetch();
      } else {
        toastError(response.message);
      }
    } catch (error) {
      toastError(error.message);
    }
  };

  const editCat = async (data) => {
    const payload = {
      ...data,
      dateOfBirth: data.dateOfBirth
        ? new Date(data.dateOfBirth).toISOString()
        : null,
      startTime: new Date().toISOString(),
      endTime: data.endTime ? new Date(data.endTime).toISOString() : null,
    };
    const { _id, images, area, areaId, startTime, endTime, ...rest } = payload;
    console.log(rest);
    try {
      // All of this is for update image
      // compare images and selectedCat.images to get deleted images
      const filterImages = selectedCat.images.filter((image) =>
        images.includes(image.url)
      );
      // if filtered images is empty, it means that user delete current image => call createCatImage
      if (filterImages.length === 0) {
        //call deleteCatImage first
        selectedCat.images.map(async (image) => {
          console.log(image._id);
          const res = await DeleteCatImage.mutateAsync([
            coffeeShopId,
            selectedCat._id,
            image._id,
          ]);
          if (res.status === 200) {
            console.log("Delete image successfully");
          } else {
            toastError(res.message);
          }
        });
        //call createCatImage
        if (images.length > 0) {
          const res = await CreateCatImage.mutateAsync([
            coffeeShopId,
            selectedCat._id,
            images,
          ]);
          if (res.status === 200) {
            console.log("Create image successfully");
          } else {
            toastError(res.message);
          }
        }
      }
      // if filtered images is not empty, it means that the old image is not delete => call createCatImage
      if (filterImages.length > 0) {
        // compare images and selectedCat.images to get new images
        const newImages = images.filter((image) => {
          return !selectedCat.images.some((oldImage) => oldImage.url === image);
        });
        // if newImages is empty, it means that user delete current image => call createCatImage
        if (newImages.length === 0) {
          // find the image that is deleted
          const deletedImages = selectedCat.images.filter((image) => {
            return !images.some((newImage) => newImage === image.url);
          });
          deletedImages &&
            deletedImages.map(async (deletedImage) => {
              const res = await DeleteCatImage.mutateAsync([
                coffeeShopId,
                selectedCat._id,
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
        // if newImages is not empty, it means that user add new image => call createCatImage
        if (newImages.length > 0) {
          images.filter(async (image) => {
            if (typeof image === "object") {
              if (images.length > 0) {
                const res = await CreateCatImage.mutateAsync([
                  coffeeShopId,
                  selectedCat._id,
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
      // end update image

      // compare rest and selectedCat to get new info
      const newInfo = Object.keys(rest).filter((key) => {
        return rest[key] !== selectedCat[key];
      });
      if (newInfo.length > 0) {
        const response = await UpdateCatInfo.mutateAsync([
          rest,
          coffeeShopId,
          _id,
        ]);
        if (response.status === 200) {
          console.log("Update Cat successfully");
        } else {
          toastError(response.message);
        }
      }
      toastSuccess("Update Cat successfully");
      setSelectedCat({});
      refetch();
    } catch (error) {
      toastError(error.message);
    }
  };

  const assignCat = async (data) => {
    const payload = {
      ...data,
      startTime: data.startTime ? new Date(data.startTime).toISOString() : null,
      endTime: data.endTime ? new Date(data.endTime).toISOString() : null,
    };
    const { areaId, startTime, endTime } = payload;
    try {
      const response = await AssignCatToArea.mutateAsync([
        areaId,
        selectedCat._id,
        startTime,
        endTime,
      ]);
      if (response.status === 200) {
        const area = await getAreaById([coffeeShopId, areaId]);
        setSelectedCat((prevState) => ({
          ...prevState,
          area: area.data.name,
        }));
        toastSuccess("Assign cat to area successfully");
        refetch();
      } else {
        toastError(response.message);
      }
    } catch (error) {
      toastError(error.message);
    }
  };

  const removeCat = async () => {
    setOpenDeletePopUp(false);
    try {
      if (selectedCat.images.length > 0) {
        selectedCat.images.map(async (image) => {
          console.log(image._id);
          const res = await DeleteCatImage.mutateAsync([
            coffeeShopId,
            selectedCat._id,
            image._id,
          ]);
          if (res.status === 200) {
            console.log("Delete image successfully");
          } else {
            toastError(res.message);
          }
        });
      }
      const response = await DeleteCat.mutateAsync([
        coffeeShopId,
        selectedCat._id,
      ]);
      if (response.status === 200) {
        toastSuccess("Delete Cat successfully");
        refetch();
      } else {
        toastError(response.message);
      }
    } catch (error) {
      toastError(error.message);
    }
  };

  const updateCatStatus = async () => {
    setOpenDisablePopUp(false);
    try {
      const response = await UpdateCatInfo.mutateAsync([
        { status: selectedCat.status === "active" ? "inactive" : "active" },
        coffeeShopId,
        selectedCat._id,
      ]);
      if (response.status === 200) {
        toastSuccess("Update Cat status successfully");
        setSelectedCat({});
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
      {cats.data?.length === 0 && (
        <div className="w-full flex flex-col justify-center items-center">
          <img src={EmptyBox} alt="empty box" />
          <Typography variant="h6">No cat now</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<HiOutlinePlus />}
            onClick={() => setShowAddCat(true)}
          >
            Add cat
          </Button>
        </div>
      )}
      {coffeeShopId && cats.data?.length > 0 && (
        <>
          {/* Overall statistic */}
          <div className="mx-4 my-2">
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6} md={4}>
                <div className="h-24 flex items-center justify-around bg-white rounded-lg">
                  <div className="p-2 bg-orange-200 rounded-3xl">
                    <HiOutlineUserGroup size={40} />
                  </div>
                  <div className="flex flex-col ml-2">
                    <p className="text-lg font-semibold">Total Cat</p>
                    <p className="text-2xl font-semibold">
                      {cats.data?.length}
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
                    <p className="text-lg font-semibold">Active Cat</p>
                    <p className="text-2xl font-semibold">{totalActiveCats}</p>
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <div className="h-24 flex items-center justify-around bg-white rounded-lg">
                  <div className="bg-red-500 rounded-3xl p-2">
                    <HiOutlineXCircle size={40} />
                  </div>
                  <div className="flex flex-col ml-2">
                    <p className="text-lg font-semibold">Inactive Cat</p>
                    <p className="text-2xl font-semibold">
                      {totalInactiveCats}
                    </p>
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>
          {/* Cat area history */}
          {/* <div className="h-36 mx-4 my-2 bg-white rounded-lg">
            <p className="m-2 text-2xl font-semibold">Cat area history</p>
            <div className="flex">
              {cats.data[
                cats.data.findIndex((cat) => cat._id === selectedCat._id)
              ]?.areaCats.map((areaCat, index) => (
                <div key={index}>
                  <div className="w-fit m-2 p-2 bg-orange-200 rounded-3xl">
                    <div className="flex flex-row items-center">
                      <HiLocationMarker size={30} />
                      <div className="ml-2">
                        <p className="text-lg font-semibold">
                          {DateTimeFormater(areaCat.startTime)} -{" "}
                          {areaCat.endTime
                            ? DateTimeFormater(areaCat.endTime)
                            : "Now"}
                        </p>
                        <p className="text-lg text-center">
                          {areaCat.areaId.name}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div> */}
          {/* filter bar */}
          <div className="flex flex-row justify-between items-center">
            <p className="mx-4 text-4xl font-semibold">Cat List</p>
            <div className="mx-4 p-2">
              {cats.data.length > 0 && (
                <div className="flex">
                  <Button
                    variant="contained"
                    color={
                      selectedCat.status === "active" ? "error" : "success"
                    }
                    startIcon={
                      selectedCat.status === "active" ? (
                        <HiOutlineX />
                      ) : (
                        <HiOutlineCheck />
                      )
                    }
                    sx={{ mx: 1 }}
                    onClick={() => setOpenDisablePopUp(true)}
                    disabled={Object.keys(selectedCat).length === 0}
                  >
                    {selectedCat.status === "active"
                      ? "Disable cat"
                      : "Enable cat"}
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mx: 1 }}
                    startIcon={<HiPencil />}
                    onClick={() => setShowAssignArea(true)}
                    disabled={
                      Object.keys(selectedCat).length === 0 ||
                      selectedCat.status === "inactive"
                    }
                  >
                    Assign cat to area
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<HiPencilAlt />}
                    sx={{ mx: 1 }}
                    onClick={() => setShowUpdateCat(true)}
                    disabled={Object.keys(selectedCat).length === 0}
                  >
                    Update cat
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<HiOutlineTrash />}
                    sx={{ mx: 1 }}
                    onClick={() => setOpenDeletePopUp(true)}
                    disabled={Object.keys(selectedCat).length === 0}
                  >
                    Delete cat
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<HiOutlinePlus />}
                    sx={{ mx: 1 }}
                    onClick={() => setShowAddCat(true)}
                  >
                    Add cat
                  </Button>
                </div>
              )}

              {showUpdateCat && (
                <form onSubmit={handleSubmit3(editCat)}>
                  <CustomDrawer
                    id="updateCatDrawer"
                    styles={{ width: "50%" }}
                    showModel={showUpdateCat}
                    setShowModel={setShowUpdateCat}
                    isFormFilled={isUpdateFormFilled}
                    renderBody={
                      <UpdateCat
                        register={register3}
                        watch={watch3}
                        setValue={setValue3}
                        onFormUpdate={(newState) =>
                          setIsUpdateFormFilled(newState)
                        }
                        selectedCat={selectedCat}
                        control={control3}
                      />
                    }
                    message={{
                      header: "Update Cat",
                      primaryBtn: "Done",
                    }}
                  />
                </form>
              )}

              {showAssignArea && (
                <form onSubmit={handleSubmit4(assignCat)}>
                  <CustomDrawer
                    id="assignCatDrawer"
                    styles={{ width: "25%" }}
                    showModel={showAssignArea}
                    setShowModel={setShowAssignArea}
                    isFormFilled={isAssignAreaFormFilled}
                    renderBody={
                      <AssignCat
                        watch={watch4}
                        setValue={setValue4}
                        onFormUpdate={(newState) =>
                          setIsAssignAreaFormFilled(newState)
                        }
                        selectedCat={selectedCat}
                        fromTo={
                          cats.data[
                            cats.data.findIndex(
                              (cat) => cat._id === selectedCat._id
                            )
                          ]?.areaCats
                        }
                        control={control4}
                      />
                    }
                    message={{
                      header: "Assign Cat to area",
                      primaryBtn: "Done",
                    }}
                  />
                </form>
              )}
            </div>
          </div>

          {cats.data?.length > 0 && (
            <div className="m-4">
              <form>
                <div className="flex items-center justify-between">
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
                      placeholder={"Search by " + searchBy}
                      inputProps={{ maxLength: 30 }}
                      {...register1("keyword")}
                    />
                    <div
                      onClick={handleClick}
                      className={`transform transition-transform duration-300 ${openModal ? "rotate-180" : ""
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
                      <MenuItem onClick={() => handleClose("breed")}>
                        Breed
                      </MenuItem>
                      <MenuItem onClick={() => handleClose("gender")}>
                        Gender
                      </MenuItem>
                      <MenuItem onClick={() => handleClose("description")}>
                        Description
                      </MenuItem>
                      <MenuItem onClick={() => handleClose("favorite")}>
                        Favorite
                      </MenuItem>
                    </Menu>
                  </Paper>
                  <div className="flex flex-row mr-4 gap-x-14">
                    {/* <div>
                      <span>Breed: </span>
                      <FilterCatBreed
                        cat={cats}
                        selectedBreed={selectedBreed}
                        setSelectedBreed={setSelectedBreed}
                      />
                    </div> */}
                    <FilterList filterData={filterData} setValue={setValue1} />
                  </div>
                </div>
              </form>
            </div>
          )}
          <div className="m-4 rounded-lg">
            {cats.data && cats.data.length > 0 && (
              <CustomDataTable
                headData={headData}
                tableData={tableData.filter(
                  (cat) =>
                    selectedBreed === "All" ||
                    cat.breed.split(" ")[0] === selectedBreed
                )}
                selectedData={selectedCat}
                setSelectedData={setSelectedCat}
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
                  <p className="text-2xl">Do you want to delete this cat?</p>
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
                onClick={() => removeCat()}
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
                  {selectedCat.status === "active" ? "Disable" : "Enable"}{" "}
                  confirmation
                </p>
              </DialogTitle>
              <DialogContent className="flex flex-col items-center justify-center">
                <DialogContentText id="alert-dialog-description">
                  <p className="text-2xl">
                    {selectedCat.status === "active"
                      ? "Disable is set cat status to inactive"
                      : "Enable is set cat status to active"}
                  </p>
                </DialogContentText>
                <DialogContentText id="alert-dialog-description">
                  <p className="text-2xl">
                    Do you want to{" "}
                    {selectedCat.status === "active" ? "disable" : "enable"}{" "}
                    this cat?
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
                color={selectedCat.status === "active" ? "error" : "success"}
                variant="contained"
                onClick={() => updateCatStatus()}
              >
                {selectedCat.status === "active" ? "Disable" : "Enable"}
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
      {showAddCat && (
        <form onSubmit={handleSubmit2(createCat)}>
          <CustomDrawer
            id="addCatDrawer"
            styles={{ width: "50%" }}
            showModel={showAddCat} // show drawer
            setShowModel={setShowAddCat} // set show drawer
            isFormFilled={isAddFormFilled} // check if form is filled to show submit button
            renderBody={
              // content of drawer
              <AddCat
                register={register2} // get the register function from useForm
                reset={reset2} // reset data after submit
                watch={watch2} // get value of each field when it change
                setValue={setValue2} // set value for image field (if form don't contain image field, this line can be removed)
                onFormUpdate={(newState) => setIsAddFormFilled(newState)} // update form state to true if all fields are filled
                control={control2}
              />
            }
            message={{
              header: "Add Cat",
              primaryBtn: "Done", // text of submit button (show when isFormFilled is true)
            }}
          />
        </form>
      )}
    </div>
  );
};

export default Cat;
