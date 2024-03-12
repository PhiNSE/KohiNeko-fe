import * as React from "react";
import { alpha } from "@mui/material/styles";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Typography,
  Paper,
  Checkbox,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  HiOutlineTrash,
  HiOutlineFilter,
  HiCheckCircle,
  HiXCircle,
} from "react-icons/hi";
import { DateFormater, DateTimeFormater } from "../utils/DateFormater";
import { HiPencilAlt } from "react-icons/hi";
import EmptyBox from "../assets/empty_box.png";
import Splide from "@splidejs/splide";
import { SplideSlide } from "@splidejs/react-splide";
import CarouselImgae from "./CarouselImgae";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
  const { onSelectAllClick, numSelected, rowCount, headData } = props;
  // const createSortHandler = (property) => (event) => {
  //   onRequestSort(event, property.toLowerCase());
  // };

  return (
    <TableHead>
      <TableRow>
        {/* <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell> */}
        {headData.map((headCell, idx) => (
          <TableCell
            key={idx}
            padding="normal"
            // sortDirection={orderBy === headCell ? order : false}
          >
            <TableSortLabel
              hideSortIcon="true"
              className="text-lg font-bold"
              // active={orderBy === headCell.toLowerCase()}
              // direction={orderBy === headCell.toLowerCase() ? order : "asc"}
              // onClick={createSortHandler(headCell)}
            >
              {headCell}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

// EnhancedTableHead.propTypes = {
//   numSelected: PropTypes.number.isRequired,
//   onRequestSort: PropTypes.func.isRequired,
//   onSelectAllClick: PropTypes.func.isRequired,
//   order: PropTypes.oneOf(["asc", "desc"]).isRequired,
//   orderBy: PropTypes.string.isRequired,
//   rowCount: PropTypes.number.isRequired,
//   headData: PropTypes.array.isRequired,
// };

function EnhancedTableToolbar(props) {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
        justifyContent: "space-between", // Add this line
      }}
    >
      {/* 
            {numSelected > 0 ? (
              <Tooltip title="Delete">
              <IconButton>
                  <HiOutlineTrash />
                  </IconButton>
              </Tooltip>
            ) : ( */}
      <Tooltip title="Filter list">
        <IconButton>
          <HiOutlineFilter />
        </IconButton>
      </Tooltip>
      {/* )} */}

      {numSelected > 0 ? (
        <Typography
          // sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : null}
    </Toolbar>
  );
}

// EnhancedTableToolbar.propTypes = {
//   numSelected: PropTypes.number.isRequired,
// };
const getHighlightedText = (text, highlight) => {
  // Split text on highlight term, include term itself into parts, ignore case
  const parts = text.split(new RegExp(`(${highlight})`, "gi"));
  return (
    <span>
      {parts.map((part, idx) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <b key={idx} className="bg-yellow-300">
            {part}
          </b>
        ) : (
          part
        )
      )}
    </span>
  );
};
const RenderRow = ({ row, key, highlightedData }) => {
  switch (key) {
    case "images":
      return (
        <TableCell align="left" key={key}>
          <div className="flex flex-row justify-start">
            {row[key].length !== 0 ? (
              // row[key].map((image, idx) => {
              // return (
              <div>
                <img
                  className="w-20 h-20 object-cover rounded-full"
                  src={row[key][0].url}
                  alt="Image"
                />
              </div>
            ) : (
              // );
              // )
              <div className="flex md:flex-row sm:flex-col">
                <Typography variant="h6">No image</Typography>
              </div>
            )}
          </div>
        </TableCell>
      );
    case "description":
      return (
        <TableCell align="left" key={key} className="w-1/4">
          <p className="text-lg font-semibold capitalize">
            {highlightedData?.searchBy === key &&
            row[key]
              .toLowerCase()
              .includes(highlightedData.keyword?.toLowerCase()) &&
            highlightedData.keyword !== "" ? (
              <span>
                {getHighlightedText(row[key], highlightedData.keyword)}
              </span>
            ) : (
              String(row[key]).slice(0, 50) + "..."
            )}
          </p>
        </TableCell>
      );
    case "email":
      return (
        <TableCell align="left" key={key}>
          <p className="text-lg font-semibold">
            {highlightedData?.searchBy === key &&
            row[key]
              .toLowerCase()
              .includes(highlightedData.keyword?.toLowerCase()) &&
            highlightedData.keyword !== "" ? (
              <span>
                {getHighlightedText(row[key], highlightedData.keyword)}
              </span>
            ) : (
              row[key]
            )}
          </p>
        </TableCell>
      );
    case "price":
      return (
        <TableCell align="left" key={key}>
          <p className="text-lg font-semibold">
            {highlightedData?.searchBy === key &&
            row[key]
              .toLocaleString("vi-VN")
              .includes(highlightedData.keyword) &&
            highlightedData.keyword !== "" ? (
              <span>
                {getHighlightedText(
                  row[key].toLocaleString("vi-VN"),
                  highlightedData.keyword
                )}
              </span>
            ) : (
              row[key].toLocaleString("vi-VN")
            )}
          </p>
        </TableCell>
      );
    case "status":
      return (
        <TableCell align="left" key={key}>
          <p
            className={`text-lg rounded-lg p-1 text-center font-semibold capitalize ${
              (row[key] === "active") || (row[key] === "available") ? "bg-lime-400" : "bg-red-500"
            }`}
          >
            {String(row[key])}
          </p>
        </TableCell>
      );
    case "isChildAllowed":
      return (
        <TableCell align="left" key={key}>
          <p
            className={`text-lg rounded-lg w-1/6 p-2 text-center font-semibold capitalize ${
              row[key] === true ? "bg-lime-400" : "bg-red-500"
            }`}
          >
            {row[key] === true ? "Yes" : "No"}
          </p>
        </TableCell>
      );
    case "createdAt":
    case "updatedAt":
    case "dateOfBirth":
    case "startAt":
    case "endAt":
    case "startTime":
    case "endTime":
      return (
        <TableCell align="left" key={key}>
          <p className="text-lg font-semibold">{DateFormater(row[key])}</p>
        </TableCell>
      );
    case "_id":
      break;
    default:
      return (
        <TableCell align="left" key={key}>
          <p className="text-lg font-semibold capitalize">
            {highlightedData?.searchBy === key &&
            String(row[key])
              .toLowerCase()
              .includes(highlightedData.keyword?.toLowerCase()) &&
            highlightedData.keyword !== "" ? (
              <span>
                {getHighlightedText(String(row[key]), highlightedData.keyword)}
              </span>
            ) : (
              String(row[key])
            )}
          </p>
        </TableCell>
      );
  }
};

export default function CustomDataTable({
  headData,
  tableData,
  selectedData,
  setSelectedData,
  highlightedData,
}) {
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  React.useEffect(() => {
    if (Object.keys(selectedData).length === 0) {
      setSelected([]);
    }
  }, [selectedData]);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = tableData.map((n) => n._id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  // const handleClick = (event, row) => {
  //   const selectedIndex = selected.indexOf(row._id);
  //   let newSelected = [];

  //   if (selectedIndex === -1) {
  //     newSelected = newSelected.concat(selected, row._id);
  //   } else if (selectedIndex === 0) {
  //     newSelected = newSelected.concat(selected.slice(1));
  //   } else if (selectedIndex === selected.length - 1) {
  //     newSelected = newSelected.concat(selected.slice(0, -1));
  //   } else if (selectedIndex > 0) {
  //     newSelected = newSelected.concat(
  //       selected.slice(0, selectedIndex),
  //       selected.slice(selectedIndex + 1)
  //     );
  //   }
  //   if (row._id !== selectedData._id) {
  //     if (Object.keys(selectedData).length === 0) {
  //       setSelectedData(row);
  //     }
  //   } else {
  //     setSelectedData({});
  //   }
  //   setSelected(newSelected);
  // };
  const handleClick = (event, row) => {
    if (selected.includes(row._id)) {
      // If the clicked row is already selected, unselect it
      setSelected([]);
      setSelectedData({});
    } else {
      // Otherwise, select the new row and update selectedData
      setSelected([row._id]);
      setSelectedData(row);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - tableData.length) : 0;
  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2, borderRadius: "10px" }}>
        {/* <EnhancedTableToolbar numSelected={selected.length} /> */}
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <EnhancedTableHead
              numSelected={selected.length}
              onSelectAllClick={handleSelectAllClick}
              rowCount={tableData.length}
              headData={headData}
            />
            <TableBody>
              {tableData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row._id);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row._id}
                      selected={isItemSelected}
                      sx={{ cursor: "pointer" }}
                    >
                      {/* <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </TableCell> */}
                      {Object.keys(row).map((key) =>
                        RenderRow({ row, key, highlightedData })
                      )}
                      {/* <TableCell align="left" className="w-30">
                        {selected.length === 1 && isItemSelected && (
                          <div>
                            <Tooltip title="Edit">
                              <IconButton
                                onClick={() => handleAction(row, "update")}
                              >
                                <HiPencilAlt />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                onClick={() => handleAction(row, "delete")}
                              >
                                <HiOutlineTrash />
                              </IconButton>
                            </Tooltip>
                          </div>
                        )}
                      </TableCell> */}
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={tableData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
