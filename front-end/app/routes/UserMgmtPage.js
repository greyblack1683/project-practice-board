import React from "react";
import { Box, TextField, Button, Paper, Typography } from "@mui/material";
import Page from "../components/Page";

function UserMgmtPage() {
  return (
    <Page title="Manage Users">
      <Typography variant="h4" sx={{ m: "1rem", textAlign: "left" }}>
        User Management
      </Typography>
    </Page>
  );
}

export default UserMgmtPage;
