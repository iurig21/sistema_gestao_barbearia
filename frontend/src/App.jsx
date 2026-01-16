import "./styles.css";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/registerPage.jsx";
import Services from "./pages/Services.jsx";
import AdminPage from "./pages/adminPage.jsx";
import Profile from "./pages/Profile.jsx";
import Marcacoes from "./pages/Marcacoes.jsx";
import { Routes, Route, Navigate } from "react-router";
import { AuthContext } from "./contexts/authContext";
import { useContext } from "react";

function App() {
  const { isAuthenticated, authUser } = useContext(AuthContext);

  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              authUser.role === "admin" ? (
                <Navigate to="/admin" replace />
              ) : (
                <Navigate to="/services" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/profile"
          element={
            isAuthenticated && authUser.role !== "admin" ? (
              <Profile />
            ) : isAuthenticated && authUser.role === "admin" ? (
              <Navigate to="/admin" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/services"
          element={
            isAuthenticated && authUser.role !== "admin" ? (
              <Services />
            ) : isAuthenticated && authUser.role === "admin" ? (
              <Navigate to="/admin" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/marcacoes"
          element={
            isAuthenticated && authUser.role !== "admin" ? (
              <Marcacoes />
            ) : isAuthenticated && authUser.role === "admin" ? (
              <Navigate to="/admin" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <LoginPage />
            ) : authUser.role === "admin" ? (
              <Navigate to="/admin" replace />
            ) : (
              <Navigate to="/services" replace />
            )
          }
        />
        <Route
          path="/register"
          element={
            !isAuthenticated ? (
              <RegisterPage />
            ) : authUser.role === "admin" ? (
              <Navigate to="/admin" replace />
            ) : (
              <Navigate to="/services" replace />
            )
          }
        />
        <Route
          path="/admin"
          element={
            isAuthenticated && authUser.role === "admin" ? (
              <AdminPage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;
