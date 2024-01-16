import React, { useState, useEffect, useContext } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import axios from "axios";

import Container from "../components/Container";

import GlobalContext from "../components/GlobalContext";

import { Button, Box, Input, FormControl, FormLabel, Typography } from "@mui/joy";

function PlanDetailsPage() {
  const { handleAlerts } = useContext(GlobalContext);
  const { appid, planid } = useParams();
  const { handleUserNotAuthorised, checkPermission } = useOutletContext();

  const [isPM, setIsPM] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [planDetails, setPlanDetails] = useState({});
  const [planName, setPlanName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleCancel = () => {
    setPlanName(planDetails.plan_mvp_name);
    setStartDate(planDetails.plan_startdate);
    setEndDate(planDetails.plan_enddate);
    setIsEditing(false);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      await axios
        .post("/plans/update", {
          plan_mvp_name: planName,
          plan_startdate: startDate,
          plan_enddate: endDate,
          plan_app_acronym: appid,
          app_acronym: appid
        })
        .then(response => {
          console.log(response);
          handleAlerts(`Updated plan ${planName} successfully`, true);
          setIsEditing(false);
        })
        .catch(error => {
          console.log(error.response.data.message);
          handleUserNotAuthorised(error.response.data.message, null, appid);
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
      const response = await checkPermission("open", appid, false);
      console.log(response);
      if (!response) setIsPM(true);
    }

    async function getPlan() {
      try {
        await axios
          .post("/plans/selected", {
            plan_app_acronym: appid,
            plan_mvp_name: planid
          })
          .then(response => {
            console.log(response);
            setPlanName(response.data.results.plan_mvp_name);
            setStartDate(response.data.results.plan_startdate);
            setEndDate(response.data.results.plan_enddate);
            setPlanDetails(response.data.results);
          })
          .catch(error => {
            console.log(error.response.data.message);
            handleAlerts(`${error.response.data.message}`, false);
          });
      } catch (error) {
        console.log(error);
        handleAlerts("Error: Internal Server Error", false);
      }
    }
    check();
    getPlan();
  }, []);

  return (
    <Container title={isEditing ? "Edit Plan" : "View Plan"} appid={appid} planid={planid} control={1}>
      <Box display="flex" justifyContent="center" sx={{ flexDirection: "row", gap: 5 }}>
        <Box sx={{ minWidth: "40rem" }}>
          <Typography level="title-lg" sx={{ mb: "1rem" }}>
            Plan Details
          </Typography>
          <FormControl>
            <FormLabel>Plan Name</FormLabel>
            <Input variant="solid" color="primary" value={planName} disabled={true} />
          </FormControl>
          <FormControl>
            <FormLabel sx={{ mt: "1rem" }}>Start Date</FormLabel>
            <Input type="date" variant={isEditing ? "soft" : "solid"} color="primary" value={startDate} onChange={e => setStartDate(e.target.value)} disabled={isEditing ? false : true} />
          </FormControl>
          <FormControl>
            <FormLabel sx={{ mt: "1rem" }}>End Date</FormLabel>
            <Input type="date" variant={isEditing ? "soft" : "solid"} color="primary" value={endDate} onChange={e => setEndDate(e.target.value)} disabled={isEditing ? false : true} />
          </FormControl>
        </Box>
        <Box sx={{ minWidth: "15rem" }} />
      </Box>
      {isPM &&
        (isEditing ? (
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", alignItems: "center", mt: "5rem" }}>
            <Button size="sm" variant="solid" color="danger" onClick={handleCancel}>
              Cancel
            </Button>
            <Button size="sm" variant="solid" color="success" type="submit" onClick={handleSubmit}>
              Save
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", alignItems: "center", mt: "5rem" }}>
            <Button size="sm" variant="solid" color="primary" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          </Box>
        ))}
    </Container>
  );
}

export default PlanDetailsPage;
