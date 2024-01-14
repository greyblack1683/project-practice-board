import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import axios from "axios";

import GlobalContext from "../components/GlobalContext";

import Page from "../components/Page";
import BCContainer from "../components/BCContainer";

import { Typography, Table, Sheet, Box, Button } from "@mui/joy";

function PlansPage() {
  const { appid } = useParams();
  const [allPlans, setAllPlans] = useState([]);
  const [handleUserNotAuthorised, checkGroup, checkPermission] = useOutletContext();
  const [isPM, setIsPM] = useState(false);
  const navigate = useNavigate();

  const { handleAlerts } = useContext(GlobalContext);

  useEffect(() => {
    const controller = new AbortController();
    async function getApps() {
      try {
        await axios
          .post("/plans/selected", {
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
  }, []);

  useEffect(() => {
    console.log("Running useEffect to check if user is of project manager");
    async function check() {
      const response = await checkPermission("plans_create", appid, false);
      console.log(response);
      if (response) setIsPM(true);
    }
    check();
  }, []);
  return (
    <Page title="Plans">
      <Box display="flex" justifyContent="center">
        <Box>
          <BCContainer appid={appid} control={1} />
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              m: "2rem",
              maxWidth: "70rem"
            }}
          >
            <Typography level="h3" sx={{ textAlign: "left", flexGrow: 1 }}>
              Plans
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 1.5,
                alignItems: "center"
              }}
            >
              {isPM && (
                <Button variant="solid" size="sm" onClick={() => navigate(`/apps/${appid}/plans/create`)}>
                  Add Plan
                </Button>
              )}
              <Button size="sm" variant="outlined" color="primary" onClick={() => navigate(`/apps/${appid}/plans/null/tasks`)}>
                Tasks Without Plan
              </Button>
            </Box>
          </Box>
          <Sheet
            variant="outlined"
            sx={{
              ml: "2rem",
              mr: "2rem",
              mt: "1rem",
              mb: "1rem",
              borderRadius: "sm",
              maxWidth: "70rem",
              "--Table-firstColumnWidth": "250px",
              "--Table-lastColumnWidth": "150px",
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
                  <th style={{ textAlign: "center" }}>Start Date</th>
                  <th style={{ textAlign: "center" }}>End Date</th>
                  <th aria-label="last" style={{ width: "var(--Table-lastColumnWidth)" }} />
                </tr>
              </thead>
              <tbody>
                {allPlans &&
                  allPlans.map(row => {
                    return (
                      <tr key={row.plan_mvp_name}>
                        <td>{row.plan_mvp_name}</td>
                        <td style={{ textAlign: "center" }}>{row.plan_startdate}</td>
                        <td style={{ textAlign: "center" }}>{row.plan_enddate}</td>
                        <td>
                          {" "}
                          <Box sx={{ display: "flex", gap: 1, justifyContent: "center", alignItems: "center" }}>
                            <Button size="sm" variant="plain" color="primary" onClick={() => navigate(`/apps/${row.plan_app_acronym}/plans/${row.plan_mvp_name}`)}>
                              View
                            </Button>
                            <Button size="sm" variant="outlined" color="primary" onClick={() => navigate(`/apps/${row.plan_app_acronym}/plans/${row.plan_mvp_name}/tasks`)}>
                              Tasks
                            </Button>
                          </Box>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
            {!allPlans && (
              <Typography level="body-sm" sx={{ textAlign: "center", flexGrow: 1, m: "2rem" }}>
                There are no plans under this application.
              </Typography>
            )}
          </Sheet>
        </Box>
      </Box>
    </Page>
  );
}

export default PlansPage;
