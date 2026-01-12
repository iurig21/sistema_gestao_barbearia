import { AuthContext } from "../contexts/authContext.jsx";
import { useContext } from "react";
import Navbar from "../components/Navbar.jsx";
import "../styles.css";

function Profile() {
  const { authUser, Logout } = useContext(AuthContext);

  return (
    <div>
      <Navbar />
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-left">
            <img
              src={`http://localhost:3000/uploads/${authUser.fotografia}`}
              alt="Foto de perfil"
              className="profile-photo"
            />
            <h2>{authUser.nome}</h2>
            <p className="profile-role">
              {authUser.role === "admin" ? "Administrador" : "Utilizador"}
            </p>

            <button onClick={Logout} className="logout-btn">
              Terminar Sessão
            </button>
          </div>

          <div className="profile-right">
            <h3>Informações Pessoais</h3>

            <div className="profile-info">
              <div className="info-group">
                <label>Email</label>
                <p>{authUser.email}</p>
              </div>

              <div className="info-group">
                <label>Telefone</label>
                <p>{authUser.telefone}</p>
              </div>

              <div className="info-group">
                <label>Morada</label>
                <p>{authUser.morada}</p>
              </div>

              <div className="info-group">
                <label>Data de Nascimento</label>
                <p>
                  {new Date(authUser.datanascimento).toLocaleDateString(
                    "pt-PT"
                  )}
                </p>
              </div>

              <div className="info-group">
                <label>Género</label>
                <p>{authUser.genero}</p>
              </div>
            </div>

            <div className="document-preview">
              <h4>Documento de Identificação</h4>
              {authUser.documento?.endsWith(".pdf") ? (
                <embed
                  src={`http://localhost:3000/uploads/${authUser.documento}`}
                  type="application/pdf"
                  className="document-embed"
                />
              ) : (
                <img
                  src={`http://localhost:3000/uploads/${authUser.documento}`}
                  alt="Documento de identificação"
                  className="document-image"
                />
              )}
              <a
                href={`http://localhost:3000/uploads/${authUser.documento}`}
                target="_blank"
                rel="noopener noreferrer"
                className="document-link"
              >
                Abrir em Nova Aba
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
