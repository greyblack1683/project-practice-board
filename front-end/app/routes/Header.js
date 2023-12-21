import React, { useContext } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

import GlobalContext from "../components/GlobalContext";
import logo from "../../public/tms_logo.png";

function Header() {
  const { handleAlerts, handleCookie } = useContext(GlobalContext);

  const handleLogOut = () => {
    handleCookie();
    handleAlerts("Log out successful", true);
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ m: "0.5rem" }}>
          <IconButton size="small" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2, ml: -2 }}>
            <img src={logo} width={50} height={50} alt="Logo" />
          </IconButton>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
            {" "}
          </Typography>
          <Button variant="contained" sx={{ mr: "1rem", backgroundColor: "green", color: "white", "&:hover": { backgroundColor: "green", color: "white" } }}>
            My Profile
          </Button>
          <Button onClick={handleLogOut} variant="contained" color="error">
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Header;
