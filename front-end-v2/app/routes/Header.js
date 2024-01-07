import React, { useContext, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import { Stack, Box, IconButton, Button, Typography, Avatar } from "@mui/joy";

import GlobalContext from "../components/GlobalContext";

import LogoutIcon from "@mui/icons-material/Logout";

function Header({ handleTheme, isLightMode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleAlerts, handleCookie, isAdmin, setIsAdmin } = useContext(GlobalContext);

  //useEffect to check if it's admin
  useEffect(() => {
    console.log("Running useEffect to check if user is admin and active");
    async function checkGroup(authorisedGroup) {
      try {
        await axios
          .post("/authorize", { authorisedGroup })
          .then(response => setIsAdmin(response.data.success))
          .catch(error => {
            console.log(error.response.data.message);
            handleAlerts(`${error.response.data.message}`, false);
          });
      } catch (error) {
        console.log(error);
        handleAlerts("Error: Internal Server Error", false);
      }
    }

    checkGroup("admin");
  }, []);

  const handleLogOut = () => {
    handleCookie();
    handleAlerts("Log out successful", true);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          justifyContent: "space-between",
          borderBottom: "1px solid",
          borderColor: "divider",
          position: "sticky",
          padding: "0.7rem"
        }}
      >
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
          <IconButton onClick={() => navigate("/")} size="md" variant="soft" color="primary" sx={{ borderRadius: "50%", width: "34px" }}>
            <Avatar onClick={() => navigate("/")} size="sm" variant="soft" color="primary" alt="TMS">
              TMS
            </Avatar>
          </IconButton>
          <Typography level="body-md" component="div" sx={{ flexGrow: 1 }}>
            Task Management System
          </Typography>
        </Stack>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 1.5,
            alignItems: "center"
          }}
        >
          <IconButton onClick={handleTheme} size="md" variant="soft" color="primary" sx={{ borderRadius: "50%", width: "34px" }}>
            <Avatar onClick={handleTheme} size="sm" variant="soft" color="primary" alt="TMS">
              TMS
            </Avatar>
          </IconButton>
          {isAdmin && (
            <Button onClick={() => navigate("/usermgmt")} variant="plain" color="neutral" aria-pressed={location.pathname === "/usermgmt" ? "true" : "false"} size="sm">
              User Management
            </Button>
          )}
          <Button onClick={() => navigate("/profile")} variant="plain" color="neutral" aria-pressed={location.pathname === "/profile" ? "true" : "false"} size="sm">
            My Profile
          </Button>
          <Button onClick={handleLogOut} variant="plain" color="danger" size="sm" startDecorator={<LogoutIcon />}>
            Logout
          </Button>
        </Box>
      </Box>
      <Outlet />
    </>
  );
}

export default Header;
