import React, { useContext, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import { Stack, Box, IconButton, Button, Typography, Avatar } from "@mui/joy";

import GlobalContext from "../components/GlobalContext";

import LogoutIcon from "@mui/icons-material/Logout";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleAlerts, handleCookie, isAdmin, setIsAdmin } = useContext(GlobalContext);

  //useEffect to check if it's admin
  useEffect(() => {
    console.log("Running useEffect to check if user is admin and active");
    async function checkGroup(authorisedGroup) {
      try {
        //to be fixed later
        const response = await axios.post("/authorize", {
          authorisedGroup
        });
        if (response) {
          console.log(response);

          setIsAdmin(response.data.success);
        } else {
          console.log(response.data.message);
          throw new Error(response.data.message);
        }
      } catch (error) {
        console.log(error.response.data.message);
        handleAlerts(`${error.response.data.message}`, false);
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
          {isAdmin && (
            <Button onClick={() => navigate("/usermgmt")} variant="plain" color="neutral" aria-pressed={location.pathname === "/usermgmt" ? "true" : "false"} size="sm">
              User Management
            </Button>
          )}
          <Button onClick={() => navigate("/profile")} variant="plain" color="neutral" aria-pressed={location.pathname === "/profile" ? "true" : "false"} size="sm">
            My Profile
          </Button>
          <Button onClick={handleLogOut} variant="soft" color="danger" size="sm" startDecorator={<LogoutIcon />}>
            Logout
          </Button>
        </Box>
      </Box>
      <Outlet />
    </>
  );
}

export default Header;
