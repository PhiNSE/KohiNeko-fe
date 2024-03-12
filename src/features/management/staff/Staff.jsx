import { useContext, useEffect, useState } from "react";
import { ManagerContext } from "../ManagerContext";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import Loader from "../../../components/Loader";
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
  HiChevronDown,
  HiOutlineCheck,
  HiOutlineCheckCircle,
  HiOutlinePlus,
  HiOutlineSearch,
  HiOutlineTrash,
  HiOutlineUserGroup,
  HiOutlineX,
  HiOutlineXCircle,
  HiPencil,
  HiPencilAlt,
} from "react-icons/hi";
import CustomDrawer from "../../../components/CustomDrawer";
import CustomDataTable from "../../../components/CustomDataTable";
import {
  addStaff,
  assignStaffToArea,
  deleteStaff,
  getStaffsByShop,
} from "../../../services/apiStaff";
import AddStaff from "./AddStaff";
import EmptyBox from "../../../assets/empty_box.png";
import AssignStaff from "./AssignStaff";
import FilterList from "../../../components/FilterList";
import { getAreaById } from "../../../services/apiArea";

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
      passwordChangedAt,
      passwordResetToken,
      passwordResetTokenExpires,
      __v,
      ...rest
    } = item;
    // const images = rest.images.map((image) => {
    //   return { _id: image._id, url: image.url, name: image.name };
    // });
    const area = areaStaffs[0]?.areaId.name || "No area assigned yet";
    // const catStatus = rest.catStatus[0]?.statusId.name || "";
    return { area, ...rest };
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

