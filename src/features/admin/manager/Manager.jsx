import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { SyntheticEvent } from "react";
import Loader from "../../../components/Loader";
import EmptyBox from "../../../assets/empty_box.png";
import { toastError, toastSuccess } from "../../../components/Toast";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Paper,
  Typography,
} from "@mui/material";
import {
  HiOutlineAdjustments,
  HiOutlineCheckCircle,
  HiOutlinePlus,
  HiOutlineSearch,
  HiOutlineTrash,
  HiOutlineUserGroup,
  HiOutlineXCircle,
} from "react-icons/hi";
import CustomDataTable from "../../../components/CustomDataTable";
import CustomDrawer from "../../../components/CustomDrawer";
import AddManager from "./AddManager";
import {
  addManager,
  deleteManager,
  getManagers,
  searchManagers,
} from "../../../services/apiManager";

const eliminateUnnecessaryKeys = (data) => {
  return data.map((item) => {
    const {
      coffeeShopId,
      areaStaffs,
      role,
      wallet,
      avatar,
      refreshToken,
      isDeleted,
      updatedAt,
      createdAt,
      passwordResetExpires,
      passwordResetToken,
      passwordResetTokenExpires,
      passwordChangedAt,
      __v,
      ...rest
    } = item;
    // const images = rest.images.map((image) => {
    //   return { _id: image._id, url: image.url, name: image.name };
    // });
    // const area = areaStaffs[0]?.areaId.name || "No area assigned yet";
    // const catStatus = rest.catStatus[0]?.statusId.name || "";
    return { ...rest };
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
        case "dateOfBirth":
          headTable.push("Date Of Birth");
          break;
        case "gender":
          headTable.push("Gender");
          break;
        case "firstName":
          headTable.push("First name");
          break;
        case "lastName":
          headTable.push("Last name");
          break;
        case "phoneNumber":
          headTable.push("Phone number");
          break;
        case "status":
          headTable.push("Status");
          break;
        case "username":
          headTable.push("Username");
          break;
        case "email":
          headTable.push("Email");
          break;
        case "area":
          headTable.push("Area");
          break;
        default:
          break;
      }
    }
  }
  return headTable;
};

