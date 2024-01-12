import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import axios from "axios";

import Container from "../components/Container";

import GlobalContext from "../components/GlobalContext";

import { Button, Box, Input, FormControl, FormLabel, Typography, Autocomplete } from "@mui/joy";

function PlanCreatePage() {
  const { handleAlerts } = useContext(GlobalContext);
  const { appid } = useParams();
  const [handleUserNotAuthorised, checkGroup, checkPermission] = useOutletContext();
  const navigate = useNavigate();

  const [acronym, setAcronym] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
  };

  return (
    <Container title="Create Plan" appid={appid} create={true} control={1}>
      <Box display="flex" justifyContent="center" sx={{ flexDirection: "row", gap: 5 }}>
        <Box sx={{ minWidth: "25rem" }}>
          <Typography level="title-lg" sx={{ mb: "1rem" }}>
            Plan Details
          </Typography>
          <FormControl>
            <FormLabel>Plan Name</FormLabel>
            <Input variant="soft" color="primary" value={acronym} onChange={e => setAcronym(e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel sx={{ mt: "1rem" }}>Start Date</FormLabel>
            <Input type="date" variant="soft" color="primary" value={startDate} onChange={e => setStartDate(e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel sx={{ mt: "1rem" }}>End Date</FormLabel>
            <Input type="date" variant="soft" color="primary" value={endDate} onChange={e => setEndDate(e.target.value)} />
          </FormControl>
        </Box>
        <Box sx={{ minWidth: "25rem" }} />
      </Box>
      <Box sx={{ display: "flex", gap: 2, justifyContent: "center", alignItems: "center", mt: "5rem" }}>
        <Button size="sm" variant="solid" color="danger" onClick={() => navigate(`/apps/${appid}/plans`)}>
          Cancel
        </Button>
        <Button size="sm" variant="solid" color="success" type="submit" onClick={handleSubmit}>
          Save
        </Button>
      </Box>
    </Container>
  );
}

export default PlanCreatePage;
