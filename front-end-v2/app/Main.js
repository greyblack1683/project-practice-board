import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

//styling
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import { Slide, ToastContainer, toast } from "react-toastify";

import GlobalContext from "./components/GlobalContext";
import Header from "./routes/Header";
import DefaultPage from "./routes/DefaultPage";
import LoginPage from "./routes/LoginPage";
import HomePage from "./routes/HomePage";
import ProfilePage from "./routes/ProfilePage";
import UserMgmtPage from "./routes/UserMgmtPage";
import LoadingPage from "./routes/LoadingPage";

import AppsPage from "./routes/AppsPage";
import KanbanPage from "./routes/KanbanPage";

axios.defaults.baseURL = "http://localhost:8080";

function Main() {
  //states
  const [loggedIn, setLoggedIn] = useState("pending");
  const [isAdmin, setIsAdmin] = useState(false);

  //handlers
  const handleAlerts = (msg, success) => {
    if (success) {
      toast.success(msg);
    } else {
      toast.error(msg);
    }
  };

  const handleCookie = token => {
    if (token) {
      //if handleCookie is called with a value
      if (Cookies.get("token") !== token) Cookies.set("token", token, { expires: 7, path: "/" });
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      console.log("set login to true");
      setLoggedIn(true);
    } else {
      Cookies.remove("token");
      axios.defaults.headers.common["Authorization"] = "";
      setLoggedIn(false);
    }
  };

  //useEffect
  useEffect(() => {
    //on first render, check if there are existing unexpired cookies with token in browser for auto login
    console.log("Running useEffect to read token");
    const tokenVal = Cookies.get("token");

    async function checkToken(token) {
      try {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        await axios
          .get("/authenticate")
          .then(response => {
            if (response.data.success === true) handleCookie(tokenVal);
          })
          .catch(error => {
            console.log(error.response.data.message);
            handleCookie();
            handleAlerts(error.response.data.message, false);
          });
      } catch (error) {
        console.log(error);
        setLoggedIn(false);
        handleAlerts("Error: Internal Server Error", false);
      }
    }
    if (tokenVal) {
      checkToken(tokenVal);
    } else {
      setLoggedIn(false);
    }
  }, []);

  return (
    <>
      <GlobalContext.Provider value={{ handleAlerts, handleCookie, isAdmin, setIsAdmin, loggedIn }}>
        <CssVarsProvider>
          <CssBaseline disableColorScheme />

          <BrowserRouter>
            <Routes>
              <Route path="*" element={<DefaultPage />} />
              <Route path="/" element={loggedIn == "pending" ? <LoadingPage /> : loggedIn ? <Header /> : <LoginPage />}>
                <Route path="" element={<AppsPage />} />
                <Route path="apps" element={<AppsPage />} />
                <Route path="apps/:appid" element={<KanbanPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="usermgmt" element={<UserMgmtPage />} />
                <Route path="tasks" element={<HomePage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </CssVarsProvider>
      </GlobalContext.Provider>
      <ToastContainer position="top-center" autoClose={1000} transition={Slide} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
    </>
  );
}

const root = ReactDOM.createRoot(document.querySelector("#app"));
root.render(<Main />);

if (module.hot) {
  module.hot.accept();
}