const Manager = () => {
  const {
    isLoading,
    error,
    data: managers,
    refetch,
  } = useQuery({
    queryKey: ["managers"],
    queryFn: () => getManagers(),
  });
  const CreateManager = useMutation({ mutationFn: addManager });
  const SearchManager = useMutation({ mutationFn: searchManagers });
  //   const AssignStaffToArea = useMutation({ mutationFn: assignStaffToArea });
  const DeleteManager = useMutation({ mutationFn: deleteManager });
  const [showAddManager, setShowAddManager] = useState(false);
  const [selectedManager, setSelectedmanager] = useState({});
  const [manager, setManager] = useState([]);
  const [openPopUp, setOpenPopUp] = useState(false);
  const [isAddFormFilled, setIsAddFormFilled] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [searchBy, setSearchBy] = useState("firstName");

  // this form is for search
  const {
    register: register1,
    handleSubmit: handleSubmit1,
    watch: watch1,
  } = useForm();
  const keyword = watch1("keyword");
  // this form is for add manager
  const {
    register: register2,
    handleSubmit: handleSubmit2,
    reset: reset2,
    setValue: setValue2,
    watch: watch2,
    control: control2,
  } = useForm();
  // this form is for update manager
  const {
    register: register3,
    handleSubmit: handleSubmit3,
    reset: reset3,
    setValue: setValue3,
    watch: watch3,
    control: control3,
  } = useForm();

  useEffect(() => {
    reset3(selectedManager);
  }, [selectedManager, reset3]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await SearchManager.mutateAsync([keyword, searchBy]);
      if (response.status === 200) {
        setManager(response.data);
      } else {
        toastError(response.message);
      }
    };
    fetchData();
  }, [keyword]);

  if (isLoading) return <Loader />;
  if (error) return "An error has occurred: " + error.message;
  const highlightedData = { searchBy: searchBy, keyword: keyword };

  const tableData = eliminateUnnecessaryKeys(
    manager.length === 0 ? managers.data || [] : manager
  );
  // const tableData = eliminateUnnecessaryKeys(data);
  const headData = extractKeys(tableData || []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (choice) => {
    setAnchorEl(null);
    if (typeof choice === "object" && choice.nativeEvent !== undefined) {
      console.log("Ignoring SyntheticEvent");
    } else {
      setSearchBy(Object.keys(choice).length > 0 ? choice : "firstName");
    }
  };

  const totalActiveManagers = managers.data?.reduce((sum, cat) => {
    if (cat.status === "active") {
      return sum + 1;
    }
    return sum;
  }, 0);
  const totalInactiveManagers = managers.data?.reduce((sum, cat) => {
    if (cat.status === "inactive") {
      return sum + 1;
    }
    return sum;
  }, 0);

  const createManager = async (data) => {
    const payload = {
      ...data,
      dateOfBirth: data.dateOfBirth
        ? new Date(data.dateOfBirth).toISOString()
        : null,
      role: "shopManager",
      passwordConfirm: data.password,
    };
    const { images, areaId, startTime, endTime, ...rest } = payload;
    console.log(rest);
    try {
      const response = await CreateManager.mutateAsync(rest);
      if (response.status === 200) {
        toastSuccess("Create Manager successfully");
        refetch();
      } else {
        toastError(response.message);
      }
    } catch (error) {
      toastError(error.message);
    }
  };

  const removeManager = async () => {
    setOpenPopUp(false);
    console.log(selectedManager._id);
    try {
      const response = await DeleteManager.mutateAsync(selectedManager._id);
      if (response.status === 200) {
        toastSuccess("Delete Manager successfully");
        refetch();
      } else {
        toastError(response.message);
      }
    } catch (error) {
      toastError(error.message);
    }
  };
  return (
    <div className="bg-gray-200 h-fit">
      {managers.data?.length === 0 && (
        <div className="w-full flex flex-col justify-center items-center">
          <img src={EmptyBox} alt="empty box" />
          <p className="text-2xl">No manager now</p>
          <Button
            variant="contained"
            color="primary"
            startIcon={<HiOutlinePlus />}
            onClick={() => setShowAddManager(true)}
          >
            Add manager
          </Button>
        </div>
      )}
      {managers.data?.length > 0 && (
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
                    <p className="text-lg font-semibold">Total Manager</p>
                    <p className="text-2xl font-semibold">
                      {managers.data?.length}
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
                    <p className="text-lg font-semibold">Available Manager</p>
                    <p className="text-2xl font-semibold">
                      {totalActiveManagers}
                    </p>
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <div className="h-24 flex items-center justify-around bg-white rounded-lg">
                  <div className="bg-red-500 rounded-3xl p-2">
                    <HiOutlineXCircle size={40} />
                  </div>
                  <div className="flex flex-col ml-2">
                    <p className="text-lg font-semibold">Unavailable Manager</p>
                    <p className="text-2xl font-semibold">
                      {totalInactiveManagers}
                    </p>
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>
          <div className="flex flex-row justify-between items-center">
            <p className="mx-4 text-4xl font-semibold">Manager List</p>
            <div className="mx-4 p-2">
              {managers.data.length > 0 && (
                <div className="flex">
                  {/* <Button
                    variant="contained"
                    color="error"
                    startIcon={<HiOutlineTrash />}
                    sx={{ mx: 1 }}
                    onClick={() => setOpenPopUp(true)}
                    disabled={Object.keys(selectedManager).length === 0}
                  >
                    Delete manager
                  </Button> */}
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<HiOutlinePlus />}
                    sx={{ mx: 1 }}
                    onClick={() => setShowAddManager(true)}
                  >
                    Add manager
                  </Button>
                </div>
              )}
            </div>
          </div>
          {managers.data?.length > 0 && (
            <div className="m-4 w-fit">
              <form>
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
                  <IconButton
                    type="button"
                    sx={{ p: "10px" }}
                    aria-label="search"
                    onClick={handleClick}
                  >
                    <HiOutlineAdjustments />
                  </IconButton>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                      "aria-labelledby": "basic-button",
                    }}
                  >
                    <MenuItem onClick={() => handleClose("firstName")}>
                      First name
                    </MenuItem>
                    <MenuItem onClick={() => handleClose("phoneNumber")}>
                      Phone
                    </MenuItem>
                    <MenuItem onClick={() => handleClose("email")}>
                      Email
                    </MenuItem>
                  </Menu>
                </Paper>
              </form>
            </div>
          )}

          <div className="m-4 rounded-lg">
            {managers.data && managers.data?.length > 0 && (
              <CustomDataTable
                headData={headData}
                tableData={tableData}
                setSelectedData={setSelectedmanager}
                highlightedData={highlightedData}
              />
            )}
          </div>

          <Dialog
            open={openPopUp}
            onClose={() => setOpenPopUp(false)}
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
                  <p className="text-2xl">
                    Do you want to delete this manager?
                  </p>
                </DialogContentText>
              </DialogContent>
            </div>
            <DialogActions>
              <Button
                color="secondary"
                onClick={() => {
                  setOpenPopUp(false);
                }}
              >
                Cancel
              </Button>
              <Button
                color="error"
                variant="contained"
                onClick={() => removeManager()}
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
      {showAddManager && (
        <form onSubmit={handleSubmit2(createManager)}>
          <CustomDrawer
            id="addManagerDrawer"
            styles={{ width: "25%" }}
            showModel={showAddManager} // show drawer
            setShowModel={setShowAddManager} // set show drawer
            isFormFilled={isAddFormFilled} // check if form is filled to show submit button
            renderBody={
              // content of drawer
              <AddManager
                register={register2} // get the register function from useForm
                reset={reset2} // reset data after submit
                watch={watch2} // get value of each field when it change
                setValue={setValue2} // set value of each field
                onFormUpdate={(newState) => setIsAddFormFilled(newState)} // update form state to true if all fields are filled
                control={control2}
              />
            }
            message={{
              header: "Add Manager",
              primaryBtn: "Done", // text of submit button (show when isFormFilled is true)
            }}
          />
        </form>
      )}
    </div>
  );
};

export default Manager;
