import React from "react";

import { Button, Box, Input, FormControl, FormLabel, Textarea } from "@mui/joy";

function TaskView({ taskDetails, handleEdit, editable }) {
  return (
    <>
      <Box display="flex" justifyContent="center" sx={{ flexDirection: "row", gap: 5, m: "2rem" }}>
        <Box sx={{ width: "35%" }}>
          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea variant="soft" minRows={7} maxRows={7} color="neutral" value={taskDetails.task_description} readOnly />
          </FormControl>
          <FormControl>
            <FormLabel sx={{ mt: "1.35rem" }}>Plan</FormLabel>
            <Input variant="soft" color="neutral" value={taskDetails.task_plan} readOnly />
          </FormControl>
        </Box>
        <Box sx={{ width: "65%", flexDirection: "column" }}>
          <FormControl>
            <FormLabel>Notes</FormLabel>
            <Textarea variant="soft" size="sm" minRows={12} maxRows={12} color="neutral" value={taskDetails.task_notes} readOnly />
          </FormControl>
        </Box>
      </Box>
      {editable && (
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center", alignItems: "bottom", mt: "3rem" }}>
          <Button size="sm" variant="solid" color="primary" onClick={handleEdit}>
            Edit
          </Button>
        </Box>
      )}
    </>
  );
}

export default TaskView;
