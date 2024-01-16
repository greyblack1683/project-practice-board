import React, { useEffect, useState, useContext } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import axios from "axios";

import GlobalContext from "./GlobalContext";
import PlanRow from "./PlanRow";
import CreatePlan from "./CreatePlan";

import { Typography, Table, Sheet, Box } from "@mui/joy";

function PlansModal() {
  const { appid } = useParams();
  const { checkPermission } = useOutletContext();
  const { handleAlerts } = useContext(GlobalContext);

  const [allPlans, setAllPlans] = useState([]);
  const [isPM, setIsPM] = useState(false);
  const [editPlanRequest, setEditPlanRequest] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    async function getApps() {
      try {
        await axios
          .post("/plans/forapp", {
            plan_app_acronym: appid
          })
          .then(response => setAllPlans(response.data.results))
          .catch(error => {
            console.log(error.response.data.message);
            handleAlerts(`${error.response.data.message}`, false);
          });
      } catch (error) {
        console.log(error);
        handleAlerts("Error: Internal Server Error", false);
      }
    }
    getApps();

    return controller.abort();
  }, [editPlanRequest]);

  useEffect(() => {
    console.log("Running useEffect to check if user is of project manager");
    async function check() {
      const response = await checkPermission("open", appid, false);
      console.log(response);
      if (response) setIsPM(true);
    }
    check();
  }, []);
  return (
    <Box display="flex" justifyContent="center">
      <Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            m: "2rem",
            maxWidth: "80rem"
          }}
        >
          <Typography level="h3" sx={{ textAlign: "left", flexGrow: 1 }}>
            Plans
          </Typography>
        </Box>
        {isPM && <CreatePlan setEditPlanRequest={setEditPlanRequest} setIsPM={setIsPM} />}
        <Sheet
          variant="outlined"
          sx={{
            ml: "2rem",
            mr: "2rem",
            mt: "1rem",
            mb: "1rem",
            borderRadius: "sm",
            maxWidth: "80rem",
            "--Table-firstColumnWidth": "200px",
            "--Table-lastColumnWidth": "120px",
            // background needs to have transparency to show the scrolling shadows
            "--TableRow-stripeBackground": "rgba(0 0 0 / 0.04)",
            "--TableRow-hoverBackground": "rgba(0 0 0 / 0.08)",
            overflow: "auto",
            backgroundColor: "background.surface"
          }}
        >
          <Table
            borderAxis="xBetween"
            stickyHeader
            hoverRow
            sx={{
              // "& tr > *:first-of-type": {
              //   position: "sticky",
              //   left: 0,
              //   boxShadow: "1px 0 var(--TableCell-borderColor)",
              //   bgcolor: "background.surface"
              // },
              "& tr > *:last-child": {
                position: "sticky",
                right: 0,
                bgcolor: "var(--TableCell-headBackground)"
              },
              whiteSpace: "normal",
              wordWrap: "break-word"
            }}
          >
            <thead>
              <tr>
                <th style={{ width: "var(--Table-firstColumnWidth)" }}>Plan Name</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th aria-label="last" style={{ width: "var(--Table-lastColumnWidth)" }} />
              </tr>
            </thead>
            <tbody>{allPlans && allPlans.map(row => <PlanRow row={row} key={row.plan_mvp_name} setEditPlanRequest={setEditPlanRequest} isPM={isPM} setIsPM={setIsPM} />)}</tbody>
          </Table>
          {!allPlans && (
            <Typography level="body-sm" sx={{ textAlign: "center", flexGrow: 1, m: "2rem" }}>
              There are no plans under this application.
            </Typography>
          )}
        </Sheet>
      </Box>
    </Box>
  );
}

export default PlansModal;
