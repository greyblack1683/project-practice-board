import React from "react";

import { Button, Box, Input, FormControl, FormLabel, Textarea, Autocomplete, AutocompleteOption, ListItemContent, Typography } from "@mui/joy";

function TaskView({ taskDetails, setIsEditing, taskPlan, setTaskPlan, taskDesc, setTaskDesc, taskNotes, setTaskNotes, allPlans }) {
  return (
    <>
      <Box display="flex" justifyContent="center" sx={{ flexDirection: "row", gap: 5, m: "2rem" }}>
        <Box sx={{ width: "35%" }}>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input variant="soft" color="neutral" value={taskDetails.task_name} />
          </FormControl>
          <FormControl>
            <FormLabel sx={{ mt: "1rem" }}>Description</FormLabel>
            <Textarea variant="soft" minRows={4} maxRows={4} color="neutral" value={taskDesc} onChange={e => setTaskDesc(e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel sx={{ mt: "1rem" }}>Plan</FormLabel>
            {/* <Input variant="soft" color="neutral" value={taskPlan} onChange={e => setTaskPlan(e.target.value)} /> */}
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
            <Textarea variant="soft" size="sm" minRows={14} maxRows={14} color="neutral" value={taskDetails.task_notes} readOnly />
          </FormControl>
          <FormControl sx={{ mt: "1rem" }}>
            <FormLabel>New Note</FormLabel>
            <Textarea variant="outlined" size="sm" minRows={3} maxRows={3} value={taskNotes} onChange={e => setTaskNotes(e.target.value)} />
          </FormControl>
        </Box>
      </Box>

      <Box sx={{ display: "flex", gap: 2, justifyContent: "center", alignItems: "bottom", mt: "3rem", mb: "2rem" }}>
        <Button size="sm" variant="plain" color="danger" onClick={() => setIsEditing(false)}>
          Cancel
        </Button>
      </Box>
    </>
  );
}

export default TaskView;
