import React from "react";
import Page from "../components/Page";

import { Box, Typography, Avatar } from "@mui/joy";

function HomePage() {
  return (
    <Page title="Home">
      <Box display="flex" sx={{ justifyContent: "center", alignItems: "center", height: "85vh" }}>
        <Box flex-direction="column">
          <Box display="flex" sx={{ justifyContent: "center", alignItems: "center" }}>
            <Avatar size="lg" variant="soft" color="primary" alt="TMS" sx={{ "--Avatar-size": "80px" }}>
              TMS
            </Avatar>
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
