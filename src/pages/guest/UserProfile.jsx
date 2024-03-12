import { Avatar, Select, MenuItem, TextField, FormLabel } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Button from "../../components/Button";
import { MdModeEdit } from "react-icons/md";
import { useEffect, useState } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { updateUserProfile } from "../../services/apiUser";
import { useForm } from "react-hook-form";
import { toastError } from "../../components/Toast";
const UserProfile = () => {
  // const user = JSON.parse(localStorage.getItem('user')) || null;
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [updatedUser, setUpdatedUser] = useState(user);
  const queryClient = useQueryClient();

  const date = new Date(user.dateOfBirth);
  const month = date.toLocaleString("default", { month: "long" });
  const day = date.getDate();
  const year = date.getFullYear();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDate, handleDateChange] = useState(dayjs(user.dateOfBirth));
  console.log(updatedUser);
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: user,
  });

  useEffect(() => {
    if (user) {
      for (const key in user) {
        setValue(key, user[key]);
      }
    }
  }, [user, setValue]);

  const handleUpdateUser = async (isEditing) => {
    console.log("user", user);
    try {
      const result = await updateUserProfile(user._id, user);
      if (result.status === "fail") {
        toastError(result.message);
      } else {
        setIsEditing(isEditing);
        localStorage.setItem("user", JSON.stringify(user));
      }
    } catch (error) {
      toastError("Failed to update user profile");
    }
  };
  return (
    <div className="grid grid-cols-[1fr_4fr]">
      {/* Avatar + Usernames */}
      <div className="flex flex-col bg-gray-200 justify-center items-center gap-2">
        <Avatar alt="Remy Sharp" sx={{ width: 80, height: 80 }} />
        {/* {isEditing ? (
          <TextField
            value={user.username}
            disabled={true}
            onChange={(event) =>
              setUser((prevUser) => ({
                ...prevUser,
                username: event.target.value,
              }))
            }
            style={{ height: "1.5rem" }}
          />
        ) : ( */}
        <h1 className="text-xl">{user.username}</h1>
        {/* )} */}
      </div>
      {/* Other info  */}
      <div className="bg-orange-50 px-5 py-4">
        <h2 className="font-semibold">User Profile</h2>
        <div className="grid grid-cols-2 gap-9 mt-5 max-w-5xl">
          <div className="px-2 flex flex-col gap-7">
            <TextField
              id="outlined-read-only-input"
              label="First Name"
              defaultValue={user.firstName}
              disabled={!isEditing}
              fullWidth
              onChange={(event) =>
                setUser((prevUser) => ({
                  ...prevUser,
                  firstName: event.target.value,
                }))
              }
              sx={{ "&.Mui-disabled": { color: "rgba(0, 0, 0, 0.6)" } }}
            />
            <TextField
              id="outlined-read-only-input"
              label="Email"
              defaultValue={user.email}
              onChange={(event) =>
                setUser((prevUser) => ({
                  ...prevUser,
                  email: event.target.value,
                }))
              }
              disabled={!isEditing}
              fullWidth
              sx={{ "&.Mui-disabled": { color: "rgba(0, 0, 0, 0.6)" } }}
            />
            <TextField
              id="outlined-read-only-input"
              label="Phone number"
              defaultValue={user.phoneNumber}
              onChange={(event) =>
                setUser((prevUser) => ({
                  ...prevUser,
                  phoneNumber: event.target.value,
                }))
              }
              disabled={!isEditing}
              fullWidth
              sx={{ "&.Mui-disabled": { color: "rgba(0, 0, 0, 0.6)" } }}
            />
          </div>

          <div className="px-2 flex flex-col gap-7">
            <TextField
              id="outlined-read-only-input"
              label="Last Name"
              defaultValue={user.lastName}
              disabled={!isEditing}
              fullWidth
              sx={{ "&.Mui-disabled": { color: "rgba(0, 0, 0, 0.6)" } }}
            />
            <div className="flex flex-col">
              <FormLabel component="legend">Gender</FormLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                color="warning"
                margin="normal"
                required
                disabled={!isEditing}
                sx={{ "&.Mui-disabled": { color: "rgba(0, 0, 0, 0.6)" } }}
                value={user.gender}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </Select>
            </div>

            <div className="flex flex-col">
              <FormLabel component="legend">Date of birth</FormLabel>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={selectedDate}
                  onChange={handleDateChange}
                  disabled={true}
                  InputProps={{
                    readOnly: true,
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      InputProps={{
                        readOnly: true,
                      }}
                      disabled={true}
                      sx={{ "&.Mui-disabled": { color: "rgba(0, 0, 0, 0.6)" } }}
                    />
                  )}
                />
              </LocalizationProvider>
            </div>
          </div>
        </div>
        <div className="mt-[5rem] flex justify-between max-w-5xl">
          {!isEditing && (
            <Button
              type="small"
              levelType="primary"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
          )}
          {isEditing && (
            <Button
              type="small"
              levelType="secondary"
              onClick={() => handleUpdateUser(false)}
            >
              Save Changes
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
