import React from "react";

function TaskView() {
  return (
    <>
      <Box display="flex" justifyContent="center" sx={{ flexDirection: "row", gap: 5, m: "2rem" }}>
        <Box sx={{ width: "40%" }}>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input variant="solid" color="primary" value={taskDetails.task_name} disabled={true} />
          </FormControl>
          {/* <FormControl>
            <FormLabel sx={{ mt: "1rem" }}>ID</FormLabel>
            <Input variant="solid" color="primary" value={taskID} disabled={true} />
          </FormControl> */}
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
          {/* <FormControl>
            <FormLabel sx={{ mt: "1rem" }}>Task Owner</FormLabel>
            <Input variant="solid" color="primary" value={taskDetails.task_owner} disabled={true} />
          </FormControl>
          <FormControl>
            <FormLabel sx={{ mt: "1rem" }}>Status</FormLabel>
            <Input variant="solid" color="primary" value={taskDetails.task_status} disabled={true} />
          </FormControl>
          <FormControl>
            <FormLabel sx={{ mt: "1rem" }}>Created By</FormLabel>
            <Input variant="solid" color="primary" value={taskDetails.task_creator} disabled={true} />
          </FormControl>
          <FormControl>
            <FormLabel sx={{ mt: "1rem" }}>Created On</FormLabel>
            <Input variant="solid" color="primary" value={taskDetails.task_createdate} disabled={true} />
          </FormControl> */}
        </Box>
        <Box sx={{ width: "60%" }}>
          <FormControl>
            <FormLabel>Notes</FormLabel>
            <Textarea variant="soft" size="sm" minRows={16} maxRows={16} color="primary" value={taskNotes} onChange={e => setTaskNotes(e.target.value)} />
          </FormControl>
        </Box>
      </Box>
      <Box sx={{ display: "flex", gap: 2, justifyContent: "center", alignItems: "center", mt: "3rem", mb: "2rem" }}>
        <Button size="sm" variant="plain" color="danger" onClick={() => setViewTask(false)}>
          Cancel
        </Button>
        <Button size="sm" variant="solid" color="success" type="submit" onClick={handleSubmit}>
          Save
        </Button>
      </Box>
    </>
  );
}

export default TaskView;
