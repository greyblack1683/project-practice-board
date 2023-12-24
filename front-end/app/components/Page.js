import React, { useEffect } from "react";
import { Box, Paper } from "@mui/material";

function Page(props) {
  useEffect(() => {
    document.title = `${props.title} | TMS`;
    window.scrollTo(0, 0);
  }, []);

  return (
    <Box display="flex" sx={{ bgcolor: "#cfe8fc", height: "100vh", justifyContent: "center", alignItems: "center" }}>
      <Paper variant="elevation" elevation={2} sx={{ height: "85vh", width: "90%", mt: "3rem" }}>
        {props.children}
      </Paper>
    </Box>
  );
}

export default Page;
