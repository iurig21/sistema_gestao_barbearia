import { useState } from "react";
import "../styles.css";
import { API_URL, getFileUrl } from "../config";
import { Link } from "react-router";
import { Loader } from "lucide-react";
import { AuthContext } from "../contexts/authContext.jsx";
import { useContext } from "react";
import validator from "validator";
import { useNavigate } from "react-router";

function RegisterPage() {
  const [nome, setNome] = useState("");
  const [datanascimento, setDatanascimento] = useState("");
  const [morada, setMorada] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [genero, setGenero] = useState("");
  const [fotografia, setFotografia] = useState("");
  const [password, setPassword] = useState("");
  const [uploadingFoto, setUploadingFoto] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  const { Register, isAuthenticating } = useContext(AuthContext);

  let navigate = useNavigate();

  const handleFileUpload = async (file, setFileName, setUploading) => {
    try {
      setUploading(true);
      setError("");

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erro ao fazer upload do arquivo");
      }

      const data = await response.json();
      setFileName(data.url);
    } catch (err) {
      setError(err.message);
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    setSuccess("");
    setError("");

    if (
      !fotografia ||
      !nome.trim() ||
      !datanascimento.trim() ||
      !password.trim() ||
      !email.trim() ||
      !morada.trim() ||
      !telefone.trim() ||
      !genero.trim()
    ) {
      if (!fotografia) {
        setError(
          "A fotografia deve ser carregada com sucesso (deve aparecer ✓). Aguarde o carregamento ou tente novamente."
        );
      } else {
        setError("Todos os campos são obrigatórios");
      }
      return;
    }

    if (!validator.isEmail(email)) {
      return setError("Email inválido");
    }

    if (password.length < 6) {
      return setError("A password deve ter pelo menos 6 caracteres");
    }

    try {
      const result = await Register({
        nome,
        datanascimento,
        morada,
        email,
        telefone,
        genero,
        fotografia,
        password,
      });

      clearForm();
      sessionStorage.setItem("pendingVerifyUserId", String(result.userId));
      navigate("/confirmar-registo", { state: { userId: result.userId } });
    } catch (err) {
      setError(err.message);
    }
  };

  const clearForm = () => {
    setNome("");
    setDatanascimento("");
    setMorada("");
    setEmail("");
    setTelefone("");
    setGenero("");
    setFotografia("");
    setPassword("");
    setError("");
    setSuccess("");
    setFileInputKey(Date.now());
  };

  return (
    <div className="login-container">
      <div className="register-modal">
        <h2>Criar Conta</h2>
        <p className="subtitle">Junte-se a nós</p>

        <form className="login-form" onSubmit={onSubmit}>
          <div className="form-row">
            <div className="input-group">
              <label>Nome</label>
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                type="text"
                placeholder="Seu nome"
                maxLength={30}
              />
            </div>

            <div className="input-group">
              <label>Data de Nascimento</label>
              <input
                value={datanascimento}
                onChange={(e) => setDatanascimento(e.target.value)}
                type="date"
                min="1960-01-01"
                max="2023-12-31"
              />
            </div>
          </div>

          <div className="input-group">
            <label>Morada</label>
            <input
              value={morada}
              onChange={(e) => setMorada(e.target.value)}
              type="text"
              placeholder="Sua morada"
              maxLength={50}
            />
          </div>

          <div className="form-row">
            <div className="input-group">
              <label>Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="seu@email.com"
                maxLength={100}
              />
            </div>

            <div className="input-group">
              <label>Telefone - XXXXXXXXX</label>
              <input
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                type="tel"
                placeholder="123456789"
                pattern="[0-9]{9}"
                maxLength={9}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Género</label>
            <select value={genero} onChange={(e) => setGenero(e.target.value)}>
              <option value="">Selecione o género</option>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
            </select>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label>Fotografia {fotografia && "✓"}</label>
              {fotografia && !uploadingFoto && (
                <img
                  src={getFileUrl(fotografia)}
                  alt="Preview fotografia"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "6px",
                    border: "1px solid #2a2a2a",
                    marginBottom: "8px",
                  }}
                />
              )}
              <input
                key={`foto-${fileInputKey}`}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    handleFileUpload(file, setFotografia, setUploadingFoto);
                  }
                }}
                disabled={uploadingFoto}
              />
              {uploadingFoto && (
                <span style={{ color: "#C8A870", fontSize: "11px" }}>
                  A carregar...
                </span>
              )}
            </div>

          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
              maxLength={100}
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="button-row">
            <button type="button" className="clear" onClick={clearForm}>
              Limpar formulário
            </button>

            <button
              type="submit"
              className="login-btn"
              disabled={isAuthenticating || uploadingFoto}
            >
              {isAuthenticating ? (
                <Loader className="spinner" size={20} />
              ) : (
                "Registar"
              )}
            </button>
          </div>
        </form>

        <div className="register-link">
          <span>Já tem conta?</span>
          <Link to="/login">Entrar</Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
