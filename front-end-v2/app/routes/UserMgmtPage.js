import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import GlobalContext from "../components/GlobalContext";

import Page from "../components/Page";
import CreateUser from "../components/CreateUser";

import { Typography, Table, Sheet, Box, Button, Input, IconButton, Autocomplete, Select, Option, Chip } from "@mui/joy";

import GroupsIcon from "@mui/icons-material/Groups";
import CancelIcon from "@mui/icons-material/Cancel";
import Close from "@mui/icons-material/Close";

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

  const handleEditUser = async () => {
    let groupsData = groups ? groups.join(", ") : "";

    try {
      await axios
        .post("/users/update", {
          email,
          password,
          groups: groupsData,
          active,
          id: editRowId
        })
        .then(response => {
          handleAlerts(`Edited user with ID ${editRowId}`, true);
          setEditRowId(0);
          setEditUserRequest(prev => prev + 1);
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

  function UserRow(row) {
    let groupList = row.groups == null || row.groups == "" ? undefined : row.groups.split(", ").sort();

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
      <tr>
        <td>{row.id}</td>
        <td>{row.username}</td>
        <td>{row.id === editRowId ? <Input variant="soft" color="primary" size="sm" value={password} onChange={e => setPassword(e.target.value)} type="password" /> : "********"}</td>
        <td>{row.id === editRowId ? <Input variant="soft" color="primary" size="sm" value={email} onChange={e => setEmail(e.target.value)} /> : row.email}</td>
        <td>
          {row.id === editRowId ? (
            <Autocomplete
              variant="outlined"
              color="primary"
              value={groups}
              size="sm"
              multiple
              options={allGroups}
              onChange={(e, newValue) => setGroups(newValue)}
              renderTags={(tags, getTagProps) =>
                tags.map((item, index) => (
                  <Chip key={index} variant="soft" size="sm" color="primary" endDecorator={<Close fontSize="sm" />} {...getTagProps({ index })}>
                    {item}
                  </Chip>
                ))
              }
            />
          ) : (
            groupList &&
            groupList.map(group => (
              <Chip key={group} variant="outlined" size="sm" sx={{ mr: "0.2rem" }}>
                {group}
              </Chip>
            ))
          )}
        </td>
        <td>
          {row.id === editRowId ? (
            <Select variant="soft" color="primary" size="sm" defaultValue={active} onChange={(e, newValue) => setActive(newValue)}>
              <Option value="true">Enable</Option>
              <Option value="false">Disable</Option>
            </Select>
          ) : row.active == "true" ? (
            "Enable"
          ) : (
            "Disable"
          )}
        </td>
        <td>
          {row.id === editRowId ? (
            <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center", alignItems: "center" }}>
              <Button onClick={handleEditUser} type="submit" size="sm" variant="soft" color="success">
                Save
              </Button>
              <IconButton onClick={handleCancel} size="sm" variant="plain" color="danger" sx={{ borderRadius: "50%" }}>
                <CancelIcon />
              </IconButton>
            </Box>
          ) : (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button onClick={handleEditRow} size="sm" variant="soft">
                Edit
              </Button>
            </Box>
          )}
        </td>
      </tr>
    );
  }
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
              <tbody>{allUsers && allUsers.map(row => UserRow(row))}</tbody>
            </Table>
          </Sheet>
        </Box>
      </Box>
    </Page>
  );
}

export default UserMgmtPage;
