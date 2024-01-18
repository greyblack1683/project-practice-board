import React from "react";

import { Button, Box, Input, FormControl, FormLabel, Textarea } from "@mui/joy";

function TaskView({ taskDetails, handleEdit, editable }) {
  return (
    <>
      <Box display="flex" justifyContent="center" sx={{ flexDirection: "row", gap: 5, m: "2rem" }}>
        <Box sx={{ width: "35%" }}>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input variant="soft" color="neutral" value={taskDetails.task_name} readOnly />
          </FormControl>
          <FormControl>
            <FormLabel sx={{ mt: "1rem" }}>Description</FormLabel>
            <Textarea variant="soft" minRows={4} maxRows={4} color="neutral" value={taskDetails.task_description} readOnly />
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
        <Box sx={{ width: "65%", flexDirection: "column" }}>
          <FormControl>
            <FormLabel>Notes</FormLabel>
            <Textarea variant="soft" size="sm" minRows={14} maxRows={14} color="neutral" value={taskDetails.task_notes} readOnly />
          </FormControl>
          {/* <FormControl sx={{ mt: "1rem" }}>
            <FormLabel>New Note</FormLabel>
            <Textarea variant="soft" size="sm" minRows={3} maxRows={3} variant="outlined" />
          </FormControl> */}
        </Box>
      </Box>
      {editable && (
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center", alignItems: "bottom", mt: "3rem", mb: "2rem" }}>
          <Button size="sm" variant="solid" color="primary" onClick={handleEdit}>
            Edit
          </Button>
        </Box>
      )}
    </>
  );
}

export default TaskView;