import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import GlobalContext from "./GlobalContext";

import { Button, Box, FormControl, FormLabel, Textarea, Autocomplete, AutocompleteOption, ListItemContent, Typography, Stack } from "@mui/joy";

function TaskEditOpen({ taskDetails, setIsEditing, taskPlan, setTaskPlan, taskDesc, setTaskDesc, taskNotes, setTaskNotes, allPlans, setTaskChangeRequest, handleClose }) {
  const { handleAlerts } = useContext(GlobalContext);
  const { appid } = useParams();

  const handleSave = async action => {
    if (!confirm(`Are you sure that you want to ${action === "promote" ? action : "save"}?`)) return;

    let taskNotesData = null;
    console.log("old task plan", taskDetails?.task_plan, "new task plan", taskPlan?.plan_mvp_name);
    if (taskNotes) {
      if (taskDetails?.task_plan != taskPlan?.plan_mvp_name) {
        taskNotesData = `Changes made to plan from '${taskDetails.task_plan ? taskDetails.task_plan : "-"}' to '${taskPlan ? taskPlan.plan_mvp_name : "-"}'.\n ${taskNotes}`;
      } else {
        taskNotesData = taskNotes;
      }
    } else {
      if (taskDetails?.task_plan != taskPlan?.plan_mvp_name) {
        taskNotesData = `Changes made to plan from '${taskDetails.task_plan ? taskDetails.task_plan : "-"}' to '${taskPlan ? taskPlan.plan_mvp_name : "-"}'.`;
      }
    }
    try {
      await axios
        .post("/tasks/updateOpen", {
          task_id: taskDetails.task_id,
          task_description: taskDesc,
          task_notes: taskNotesData,
          task_plan: taskPlan ? taskPlan.plan_mvp_name : null,
          action,
          app_acronym: appid
        })
        .then(response => {
          console.log(response);
          setTaskNotes("");
          setTaskChangeRequest(prev => prev + 1);
          setIsEditing(false);
          if (action === "promote") handleClose();
          handleAlerts(`Updated task ${taskDetails.task_id} successfully`, true);
        })
        .catch(error => {
          console.log(error.response.data.message);
          if (error.response.data.message.includes("not authorised")) handleClose();
          handleAlerts(`${error.response.data.message}`, false);
        });
    } catch (error) {
      console.log(error);
      handleAlerts("Error: Internal Server Error", false);
    }
  };

  return (
    <Stack direction="column" sx={{ m: "2rem" }}>
      <Box display="flex" justifyContent="center" sx={{ flexDirection: "row", gap: 5 }}>
        <Box sx={{ width: "35%" }}>
          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea variant="soft" minRows={7} maxRows={7} color="primary" value={taskDesc} onChange={e => setTaskDesc(e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel sx={{ mt: "1.35rem" }}>Plan</FormLabel>
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
        <Box sx={{ width: "65%", flexDirection: "column" }}>
          <FormControl>
            <FormLabel>Notes</FormLabel>
            <Textarea variant="soft" size="sm" minRows={12} maxRows={12} color="neutral" value={taskDetails.task_notes} readOnly />
          </FormControl>
        </Box>
      </Box>

      <FormControl sx={{ mt: "1.35rem" }}>
        <FormLabel>Additional Notes</FormLabel>
        <Textarea variant="soft" color="primary" minRows={4} maxRows={4} value={taskNotes} onChange={e => setTaskNotes(e.target.value)} />
      </FormControl>
      <Box sx={{ display: "flex", gap: 2, justifyContent: "center", alignItems: "bottom", mt: "3rem" }}>
        {/* <Button size="sm" variant="plain" color="danger" onClick={() => setIsEditing(false)}>
          Cancel
        </Button> */}
        <Button size="sm" variant="solid" color="primary" onClick={() => handleSave("none")}>
          Save
        </Button>
        <Button size="sm" variant="solid" color="success" onClick={() => handleSave("promote")}>
          Save & Promote
        </Button>
      </Box>
    </Stack>
  );
}

export default TaskEditOpen;
