import React from "react";

import { Box, Button, Input, IconButton, Autocomplete, Select, Option, Chip } from "@mui/joy";

import CancelIcon from "@mui/icons-material/Cancel";
import Close from "@mui/icons-material/Close";

function UserRow({ row, handleCancel, handleEditUser, setPassword, setEmail, setGroups, setActive, editRowId, setEditRowId, password, email }) {
  let groupList = row.groups == null || row.groups == "" ? undefined : row.groups.split(", ").sort();

  const handleEditRow = (row, groupList) => {
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
            <Button onClick={handleEditRow(row, groupList)} size="sm" variant="soft">
              Edit
            </Button>
          </Box>
        )}
      </td>
    </tr>
  );
}

export default UserRow;
