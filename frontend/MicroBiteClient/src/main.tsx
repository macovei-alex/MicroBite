import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage.tsx";
import MenuPage from "./pages/MenuPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import HomePage from "./pages/HomePage.tsx";
import AuthProtectedOutlet from "./auth/AuthProtectedOutlet.tsx";
import { AuthContextProvider } from "./auth/context/AuthContextProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <Routes>
          <Route index path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route element={<AuthProtectedOutlet redirectTo="/login" />}>
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </AuthContextProvider>
    </BrowserRouter>
  </StrictMode>
);
