import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import GlobalContext from "../components/GlobalContext";

import Page from "../components/Page";
import CreateUser from "../components/CreateUser";
import UserRow from "../components/UserRow";

import { Typography, Table, Sheet, Box, Button, Input } from "@mui/joy";

import GroupsIcon from "@mui/icons-material/Groups";

function UserMgmtPage() {
  const { handleAlerts, setIsAdmin, handleCookie } = useContext(GlobalContext);
  const navigate = useNavigate();

  const [allGroups, setAllGroups] = useState([]);
  const [addGroupRequest, setAddGroupRequest] = useState(0);
  const [newGroup, setNewGroup] = useState("");

  const [allUsers, setAllUsers] = useState([]);
  const [editUserRequest, setEditUserRequest] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    async function getGroups() {
      try {
        await axios
          .get("/groups/all")
          .then(response => setAllGroups(response.data.results))
          .catch(error => {
            console.log(error.response.data.message);
            handleUserNotAuthorised(error.response.data.message);
            handleAlerts(`${error.response.data.message}`, false);
          });
      } catch (error) {
        console.log(error);
        handleAlerts("Error: Internal Server Error", false);
      }
    }
    getGroups();

    return controller.abort();
  }, [addGroupRequest]);

  useEffect(() => {
    const controller = new AbortController();
    async function getUsers() {
      try {
        await axios
          .get("/users/all")
          .then(response => setAllUsers(response.data.results))
          .catch(error => {
            console.log(error.response.data.message);
            handleUserNotAuthorised(error.response.data.message);
            handleAlerts(`${error.response.data.message}`, false);
          });
      } catch (error) {
        console.log(error);
        handleAlerts("Error: Internal Server Error", false);
      }
    }
    getUsers();

    return controller.abort();
  }, [editUserRequest]);

  const handleUserNotAuthorised = message => {
    if (message.includes("not authorised")) {
      setIsAdmin(false);
      navigate("/");
    }
    if (message.toLowerCase().includes("inactive")) {
      handleCookie();
    }
  };

  const handleAddGroup = async () => {
    try {
      await axios
        .post("/groups/create", { group: newGroup })
        .then(response => {
          setNewGroup("");
          handleAlerts(`Added ${newGroup} as a new group`, true);
          setAddGroupRequest(prev => prev + 1);
        })
        .catch(error => {
          console.log(error.response.data.message);
          handleUserNotAuthorised(error.response.data.message);
          handleAlerts(`${error.response.data.message}`, false);
        });
    } catch (error) {
      console.log(error);
      handleAlerts("Error: Internal Server Error", false);
    }
  };

  return (
    <Page title="Manage Users">
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
              User Management
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 1.5,
                alignItems: "center"
              }}
            >
              <GroupsIcon />
              <Input placeholder="group name" value={newGroup} onChange={e => setNewGroup(e.target.value)} variant="soft" size="sm" color="primary" />
              <Button onClick={handleAddGroup} variant="outlined" size="sm">
                Add Group
              </Button>
            </Box>
          </Box>
          <CreateUser allGroups={allGroups} handleUserNotAuthorised={handleUserNotAuthorised} setEditUserRequest={setEditUserRequest} />
          <Sheet
            variant="outlined"
            sx={{
              ml: "2rem",
              mr: "2rem",
              mt: "1rem",
              mb: "1rem",
              borderRadius: "sm",
              maxWidth: "70rem",
              "--Table-firstColumnWidth": "120px",
              "--Table-lastColumnWidth": "105px",
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
                "& tr > *:first-of-type": {
                  position: "sticky",
                  left: 0,
                  boxShadow: "1px 0 var(--TableCell-borderColor)",
                  bgcolor: "background.surface"
                },
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
                  <th style={{ width: "var(--Table-firstColumnWidth)" }}>Username</th>
                  <th>Password</th>
                  <th>Email</th>
                  <th>Groups</th>
                  <th style={{ width: 110 }}>Activity</th>
                  <th aria-label="last" style={{ width: "var(--Table-lastColumnWidth)" }} />
                </tr>
              </thead>
              <tbody>{allUsers && allUsers.map(row => <UserRow key={row.username} row={row} allGroups={allGroups} handleAlerts={handleAlerts} handleUserNotAuthorised={handleUserNotAuthorised} setEditUserRequest={setEditUserRequest} />)}</tbody>
            </Table>
          </Sheet>
        </Box>
      </Box>
    </Page>
  );
}

export default UserMgmtPage;
