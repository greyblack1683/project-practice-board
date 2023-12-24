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

  function ProfileView() {
    return (
      <Box display="flex" sx={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        <Box display="flex" sx={{ "& .MuiTextField-root": { m: "0.5rem", width: "15rem" }, flexDirection: "column" }} noValidate autoComplete="off">
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input variant="solid" disabled value={email} />

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
      setNewPassword(password);
      if (password.length < 8 || password.length > 10) {
        setHelperMsg("Password should be between 8 to 10 characters.");
      } else {
        setHelperMsg("");
      }
    };

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
        if (error.response.data.message.toLowerCase().includes("password")) setHelperMsg(error.response.data.message);
        handleAlerts(error.response.data.message, false);
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
            <Button variant="solid" type="submit" sx={{ mr: "1rem" }}>
              Save
            </Button>
            <Button onClick={() => setIsEditing(false)} variant="solid" color="danger">
              Cancel
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
