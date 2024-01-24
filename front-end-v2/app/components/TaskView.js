import React from "react";

import { Button, Box, Input, FormControl, FormLabel, Textarea, Chip, Tooltip } from "@mui/joy";

import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

function TaskView({ taskDetails, handleEdit, editable, taskPlan }) {
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
            <Input
              variant="soft"
              color="neutral"
              value={taskDetails.task_plan}
              readOnly
              endDecorator={
                taskPlan && (
                  <Tooltip title={`${taskPlan.plan_startdate} to ${taskPlan.plan_enddate}`} variant="soft">
                    <Chip startDecorator={<CalendarTodayIcon />} variant="soft" size="md" sx={{ mr: "-0.5rem" }} />
                  </Tooltip>
                )
              }
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
