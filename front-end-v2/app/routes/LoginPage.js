import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import GlobalContext from "../components/GlobalContext";
import axios from "axios";

import { Box, FormControl, FormLabel, Input, FormHelperText, Button, Sheet, Avatar } from "@mui/joy";

function LoginPage() {
  const navigate = useNavigate();
  const { handleAlerts, handleCookie } = useContext(GlobalContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [helperMsg, setHelperMsg] = useState("");

  const checkPassword = password => {
    setPassword(password);
    if (password.length < 8 || password.length > 10) {
      setHelperMsg("Password should be between 8 to 10 characters.");
    } else {
      setHelperMsg("");
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await axios.post("/login", {
        username,
        password
      });

      console.log(response);

      if (response.data) {
        console.log(response.data);
        if (response.data.results.active === "true") {
          handleCookie(response.data.results.token);
          setUsername("");
          setPassword("");
          handleAlerts("Login successful", true);
          navigate("/");
        } else {
          setUsername("");
          setPassword("");
          handleAlerts("User is inactive", false);
        }
      } else {
        console.log(response.data.message);
        handleAlerts(`${error.response.data.message}`, false);
      }
    } catch (error) {
      console.log(error.response.data.message);
      handleAlerts(`${error.response.data.message}`, false);
    }
  };

  return (
    <>
      <Box display="flex" sx={{ bgcolor: "#cfe8fc", height: "100vh", justifyContent: "center", alignItems: "center" }}>
        <Sheet sx={{ height: "65vh", width: "40vh", padding: "2rem", justifyContent: "center", alignItems: "center", borderRadius: "2%" }}>
          <Box flex-direction="column">
            <Box display="flex" sx={{ justifyContent: "center", alignItems: "center", m: "2rem" }}>
              <Avatar
                size="lg"
                variant="soft"
                color="primary"
                alt="TMS"
                sx={{
                  "--Avatar-size": "100px"
                }}
              >
                TMS
              </Avatar>
            </Box>
            <form onSubmit={handleSubmit}>
              <Box display="flex" sx={{ "& .MuiTextField-root": { m: "0.5rem", width: "15rem" }, flexDirection: "column" }} noValidate autoComplete="off">
                <FormControl>
                  <FormLabel>Username</FormLabel>
                  <Input variant="soft" value={username} onChange={e => setUsername(e.target.value)} />
                </FormControl>
                <FormControl error={helperMsg ? true : false}>
                  <FormLabel sx={{ mt: "1rem" }}>Password</FormLabel>
                  <Input variant="soft" value={password} type="password" onChange={e => checkPassword(e.target.value)} />
                  {helperMsg && <FormHelperText>{helperMsg}</FormHelperText>}
                </FormControl>
              </Box>
              <Box display="flex" sx={{ justifyContent: "center", alignItems: "center", m: "2rem" }}>
                <Button variant="solid" type="submit">
                  Login
                </Button>
              </Box>
            </form>
          </Box>
        </Sheet>
      </Box>
    </>
  );
}

export default LoginPage;
