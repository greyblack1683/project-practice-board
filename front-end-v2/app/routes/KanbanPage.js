import React, { useEffect, useState, useContext } from "react";

import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import axios from "axios";

import GlobalContext from "../components/GlobalContext";

import Page from "../components/Page";
import TaskStateCard from "../components/TaskStateCard";
import TaskCard from "../components/TaskCard";
import PlansModal from "../components/PlansModal";
import TaskCreateModal from "../components/TaskCreateModal";
import TaskDetailsModal from "../components/TaskDetailsModal";

import { Typography, Sheet, Box, Button, Modal, ModalClose, Card, CardContent, Stack } from "@mui/joy";

function KanbanPage() {
  const { appid } = useParams();
  const { checkPermission } = useOutletContext();
  const [isPL, setIsPL] = useState(false);
  const navigate = useNavigate();

  const { handleAlerts } = useContext(GlobalContext);

  const [viewPlans, setViewPlans] = useState(false);
  const [addTask, setAddTask] = useState(false);
  const [viewTask, setViewTask] = useState(false);
  const [allTasks, setAllTasks] = useState([]);
  const [editableTaskID, setEditableTaskID] = useState("");

  const [taskChangeRequest, setTaskChangeRequest] = useState(0);

  const handleView = taskID => {
    setEditableTaskID(taskID);
    setViewTask(true);
  };

  const handleClose = () => {
    setViewTask(false);
    setTaskChangeRequest(prev => prev + 1);
  };

  useEffect(() => {
    const controller = new AbortController();
    console.log("Running useEffect to check if user is of project lead");
    async function check() {
      const response = await checkPermission("create", appid, false);
      console.log(response);
      if (response) setIsPL(true);
    }
    check();

    return controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    console.log("Running useEffect to get tasks of this application");

    async function getTasks() {
      try {
        await axios
          .post("/tasks/forapp", {
            task_app_acronym: appid
          })
          .then(response => {
            console.log(response.data.results);
            setAllTasks(response.data.results);
          })
          .catch(error => {
            console.log(error.response.data.message);
            handleAlerts(`${error.response.data.message}`, false);
          });
      } catch (error) {
        console.log(error);
        handleAlerts("Error: Internal Server Error", false);
      }
    }

    getTasks();
    return controller.abort();
  }, [taskChangeRequest]);

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
              minWidth: "80rem",
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
                Plans
              </Button>
              {isPL && (
                <Button variant="solid" size="sm" onClick={() => setAddTask(true)}>
                  Add Tasks
                </Button>
              )}
            </Box>
          </Box>
          <Sheet
            variant={allTasks ? "plain" : "outlined"}
            sx={{
              ml: "2rem",
              mr: "2rem",
              mt: "1rem",
              mb: "1rem",
              borderRadius: "sm",
              maxWidth: "90rem",
              overflow: "auto",
              backgroundColor: "background.surface"
            }}
          >
            {allTasks && (
              <Stack direction="row" spacing={1.2}>
                <TaskStateCard taskStatus="Open">
                  {allTasks
                    .filter(row => row.task_status === "open")
                    .map(row => (
                      <TaskCard key={row.task_id} taskID={row.task_id} taskName={row.task_name} taskOwner={row.task_owner} taskPlan={row.task_plan} handleView={handleView} viewTask={viewTask} />
                    ))}
                </TaskStateCard>
                <TaskStateCard taskStatus="To Do">
                  {allTasks
                    .filter(row => row.task_status === "todo")
                    .map(row => (
                      <TaskCard key={row.task_id} taskID={row.task_id} taskName={row.task_name} taskOwner={row.task_owner} taskPlan={row.task_plan} handleView={handleView} viewTask={viewTask} />
                    ))}
                </TaskStateCard>
                <TaskStateCard taskStatus="Doing">
                  {allTasks
                    .filter(row => row.task_status === "doing")
                    .map(row => (
                      <TaskCard key={row.task_id} taskID={row.task_id} taskName={row.task_name} taskOwner={row.task_owner} taskPlan={row.task_plan} handleView={handleView} viewTask={viewTask} />
                    ))}
                </TaskStateCard>
                <TaskStateCard taskStatus="Done">
                  {allTasks
                    .filter(row => row.task_status === "done")
                    .map(row => (
                      <TaskCard key={row.task_id} taskID={row.task_id} taskName={row.task_name} taskOwner={row.task_owner} taskPlan={row.task_plan} handleView={handleView} viewTask={viewTask} />
                    ))}
                </TaskStateCard>
                <TaskStateCard taskStatus="Closed">
                  {allTasks
                    .filter(row => row.task_status === "closed")
                    .map(row => (
                      <TaskCard key={row.task_id} taskID={row.task_id} taskName={row.task_name} taskOwner={row.task_owner} taskPlan={row.task_plan} handleView={handleView} viewTask={viewTask} />
                    ))}
                </TaskStateCard>
              </Stack>
            )}
            {!allTasks && (
              <Typography level="body-sm" sx={{ textAlign: "center", flexGrow: 1, m: "2rem" }}>
                There are no tasks under this application.
              </Typography>
            )}
          </Sheet>
        </Box>
      </Box>
      <Modal aria-labelledby="modal-title" aria-describedby="modal-desc" open={viewPlans} onClose={() => setViewPlans(false)} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Sheet
          variant="outlined"
          sx={{
            width: "60%",
            borderRadius: "md",
            p: 3,
            boxShadow: "lg",
            overflowY: "scroll",
            height: "80%"
          }}
        >
          <ModalClose variant="plain" sx={{ m: 1 }} />
          <PlansModal />
        </Sheet>
      </Modal>
      <Modal aria-labelledby="modal-title" aria-describedby="modal-desc" open={addTask} onClose={() => setAddTask(false)} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Sheet
          variant="outlined"
          sx={{
            maxWidth: "80rem",
            borderRadius: "md",
            p: 3,
            boxShadow: "lg",
            overflowY: "scroll",
            height: "80%"
          }}
        >
          <ModalClose variant="plain" sx={{ m: 1 }} />
          <TaskCreateModal setTaskChangeRequest={setTaskChangeRequest} setAddTask={setAddTask} setIsPL={setIsPL} />
        </Sheet>
      </Modal>
      <Modal aria-labelledby="modal-title" aria-describedby="modal-desc" open={viewTask} onClose={handleClose} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Sheet
          variant="outlined"
          sx={{
            width: "60%",
            borderRadius: "md",
            p: 3,
            boxShadow: "lg",
            height: "80%",
            overflowY: "scroll"
          }}
        >
          <ModalClose variant="plain" sx={{ m: 1 }} />
          <TaskDetailsModal taskID={editableTaskID} setIsPL={setIsPL} isPL={isPL} handleClose={handleClose} />
        </Sheet>
      </Modal>
    </Page>
  );
}

export default KanbanPage;
