import React, { useState } from "react";
import axios from "axios";

import { Box, Button, Input, IconButton, Autocomplete, Select, Option, Chip } from "@mui/joy";

import CancelIcon from "@mui/icons-material/Cancel";
import Close from "@mui/icons-material/Close";

function UserRow({ row, allGroups, handleAlerts, handleUserNotAuthorised, setEditUserRequest }) {
  let groupList = row.groups == null || row.groups == "" ? undefined : row.groups.split(", ").sort();

  const [isEditing, setIsEditing] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [groups, setGroups] = useState("");
  const [isActive, setIsActive] = useState("");

  const handleEditUser = async () => {
    try {
      await axios
        .post("/users/update", {
          email,
          password,
          groups: groups ? groups.join(", ") : "",
          isactive: isActive,
          username: row.username
        })
        .then(response => {
          console.log(response);
          handleAlerts(`Edited user ${row.username}`, true);
          handleCancel();
          setEditUserRequest(prev => prev + 1);
        })
        .catch(error => {
          console.log(error);
          handleUserNotAuthorised(error.response.data.message);
          handleAlerts(`${error.response.data.message}`, false);
        });
    } catch (error) {
      console.log(error);
      handleAlerts("Error: Internal Server Error", false);
    }
  };

  const handleCancel = () => {
    setPassword("");
    setEmail("");
    setGroups("");
    setIsActive("");
    setIsEditing(false);
  };

  const handleEditRow = () => {
    setPassword("");
    setEmail(row.email);
    setGroups(groupList);
    setIsActive(row.isactive);
    setIsEditing(true);
  };

  return (
    <tr key={row.username}>
      <td>{row.username}</td>
      <td>{isEditing ? <Input variant="soft" color="primary" size="sm" value={password} onChange={e => setPassword(e.target.value)} type="password" /> : "********"}</td>
      <td>{isEditing ? <Input variant="soft" color="primary" size="sm" value={email} onChange={e => setEmail(e.target.value)} /> : row.email}</td>
      <td>
        {isEditing ? (
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
        {isEditing ? (
          <Select variant="soft" color="primary" size="sm" defaultValue={isActive} onChange={(e, newValue) => setIsActive(newValue)}>
            <Option value="true">Enable</Option>
            <Option value="false">Disable</Option>
          </Select>
        ) : row.isactive == "true" ? (
          "Enable"
        ) : (
          "Disable"
        )}
      </td>
      <td>
        {isEditing ? (
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

export default UserRow;
