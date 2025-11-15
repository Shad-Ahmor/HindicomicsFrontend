import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import ErrorRedirect from "./ErrorRedirect";
import { ThemeProvider } from "./Landing Page/ThemeContext";
import "./styles/css/index.css";
import "./styles/css/customScrollbar.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <Router>
        <ErrorRedirect />
        <App />
      </Router>
    </ThemeProvider>
  </React.StrictMode>
);
