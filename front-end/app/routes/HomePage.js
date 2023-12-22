import React from "react";
import { Box, Typography } from "@mui/material";
import logo from "../../public/tms_logo.png";

function HomePage() {
  return (
    <Box display="flex" sx={{ bgcolor: "#cfe8fc", height: "100vh", justifyContent: "center", alignItems: "center" }}>
      <Box flex-direction="column">
        <Box display="flex" sx={{ justifyContent: "center", alignItems: "center", m: "2rem", mt: "-2rem" }}>
          <img src={logo} width={150} height={150} alt="Logo" />
        </Box>
        <Typography variant="h2" sx={{ textAlign: "center", m: "2rem" }}>
          Task Management
        </Typography>
        <Typography variant="h2" sx={{ textAlign: "center", m: "2rem" }}>
          System
        </Typography>
      </Box>
    </Box>
  );
}

export default HomePage;
