import React, { useState, useEffect, useContext } from "react";
import axios from "axios";

import GlobalContext from "../components/GlobalContext";
import Page from "../components/Page";

import { Box, Input, FormControl, FormLabel, FormHelperText, Typography, Button, Avatar } from "@mui/joy";

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
        await axios
          .get("/profile")
          .then(response => {
            setUsername(response.data.results.username);
            setEmail(response.data.results.email ? response.data.results.email : "");
          })
          .catch(error => {
            console.log(error.response.data.message);
            handleAlerts(error.response.data.message, false);
          });
      } catch (error) {
        console.log(error);
        handleAlerts("Error: Internal Server Error", false);
      }
    }

    getProfile();
  }, [editRequest]);

  function ProfileView() {
    return (
      <Box display="flex" sx={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        <Box display="flex" sx={{ "& .MuiTextField-root": { m: "0.5rem", width: "15rem" }, flexDirection: "column" }} noValidate autoComplete="off">
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input variant="solid" disabled value={email} />
          </FormControl>
          <FormControl>
            <FormLabel sx={{ mt: "1rem" }}>Password</FormLabel>
            <Input variant="solid" disabled value="password" type="password" />
          </FormControl>
        </Box>
        <Box display="flex" sx={{ justifyContent: "center", alignItems: "center", mt: "3rem" }}>
          <Button onClick={() => setIsEditing(true)} variant="solid" type="submit">
            Edit
          </Button>
        </Box>
      </Box>
    );
  }

  function ProfileEdit() {
    const [newEmail, setNewEmail] = useState(email);
    const [newPassword, setNewPassword] = useState("");
    const [helperMsg, setHelperMsg] = useState("");

    const checkPassword = password => {
      if (password) {
        setNewPassword(password);
        setHelperMsg(password.length < 8 || password.length > 10 ? "Password should be between 8 to 10 characters." : "");
      }
    };

    const handleSubmit = async e => {
      e.preventDefault();
      try {
        await axios
          .post("/profile/update", {
            email: newEmail,
            password: newPassword
          })
          .then(response => {
            handleAlerts("Email and/or password is updated!", true);
            setEditRequest(prev => prev + 1);
            setIsEditing(false);
          })
          .catch(error => {
            console.log(error.response.data.message);
            if (error.response.data.message.toLowerCase().includes("password")) setHelperMsg(error.response.data.message);
            handleAlerts(error.response.data.message, false);
          });
      } catch (error) {
        console.log(error);
        handleAlerts("Error: Internal Server Error", false);
      }
    };

    return (
      <form onSubmit={handleSubmit}>
        <Box display="flex" sx={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
          <Box display="flex" sx={{ "& .MuiTextField-root": { m: "0.5rem", width: "15rem" }, flexDirection: "column" }} noValidate autoComplete="off">
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input variant="soft" color="primary" value={newEmail} onChange={e => setNewEmail(e.target.value)} />
            </FormControl>
            <FormControl error={helperMsg ? true : false}>
              <FormLabel sx={{ mt: "1rem" }}>Password</FormLabel>
              <Input variant="soft" color="primary" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} onBlur={e => checkPassword(e.target.value)} />
              {helperMsg && <FormHelperText sx={{ width: "12rem" }}>{helperMsg}</FormHelperText>}
            </FormControl>
          </Box>
          <Box display="flex" sx={{ justifyContent: "center", alignItems: "center", mt: "3rem" }}>
            <Button onClick={() => setIsEditing(false)} variant="solid" color="danger" sx={{ mr: "1rem" }}>
              Cancel
            </Button>
            <Button variant="solid" color="success" type="submit">
              Save
            </Button>
          </Box>
        </Box>
      </form>
    );
  }

  return (
    <Page title="Profile">
      <Box display="flex" sx={{ justifyContent: "center", alignItems: "center", height: "85vh" }}>
        <Box flex-direction="column">
          <Box display="flex" sx={{ justifyContent: "center", alignItems: "center", mt: "-2rem" }}>
            <Avatar variant="outlined" sx={{ height: 60, width: 60 }} />
          </Box>
          <Typography level="h3" sx={{ textAlign: "center", m: "2rem" }}>
            {username}'s Profile
          </Typography>
          {isEditing ? <ProfileEdit /> : <ProfileView />}
        </Box>
      </Box>
    </Page>
  );
}

export default ProfilePage;
