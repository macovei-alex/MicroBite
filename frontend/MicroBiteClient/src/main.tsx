import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage.tsx";
import MenuPage from "./pages/MenuPage.tsx";
import { AuthContextProvider } from "./auth/AuthContext.tsx";
import HomePage from "./pages/HomePage.tsx";
import AuthProtected from "./auth/AuthProtected.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <Routes>
          <Route index path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/menu"
            element={
              <AuthProtected>
                <MenuPage />
              </AuthProtected>
            }
          />
        </Routes>
      </AuthContextProvider>
    </BrowserRouter>
  </StrictMode>
);
