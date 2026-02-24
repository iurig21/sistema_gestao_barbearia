import { AuthContext } from "../contexts/authContext.jsx";
import { useContext, useState, useEffect, useCallback } from "react";
import { API_URL, getFileUrl } from "../config";
import { useSearchParams } from "react-router";
import Navbar from "../components/Navbar.jsx";
import "../styles.css";
import { EyeIcon, EyeOffIcon, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';

function Profile() {
  const { authUser, setAuthUser, token, Logout } = useContext(AuthContext);
  const [updatingUser, setIsUpdatingUser] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [telefone, setTelefone] = useState("");
  const [morada, setMorada] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [googleConnected, setGoogleConnected] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const checkGoogleStatus = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/google/status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setGoogleConnected(data.connected);
      }
    } catch (err) {
      console.error("Error checking Google status:", err);
    }
  }, [token]);

  useEffect(() => {
    checkGoogleStatus();
  }, [checkGoogleStatus]);

  useEffect(() => {
    const googleParam = searchParams.get("google");
    if (googleParam === "success") {
      setSuccessMsg("Google Calendar conectado com sucesso!");
      setGoogleConnected(true);
      setSearchParams({}, { replace: true });
      setTimeout(() => setSuccessMsg(""), 4000);
    } else if (googleParam === "error") {
      setErrorMsg("Erro ao conectar Google Calendar. Tente novamente.");
      setSearchParams({}, { replace: true });
      setTimeout(() => setErrorMsg(""), 4000);
    }
  }, [searchParams, setSearchParams]);

  async function connectGoogle() {
    setGoogleLoading(true);
    try {
      const response = await fetch(`${API_URL}/google/auth-url`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      }
    } catch (err) {
      console.error("Error connecting Google:", err);
      setErrorMsg("Erro ao conectar Google Calendar.");
    } finally {
      setGoogleLoading(false);
    }
  }

  async function disconnectGoogle() {
    if (!confirm("Deseja desconectar o Google Calendar?")) return;
    try {
      const response = await fetch(`${API_URL}/google/disconnect`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setGoogleConnected(false);
        setSuccessMsg("Google Calendar desconectado.");
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (err) {
      console.error("Error disconnecting Google:", err);
    }
  }

  function startEditing() {
    setTelefone(authUser.telefone || "");
    setMorada(authUser.morada || "");
    setPassword("");
    setPhotoFile(null);
    setPhotoPreview(null);
    setSuccessMsg("");
    setErrorMsg("");
    setIsUpdatingUser(true)
  }

  function cancelEditing() {
    setIsUpdatingUser(false);
    setPhotoPreview(null);
    setErrorMsg("");
  }

  function handlePhotoChange(e) {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  }

  async function uploadFile(file) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Erro ao enviar ficheiro");

    const data = await response.json();
    return data.url;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      let newPhoto = null;

      if (photoFile) {
        newPhoto = await uploadFile(photoFile);
      }

      const body = {};
      if (telefone && telefone !== authUser.telefone) body.newTelefone = telefone;
      if (morada && morada !== authUser.morada) body.newMorada = morada;
      if (password) body.newPassword = password;
      if (newPhoto) body.newPhoto = newPhoto;

      if (Object.keys(body).length === 0) {
        setErrorMsg("Nenhuma alteração detetada.");
        setIsSubmitting(false);
        return;
      }

      const response = await fetch(
        `${API_URL}/users/${authUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        },
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Erro ao atualizar perfil");
      }

      setAuthUser((prev) => ({
        ...prev,
        telefone: body.newTelefone || prev.telefone,
        morada: body.newMorada || prev.morada,
        fotografia: newPhoto || prev.fotografia,
      }));

      setSuccessMsg("Perfil atualizado com sucesso!");
      setIsUpdatingUser(false);
      setPhotoPreview(null);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <Navbar />
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-left">
            <img
              src={
                photoPreview ||
                getFileUrl(authUser.fotografia)
              }
              alt="Foto de perfil"
              className="profile-photo"
            />
            <h2>{authUser.nome}</h2>
            <p className="profile-role">
              {authUser.role === "admin" ? "Administrador" : "Utilizador"}
            </p>

            {updatingUser && (
              <div className="profile-file-group">
                <label>Alterar Fotografia</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
              </div>
            )}

            <button onClick={Logout} className="logout-btn">
              Terminar Sessão
            </button>
          </div>

          <div className="profile-right">
            <div className="profile-right-header">
              <h3>Informações Pessoais</h3>
              {!updatingUser && (
                <button onClick={startEditing} className="btn-edit-profile">
                  Editar Perfil
                </button>
              )}
            </div>

          
            {successMsg && <p className="success-message">{successMsg}</p>}
            {errorMsg && <p className="error-message">{errorMsg}</p>}

            <form onSubmit={handleSubmit}>
              <div className="profile-info">
                <div className="info-group">
                  <label>Email</label>
                  <p>{authUser.email}</p>
                  {authUser.email_verificado ? (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "#4CAF50", fontSize: "13px", marginTop: "4px" }}>
                      <CheckCircle size={14} /> Verificado
                    </span>
                  ) : (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "#e74c3c", fontSize: "13px", marginTop: "4px" }}>
                      <AlertTriangle size={14} /> Email não verificado!
                    </span>
                  )}
                </div>

                <div className="info-group">
                  <label>Telefone</label>
                  {!updatingUser ? (
                    <p>{authUser.telefone}</p>
                  ) : (
                    <input
                      className="profile-edit-input"
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                      type="tel"
                      placeholder="123456789"
                      pattern="[0-9]{9}"
                      maxLength={9}
                    />
                  )}
                  {authUser.telefone_verificado ? (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "#4CAF50", fontSize: "13px", marginTop: "4px" }}>
                      <CheckCircle size={14} /> Verificado
                    </span>
                  ) : (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "#e74c3c", fontSize: "13px", marginTop: "4px" }}>
                      <AlertTriangle size={14} /> Telefone não verificado
                    </span>
                  )}
                </div>

                <div className="info-group">
                  <label>Morada</label>
                  {!updatingUser ? (
                    <p>{authUser.morada}</p>
                  ) : (
                    <input
                      className="profile-edit-input"
                      value={morada}
                      onChange={(e) => setMorada(e.target.value)}
                      type="text"
                      placeholder="Sua morada"
                    />
                  )}
                </div>

                <div className="info-group">
                  <label>Data de Nascimento</label>
                  <p>
                    {new Date(authUser.datanascimento).toLocaleDateString(
                      "pt-PT",
                    )}
                  </p>
                </div>

                <div className="info-group">
                  <label>Género</label>
                  <p>{authUser.genero}</p>
                </div>

                {updatingUser && (
                  <div className="info-group">
                    <label>Nova Password</label>
                    <div className="password-input-wrapper">
                      <input
                        className="profile-edit-input"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Deixe vazio para manter"
                        minLength={6}
                      />
                      <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOffIcon size={18} />
                        ) : (
                          <EyeIcon size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="google-calendar-section">
                <h4>
                  <Calendar size={18} />
                  Google Calendar
                </h4>
                <p className="google-calendar-description">
                  {googleConnected
                    ? "A sua conta Google está conectada. As suas marcações serão adicionadas automaticamente ao seu Google Calendar."
                    : "Conecte a sua conta Google para adicionar marcações automaticamente ao seu calendário."}
                </p>
                {googleConnected ? (
                  <button
                    type="button"
                    onClick={disconnectGoogle}
                    className="btn-google-disconnect"
                  >
                    Desconectar Google Calendar
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={connectGoogle}
                    disabled={googleLoading}
                    className="btn-google-connect"
                  >
                    <Calendar size={16} />
                    {googleLoading ? "A conectar..." : "Conectar Google Calendar"}
                  </button>
                )}
              </div>

              {updatingUser && (
                <div className="profile-actions">
                  <button
                    type="button"
                    onClick={cancelEditing}
                    className="btn-cancel"
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn-submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "A guardar..." : "Guardar Alterações"}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
