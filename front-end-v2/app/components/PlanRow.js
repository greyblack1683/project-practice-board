import React, { useEffect, useState, useContext } from "react";

import { Typography, Table, Sheet, Box, Button } from "@mui/joy";

function PlanRow({ row }) {
  const [isEditing, setIsEditing] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleEdit = () => {
    setStartDate(row.plan_startdate);
    setEndDate(row.plan_enddate);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setStartDate("");
    setEndDate("");
    setIsEditing(false);
  };

  return (
    <tr key={row.plan_mvp_name}>
      <td>{row.plan_mvp_name}</td>
      <td style={{ textAlign: "center" }}>{isEditing ? <Input variant="soft" color="primary" size="sm" value={startDate} onChange={e => setStartDate(e.target.value)} /> : row.plan_startdate}</td>
      <td style={{ textAlign: "center" }}>{isEditing ? <Input variant="soft" color="primary" size="sm" value={endDate} onChange={e => setEndDate(e.target.value)} /> : row.plan_enddate}</td>
      <td>
        {isEditing ? (
          <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center", alignItems: "center" }}>
            <Button onClick={handleSubmit} type="submit" size="sm" variant="soft" color="success">
              Save
            </Button>
            <IconButton onClick={handleCancel} size="sm" variant="plain" color="danger" sx={{ borderRadius: "50%" }}>
              <CancelIcon />
            </IconButton>
          </Box>
        ) : (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button onClick={handleEdit} size="sm" variant="soft">
              Edit
            </Button>
          </Box>
        )}
      </td>
    </tr>
  );
}

export default PlanRow;
