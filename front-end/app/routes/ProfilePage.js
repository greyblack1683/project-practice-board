import React, { useState, useEffect, useContext } from "react";
import Page from "../components/Page";
import { Box, TextField, Button, Typography } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import axios from "axios";
import GlobalContext from "../components/GlobalContext";

function ProfileEdit({ setIsEditing, email, setEditRequest }) {
  const { handleAlerts } = useContext(GlobalContext);
  const [newEmail, setNewEmail] = useState(email);
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await axios.post("/profile/update", {
        email: newEmail,
        password: newPassword
      });
      console.log(response);
      if (response.data) {
        handleAlerts("Email and/or password is updated!", true);
        setEditRequest(prev => prev + 1);
        setIsEditing(false);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      handleAlerts(error.response.data.message, false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box display="flex" sx={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        <Box display="flex" sx={{ "& .MuiTextField-root": { m: "0.5rem", width: "15rem" }, flexDirection: "column" }} noValidate autoComplete="off">
          <TextField id="outlined" label="Email" value={newEmail} onChange={e => setNewEmail(e.target.value)} />
          <TextField id="outlined-password-input" label="Password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
        </Box>
        <Box display="flex" sx={{ justifyContent: "center", alignItems: "center", mt: "2rem" }}>
          <Button variant="contained" type="submit" sx={{ mr: "1rem" }}>
            Save
          </Button>
          <Button onClick={() => setIsEditing(false)} variant="contained" color="error">
            Cancel
          </Button>
        </Box>
      </Box>
    </form>
  );
}
function ProfileView({ setIsEditing, email }) {
  return (
    <Box display="flex" sx={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
      <Box display="flex" sx={{ "& .MuiTextField-root": { m: "0.5rem", width: "15rem" }, flexDirection: "column" }} noValidate autoComplete="off">
        <TextField id="standard" variant="standard" disabled label="Email" value={email ? email : " "} />
        <TextField id="standard-password-input" variant="standard" disabled value="password" label="Password" type="password" />
      </Box>
      <Box display="flex" sx={{ justifyContent: "center", alignItems: "center", mt: "2rem" }}>
        <Button onClick={() => setIsEditing(true)} variant="contained" type="submit" sx={{ mr: "1rem" }}>
          Edit
        </Button>
      </Box>
    </Box>
  );
}

function ProfilePage() {
  const { handleAlerts } = useContext(GlobalContext);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [editRequest, setEditRequest] = useState(0);

  useEffect(() => {
    console.log("Running useEffect to get profile");
    async function getProfile() {
      try {
        const response = await axios.get("/profile");
        console.log(response.data.results);
        if (response.data.results) {
          setUsername(response.data.results.username);
          setEmail(response.data.results.email ? response.data.results.email : "");
        } else {
          throw new Error("Internal Server Error");
        }
      } catch (error) {
        console.log(error);
        handleAlerts(error.message, false);
      }
    }

    getProfile();
  }, [editRequest]);

  return (
    <Page title="Profile">
      <Box display="flex" sx={{ justifyContent: "center", alignItems: "center", height: "85vh" }}>
        <Box flex-direction="column">
          <Box display="flex" sx={{ justifyContent: "center", alignItems: "center", mt: "-2rem" }}>
            <AccountCircleIcon color="action" sx={{ height: 100, width: 100 }} />
          </Box>
          <Typography variant="h4" sx={{ textAlign: "center", m: "2rem" }}>
            {username}'s Profile
          </Typography>
          {isEditing ? <ProfileEdit setIsEditing={setIsEditing} email={email} setEditRequest={setEditRequest} /> : <ProfileView setIsEditing={setIsEditing} email={email} />}
        </Box>
      </Box>
    </Page>
  );
}

export default ProfilePage;