const filterData = [{ status: ["active", "inactive"] }];
const Staff = () => {
  const { coffeeShopId } = useContext(ManagerContext);
  const {
    isLoading,
    error,
    data: staffs,
    refetch,
  } = useQuery({
    queryKey: ["staffs", coffeeShopId],
    queryFn: () => getStaffsByShop(coffeeShopId),
  });
  const CreateStaff = useMutation({ mutationFn: addStaff });
  const AssignStaffToArea = useMutation({ mutationFn: assignStaffToArea });
  const DeleteStaff = useMutation({ mutationFn: deleteStaff });
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [showUpdateStaff, setShowUpdateStaff] = useState(false);
  const [showAssignArea, setShowAssignArea] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState({});
  const [filteredStaffs, setFilteredStaffs] = useState([]);
  const [openDeletePopUp, setOpenDeletePopUp] = useState(false);
  const [openDisablePopUp, setOpenDisablePopUp] = useState(false);
  const [isAddFormFilled, setIsAddFormFilled] = useState(false);
  const [isUpdateFormFilled, setIsUpdateFormFilled] = useState(false);
  const [isAssignAreaFormFilled, setIsAssignAreaFormFilled] = useState(false);

  const [staff, setStaff] = useState([]);
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
  // this form is for add staff
  const {
    register: register2,
    handleSubmit: handleSubmit2,
    reset: reset2,
    setValue: setValue2,
    watch: watch2,
    control: control2,
  } = useForm();
  // this form is for update staff
  const {
    register: register3,
    handleSubmit: handleSubmit3,
    reset: reset3,
    setValue: setValue3,
    watch: watch3,
    control: control3,
  } = useForm();
  // this form is for assign staff to area
  const {
    handleSubmit: handleSubmit4,
    reset: reset4,
    setValue: setValue4,
    watch: watch4,
    control: control4,
  } = useForm();

  //   useEffect(() => {
  //     reset3(selectedStaff);
  //   }, [selectedStaff, reset3]);

  useEffect(() => {
    reset4(selectedStaff);
  }, [selectedStaff, reset4]);

  useEffect(() => {
    console.log(searchBy, keyword);
    // const fetchData = async () => {
    //   const response = await SearchManager.mutateAsync([keyword, searchBy]);
    //   if (response.status === 200) {
    //     setTable(response.data);
    //   } else {
    //     toastError(response.message);
    //   }
    // };
    // fetchData();
  }, [keyword]);

  useEffect(() => {
    console.log(filter);
    setFilteredStaffs(
      staffs?.data?.filter((staff) => {
        for (const key in filter) {
          if (filter[key].length > 0) {
            if (filter[key] === staff[key]) {
              return staff;
            }
          }
        }
      })
    );
  }, [filter]);

  if (isLoading) return <Loader />;
  if (error) return "An error has occurred: " + error.message;

  const tableData = eliminateUnnecessaryKeys(
    ((staff ?? []).length === 0
      ? (filteredStaffs ?? []).length === 0
        ? staffs?.data || []
        : filteredStaffs
      : staff) || []
  );
  console.log(tableData);
  // const tableData = eliminateUnnecessaryKeys(data);
  const headData = extractKeys(tableData || []);

  const totalActiveStaffs = staffs.data?.reduce((sum, cat) => {
    if (cat.status === "active") {
      return sum + 1;
    }
    return sum;
  }, 0);
  const totalInactiveStaffs = staffs.data?.reduce((sum, cat) => {
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

  const createStaff = async (data) => {
    const payload = {
      ...data,
      dateOfBirth: data.dateOfBirth
        ? new Date(data.dateOfBirth).toISOString()
        : null,
    };
    const { images, areaId, startTime, endTime, ...rest } = payload;
    console.log(rest);
    try {
      const response = await CreateStaff.mutateAsync([coffeeShopId, rest]);
      if (response.status === 200) {
        toastSuccess("Create Staff successfully");
        refetch();
      } else {
        toastError(response.message);
      }
    } catch (error) {
      toastError(error.message);
    }
  };

  const assignStaff = async (data) => {
    const payload = {
      ...data,
      startTime: data.startTime ? new Date(data.startTime).toISOString() : null,
      endTime: data.endTime ? new Date(data.endTime).toISOString() : null,
    };
    const { areaId, startTime, endTime } = payload;
    console.log(payload);
    try {
      const response = await AssignStaffToArea.mutateAsync([
        areaId,
        selectedStaff._id,
        startTime,
        endTime,
      ]);
      if (response.message.includes("successfully")) {
        const area = await getAreaById([coffeeShopId, areaId]);
        setSelectedStaff((prevState) => ({
          ...prevState,
          area: area.data.name,
        }));
        toastSuccess("Assign staff to area successfully");
        refetch();
      } else {
        toastError(response.message);
      }
    } catch (error) {
      toastError(error.message);
    }
  };

  const removeStaff = async () => {
    setOpenDeletePopUp(false);
    try {
      const response = await DeleteStaff.mutateAsync(selectedStaff._id);
      if (response.status === 200) {
        toastSuccess("Delete Staff successfully");
        refetch();
      } else {
        toastError(response.message);
      }
    } catch (error) {
      toastError(error.message);
    }
  };

  const updateStaffStatus = async () => {
    setOpenDisablePopUp(false);
    // try {
    //   const response = await UpdateCatInfo.mutateAsync([
    //     { status: selectedStaff.status === "active" ? "inactive" : "active" },
    //     coffeeShopId,
    //     selectedStaff._id,
    //   ]);
    //   if (response.status === 200) {
    //     toastSuccess("Update Staff status successfully");
    //     setSelectedStaff((prevState) => ({
    //       ...prevState,
    //       status: prevState.status === "active" ? "inactive" : "active",
    //     }));
    //     refetch();
    //   } else {
    //     toastError(response.message);
    //   }
    // } catch (error) {
    //   toastError(error.message);
    // }
  };
  return (
    <div className="h-fit">
      {staffs.data?.length === 0 && (
        <div className="w-full flex flex-col justify-center items-center">
          <img src={EmptyBox} alt="empty box" />
          <Typography variant="h6">No staff now</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<HiOutlinePlus />}
            onClick={() => setShowAddStaff(true)}
          >
            Add staff
          </Button>
        </div>
      )}
      {coffeeShopId && staffs.data?.length > 0 && (
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
                    <p className="text-lg font-semibold">Total Staff</p>
                    <p className="text-2xl font-semibold">
                      {staffs.data?.length}
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
                    <p className="text-lg font-semibold">Active Staff</p>
                    <p className="text-2xl font-semibold">
                      {totalActiveStaffs}
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
                    <p className="text-lg font-semibold">Inactive Staff</p>
                    <p className="text-2xl font-semibold">
                      {totalInactiveStaffs}
                    </p>
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>
          <div className="flex flex-row justify-between items-center">
            <p className="mx-4 text-4xl font-semibold">Staff List</p>
            <div className="mx-4 p-2">
              {staffs.data.length > 0 && (
                <div className="flex">
                  <Button
                    variant="contained"
                    color={
                      selectedStaff.status === "active" ? "error" : "success"
                    }
                    startIcon={
                      selectedStaff.status === "active" ? (
                        <HiOutlineX />
                      ) : (
                        <HiOutlineCheck />
                      )
                    }
                    sx={{ mx: 1 }}
                    onClick={() => setOpenDisablePopUp(true)}
                    disabled={Object.keys(selectedStaff).length === 0}
                  >
                    {selectedStaff.status === "active"
                      ? "Disable staff"
                      : "Enable staff"}
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mx: 1 }}
                    startIcon={<HiPencil />}
                    onClick={() => setShowAssignArea(true)}
                    disabled={
                      Object.keys(selectedStaff).length === 0 ||
                      selectedStaff.status === "inactive"
                    }
                  >
                    Assign staff to area
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<HiOutlineTrash />}
                    sx={{ mx: 1 }}
                    onClick={() => setOpenDeletePopUp(true)}
                    disabled={Object.keys(selectedStaff).length === 0}
                  >
                    Delete staff
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<HiOutlinePlus />}
                    sx={{ mx: 1 }}
                    onClick={() => setShowAddStaff(true)}
                  >
                    Add staff
                  </Button>
                </div>
              )}

              {showAssignArea && (
                <form onSubmit={handleSubmit4(assignStaff)}>
                  <CustomDrawer
                    id="assignCatDrawer"
                    styles={{ width: "25%" }}
                    showModel={showAssignArea}
                    setShowModel={setShowAssignArea}
                    isFormFilled={isAssignAreaFormFilled}
                    renderBody={
                      <AssignStaff
                        watch={watch4}
                        setValue={setValue4}
                        onFormUpdate={(newState) =>
                          setIsAssignAreaFormFilled(newState)
                        }
                        selectedStaff={selectedStaff}
                        fromTo={
                          staffs.data[
                            staffs.data.findIndex(
                              (staff) => staff._id === selectedStaff._id
                            )
                          ]?.areaStaffs
                        }
                        control={control4}
                      />
                    }
                    message={{
                      header: "Assign Staff to area",
                      primaryBtn: "Done",
                    }}
                  />
                </form>
              )}
            </div>
          </div>
          {staffs.data?.length > 0 && (
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
                      <MenuItem onClick={() => handleClose("firstName")}>
                        First name
                      </MenuItem>
                      <MenuItem onClick={() => handleClose("username")}>
                        Username
                      </MenuItem>
                      <MenuItem onClick={() => handleClose("phoneNumber")}>
                        Phone
                      </MenuItem>
                      <MenuItem onClick={() => handleClose("email")}>
                        Email
                      </MenuItem>
                    </Menu>
                  </Paper>
                  <FilterList filterData={filterData} setValue={setValue1} />
                </div>
              </form>
            </div>
          )}
          <div className="m-4 rounded-lg">
            {staffs.data && staffs.data?.length > 0 && (
              <CustomDataTable
                headData={headData}
                tableData={tableData}
                selectedData={selectedStaff}
                setSelectedData={setSelectedStaff}
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
                  <p className="text-2xl">Do you want to delete this staff?</p>
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
                onClick={() => removeStaff()}
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
                  {selectedStaff.status === "active" ? "Disable" : "Enable"}{" "}
                  confirmation
                </p>
              </DialogTitle>
              <DialogContent className="flex flex-col items-center justify-center">
                <DialogContentText id="alert-dialog-description">
                  <p className="text-2xl">
                    {selectedStaff.status === "active"
                      ? "Disable is set staff status to inactive"
                      : "Enable is set staff status to active"}
                  </p>
                </DialogContentText>
                <DialogContentText id="alert-dialog-description">
                  <p className="text-2xl">
                    Do you want to{" "}
                    {selectedStaff.status === "active" ? "disable" : "enable"}{" "}
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
                color={selectedStaff.status === "active" ? "error" : "success"}
                variant="contained"
                onClick={() => updateStaffStatus()}
              >
                {searchBy.status === "active" ? "Disable" : "Enable"}
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
      {showAddStaff && (
        <form onSubmit={handleSubmit2(createStaff)}>
          <CustomDrawer
            id="addStaffDrawer"
            styles={{ width: "25%" }}
            showModel={showAddStaff} // show drawer
            setShowModel={setShowAddStaff} // set show drawer
            isFormFilled={isAddFormFilled} // check if form is filled to show submit button
            renderBody={
              // content of drawer
              <AddStaff
                register={register2} // get the register function from useForm
                reset={reset2} // reset data after submit
                watch={watch2} // get value of each field when it change
                setValue={setValue2} // set value of each field
                onFormUpdate={(newState) => setIsAddFormFilled(newState)} // update form state to true if all fields are filled
                control={control2}
              />
            }
            message={{
              header: "Add Staff",
              primaryBtn: "Done", // text of submit button (show when isFormFilled is true)
            }}
          />
        </form>
      )}
    </div>
  );
};

export default Staff;
