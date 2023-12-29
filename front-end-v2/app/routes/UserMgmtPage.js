import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import GlobalContext from "../components/GlobalContext";

import Page from "../components/Page";
import CreateUser from "../components/CreateUser";
import UserRow from "../components/UserRow";

import { Typography, Table, Sheet, Box, Button, Input } from "@mui/joy";

function UserMgmtPage() {
  const { handleAlerts, setIsAdmin } = useContext(GlobalContext);
  const navigate = useNavigate();

  const [allGroups, setAllGroups] = useState([]);
  const [addGroupRequest, setAddGroupRequest] = useState(0);
  const [newGroup, setNewGroup] = useState("");

  const [allUsers, setAllUsers] = useState([]);
  const [editUserRequest, setEditUserRequest] = useState(0);
  const [editRowId, setEditRowId] = useState(0);

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [groups, setGroups] = useState("");
  const [active, setActive] = useState("");

  useEffect(() => {
    async function getGroups() {
      try {
        const response = await axios.get("/groups/all");

        console.log(response);

        if (response.data) {
          console.log(response.data);
          setAllGroups(response.data.results);
        } else {
          console.log(response.data.message);
          throw new Error(response.data.message);
        }
      } catch (error) {
        console.log(error.response.data.message);
        handleUserNotAuthorised(error.response.data.message);
        handleAlerts(`${error.response.data.message}`, false);
      }
    }
    getGroups();
  }, [addGroupRequest]);

  useEffect(() => {
    async function getUsers() {
      try {
        const response = await axios.get("/users/all");

        console.log(response);

        if (response.data) {
          console.log(response.data);
          setAllUsers(response.data.results);
        } else {
          console.log(response.data.message);
          throw new Error(response.data.message);
        }
      } catch (error) {
        console.log(error.response.data.message);
        handleUserNotAuthorised(error.response.data.message);
        handleAlerts(`${error.response.data.message}`, false);
      }
    }
    getUsers();
  }, [editUserRequest]);

  const handleUserNotAuthorised = message => {
    if (message.includes("not authorised")) {
      setIsAdmin(false);
      navigate("/");
    }
  };

  const handleAddGroup = async () => {
    try {
      const response = await axios.post("/groups/create", {
        group: newGroup
      });

      if (response.data) {
        console.log(response.data);
        setNewGroup("");
        handleAlerts(`Added ${newGroup} as a new group`, true);
        setAddGroupRequest(prev => prev + 1);
      } else {
        console.log(response.data.message);
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.log(error.response.data.message);
      handleUserNotAuthorised(error.response.data.message);
      handleAlerts(`${error.response.data.message}`, false);
    }
  };

  const handleEditUser = async () => {
    let groupsData = groups ? groups.join(", ") : "";

    try {
      const response = await axios.post("/users/update", {
        email,
        password,
        groups: groupsData,
        active,
        id: editRowId
      });

      if (response) {
        console.log(response);
        handleAlerts(`Edited user with ID ${editRowId}`, true);
        setEditRowId(0);
        setEditUserRequest(prev => prev + 1);
      } else {
        console.log(response.data.message);
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.log(error.response.data.message);
      handleUserNotAuthorised(error.response.data.message);
      handleAlerts(`${error.response.data.message}`, false);
    }
  };

  const handleCancel = () => {
    setEditRowId(0);
  };
  const handleEditRow = () => {
    setPassword("");
    setEmail(row.email);
    setGroups(groupList);
    setActive(row.active);
    setEditRowId(row.id);
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
              maxWidth: "80rem"
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
              maxWidth: "80rem",
              "--Table-firstColumnWidth": "50px",
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
                  <th style={{ width: "var(--Table-firstColumnWidth)" }}>ID</th>
                  <th>Username</th>
                  <th>Password</th>
                  <th>Email</th>
                  <th>Groups</th>
                  <th style={{ width: 110 }}>Activity</th>
                  <th aria-label="last" style={{ width: "var(--Table-lastColumnWidth)" }} />
                </tr>
              </thead>
              <tbody>{allUsers && allUsers.map(row => <UserRow row={row} handleCancel={handleCancel} handleEditRow={handleEditRow} handleEditUser={handleEditUser} setPassword={setPassword} setEmail={setEmail} setGroups={setAllGroups} setActive={setActive} setEditRowId={setEditRowId} />)}</tbody>
            </Table>
          </Sheet>
        </Box>
      </Box>
    </Page>
  );
}

export default UserMgmtPage;
