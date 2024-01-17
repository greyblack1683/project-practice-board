import React from "react";

import { Typography, Card, CardContent, Stack } from "@mui/joy";

function TaskStateCard({ taskStatus, children }) {
  return (
    <Card variant="soft" sx={{ width: "20%" }}>
      <CardContent>
        <Typography level="title-md" sx={{ textAlign: "center", mb: "1rem" }}>
          {taskStatus}
        </Typography>
        <Stack spacing={1.2}>{children}</Stack>
      </CardContent>
    </Card>
  );
}

export default TaskStateCard;
