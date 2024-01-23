import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import axios from "axios";

import GlobalContext from "./GlobalContext";
import TaskView from "./TaskView";
import TaskEditOpen from "./TaskEditOpen";
import TaskEditToDo from "./TaskEditToDo";
import TaskEditDoing from "./TaskEditDoing";
import TaskEditDone from "./TaskEditDone";

import { Stack, Box, Typography, Chip } from "@mui/joy";

import TaskAltIcon from "@mui/icons-material/TaskAlt";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

function TaskDetailsModal({ taskID, setIsPL, isPL, handleClose }) {
  const { handleAlerts } = useContext(GlobalContext);
  const { handleUserNotAuthorised, checkPermission } = useOutletContext();
  const { appid } = useParams();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [taskChangeRequest, setTaskChangeRequest] = useState(0);
  const [allPlans, setAllPlans] = useState([]);
  const [taskDesc, setTaskDesc] = useState("");
  const [taskNotes, setTaskNotes] = useState("");
  const [taskPlan, setTaskPlan] = useState(null);
  const [isPM, setIsPM] = useState(false);
  const [isDevTeam, setIsDevTeam] = useState(false);
  const [taskDetails, setTaskDetails] = useState({});
  const [editable, setEditable] = useState(false);

  const statusColor = status => {
    switch (status) {
      case "todo":
        return "primary";
      case "doing":
        return "warning";
      case "done":
        return "success";
      default:
        return "neutral";
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  useEffect(() => {
    const controller = new AbortController();

    async function check(taskStatus) {
      console.log("Running useEffect to check if user is of PM / PL/ Dev Team");
      const response = await checkPermission(taskStatus, appid, false);
      console.log("check permit", response);

      if (response) {
        switch (taskStatus) {
          case "open":
            setIsPM(true);
            setEditable(true);
            break;
          case "todo":
          case "doing":
            setIsDevTeam(true);
            setEditable(true);
            break;
          case "done":
            setIsPL(true);
            setEditable(true);
            break;
          default:
            break;
        }
      }

      return response;
    }

    async function getSelectedTask(plans) {
      try {
        await axios
          .post("/tasks/selected", {
            task_id: taskID
          })
          .then(response => {
            if (response.data.results.task_plan) {
              const plan = plans.filter(plan => plan.plan_mvp_name === response.data.results.task_plan);
              console.log("plan", plan, plan[0]);
              setTaskPlan(plan[0]);
            }

            console.log(response.data.results);
            setTaskDesc(response.data.results.task_description);

            setTaskDetails(response.data.results);
            if (response.data.results.task_status !== "closed") {
              check(response.data.results.task_status);
            }
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

    async function getPlans() {
      try {
        const response = await axios
          .post("/plans/forapp", {
            plan_app_acronym: appid
          })
          .catch(error => {
            console.log(error.response.data.message);
            handleAlerts(`${error.response.data.message}`, false);
          });
        if (response) {
          console.log(response.data);
          if (!response.data.message.includes("no plans")) setAllPlans(response.data.results);
          getSelectedTask(response.data.results);
        }
      } catch (error) {
        console.log(error);
        handleAlerts("Error: Internal Server Error", false);
      }
    }

    getPlans();
    return controller.abort();
  }, [taskChangeRequest]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "left",
          mt: "2rem",
          ml: "2rem",
          mr: "2rem",
          mb: "2rem",
          borderBottom: "1px solid",
          borderColor: "divider",
          paddingBottom: "0.7rem"
        }}
      >
        <Stack>
          <Typography level="h3" sx={{ textAlign: "left" }}>
            Task #{taskID}: {taskDetails.task_name}
          </Typography>
          <Typography level="body-xs" sx={{ textAlign: "left", mt: "0.1rem", mb: "0.5rem" }}>
            Created by {taskDetails.task_creator} on {taskDetails.task_createdate} for application {appid}
          </Typography>
          <Stack direction="row" spacing={0.5}>
            <Chip size="sm" variant={taskDetails.task_status === "open" ? "outlined" : "soft"} color={statusColor(taskDetails.task_status)} startDecorator={<TaskAltIcon />}>
              Status: {taskDetails.task_status}
            </Chip>
            <Chip size="sm" color="primary" variant="soft" startDecorator={<AccountCircleIcon />}>
              Owner: {taskDetails.task_owner}
            </Chip>
          </Stack>
        </Stack>
      </Box>
      {isEditing ? (
        {
          open: <TaskEditOpen taskDetails={taskDetails} setIsEditing={setIsEditing} taskDesc={taskDesc} setTaskDesc={setTaskDesc} taskNotes={taskNotes} setTaskNotes={setTaskNotes} taskPlan={taskPlan} setTaskPlan={setTaskPlan} allPlans={allPlans} setTaskChangeRequest={setTaskChangeRequest} handleClose={handleClose} />,
          todo: <TaskEditToDo taskDetails={taskDetails} setIsEditing={setIsEditing} taskDesc={taskDesc} setTaskDesc={setTaskDesc} taskNotes={taskNotes} setTaskNotes={setTaskNotes} setTaskChangeRequest={setTaskChangeRequest} handleClose={handleClose} />,
          doing: <TaskEditDoing taskDetails={taskDetails} setIsEditing={setIsEditing} taskDesc={taskDesc} setTaskDesc={setTaskDesc} taskNotes={taskNotes} setTaskNotes={setTaskNotes} setTaskChangeRequest={setTaskChangeRequest} handleClose={handleClose} />,
          done: <TaskEditDone taskDetails={taskDetails} setIsEditing={setIsEditing} taskDesc={taskDesc} setTaskDesc={setTaskDesc} taskNotes={taskNotes} setTaskNotes={setTaskNotes} taskPlan={taskPlan} setTaskPlan={setTaskPlan} allPlans={allPlans} setTaskChangeRequest={setTaskChangeRequest} handleClose={handleClose} />
        }[taskDetails.task_status]
      ) : (
        <TaskView taskDetails={taskDetails} handleEdit={handleEdit} editable={editable} taskPlan={taskPlan} />
      )}
    </>
  );
}

export default TaskDetailsModal;
