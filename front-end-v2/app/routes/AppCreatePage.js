import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import axios from "axios";

import Container from "../components/Container";

import GlobalContext from "../components/GlobalContext";

import { Button, Box, Input, FormControl, FormLabel, Typography, Autocomplete } from "@mui/joy";

function AppCreatePage() {
  const { handleAlerts } = useContext(GlobalContext);
  const [handleUserNotAuthorised, checkGroup] = useOutletContext();
  const navigate = useNavigate();

  const [allGroups, setAllGroups] = useState([]);
  const [acronym, setAcronym] = useState("");
  const [rNum, setRNum] = useState(0);
  const [desc, setDesc] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [permitCreate, setPermitCreate] = useState(undefined);
  const [permitOpen, setPermitOpen] = useState(undefined);
  const [permitToDo, setPermitToDo] = useState(undefined);
  const [permitDoing, setPermitDoing] = useState(undefined);
  const [permitDone, setPermitDone] = useState(undefined);

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      await axios
        .post("/apps/create", {
          app_acronym: acronym,
          app_rnumber: rNum,
          app_description: desc,
          app_startdate: startDate,
          app_enddate: endDate,
          app_permit_create: permitCreate,
          app_permit_open: permitOpen,
          app_permit_todolist: permitToDo,
          app_permit_doing: permitDoing,
          app_permit_done: permitDone
        })
        .then(response => {
          console.log(response);
          handleAlerts(`Created application ${acronym} successfully`, true);
          navigate(`/apps`);
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
    const controller = new AbortController();
    async function getGroups() {
      try {
        await axios
          .get("/groups/all")
          .then(response => setAllGroups(response.data.results))
          .catch(error => {
            console.log(error.response.data.message);
            handleUserNotAuthorised(error.response.data.message);
            handleAlerts(`${error.response.data.message}`, false);
          });
      } catch (error) {
        console.log(error);
        handleAlerts("Error: Internal Server Error", false);
      }
    }
    async function check() {
      const response = await checkGroup("projectlead", true);
      if (!response) navigate("/apps");
    }
    check();
    getGroups();
    return controller.abort();
  }, []);

  return (
    <Container title="Create App" create={true} control={0}>
      <Box display="flex" justifyContent="center" sx={{ flexDirection: "row", gap: 5 }}>
        <Box sx={{ minWidth: "25rem" }}>
          <Typography level="title-lg" sx={{ mb: "1rem" }}>
            Application Details
          </Typography>
          <FormControl>
            <FormLabel>Acronym</FormLabel>
            <Input variant="soft" color="primary" value={acronym} onChange={e => setAcronym(e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel sx={{ mt: "1rem" }}>Running Number</FormLabel>
            <Input variant="soft" color="primary" type="number" value={rNum} onChange={e => setRNum(e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel sx={{ mt: "1rem" }}>Description</FormLabel>
            <Input variant="soft" color="primary" value={desc} onChange={e => setDesc(e.target.value)} />
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
        <Box sx={{ minWidth: "25rem" }}>
          <Typography level="title-lg" sx={{ mb: "1rem" }}>
            Permissions
          </Typography>
          <FormControl>
            <FormLabel>Create Tasks</FormLabel>
            <Autocomplete variant="outlined" color="primary" size="md" options={allGroups} value={permitCreate} onChange={(e, newValue) => setPermitCreate(newValue)} />
          </FormControl>
          <FormControl>
            <FormLabel sx={{ mt: "1rem" }}>Edit Open Tasks</FormLabel>
            <Autocomplete variant="outlined" color="primary" size="md" options={allGroups} value={permitOpen} onChange={(e, newValue) => setPermitOpen(newValue)} />
          </FormControl>
          <FormControl>
            <FormLabel sx={{ mt: "1rem" }}>Edit To-Do Tasks</FormLabel>
            <Autocomplete variant="outlined" color="primary" size="md" options={allGroups} value={permitToDo} onChange={(e, newValue) => setPermitToDo(newValue)} />
          </FormControl>
          <FormControl>
            <FormLabel sx={{ mt: "1rem" }}>Edit Doing Tasks</FormLabel>
            <Autocomplete variant="outlined" color="primary" size="md" options={allGroups} value={permitDoing} onChange={(e, newValue) => setPermitDoing(newValue)} />
          </FormControl>
          <FormControl>
            <FormLabel sx={{ mt: "1rem" }}>Edit Done Tasks</FormLabel>
            <Autocomplete variant="outlined" color="primary" size="md" options={allGroups} value={permitDone} onChange={(e, newValue) => setPermitDone(newValue)} />
          </FormControl>
        </Box>
      </Box>
      <Box sx={{ display: "flex", gap: 2, justifyContent: "center", alignItems: "center", mt: "5rem" }}>
        <Button size="sm" variant="solid" color="danger" onClick={() => navigate(`/apps`)}>
          Cancel
        </Button>
        <Button size="sm" variant="solid" color="success" type="submit" onClick={handleSubmit}>
          Save
        </Button>
      </Box>
    </Container>
  );
}

export default AppCreatePage;
