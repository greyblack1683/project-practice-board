import React, { useEffect, useState, useContext } from "react";

import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import axios from "axios";

import GlobalContext from "../components/GlobalContext";

import Page from "../components/Page";
import PlansModal from "../components/PlansModal";

import { Typography, Table, Sheet, Box, Button, Modal, ModalClose } from "@mui/joy";

function KanbanPage() {
  const { appid } = useParams();
  const { checkPermission } = useOutletContext();
  const [isPM, setIsPM] = useState(false);
  const navigate = useNavigate();

  const { handleAlerts } = useContext(GlobalContext);

  const [viewPlans, setViewPlans] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    console.log("Running useEffect to check if user is of project manager");
    async function check() {
      const response = await checkPermission("create", appid, false);
      console.log(response);
      if (response) setIsPM(true);
    }
    check();

    return controller.abort();
  }, []);
  return (
    <Page title="Kanban">
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
              Tasks of {appid}
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 1.5,
                alignItems: "center"
              }}
            >
              <Button variant="outlined" size="sm" onClick={() => setViewPlans(true)}>
                View Plans
              </Button>
              {isPM && (
                <Button variant="solid" size="sm" onClick={() => navigate(`/apps/${appid}/plans/create`)}>
                  Add Tasks
                </Button>
              )}
            </Box>
          </Box>
          <Sheet
            variant="plain"
            sx={{
              ml: "2rem",
              mr: "2rem",
              mt: "1rem",
              mb: "1rem",
              maxWidth: "90rem",
              // "--Table-firstColumnWidth": "250px",
              // "--Table-lastColumnWidth": "150px",
              // // background needs to have transparency to show the scrolling shadows
              // "--TableRow-stripeBackground": "rgba(0 0 0 / 0.04)",
              // "--TableRow-hoverBackground": "rgba(0 0 0 / 0.08)",
              overflow: "auto",
              backgroundColor: "background.surface"
            }}
          >
            <Table
              borderAxis="yBetween"
              stickyHeader
              sx={{
                // "& tr > *:first-of-type": {
                //   position: "sticky",
                //   left: 0,
                //   boxShadow: "1px 0 var(--TableCell-borderColor)",
                //   bgcolor: "background.surface"
                // },
                // "& tr > *:last-child": {
                //   position: "sticky",
                //   right: 0,
                //   bgcolor: "var(--TableCell-headBackground)"
                // },
                whiteSpace: "normal",
                wordWrap: "break-word"
              }}
            >
              <thead>
                <tr>
                  <th style={{ textAlign: "center" }}>
                    <Typography level="title-md" variant="soft" sx={{ mr: "0.2rem", padding: "0.5rem" }}>
                      Open
                    </Typography>
                  </th>
                  <th style={{ textAlign: "center" }}>
                    <Typography level="title-md" variant="soft" sx={{ ml: "0.2rem", mr: "0.2rem", padding: "0.5rem" }}>
                      To Do
                    </Typography>
                  </th>
                  <th style={{ textAlign: "center" }}>
                    <Typography level="title-md" variant="soft" sx={{ ml: "0.2rem", mr: "0.2rem", padding: "0.5rem" }}>
                      Doing
                    </Typography>
                  </th>
                  <th style={{ textAlign: "center" }}>
                    <Typography level="title-md" variant="soft" sx={{ ml: "0.2rem", mr: "0.2rem", padding: "0.5rem" }}>
                      Done
                    </Typography>
                  </th>
                  <th style={{ textAlign: "center" }}>
                    <Typography level="title-md" variant="soft" sx={{ ml: "0.2rem", padding: "0.5rem" }}>
                      Closed
                    </Typography>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>1</td>
                  <td>1</td>
                  <td>1</td>
                  <td>1</td>
                </tr>
              </tbody>
            </Table>
          </Sheet>
        </Box>
      </Box>
      <Modal aria-labelledby="modal-title" aria-describedby="modal-desc" open={viewPlans} onClose={() => setViewPlans(false)} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Sheet
          variant="outlined"
          sx={{
            maxWidth: "50rem",
            borderRadius: "md",
            p: 3,
            boxShadow: "lg",
            height: "50rem"
          }}
        >
          <ModalClose variant="plain" sx={{ m: 1 }} />
          <PlansModal />
        </Sheet>
      </Modal>
    </Page>
  );
}

export default KanbanPage;
