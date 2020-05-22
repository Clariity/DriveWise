import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom"
import "./index.css";
import App from "./App";
import { StateProvider } from "./store";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <StateProvider>
        <App />
      </StateProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);