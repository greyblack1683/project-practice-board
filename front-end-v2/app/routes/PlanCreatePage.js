import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import axios from "axios";

import Container from "../components/Container";

import GlobalContext from "../components/GlobalContext";

import { Button, Box, Input, FormControl, FormLabel, Typography } from "@mui/joy";

function PlanCreatePage() {
  const { handleAlerts } = useContext(GlobalContext);
  const { appid } = useParams();
  const { handleUserNotAuthorised, checkPermission } = useOutletContext();
  const navigate = useNavigate();

  const [planName, setPlanName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      await axios
        .post("/plans/create", {
          plan_mvp_name: planName,
          plan_startdate: startDate,
          plan_enddate: endDate,
          plan_app_acronym: appid
        })
        .then(response => {
          console.log(response);
          handleAlerts(`Created plan ${planName} successfully`, true);
          navigate(`/apps/${appid}/plans`);
        })
        .catch(error => {
          console.log(error.response.data.message);
          handleUserNotAuthorised(error.response.data.message);
          handleAlerts(`${error.response.data.message}`, false);
        });
    } catch (error) {
      console.log(error);
      handleAlerts("Error: Internal Server Error", false);
    }
  };

  useEffect(() => {
    console.log("Running useEffect to check if user is a project manager");
    async function check() {
      const response = await checkPermission("plans_create", appid, true);
      console.log(response);
      if (!response) navigate(`/apps/${appid}/plans`);
    }
    check();
  }, []);

  return (
    <Container title="Create Plan" appid={appid} control={1}>
      <Box display="flex" justifyContent="center" sx={{ flexDirection: "row", gap: 5 }}>
        <Box sx={{ minWidth: "25rem" }}>
          <Typography level="title-lg" sx={{ mb: "1rem" }}>
            Plan Details
          </Typography>
          <FormControl>
            <FormLabel>Plan Name</FormLabel>
            <Input variant="soft" color="primary" value={planName} onChange={e => setPlanName(e.target.value)} />
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
