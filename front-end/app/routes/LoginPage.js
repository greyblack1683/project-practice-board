import React, { useContext, useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import logo from "../../public/tms_logo.png";
import GlobalContext from "../components/GlobalContext";
import axios from "axios";

function LoginPage() {
  const navigate = useNavigate();
  const { handleAlerts, handleCookie } = useContext(GlobalContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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
        handleCookie(response.data.results.token);
        setUsername("");
        setPassword("");
        handleAlerts("Login successful", true);
        navigate("/");
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
        <Box flex-direction="column">
          <Box display="flex" sx={{ justifyContent: "center", alignItems: "center", m: "2rem", mt: "-2rem" }}>
            <img src={logo} width={150} height={150} alt="Logo" />
          </Box>
          <form onSubmit={handleSubmit}>
            <Box display="flex" sx={{ "& .MuiTextField-root": { m: "0.5rem", width: "15rem" }, flexDirection: "column" }} noValidate autoComplete="off">
              <TextField id="outlined" label="Username" value={username} onChange={e => setUsername(e.target.value)} />
              <TextField id="outlined-password-input" label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
            </Box>
            <Box display="flex" sx={{ justifyContent: "center", alignItems: "center", m: "2rem" }}>
              <Button variant="contained" type="submit">
                Login
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </>
  );
}

export default LoginPage;
