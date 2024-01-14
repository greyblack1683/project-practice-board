import React from "react";

import Page from "./Page";
import BCContainer from "./BCContainer";

import { Typography, Box, Sheet } from "@mui/joy";

function Container({ title, control, appid, planid, taskid, create, children }) {
  return (
    <Page title={title}>
      <Box display="flex" justifyContent="center">
        <Box>
          <BCContainer appid={appid} planid={planid} taskid={taskid} control={control} create={create} />
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "left",
              m: "2rem",
              maxWidth: "70rem",
              borderBottom: "1px solid",
              borderColor: "divider",
              paddingBottom: "0.7rem"
            }}
          >
            <Typography level="h3" sx={{ textAlign: "left" }}>
              {title}
            </Typography>
          </Box>
          <Box
            sx={{
              ml: "2rem",
              mr: "2rem",
              maxWidth: "70rem",
              overflow: "auto"
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </Page>
  );
}

export default Container;
