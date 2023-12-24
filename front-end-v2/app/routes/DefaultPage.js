import React from "react";
import { Box, Sheet, Typography } from "@mui/joy";

function DefaultPage() {
  return (
    <Box display="flex" sx={{ bgcolor: "#cfe8fc", height: "100vh", justifyContent: "center", alignItems: "center" }}>
      <Sheet sx={{ height: "60vh", width: "40vh", padding: "2rem", justifyContent: "center", alignItems: "center", borderRadius: "2%" }}>
        <Typography level="h1" component="div" sx={{ textAlign: "center" }}>
          Error 404
        </Typography>
        <Typography level="body-lg" sx={{ textAlign: "center" }}>
          Page cannot be found
        </Typography>
      </Sheet>
    </Box>
  );
}

export default DefaultPage;
