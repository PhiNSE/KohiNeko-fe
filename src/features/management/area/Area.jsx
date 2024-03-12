import {
  HiOutlinePlus,
  HiOutlineUserGroup,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineTrash,
  HiPencilAlt,
  HiPencil,
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
  IconButton,
} from "@mui/material";
import { set, useForm } from "react-hook-form";
// import CatTest from "../../../assets/CatTest.png";
import { useState, useEffect, useContext, useMemo } from "react";
import CustomDataTable from "../../../components/CustomDataTable";
import CustomDrawer from "../../../components/CustomDrawer";
import { useMutation, useQuery } from "@tanstack/react-query";
import Loader from "../../../components/Loader";
import EmptyBox from "../../../assets/empty_box.png";
import { ManagerContext } from "../ManagerContext";
import QuantityControl from "../../../components/QuantityControl";
import {
  toastError,
  toastSuccess,
  toastWarning,
} from "../../../components/Toast";
import { createAreaImage, deleteAreaImage } from "../../../services/apiImage";
import { DateTimeFormater } from "../../../utils/DateFormater";
import {
  createArea,
  deleteArea,
  getAreasInAShop,
  updateArea,
} from "../../../services/apiArea";
import UpdateArea from "./UpdateArea";
import AddArea from "./AddArea";
import {
  addTable,
  deleteTable,
  getAllTablesInArea,
  getTableTypesInShop,
} from "../../../services/apiTable";

