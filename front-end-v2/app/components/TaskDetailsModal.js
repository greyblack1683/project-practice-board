import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import axios from "axios";

import GlobalContext from "./GlobalContext";

import { Button, Box, Input, FormControl, FormLabel, Typography, Autocomplete, AutocompleteOption, ListItemContent, Textarea } from "@mui/joy";

function TaskDetailsModal({ taskID }) {
  const { handleAlerts } = useContext(GlobalContext);
  const { handleUserNotAuthorised, checkPermission } = useOutletContext();
  const { appid } = useParams();
  const navigate = useNavigate();

  const [allPlans, setAllPlans] = useState({});
  const [taskName, setTaskName] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskNotes, setTaskNotes] = useState("");
  const [taskPlan, setTaskPlan] = useState(null);
  const [taskDetails, setTaskDetails] = useState({});

  const handleSubmit = () => {
    alert("yo");
  };

  //stuck here
  useEffect(() => {
    const controller = new AbortController();
    async function getSelectedTask() {
      try {
        await axios
          .post("/tasks/selected", {
            task_id: taskID
          })
          .then(response => {
            console.log(response.data.results);
            setTaskName(response.data.results.task_name);
            setTaskDesc(response.data.results.task_description);
            setTaskNotes(response.data.results.task_notes);
            setTaskPlan(response.data.results.task_plan);
            setTaskDetails(response.data.results);
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

    getSelectedTask();
    return controller.abort();
  }, []);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "left",
          mt: "2rem",
          ml: "2rem",
          mr: "2rem",
          mb: "2rem",
          borderBottom: "1px solid",
          borderColor: "divider",
          paddingBottom: "0.7rem"
        }}
      >
        <Typography level="h3" sx={{ textAlign: "left" }}>
          Create Task for {appid}
        </Typography>
      </Box>
      <Box display="flex" justifyContent="center" sx={{ flexDirection: "row", gap: 5, m: "2rem" }}>
        <Box sx={{ minWidth: "20rem" }}>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input variant="soft" color="primary" value={taskName} onChange={e => setTaskName(e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel sx={{ mt: "1rem" }}>Description</FormLabel>
            <Textarea variant="soft" minRows={4} maxRows={4} color="primary" value={taskDesc} onChange={e => setTaskDesc(e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel sx={{ mt: "1rem" }}>Plan</FormLabel>
            <Autocomplete
              variant="outlined"
              color="primary"
              size="md"
              options={allPlans}
              getOptionLabel={option => option.plan_mvp_name}
              value={taskPlan}
              onChange={(e, newValue) => setTaskPlan(newValue)}
              renderOption={(props, option) => (
                <AutocompleteOption {...props}>
                  <ListItemContent sx={{ fontSize: "sm" }}>
                    {option.plan_mvp_name}
                    <Typography level="body-xs">
                      {option.plan_startdate} to {option.plan_enddate}
                    </Typography>
                  </ListItemContent>
                </AutocompleteOption>
              )}
            />
          </FormControl>
        </Box>
        <Box sx={{ minWidth: "30rem" }}>
          <FormControl>
            <FormLabel>Notes</FormLabel>
            <Textarea variant="soft" minRows={16} maxRows={16} color="primary" value={taskNotes} onChange={e => setTaskNotes(e.target.value)} />
          </FormControl>
        </Box>
      </Box>
      <Box sx={{ display: "flex", gap: 2, justifyContent: "center", alignItems: "center", mt: "3rem", mb: "2rem" }}>
        <Button size="sm" variant="plain" color="danger" onClick={() => navigate(`/apps/${appid}`)}>
          Cancel
        </Button>
        <Button size="sm" variant="solid" color="success" type="submit" onClick={handleSubmit}>
          Save
        </Button>
      </Box>
    </>
  );
}

export default TaskDetailsModal;
