import React from "react";
import { Box, CircularProgress } from "@mui/joy";

function LoadingPage() {
  return (
    <Box display="flex" sx={{ height: "100vh", justifyContent: "center", alignItems: "center" }}>
      <CircularProgress />
    </Box>
  );
}

export default LoadingPage;
