import React, { useContext, useEffect } from "react";
import { AppBar, Toolbar, Typography, Button, IconButton } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import axios from "axios";

import GlobalContext from "../components/GlobalContext";
import logo from "../../public/tms_logo.png";

function Header({ setIsAdmin }) {
  const navigate = useNavigate();
  const { handleAlerts, handleCookie, isAdmin } = useContext(GlobalContext);

  //useEffect to check if it's admin
  useEffect(() => {
    console.log("Running useEffect to check if user is admin");
    async function checkGroup(authorisedGroup) {
      try {
        //to be fixed later
        const response = await axios.post("/authorize", {
          authorisedGroup
        });
        console.log(response);
        setIsAdmin(response.data.success);
      } catch (error) {
        console.log(error);
        handleAlerts(error.message, false);
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
      <AppBar position="fixed">
        <Toolbar>
          <IconButton onClick={() => navigate("/")} size="small" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2, ml: -2 }}>
            <img src={logo} width={40} height={40} alt="Logo" />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {""}
          </Typography>
          {isAdmin && (
            <Button onClick={() => navigate("/usermgmt")} variant="text" sx={{ mr: "1rem", color: "white", "&:hover": { backgroundColor: "#2e5cb8" } }}>
              User Management
            </Button>
          )}
          <Button onClick={() => navigate("/profile")} variant="text" sx={{ mr: "1rem", color: "white", "&:hover": { backgroundColor: "#2e5cb8" } }}>
            My Profile
          </Button>
          <Button onClick={handleLogOut} variant="text" sx={{ mr: "1rem", alignItems: "center", backgroundColor: "#25488e", color: "white", "&:hover": { backgroundColor: "#1a3365" } }}>
            <LogoutIcon sx={{ mr: "0.2rem", height: 22 }} /> Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Outlet />
    </>
  );
}

export default Header;
