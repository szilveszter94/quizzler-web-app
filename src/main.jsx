import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ActualQuizProvider } from "./contexts/quizContext.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { UserProvider } from "./contexts/userContext.jsx";
import { SnackbarProvider } from "./contexts/snackBarContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <ActualQuizProvider>
          <SnackbarProvider>
            <App />
          </SnackbarProvider>
        </ActualQuizProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
