import React from "react";
import Page from "../components/Page";

import { Box, Typography } from "@mui/joy";

import logo from "../../public/tms_logo.png";

function HomePage() {
  return (
    <Page title="Home">
      <Box display="flex" sx={{ justifyContent: "center", alignItems: "center", height: "85vh" }}>
        <Box flex-direction="column">
          <Box display="flex" sx={{ justifyContent: "center", alignItems: "center" }}>
            <img src={logo} width={80} height={80} alt="Logo" />
          </Box>
          <Typography level="body-lg" sx={{ textAlign: "center", m: "2rem" }}>
            Task Management System
          </Typography>
        </Box>
      </Box>
    </Page>
  );
}

export default HomePage;
