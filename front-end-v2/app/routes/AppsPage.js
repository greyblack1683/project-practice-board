import React, { useEffect, useState, useContext } from "react";
import { useNavigate, Out } from "react-router-dom";
import axios from "axios";

import GlobalContext from "../components/GlobalContext";

import Page from "../components/Page";
import AppCreateModal from "../components/AppCreateModal";
import AppDetailsModal from "../components/AppDetailsModal";

import { Typography, Table, Sheet, Box, Button, Modal, ModalClose } from "@mui/joy";

function AppsPage() {
  const [allApps, setAllApps] = useState([]);
  const [isPL, setIsPL] = useState(false);
  const [appChangeRequest, setAppChangeRequest] = useState(0);
  const [createApp, setCreateApp] = useState(false);
  const [editApp, setEditApp] = useState(false);
  const [editableAppID, setEditableAppID] = useState("");
  const navigate = useNavigate();

  const { handleAlerts } = useContext(GlobalContext);

  const handleEdit = appAcronym => {
    setEditableAppID(appAcronym);
    setEditApp(true);
  };

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
  }, [appChangeRequest]);

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
              maxWidth: "90rem"
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
                <Button variant="solid" size="sm" onClick={() => setCreateApp(true)}>
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
              maxWidth: "90rem",
              "--Table-firstColumnWidth": "180px",
              "--Table-lastColumnWidth": "160px",
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
                  <th style={{ verticalAlign: "top", width: "var(--Table-firstColumnWidth)" }}>Acronym</th>
                  <th style={{ verticalAlign: "top", textAlign: "center", whiteSpace: "normal", wordWrap: "break-word" }}>Start Date</th>
                  <th style={{ verticalAlign: "top", textAlign: "center", whiteSpace: "normal", wordWrap: "break-word" }}>End Date</th>
                  <th style={{ verticalAlign: "top", textAlign: "center", whiteSpace: "normal", wordWrap: "break-word" }}>Create Tasks</th>
                  <th style={{ verticalAlign: "top", textAlign: "center", whiteSpace: "normal", wordWrap: "break-word" }}>Edit Open Task</th>
                  <th style={{ verticalAlign: "top", textAlign: "center", whiteSpace: "normal", wordWrap: "break-word" }}>Edit To Do Task</th>
                  <th style={{ verticalAlign: "top", textAlign: "center", whiteSpace: "normal", wordWrap: "break-word" }}>Edit Doing Task</th>
                  <th style={{ verticalAlign: "top", textAlign: "center", whiteSpace: "normal", wordWrap: "break-word" }}>Edit Done Task</th>

                  <th rowSpan={2} aria-label="last" style={{ width: "var(--Table-lastColumnWidth)" }} />
                </tr>
              </thead>
              <tbody>
                {allApps &&
                  allApps.map(row => {
                    return (
                      <tr key={row.app_acronym}>
                        <td>{row.app_acronym}</td>
                        <td style={{ textAlign: "center" }}>{row.app_startdate}</td>
                        <td style={{ textAlign: "center" }}>{row.app_enddate}</td>
                        <td style={{ textAlign: "center" }}>{row.app_permit_create}</td>
                        <td style={{ textAlign: "center" }}>{row.app_permit_open}</td>
                        <td style={{ textAlign: "center" }}>{row.app_permit_todolist}</td>
                        <td style={{ textAlign: "center" }}>{row.app_permit_doing}</td>
                        <td style={{ textAlign: "center" }}>{row.app_permit_done}</td>
                        <td>
                          <Box sx={{ display: "flex", gap: 1, justifyContent: "center", alignItems: "center" }}>
                            <Button size="sm" variant="plain" color="primary" onClick={() => handleEdit(row.app_acronym)}>
                              View
                            </Button>
                            <Button size="sm" variant="outlined" color="primary" onClick={() => navigate(`/apps/${row.app_acronym}`)}>
                              Kanban
                            </Button>
                          </Box>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
            {!allApps && (
              <Typography level="body-sm" sx={{ textAlign: "center", flexGrow: 1, m: "2rem" }}>
                There are no applications created.
              </Typography>
            )}
          </Sheet>
        </Box>
      </Box>
      <Modal aria-labelledby="modal-title" aria-describedby="modal-desc" open={createApp} onClose={() => setCreateApp(false)} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Sheet
          variant="outlined"
          sx={{
            width: "60%",
            borderRadius: "md",
            p: 3,
            boxShadow: "lg"
          }}
        >
          <ModalClose variant="plain" sx={{ m: 1 }} />

          <AppCreateModal setAppChangeRequest={setAppChangeRequest} setCreateApp={setCreateApp} setIsPL={setIsPL} />
        </Sheet>
      </Modal>
      <Modal aria-labelledby="modal-title" aria-describedby="modal-desc" open={editApp} onClose={() => setEditApp(false)} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Sheet
          variant="outlined"
          sx={{
            maxWidth: "70rem",
            borderRadius: "md",
            p: 3,
            boxShadow: "lg",
            height: "50rem"
          }}
        >
          <ModalClose variant="plain" sx={{ m: 1 }} />

          <AppDetailsModal appid={editableAppID} setAppChangeRequest={setAppChangeRequest} setCreateApp={setCreateApp} />
        </Sheet>
      </Modal>
    </Page>
  );
}

export default AppsPage;
