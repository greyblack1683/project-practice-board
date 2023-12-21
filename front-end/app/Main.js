import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

//styling
import CssBaseline from "@mui/material/CssBaseline";
import { Slide, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import GlobalContext from "./components/GlobalContext";
import Header from "./routes/Header";
import DefaultPage from "./routes/DefaultPage";
import LoginPage from "./routes/LoginPage";

axios.defaults.baseURL = "http://localhost:8080";

function Main() {
  //states
  const [loggedIn, setLoggedIn] = useState(false);

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
      if (!Cookies.get("token")) Cookies.set("token", token, { expires: 7, path: "" });
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
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
    const tokenVal = Cookies.get("token");
    if (tokenVal) handleCookie(tokenVal);
  }, []);

  return (
    <>
      <GlobalContext.Provider value={{ handleAlerts, handleCookie }}>
        <CssBaseline enableColorScheme />

        <BrowserRouter>
          <Routes>
            <Route path="/" element={loggedIn ? <Header /> : <LoginPage />} />
            <Route path="*" element={<DefaultPage />} />
          </Routes>
        </BrowserRouter>
      </GlobalContext.Provider>
      <ToastContainer position="top-center" autoClose={2000} transition={Slide} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
    </>
  );
}

const root = ReactDOM.createRoot(document.querySelector("#app"));
root.render(<Main />);

if (module.hot) {
  module.hot.accept();
}
