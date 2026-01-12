import { Link, useLocation } from "react-router";
import { User, Calendar, Scissors, LogOut } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../contexts/authContext";

function Navbar() {
  const location = useLocation();
  const { Logout } = useContext(AuthContext);



  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Scissors size={28} className="navbar-logo" />
          <span className="navbar-title">Barbearia</span>
        </div>

        <div className="navbar-links">
          <Link
            to="/services"
            className={`navbar-link ${isActive("/services") ? "active" : ""}`}
          >
            <Scissors size={20} />
            <span>Serviços</span>
          </Link>

          <Link
            to="/marcacoes"
            className={`navbar-link ${isActive("/marcacoes") ? "active" : ""}`}
          >
            <Calendar size={20} />
            <span>Marcações</span>
          </Link>

          <Link
            to="/profile"
            className={`navbar-link ${isActive("/profile") ? "active" : ""}`}
          >
            <User size={20} />
            <span>Perfil</span>
          </Link>

          <button onClick={Logout} className="navbar-link navbar-logout">
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
