import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import HomePage from "./Scenes/Homepage/HomePage";
import LoginPage from "./Scenes/Loginpage/LoginPage";
import ProfilePage from "./Scenes/Profilepage/ProfilePage";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import React from "react";
import Chat from "Scenes/Chat/Chat";
import OtpForm from "./Scenes/Loginpage/OtpForm";

function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.token));
  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={isAuth ? <HomePage /> : <LoginPage />} />

            <Route path="/otp-page" element={<OtpForm />} />

            <Route path="/" element={<LoginPage />} />

            <Route
              path="/*"
              element={isAuth ? <HomePage /> : <Navigate to="/" />}
            />

            <Route
              path="/profile"
              element={isAuth ? <ProfilePage /> : <Navigate to="/" />}
            />

            <Route
              path="/Chat"
              element={isAuth ? <Chat /> : <Navigate to="/" />}
            />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
