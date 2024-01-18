import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import axios from "axios";

import GlobalContext from "./GlobalContext";

import { Stack, Button, Box, Input, FormControl, FormLabel, Typography, Autocomplete, AutocompleteOption, ListItemContent, Textarea, Chip } from "@mui/joy";

import TaskAltIcon from "@mui/icons-material/TaskAlt";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

function TaskDetailsModal({ taskID, setViewTask }) {
  const { handleAlerts } = useContext(GlobalContext);
  const { handleUserNotAuthorised, checkPermission } = useOutletContext();
  const { appid } = useParams();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [allPlans, setAllPlans] = useState({});
  const [taskDesc, setTaskDesc] = useState("");
  const [taskNotes, setTaskNotes] = useState("");
  const [taskPlan, setTaskPlan] = useState(null);
  const [taskDetails, setTaskDetails] = useState({});

  const handleSubmit = () => {
    alert("yo");
  };

  const statusColor = status => {
    switch (status) {
      case "todo":
        return "primary";
      case "doing":
        return "warning";
      case "done":
        return "success";
      default:
        return "neutral";
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    async function getSelectedTask(plans) {
      try {
        await axios
          .post("/tasks/selected", {
            task_id: taskID
          })
          .then(response => {
            const plan = plans.filter(plan => plan.plan_mvp_name === response.data.results.task_plan);
            console.log("plan", plan, plan[0]);
            console.log(response.data.results);
            setTaskDesc(response.data.results.task_description);
            setTaskNotes(response.data.results.task_notes);
            setTaskPlan(plan[0]);
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

    async function getPlans() {
      try {
        const response = await axios
          .post("/plans/forapp", {
            plan_app_acronym: appid
          })
          .catch(error => {
            console.log(error.response.data.message);
            handleAlerts(`${error.response.data.message}`, false);
          });
        if (response) {
          console.log(response.data.results);
          setAllPlans(response.data.results);
          getSelectedTask(response.data.results);
        }
      } catch (error) {
        console.log(error);
        handleAlerts("Error: Internal Server Error", false);
      }
    }

    getPlans();
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
        <Stack>
          <Typography level="h3" sx={{ textAlign: "left" }}>
            View Task # {taskID} for {appid}
          </Typography>
          <Typography level="body-xs" sx={{ textAlign: "left", mt: "0.1rem", mb: "0.5rem" }}>
            Created by {taskDetails.task_creator} on {taskDetails.task_createdate}
          </Typography>
          <Stack direction="row" spacing={0.5}>
            <Chip size="sm" variant={taskDetails.task_status === "open" ? "outlined" : "soft"} color={statusColor(taskDetails.task_status)} startDecorator={<TaskAltIcon />}>
              Status: {taskDetails.task_status}
            </Chip>
            <Chip size="sm" color="primary" variant="soft" startDecorator={<AccountCircleIcon />}>
              Owner: {taskDetails.task_owner}
            </Chip>
          </Stack>
        </Stack>
      </Box>
      <Box display="flex" justifyContent="center" sx={{ flexDirection: "row", gap: 5, m: "2rem" }}>
        <Box sx={{ width: "40%" }}>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input variant="soft" color="neutral" value={taskDetails.task_name} readOnly />
          </FormControl>
          <FormControl>
            <FormLabel sx={{ mt: "1rem" }}>Description</FormLabel>
            <Textarea variant="soft" minRows={4} maxRows={4} color="neutral" value={taskDesc} readOnly />
          </FormControl>
          <FormControl>
            <FormLabel sx={{ mt: "1rem" }}>Plan</FormLabel>
            <Input variant="soft" color="neutral" value={taskDetails.task_plan} readOnly />
            {/* <Autocomplete
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
            /> */}
          </FormControl>
        </Box>
        <Box sx={{ width: "60%", flexDirection: "column" }}>
          <FormControl>
            <FormLabel>Notes</FormLabel>
            <Textarea variant="soft" size="sm" minRows={14} maxRows={14} color="neutral" value={taskNotes} onChange={e => setTaskNotes(e.target.value)} readOnly />
          </FormControl>
          {/* <FormControl sx={{ mt: "1rem" }}>
            <FormLabel>New Note</FormLabel>
            <Textarea variant="soft" size="sm" minRows={3} maxRows={3} variant="outlined" />
          </FormControl> */}
        </Box>
      </Box>
      <Box sx={{ display: "flex", gap: 2, justifyContent: "center", alignItems: "bottom", mt: "3rem", mb: "2rem" }}>
        <Button size="sm" variant="solid" color="primary" onClick={() => setIsEditing(true)}>
          Edit
        </Button>
      </Box>
    </>
  );
}

export default TaskDetailsModal;
