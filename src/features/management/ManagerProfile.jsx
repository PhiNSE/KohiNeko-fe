import { Avatar, Button, Grid, TextField, Typography } from "@mui/material";
import { DateFormater } from "../../utils/DateFormater";
import { useNavigate } from "react-router-dom";

const ManagerProfile = () => {
  const user = JSON.parse(localStorage.getItem("user")) || null;
  const navigate = useNavigate();
  return (
    <div className="m-2">
      <div className="flex flex-col items-center">
        <Avatar
          alt="Remy Sharp"
          sx={{ width: 56, height: 56 }}
          src={user.avatar}
        />
        <Typography variant="h4">{user.username}</Typography>
      </div>
      <div className="my-2 px-6 py-4 border-solid border-2 rounded-large">
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5">First Name</Typography>
            <TextField
              defaultValue={user.firstName}
              color="warning"
              variant="standard"
              fullWidth
              focused
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h5">Last Name</Typography>
            <TextField
              defaultValue={user.lastName}
              color="warning"
              variant="standard"
              fullWidth
              focused
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h5">Email</Typography>
            <TextField
              defaultValue={user.email}
              color="warning"
              variant="standard"
              fullWidth
              focused
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h5">Gender</Typography>
            <TextField
              defaultValue={user.gender}
              color="warning"
              variant="standard"
              fullWidth
              focused
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h5">Date of Birth</Typography>
            <TextField
              defaultValue={DateFormater(user.dateOfBirth)}
              color="warning"
              variant="standard"
              fullWidth
              focused
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h5">Phone</Typography>
            <TextField
              defaultValue={user.phoneNumber}
              color="warning"
              variant="standard"
              fullWidth
              focused
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default ManagerProfile;
