import { Outlet, NavLink } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../contexts/authContext.jsx";
import { Calendar, User, Scissors, LogOut } from "lucide-react";

function AdminLayout() {
  const { Logout } = useContext(AuthContext);

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>Backoffice</h2>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/admin/marcacoes" className={({ isActive }) => `sidebar-link ${isActive ? "sidebar-link-active" : ""}`}>
            <Calendar size={18} />
            <span>Marcações</span>
          </NavLink>
          <NavLink to="/admin/utilizadores" className={({ isActive }) => `sidebar-link ${isActive ? "sidebar-link-active" : ""}`}>
            <User size={18} />
            <span>Utilizadores</span>
          </NavLink>
          <NavLink to="/admin/servicos" className={({ isActive }) => `sidebar-link ${isActive ? "sidebar-link-active" : ""}`}>
            <Scissors size={18} />
            <span>Serviços</span>
          </NavLink>
          <NavLink to="/admin/barbeiros" className={({ isActive }) => `sidebar-link ${isActive ? "sidebar-link-active" : ""}`}>
            <User size={18} />
            <span>Barbeiros</span>
          </NavLink>
        </nav>
        <button className="sidebar-logout" onClick={Logout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </aside>

      <div className="admin-container">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