const eliminateUnnecessaryKeys = (data) => {
  return data.map((item) => {
    const {
      coffeeShopId,
      isDeleted,
      areaCats,
      areaStaffs,
      updatedAt,
      createdAt,
      __v,
      ...rest
    } = item;
    const images = rest.images.map((image) => {
      return { _id: image._id, url: image.url, name: image.name };
    });
    return { images, ...rest };
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
        case "isChildAllowed":
          headTable.push("Child Allowed");
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
const Area = () => {
  const { coffeeShopId } = useContext(ManagerContext);
  const {
    isLoading,
    error,
    data: areas,
    refetch: refetchAreas,
  } = useQuery({
    queryKey: ["areas", coffeeShopId],
    queryFn: () => getAreasInAShop(coffeeShopId),
  });
  const [showAddArea, setShowAddArea] = useState(false);
  const [showUpdateArea, setShowUpdateArea] = useState(false);
  const [selectedArea, setSelectedArea] = useState({});
  const [openPopUp, setOpenPopUp] = useState(false);
  const [openTablePopUp, setOpenTablePopUp] = useState(false);
  const [isAddFormFilled, setIsAddFormFilled] = useState(false);
  const [isUpdateFormFilled, setIsUpdateFormFilled] = useState(false);
  const [isLoadTable, setIsLoadTable] = useState(false);
  const [tableTypes, setTableTypes] = useState([]);
  const [tables, setTables] = useState([]);
  const [selectedTableType, setSelectedTableType] = useState({});
  const [selectedTable, setSelectedTable] = useState({});
  const [quantity, setQuantity] = useState(1);
  const CreateArea = useMutation({ mutationFn: createArea });
  const CreateAreaImage = useMutation({ mutationFn: createAreaImage });
  const UpdateAreaInfo = useMutation({ mutationFn: updateArea });
  const DeleteArea = useMutation({ mutationFn: deleteArea });
  const DeleteAreaImage = useMutation({ mutationFn: deleteAreaImage });
  const GetTableTypesInShop = useMutation({ mutationFn: getTableTypesInShop });
  const GetTablesInArea = useMutation({ mutationFn: getAllTablesInArea });
  const CreateTable = useMutation({ mutationFn: addTable });
  const DeleteTable = useMutation({ mutationFn: deleteTable });
  // this form is for add table
  const { register: register1, handleSubmit: handleSubmit1 } = useForm();

  // this form is for add area
  const {
    register: register2,
    handleSubmit: handleSubmit2,
    reset: reset2,
    setValue: setValue2,
    watch: watch2,
    control: control2,
  } = useForm();
  // this form is for update area
  const {
    register: register3,
    handleSubmit: handleSubmit3,
    reset: reset3,
    setValue: setValue3,
    watch: watch3,
    control: control3,
  } = useForm();

  useEffect(() => {
    reset3(selectedArea);
  }, [selectedArea, reset3]);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedArea) {
        try {
          const tableTypes = await GetTableTypesInShop.mutateAsync(
            coffeeShopId
          );
          if (tableTypes.status === 200) {
            setTableTypes(tableTypes.data);
          } else {
            console.log(tableTypes.message);
          }
          const tables = await GetTablesInArea.mutateAsync([selectedArea._id]);
          if (tables.status === 200) {
            setTables(tables.data);
          } else {
            console.log(tables.message);
          }
          setSelectedTableType({});
        } catch (error) {
          toastError(error.message);
        }
      }
    };

    fetchData();
  }, [selectedArea, isLoadTable]);

  if (isLoading) return <Loader />;
  if (error) return "An error has occurred: " + error.message;

  const tableData = eliminateUnnecessaryKeys(areas.data || []);
  // const tableData = eliminateUnnecessaryKeys(data);
  const headData = extractKeys(tableData || []);

  const addNewArea = async (data) => {
    const { images, ...rest } = data;
    const payload = {
      ...rest,
      coffeeShopId: coffeeShopId,
    };
    console.log(payload);
    try {
      const response = await CreateArea.mutateAsync([coffeeShopId, payload]);
      if (response.status === 200) {
        if (images.length > 0) {
          const res = await CreateAreaImage.mutateAsync([
            coffeeShopId,
            response.data._id,
            images,
          ]);
          if (res.status === 200) {
            toastSuccess("Create area successfully!");
            refetchAreas();
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

  const editArea = async (data) => {
    const { _id, images, createdAt, isDeleted, updatedAt, __v, ...rest } = data;
    console.log(rest);
    try {
      const filterImages = selectedArea.images.filter((image) =>
        images.includes(image.url)
      );
      if (filterImages.length === 0) {
        const res = await DeleteAreaImage.mutateAsync([
          coffeeShopId,
          selectedArea._id,
          selectedArea.images[0]._id,
        ]);
        if (res.status === 200) {
          console.log("Delete image successfully");
        } else {
          toastError(res.message);
        }
        if (images.length > 0) {
          const res = await CreateAreaImage.mutateAsync([
            coffeeShopId,
            selectedArea._id,
            images,
          ]);
          if (res.status === 200) {
            console.log("Create image successfully");
          } else {
            toastError(res.message);
          }
        }
      }
      const newInfo = Object.keys(rest).filter((key) => {
        return rest[key] !== selectedArea[key];
      });
      if (newInfo.length > 0) {
        const response = await UpdateAreaInfo.mutateAsync([
          rest,
          coffeeShopId,
          _id,
        ]);
        if (response.status === 200) {
          console.log("Update area successfully");
        } else {
          toastError(response.message);
        }
      }
      toastSuccess("Update area successfully");
      setSelectedArea({});
      refetchAreas();
    } catch (error) {
      toastError(error.message);
    }
  };

  const removeArea = async () => {
    setOpenPopUp(false);
    try {
      if (selectedArea.images.length > 0) {
        selectedArea.images.map(async (image) => {
          const res = await DeleteAreaImage.mutateAsync([
            coffeeShopId,
            selectedArea._id,
            image._id,
          ]);
          if (res.status === 200) {
            console.log("Delete image successfully");
          } else {
            toastError(res.message);
          }
        });
      }
      const response = await DeleteArea.mutateAsync([
        coffeeShopId,
        selectedArea._id,
      ]);
      if (response.status === 200) {
        toastSuccess("Delete Area successfully");
        refetchAreas();
      } else {
        toastError(response.message);
      }
    } catch (error) {
      toastError(error.message);
    }
  };

  const createTable = async (data) => {
    const payload = {
      ...data,
      quantity: quantity,
    };
    console.log(payload);
    try {
      const response = await CreateTable.mutateAsync([
        selectedArea._id,
        selectedTableType._id,
        payload,
      ]);
      if (response.status === 201 || response.message === "Success") {
        toastSuccess("Create table successfully");
        setIsLoadTable(!isLoadTable);
      }
    } catch (error) {
      toastError(error.message);
    }
  };

  const removeTable = async () => {
    setOpenTablePopUp(false);
    try {
      const response = await DeleteTable.mutateAsync(selectedTable._id);
      if (response.status === 200) {
        toastSuccess("Delete table successfully");
        setIsLoadTable(!isLoadTable);
      } else {
        toastError(response.message);
      }
    } catch (error) {
      toastError(error.message);
    }
  };

  const handleClick = (tableType) => {
    if (selectedTableType._id === tableType._id) {
      setSelectedTableType({});
    } else {
      setSelectedTableType(tableType);
    }
  };
  return (
    <div className="h-fit">
      {areas.data?.length === 0 && (
        <div className="w-full flex flex-col justify-center items-center">
          <img src={EmptyBox} alt="empty box" />
          <Typography variant="h6">No Area now</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<HiOutlinePlus />}
            onClick={() => setShowAddArea(true)}
          >
            Add Area
          </Button>
        </div>
      )}
      {coffeeShopId && areas.data?.length > 0 && (
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
                    <p className="text-lg font-semibold">Total Cat</p>
                    <p className="text-2xl font-semibold">
                      {areas.data?.length}
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
          <div className="h-96 mx-4 my-2 bg-white rounded-lg">
            <p className="m-2 text-3xl font-semibold">Table type</p>
            <div className="flex flex-row flex-wrap">
              {Object.keys(selectedArea).length > 0 &&
                tableTypes?.map((tableType, idx) => (
                  <div
                    key={idx}
                    className={`mx-4 p-4 cursor-pointer rounded-3xl border-2 border-gray-300 ${
                      selectedTableType._id === tableType._id
                        ? "bg-orange-100"
                        : ""
                    } hover:border-orange-500 hover:shadow-lg w-1/4`}
                    onClick={() => handleClick(tableType)}
                  >
                    <p className="text-xl font-semibold">{tableType.name}</p>
                    <div className="h-40 overflow-y-scroll">
                      {tables && tables?.length > 0 ? (
                        tables
                          .filter(
                            (table) => table.tableTypeId === tableType._id
                          )
                          .map((table, idx) => (
                            <div
                              key={table._id}
                              className="flex justify-between items-center m-2 p-2 rounded-lg"
                            >
                              <p>Table {idx + 1}</p>
                              <IconButton
                                disabled={
                                  selectedTableType._id !== tableType._id
                                }
                                // size="small"
                                color="error"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenTablePopUp(true);
                                  setSelectedTable(table);
                                }}
                              >
                                <HiOutlineTrash />
                              </IconButton>
                              {/* {selectedTableType._id === tableType._id && (
                                <HiOutlineTrash
                                  disabled={
                                    Object.keys(selectedTableType).length === 0
                                  }
                                  size={20}
                                  color="red"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenTablePopUp(true);
                                    setSelectedTable(table);
                                  }}
                                />
                              )} */}
                            </div>
                          ))
                      ) : (
                        <p>No table</p>
                      )}
                    </div>
                    {selectedTableType._id === tableType._id && (
                      <form onSubmit={handleSubmit1(createTable)}>
                        <div className="my-2">
                          <QuantityControl
                            value={quantity || 1}
                            onIncrement={(e) => {
                              e.stopPropagation();
                              setQuantity(Math.min((quantity || 1) + 1, 5));
                            }}
                            onDecrement={(e) => {
                              e.stopPropagation();
                              setQuantity(Math.max((quantity || 1) - 1, 1));
                            }}
                          />
                          <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            fullWidth
                            startIcon={<HiOutlinePlus />}
                            onClick={(e) => e.stopPropagation()}
                          >
                            Add table
                          </Button>
                        </div>
                      </form>
                    )}
                  </div>
                ))}
            </div>
          </div>

          {/* filter bar */}
          <div className="flex flex-row justify-between items-center">
            <p className="mx-4 text-4xl font-semibold">Area List</p>
            <div className="mx-4 p-2">
              {areas.data.length > 0 && (
                <div className="flex">
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<HiPencilAlt />}
                    sx={{ mx: 1 }}
                    onClick={() => setShowUpdateArea(true)}
                    disabled={Object.keys(selectedArea).length === 0}
                  >
                    Update area
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<HiOutlineTrash />}
                    sx={{ mx: 1 }}
                    onClick={() => setOpenPopUp(true)}
                    disabled={Object.keys(selectedArea).length === 0}
                  >
                    Delete area
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<HiOutlinePlus />}
                    sx={{ mx: 1 }}
                    onClick={() => setShowAddArea(true)}
                  >
                    Add area
                  </Button>
                </div>
              )}

              {showUpdateArea && (
                <form onSubmit={handleSubmit3(editArea)}>
                  <CustomDrawer
                    id="updateCatDrawer"
                    styles={{ width: "25%" }}
                    showModel={showUpdateArea}
                    setShowModel={setShowUpdateArea}
                    isFormFilled={isUpdateFormFilled}
                    renderBody={
                      <UpdateArea
                        register={register3}
                        watch={watch3}
                        setValue={setValue3}
                        onFormUpdate={(newState) =>
                          setIsUpdateFormFilled(newState)
                        }
                        selectedArea={selectedArea}
                        control={control3}
                      />
                    }
                    message={{
                      header: "Update Area",
                      primaryBtn: "Done",
                    }}
                  />
                </form>
              )}
            </div>
          </div>

          <div className="m-4 rounded-lg">
            {areas.data && areas.data.length > 0 && (
              <CustomDataTable
                headData={headData}
                tableData={tableData}
                selectedData={selectedArea}
                setSelectedData={setSelectedArea}
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
                  <p className="text-2xl">Do you want to delete this area?</p>
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
                onClick={() => removeArea()}
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={openTablePopUp}
            onClose={() => setOpenTablePopUp(false)}
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
                  <p className="text-2xl">Do you want to delete this table?</p>
                </DialogContentText>
              </DialogContent>
            </div>
            <DialogActions>
              <Button
                color="secondary"
                onClick={() => {
                  setOpenTablePopUp(false);
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
      {showAddArea && (
        <form onSubmit={handleSubmit2(addNewArea)}>
          <CustomDrawer
            id="addAreaDrawer"
            styles={{ width: "25%" }}
            showModel={showAddArea} // show drawer
            setShowModel={setShowAddArea} // set show drawer
            isFormFilled={isAddFormFilled} // check if form is filled to show submit button
            renderBody={
              // content of drawer
              <AddArea
                register={register2} // get the register function from useForm
                reset={reset2} // reset data after submit
                watch={watch2} // get value of each field when it change
                setValue={setValue2} // set value for image field (if form don't contain image field, this line can be removed)
                onFormUpdate={(newState) => setIsAddFormFilled(newState)} // update form state to true if all fields are filled
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

export default Area;
