import {
  Button,
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Menu,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import {
  HiChevronDown,
  HiChevronUp,
  HiMinus,
  HiOutlineAdjustments,
  HiOutlineFilter,
  HiPencil,
  HiPlus,
} from "react-icons/hi";

const FilterList = ({ filterData, setValue }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filter, setFilter] = useState({});
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
    setValue("filter", {});
  };

  const handleOpenItem = (item) => {
    if (item === selectedItem) {
      setSelectedItem(null);
    } else {
      setSelectedItem(item);
    }
  };

  const handleChooseFilter = (key, value) => {
    setValue("filter", { [key]: value });
    setFilter(value);
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        variant="contained"
        startIcon={<HiOutlineFilter />}
        onClick={handleClick}
      >
        Filter by {selectedItem && Object.keys(selectedItem)}
      </Button>
      <Menu
        id="lock-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {filterData.map((item, index) => (
          <MenuItem
            key={index}
            disableRipple
            sx={{ "&:hover": { backgroundColor: "transparent" } }}
          >
            <List>
              <ListItemButton onClick={() => handleOpenItem(item)}>
                <ListItemIcon>
                  <HiPencil />
                </ListItemIcon>
                <ListItemText primary={Object.keys(item)} />
                {selectedItem === item ? <HiChevronDown /> : <HiChevronUp />}
              </ListItemButton>
              <Collapse in={selectedItem === item} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {Object.values(item)[0].map((subItem, subIndex) => (
                    <ListItemButton
                      key={subIndex}
                      selected={filter === subItem}
                      sx={{ pl: 4 }}
                      onClick={() =>
                        handleChooseFilter(Object.keys(item), subItem)
                      }
                    >
                      <ListItemIcon>
                        <HiPlus />
                      </ListItemIcon>
                      <ListItemText primary={subItem} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            </List>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default FilterList;
