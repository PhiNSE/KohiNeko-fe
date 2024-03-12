import {
  HiOutlinePlus,
  HiOutlineUserGroup,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineTrash,
  HiPencilAlt,
  HiPencil,
  HiOutlineSearch,
  HiOutlineAdjustments,
  HiChevronDown,
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
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  addCat,
  assignCatToArea,
  deleteCat,
  getCatByShop,
  updateCat,
} from "../../../services/apiCat";
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
import {
  addTableType,
  deleteTableType,
  getTableTypesInShop,
  updateTableType,
} from "../../../services/apiTable";
import AddTable from "./AddTable";
import UpdateTable from "./UpdateTable";

const eliminateUnnecessaryKeys = (data) => {
  return data.map((item) => {
    const {
      coffeeShopId,
      isDeleted,
      updatedAt,
      createdAt,
      __v,
      tableIds,
      ...rest
    } = item;
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
        case "name":
          headTable.push("Name");
          break;
        case "tableCount":
          headTable.push("Total Tables");
          break;
        case "minNumberOfSeats":
          headTable.push("Min Seats");
          break;
        case "maxNumberOfSeats":
          headTable.push("Max Seats");
          break;
        case "price":
          headTable.push("Price (VND)");
          break;
        default:
          break;
      }
    }
  }
  return headTable;
};
const Table = () => {
  const { coffeeShopId } = useContext(ManagerContext);
  const {
    isLoading,
    error,
    data: tables,
    refetch,
  } = useQuery({
    queryKey: ["tables", coffeeShopId],
    queryFn: () => getTableTypesInShop(coffeeShopId),
  });
  const CreateTable = useMutation({ mutationFn: addTableType });
  //   const AssignCatToArea = useMutation({ mutationFn: assignCatToArea });
  const UpdateTableInfo = useMutation({ mutationFn: updateTableType });
  const DeleteTable = useMutation({ mutationFn: deleteTableType });
  const [showAddTable, setShowAddTable] = useState(false);
  const [showUpdateTable, setShowUpdateTable] = useState(false);
  const [showAssignArea, setShowAssignArea] = useState(false);
  const [selectedTable, setSelectedTable] = useState({});
  const [openPopUp, setOpenPopUp] = useState(false);
  const [isAddFormFilled, setIsAddFormFilled] = useState(false);
  const [isUpdateFormFilled, setIsUpdateFormFilled] = useState(false);
  const [isAssignAreaFormFilled, setIsAssignAreaFormFilled] = useState(false);

  const [table, setTable] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const open = Boolean(anchorEl);
  const [searchBy, setSearchBy] = useState("name");
  // this form is for search
  const {
    register: register1,
    handleSubmit: handleSubmit1,
    watch: watch1,
  } = useForm();
  const keyword = watch1("keyword");
  // this form is for add table
  const {
    register: register2,
    handleSubmit: handleSubmit2,
    reset: reset2,
    setValue: setValue2,
    watch: watch2,
    control: control2,
  } = useForm();
  // this form is for update table
  const {
    register: register3,
    handleSubmit: handleSubmit3,
    reset: reset3,
    setValue: setValue3,
    watch: watch3,
    control: control3,
  } = useForm();
  // this form is for assign table to area
  const {
    handleSubmit: handleSubmit4,
    reset: reset4,
    setValue: setValue4,
    watch: watch4,
    control: control4,
  } = useForm();

  useEffect(() => {
    reset3(selectedTable);
  }, [selectedTable, reset3]);

  useEffect(() => {
    reset4(selectedTable);
  }, [selectedTable, reset4]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const response = await SearchManager.mutateAsync([keyword, searchBy]);
  //     if (response.status === 200) {
  //       setTable(response.data);
  //     } else {
  //       toastError(response.message);
  //     }
  //   };
  //   fetchData();
  // }, [keyword]);

  if (isLoading) return <Loader />;
  if (error) return "An error has occurred: " + error.message;

  const tableData = eliminateUnnecessaryKeys(
    table.length === 0 ? tables.data || [] : table
  );
  // const tableData = eliminateUnnecessaryKeys(data);
  const headData = extractKeys(tableData || []);

  const totalActiveCats = tables.data?.reduce((sum, cat) => {
    if (cat.status === "active") {
      return sum + 1;
    }
    return sum;
  }, 0);
  const totalInactiveCats = tables.data?.reduce((sum, cat) => {
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

  const createTable = async (data) => {
    const payload = {
      ...data,
      coffeeShopId: coffeeShopId,
    };
    console.log(payload);
    try {
      const response = await CreateTable.mutateAsync(payload);
      if (response.status === 200) {
        toastSuccess("Create Table successfully");
        // reset2({
        //   name: null,
        //   price: null,
        //   minNumberOfSeats: null,
        //   maxNumberOfSeats: null,
        // });
        refetch();
      } else {
        toastError(response.message);
      }
    } catch (error) {
      toastError(error.message);
    }
  };

  const editTable = async (data) => {
    const payload = {
      ...data,
      coffeeShopId: coffeeShopId,
    };
    console.log(payload);
    try {
      const response = await UpdateTableInfo.mutateAsync(payload);
      if (response.status === 200) {
        toastSuccess("Update Table successfully");
        setSelectedTable({});
        refetch();
      } else {
        toastError(response.message);
      }
    } catch (error) {
      toastError(error.message);
    }
  };

  //   const assignCat = async (data) => {
  //     const payload = {
  //       ...data,
  //       startTime: new Date().toISOString(),
  //       endTime: data.endTime ? new Date(data.endTime).toISOString() : null,
  //     };
  //     const { areaId, startTime, endTime } = payload;
  //     try {
  //       const response = await AssignCatToArea.mutateAsync([
  //         areaId,
  //         selectedTable._id,
  //         startTime,
  //         endTime,
  //       ]);
  //       if (response.status === 200) {
  //         toastSuccess("Assign cat to area successfully");
  //         refetch();
  //       } else {
  //         toastError(response.message);
  //       }
  //     } catch (error) {
  //       toastError(error.message);
  //     }
  //   };

  const removeTable = async () => {
    setOpenPopUp(false);
    try {
      const response = await DeleteTable.mutateAsync(selectedTable._id);
      if (response.status === 200) {
        toastSuccess("Delete Table successfully");
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
      {tables.data?.length === 0 && (
        <div className="w-full flex flex-col justify-center items-center">
          <img src={EmptyBox} alt="empty box" />
          <Typography variant="h6">No Table now</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<HiOutlinePlus />}
            onClick={() => setShowAddTable(true)}
          >
            Add Table
          </Button>
        </div>
      )}
      {coffeeShopId && tables.data?.length > 0 && (
        <>
          {/* Overall statistic */}
          {/* <div className="mx-4 my-2">
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6} md={4}>
                <div className="h-24 flex items-center justify-around bg-white rounded-lg">
                  <div className="p-2 bg-orange-200 rounded-3xl">
                    <HiOutlineUserGroup size={40} />
                  </div>
                  <div className="flex flex-col ml-2">
                    <p className="text-lg font-semibold">Total Table</p>
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
                    <p className="text-lg font-semibold">Available Cat</p>
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
                    <p className="text-lg font-semibold">Unavailable Cat</p>
                    <p className="text-2xl font-semibold">
                      {totalInactiveCats}
                    </p>
                  </div>
                </div>
              </Grid>
            </Grid>
          </div> */}
          <div className="flex flex-row justify-between items-center">
            <p className="mx-4 text-4xl font-semibold">Table type List</p>
            <div className="mx-4 p-2">
              {tables.data?.length > 0 && (
                <div className="flex">
                  {/* <Button
                    variant="contained"
                    color="primary"
                    sx={{ mx: 1 }}
                    startIcon={<HiPencil />}
                    onClick={() => setShowAssignArea(true)}
                    disabled={Object.keys(selectedTable).length === 0}
                  >
                    Assign cat to area
                  </Button> */}
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<HiPencilAlt />}
                    sx={{ mx: 1 }}
                    onClick={() => setShowUpdateTable(true)}
                    disabled={Object.keys(selectedTable).length === 0}
                  >
                    Update table type
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<HiOutlineTrash />}
                    sx={{ mx: 1 }}
                    onClick={() => setOpenPopUp(true)}
                    disabled={Object.keys(selectedTable).length === 0}
                  >
                    Delete table type
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<HiOutlinePlus />}
                    sx={{ mx: 1 }}
                    onClick={() => setShowAddTable(true)}
                  >
                    Add table type
                  </Button>
                </div>
              )}

              {showUpdateTable && (
                <form onSubmit={handleSubmit3(editTable)}>
                  <CustomDrawer
                    id="updateTableDrawer"
                    styles={{ width: "25%" }}
                    showModel={showUpdateTable}
                    setShowModel={setShowUpdateTable}
                    isFormFilled={isUpdateFormFilled}
                    renderBody={
                      <UpdateTable
                        register={register3}
                        watch={watch3}
                        setValue={setValue3}
                        onFormUpdate={(newState) =>
                          setIsUpdateFormFilled(newState)
                        }
                        selectedTable={selectedTable}
                        control={control3}
                      />
                    }
                    message={{
                      header: "Update Table Type",
                      primaryBtn: "Done",
                    }}
                  />
                </form>
              )}

              {/* {showAssignArea && (
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
                        selectedCat={selectedTable}
                        fromTo={
                          cats.data[
                            cats.data.findIndex(
                              (cat) => cat._id === selectedTable._id
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
              )} */}
            </div>
          </div>
          {tables.data?.length > 0 && (
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
                  {/* <IconButton
                    type="button"
                    sx={{ p: "10px" }}
                    aria-label="search"
                    onClick={handleClick}
                  >
                    <HiOutlineAdjustments />
                  </IconButton> */}
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
                  </Menu>
                </Paper>
              </form>
            </div>
          )}
          <div className="m-4 rounded-lg">
            {tables.data && tables.data.length > 0 && (
              <CustomDataTable
                headData={headData}
                tableData={tableData}
                selectedData={selectedTable}
                setSelectedData={setSelectedTable}
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
                    Do you want to delete this table type?
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
                onClick={() => removeTable()}
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
      {showAddTable && (
        <form onSubmit={handleSubmit2(createTable)}>
          <CustomDrawer
            id="addTableDrawer"
            styles={{ width: "25%" }}
            showModel={showAddTable} // show drawer
            setShowModel={setShowAddTable} // set show drawer
            isFormFilled={isAddFormFilled} // check if form is filled to show submit button
            renderBody={
              // content of drawer
              <AddTable
                register={register2} // get the register function from useForm
                reset={reset2} // reset data after submit
                watch={watch2} // get value of each field when it change
                setValue={setValue2} // set value for image field (if form don't contain image field, this line can be removed)
                onFormUpdate={(newState) => setIsAddFormFilled(newState)} // update form state to true if all fields are filled
              />
            }
            message={{
              header: "Add Table Type",
              primaryBtn: "Done", // text of submit button (show when isFormFilled is true)
            }}
          />
        </form>
      )}
    </div>
  );
};

export default Table;
