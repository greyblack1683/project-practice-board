import React, { useEffect, useState, useContext } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import GlobalContext from "./GlobalContext";

import { Button, Box, Chip, Stack, Input, FormControl, FormLabel, Typography, Autocomplete, Textarea } from "@mui/joy";

import SettingsBackupRestoreRoundedIcon from "@mui/icons-material/SettingsBackupRestoreRounded";

function AppDetailsModal({ appid, setAppChangeRequest, setCreateApp }) {
  const { handleAlerts } = useContext(GlobalContext);
  const { handleUserNotAuthorised, checkGroup } = useOutletContext();
  const [allGroups, setAllGroups] = useState([]);
  const [appDetails, setAppDetails] = useState({});
  const [acronym, setAcronym] = useState(undefined);
  const [rNum, setRNum] = useState(0);
  const [desc, setDesc] = useState(undefined);
  const [startDate, setStartDate] = useState(undefined);
  const [endDate, setEndDate] = useState(undefined);
  const [permitCreate, setPermitCreate] = useState("sqa");
  const [permitOpen, setPermitOpen] = useState("sqa");
  const [permitToDo, setPermitToDo] = useState("sqa");
  const [permitDoing, setPermitDoing] = useState("sqa");
  const [permitDone, setPermitDone] = useState("sqa");
  const [isEditing, setIsEditing] = useState(false);

  const handleCancel = () => {
    setAcronym(appDetails.app_acronym);
    setRNum(appDetails.app_rnumber);
    setDesc(appDetails.app_description ? appDetails.app_description : "");
    setStartDate(appDetails.app_startdate);
    setEndDate(appDetails.app_enddate);
    setPermitCreate(appDetails.app_permit_create);
    setPermitOpen(appDetails.app_permit_open);
    setPermitToDo(appDetails.app_permit_todolist);
    setPermitDoing(appDetails.app_permit_doing);
    setPermitDone(appDetails.app_permit_done);
    setIsEditing(false);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      await axios
        .post("/apps/update", {
          app_acronym: acronym,
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
          setIsEditing(false);
          setAppChangeRequest(prev => prev + 1);
          setCreateApp(false);
          handleAlerts(`Updated application ${acronym} successfully`, true);
        })
        .catch(error => {
          console.log(error.response.data.message);
          handleUserNotAuthorised(error.response.data.message, "pl_app");
          handleAlerts(`${error.response.data.message}`, false);
        });
    } catch (error) {
      console.log(error);
      handleAlerts("Error: Internal Server Error", false);
    }
  };

  useEffect(() => {
    async function check() {
      const response = await checkGroup("projectlead", false);
      if (response) {
        setIsEditing(true);
        try {
          //get list of groups
          await axios
            .get("/groups/all")
            .then(response => setAllGroups(response.data.results))
            .catch(error => {
              console.log(error.response.data.message);
              handleUserNotAuthorised(error.response.data.message, "pl_app");
              handleAlerts(`${error.response.data.message}`, false);
            });
          setIsEditing(true);
        } catch (error) {
          console.log(error);
          handleAlerts("Error: Internal Server Error", false);
        }
      }
    }
    async function getApp() {
      try {
        await axios
          .post("/apps/selected", {
            app_acronym: appid
          })
          .then(response => {
            console.log(response);
            setAcronym(response.data.results.app_acronym);
            setRNum(response.data.results.app_rnumber);
            setDesc(response.data.results.app_description);
            setStartDate(response.data.results.app_startdate);
            setEndDate(response.data.results.app_enddate);
            setPermitCreate(response.data.results.app_permit_create);
            setPermitOpen(response.data.results.app_permit_open);
            setPermitToDo(response.data.results.app_permit_todolist);
            setPermitDoing(response.data.results.app_permit_doing);
            setPermitDone(response.data.results.app_permit_done);
            setAppDetails(response.data.results);
          })
          .catch(error => {
            console.log(error.response.data.message);
            if (error.response.data.message.toLowerCase().includes("does not exist")) handleAlerts(`${error.response.data.message}`, false);
          });
      } catch (error) {
        console.log(error);
        handleAlerts("Error: Internal Server Error", false);
      }
    }
    check();
    getApp();
  }, []);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "left",
          m: "2rem"
        }}
      >
        <Box sx={{ borderBottom: "1px solid", borderColor: "divider", paddingBottom: "0.7rem", flexGrow: 1 }}>
          <Typography level="h3" sx={{ textAlign: "left" }}>
            Application: {acronym}
          </Typography>
          <Chip size="sm" color="primary" startDecorator={<SettingsBackupRestoreRoundedIcon />}>
            Running Number: {rNum}
          </Chip>
        </Box>
      </Box>
      <Box display="flex" justifyContent="center" sx={{ flexDirection: "row", gap: 5, m: "2rem" }}>
        <Box sx={{ width: "60%" }}>
          <Typography level="title-lg" sx={{ mb: "1rem" }}>
            Application Details
          </Typography>

          <Stack direction="row" spacing="4%">
            <FormControl sx={{ width: "48%" }}>
              <FormLabel>Start Date</FormLabel>
              <Input type="date" variant="soft" color={isEditing ? "primary" : "neutral"} value={startDate} onChange={e => setStartDate(e.target.value)} readOnly={isEditing ? false : true} />
            </FormControl>
            <FormControl sx={{ width: "48%" }}>
              <FormLabel>End Date</FormLabel>
              <Input type="date" variant="soft" color={isEditing ? "primary" : "neutral"} value={endDate} onChange={e => setEndDate(e.target.value)} readOnly={isEditing ? false : true} />
            </FormControl>
          </Stack>
          <FormControl>
            <FormLabel sx={{ mt: "1rem" }}>Description</FormLabel>
            <Textarea variant="soft" minRows={8} maxRows={8} color={isEditing ? "primary" : "neutral"} value={desc} onChange={e => setDesc(e.target.value)} readOnly={isEditing ? false : true} />
          </FormControl>
        </Box>
        <Box sx={{ width: "40%" }}>
          <Typography level="title-lg" sx={{ mb: "1rem" }}>
            Permissions
          </Typography>
          <FormControl>
            <FormLabel>Create Tasks</FormLabel>
            <Autocomplete variant={isEditing ? "outlined" : "solid"} color="primary" size="md" options={allGroups} value={permitCreate} onChange={(e, newValue) => setPermitCreate(newValue)} disabled={isEditing ? false : true} />
          </FormControl>
          <FormControl>
            <FormLabel sx={{ mt: "1rem" }}>Edit Open Tasks</FormLabel>
            <Autocomplete variant={isEditing ? "outlined" : "solid"} color="primary" size="md" options={allGroups} value={permitOpen} onChange={(e, newValue) => setPermitOpen(newValue)} disabled={isEditing ? false : true} />
          </FormControl>
          <FormControl>
            <FormLabel sx={{ mt: "1rem" }}>Edit To-Do Tasks</FormLabel>
            <Autocomplete variant={isEditing ? "outlined" : "solid"} color="primary" size="md" options={allGroups} value={permitToDo} onChange={(e, newValue) => setPermitToDo(newValue)} disabled={isEditing ? false : true} />
          </FormControl>
          <FormControl>
            <FormLabel sx={{ mt: "1rem" }}>Edit Doing Tasks</FormLabel>
            <Autocomplete variant={isEditing ? "outlined" : "solid"} color="primary" size="md" options={allGroups} value={permitDoing} onChange={(e, newValue) => setPermitDoing(newValue)} disabled={isEditing ? false : true} />
          </FormControl>
          <FormControl>
            <FormLabel sx={{ mt: "1rem" }}>Edit Done Tasks</FormLabel>
            <Autocomplete variant={isEditing ? "outlined" : "solid"} color="primary" size="md" options={allGroups} value={permitDone} onChange={(e, newValue) => setPermitDone(newValue)} disabled={isEditing ? false : true} />
          </FormControl>
        </Box>
      </Box>
      {isEditing && (
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center", alignItems: "center", mt: "4rem" }}>
          <Button size="sm" variant="plain" color="danger" onClick={handleCancel}>
            Cancel
          </Button>
          <Button size="sm" variant="solid" color="success" onClick={handleSubmit}>
            Save
          </Button>
        </Box>
      )}
    </>
  );
}

export default AppDetailsModal;
