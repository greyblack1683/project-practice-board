import React from "react";

import { Typography, Card, CardContent, Chip, Stack, Link } from "@mui/joy";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

function TaskCard({ taskID, taskName, taskOwner, taskPlan, handleView }) {
  return (
    <Card
      variant="plain"
      sx={{
        boxShadow: "sm",
        "&:hover": { boxShadow: "md", borderColor: "neutral.outlinedHoverBorder" }
      }}
    >
      <CardContent>
        <Typography level="title-sm">
          <Link overlay underline="none" onClick={handleView}>
            {taskName}
          </Link>
        </Typography>
        <Stack direction="row" justifyContent="flex-start" alignItems="center" sx={{ ml: "-0.3rem" }}>
          <Chip color="primary" size="sm" disabled>
            # {taskID}
          </Chip>
          {taskPlan && (
            <Chip color="primary" size="sm" disabled startDecorator={<CalendarMonthIcon />}>
              {taskPlan}
            </Chip>
          )}
        </Stack>
        {/* {taskPlan && (
          <Stack direction="row" justifyContent="flex-start" alignItems="center" sx={{ ml: "-0.3rem", mt: "-0.2rem" }}>
            <Chip color="primary" size="sm" disabled startDecorator={<CalendarMonthIcon />}>
              {taskPlan}
            </Chip>
          </Stack>
        )} */}

        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} sx={{ ml: "-0.3rem" }}>
          <Typography />
          <Chip variant="soft" color="primary" size="sm" startDecorator={<AccountCircleIcon />}>
            {taskOwner}
          </Chip>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default TaskCard;
