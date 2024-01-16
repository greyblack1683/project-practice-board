import React, { useState, useContext } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import axios from "axios";

import { Input, Box, Button, IconButton } from "@mui/joy";

import GlobalContext from "../components/GlobalContext";

import CancelIcon from "@mui/icons-material/Cancel";

function PlanRow({ row, setEditPlanRequest, isPM, setIsPM }) {
  const { handleAlerts } = useContext(GlobalContext);
  const { appid } = useParams();
  const { handleUserNotAuthorised } = useOutletContext();

  const [isEditing, setIsEditing] = useState(false);
  const [planName, setPlanName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      await axios
        .post("/plans/update", {
          plan_mvp_name: planName,
          plan_startdate: startDate,
          plan_enddate: endDate,
          plan_app_acronym: appid,
          app_acronym: appid
        })
        .then(response => {
          console.log(response);
          setEditPlanRequest(prev => prev + 1);
          handleAlerts(`Updated plan ${planName} successfully`, true);
          setIsEditing(false);
        })
        .catch(error => {
          console.log(error.response.data.message);
          handleUserNotAuthorised(error.response.data.message, null, appid);
          if (error.response.data.message.includes("not authorised")) setIsPM(false);
          handleAlerts(`${error.response.data.message}`, false);
        });
    } catch (error) {
      console.log(error);
      handleAlerts("Error: Internal Server Error", false);
    }
  };

  const handleEdit = () => {
    setPlanName(row.plan_mvp_name);
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
      <td>{isPM && isEditing ? <Input variant="soft" color="primary" type="date" size="sm" value={startDate} onChange={e => setStartDate(e.target.value)} /> : row.plan_startdate}</td>
      <td>{isPM && isEditing ? <Input variant="soft" color="primary" type="date" size="sm" value={endDate} onChange={e => setEndDate(e.target.value)} /> : row.plan_enddate}</td>
      <td>
        {isPM &&
          (isEditing ? (
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
          ))}
      </td>
    </tr>
  );
}

export default PlanRow;
