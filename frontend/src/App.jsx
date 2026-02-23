import "./styles.css";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/registerPage.jsx";
import Services from "./pages/Services.jsx";
import AdminLayout from "./pages/AdminLayout.jsx";
import AdminMarcacoes from "./pages/AdminMarcacoes.jsx";
import AdminUtilizadores from "./pages/AdminUtilizadores.jsx";
import AdminServicos from "./pages/AdminServicos.jsx";
import AdminBarbeiros from "./pages/AdminBarbeiros.jsx";
import Profile from "./pages/Profile.jsx";
import Marcacoes from "./pages/Marcacoes.jsx";
import VerificarEmail from "./pages/VerificarEmail.jsx";
import VerificarTelefone from "./pages/VerificarTelefone.jsx";
import ConfirmarRegisto from "./pages/ConfirmarRegisto.jsx";
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
        <Route path="/confirmar-registo" element={<ConfirmarRegisto />} />
        <Route path="/verificar-email" element={<VerificarEmail />} />
        <Route path="/verificar-telefone" element={<VerificarTelefone />} />

        <Route
          path="/admin"
          element={
            isAuthenticated && authUser.role === "admin" ? (
              <AdminLayout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<Navigate to="marcacoes" replace />} />
          <Route path="marcacoes" element={<AdminMarcacoes />} />
          <Route path="utilizadores" element={<AdminUtilizadores />} />
          <Route path="servicos" element={<AdminServicos />} />
          <Route path="barbeiros" element={<AdminBarbeiros />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
