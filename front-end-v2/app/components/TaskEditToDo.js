import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import axios from "axios";

import GlobalContext from "./GlobalContext";

import { Button, Box, Input, FormControl, FormLabel, Textarea, Stack } from "@mui/joy";

function TaskEditToDo({ taskDetails, setIsEditing, taskDesc, setTaskDesc, taskNotes, setTaskNotes, setTaskChangeRequest, handleClose }) {
  const { handleAlerts } = useContext(GlobalContext);
  const { handleUserNotAuthorised, checkPermission } = useOutletContext();
  const { appid } = useParams();
  const navigate = useNavigate();

  const handleSave = async action => {
    try {
      await axios
        .post("/tasks/updatetodo", {
          task_id: taskDetails.task_id,
          task_description: taskDesc,
          task_notes: taskNotes,
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
          handleUserNotAuthorised(error.response.data.message, null, appid);
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
            <Input variant="solid" color="neutral" value={taskDetails.task_plan} disabled />
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
        <Button size="sm" variant="plain" color="danger" onClick={() => setIsEditing(false)}>
          Cancel
        </Button>
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

export default TaskEditToDo;
