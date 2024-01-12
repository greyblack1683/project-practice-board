import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import GlobalContext from "../components/GlobalContext";

import Page from "../components/Page";

import { Typography, Table, Sheet, Box, Button } from "@mui/joy";

function AppsPage() {
  const [allApps, setAllApps] = useState([]);
  const [isPL, setIsPL] = useState(false);
  const navigate = useNavigate();

  const { handleAlerts } = useContext(GlobalContext);

  useEffect(() => {
    const controller = new AbortController();
    async function getApps() {
      try {
        await axios
          .get("/apps/all")
          .then(response => setAllApps(response.data.results))
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
    console.log("Running useEffect to check if user is project lead");
    async function checkGroup(authorisedGroup) {
      try {
        await axios
          .post("/authorize", { authorisedGroup })
          .then(response => setIsPL(response.data.success))
          .catch(error => {
            console.log(error.response.data.message);
            handleAlerts(`${error.response.data.message}`, false);
          });
      } catch (error) {
        console.log(error);
        handleAlerts("Error: Internal Server Error", false);
      }
    }

    checkGroup("projectlead");
  }, []);
  return (
    <Page title="Apps">
      <Box display="flex" justifyContent="center">
        <Box>
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
              Applications
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 1.5,
                alignItems: "center"
              }}
            >
              {isPL && (
                <Button variant="outlined" size="sm" onClick={() => navigate(`/apps/create`)}>
                  Add Application
                </Button>
              )}
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
                  <th style={{ width: "var(--Table-firstColumnWidth)" }}>Acronym</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th aria-label="last" style={{ width: "var(--Table-lastColumnWidth)" }} />
                </tr>
              </thead>
              <tbody>
                {allApps &&
                  allApps.map(row => {
                    return (
                      <tr key={row.app_acronym}>
                        <td>{row.app_acronym}</td>
                        <td>{row.app_startdate}</td>
                        <td>{row.app_enddate}</td>
                        <td>
                          {" "}
                          <Box sx={{ display: "flex", gap: 1, justifyContent: "center", alignItems: "center" }}>
                            <Button size="sm" variant="plain" color="primary" onClick={() => navigate(`/apps/${row.app_acronym}`)}>
                              View
                            </Button>
                            <Button size="sm" variant="outlined" color="primary" onClick={() => navigate(`/apps/${row.app_acronym}/plans`)}>
                              Plans
                            </Button>
                          </Box>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          </Sheet>
        </Box>
      </Box>
    </Page>
  );
}

export default AppsPage;
