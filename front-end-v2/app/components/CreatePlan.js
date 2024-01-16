import React, { useState, useContext } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import axios from "axios";

import GlobalContext from "./GlobalContext";

import { Button, Box, Input } from "@mui/joy";

function CreatePlan({ setEditPlanRequest, setIsPM }) {
  const { handleAlerts } = useContext(GlobalContext);
  const { appid } = useParams();
  const { handleUserNotAuthorised } = useOutletContext();

  const [planName, setPlanName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = async () => {
    try {
      await axios
        .post("/plans/create", {
          plan_mvp_name: planName,
          plan_startdate: startDate,
          plan_enddate: endDate,
          plan_app_acronym: appid,
          app_acronym: appid
        })
        .then(response => {
          console.log(response);
          setPlanName("");
          setStartDate("");
          setEndDate("");
          setEditPlanRequest(prev => prev + 1);
          handleAlerts(`Created plan ${planName} successfully`, true);
        })
        .catch(error => {
          console.log(error.response.data.message);
          handleUserNotAuthorised(error.response.data.message);
          if (error.response.data.message.includes("not authorised")) setIsPM(false);
          handleAlerts(`${error.response.data.message}`, false);
        });
    } catch (error) {
      console.log(error);
      handleAlerts("Error: Internal Server Error", false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        mt: "-1rem",
        ml: "2rem",
        mr: "2rem",
        maxWidth: "80rem"
      }}
    >
      <Input placeholder="plan name" variant="soft" size="sm" color="primary" value={planName} onChange={e => setPlanName(e.target.value)} sx={{ flexGrow: 1, mr: 1.5 }} />

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 1.5,
          alignItems: "center"
        }}
      >
        <Input placeholder="start date" type="date" size="sm" variant="soft" color="primary" value={startDate} onChange={e => setStartDate(e.target.value)} />
        <Input placeholder="end date" type="date" size="sm" variant="soft" color="primary" value={endDate} onChange={e => setEndDate(e.target.value)} />
        <Button variant="outlined" size="sm" sx={{ width: "90px" }} onClick={handleSubmit}>
          Add Plan
        </Button>
      </Box>
    </Box>
  );
}

export default CreatePlan;
