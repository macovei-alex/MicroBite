import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage.tsx";
import MenuPage from "./pages/MenuPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import HomePage from "./pages/HomePage.tsx";
import AuthProtectedOutlet from "./auth/components/AuthProtectedOutlet.tsx";
import { AuthContextProvider } from "./auth/context/AuthContextProvider.tsx";
import PasswordResetPage from "./pages/PasswordResetPage.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from "./header/components/Header.tsx";
import AdminPage from "./pages/AdminPage.tsx";
import CartPage from "./pages/CartPage.tsx";
import CartProvider from "./cart/context/CartContextProvider.tsx";
import OrderHistoryPage from "./pages/OrderHistoryPage.tsx";
import OrderStatusUpdatesContextProvider from "./orders/context/OrderStatusUpdatesContextProvider.tsx";
import AdminUserOrdersPage from "./pages/AdminUserOrdersPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      gcTime: 3600 * 1000,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthContextProvider>
          <CartProvider>
            <OrderStatusUpdatesContextProvider>
              <Header />
              <Routes>
                <Route index path="/" element={<HomePage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage/>}/>
                <Route path="/password-reset" element={<PasswordResetPage />} />
                <Route element={<AuthProtectedOutlet redirectTo="/login" />}>
                  <Route path="/menu" element={<MenuPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/orders" element={<OrderHistoryPage />} />
                </Route>
                <Route
                  element={<AuthProtectedOutlet allowedRoles={["admin"]} redirectTo="/login" />}
                >
                  <Route path="/admin" element={<AdminPage />} />
                  <Route path="/admin/orders" element={<AdminUserOrdersPage />} />
                </Route>
                <Route path="*" element={<div>404 Not Found</div>} />
              </Routes>
            </OrderStatusUpdatesContextProvider>
          </CartProvider>
        </AuthContextProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);
