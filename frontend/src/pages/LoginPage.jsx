import { useState } from "react";
import "../styles.css";
import { Link } from "react-router";
import { AuthContext } from "../contexts/authContext.jsx";
import { useContext } from "react";
import { Loader } from "lucide-react";
import validator from "validator";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const { Login, isAuthenticating } = useContext(AuthContext);

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      return setError("O email e password são obrigatórios");
    }

    if (!validator.isEmail(email)) {
      return setError("Email inválido");
    }

    if (password.length < 6) {
      return setError("A password deve ter pelo menos 6 caracteres");
    }

    try {
      setError("");
      await Login(email, password);

      setSuccess("Autenticado com sucesso!");
    } catch (err) {
      console.error(err);
      setError(err.message ?? "Erro no login");
    }
  };

  const clearForm = () => {
    setEmail("");
    setPassword("");
    setError("");
    setSuccess("");
  };

  return (
    <div className="login-container">
      <div className="login-modal">
        <h2>Login</h2>
        <p className="subtitle">Bem-vindo de volta</p>

        <form className="login-form">
          <div className="input-group">
            <label>Email</label>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              placeholder="seu@email.com"
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              placeholder="••••••••"
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="button-row">
            <button type="button" className="clear" onClick={clearForm}>
              Limpar formulário
            </button>

            <button
              disabled={isAuthenticating}
              type="submit"
              className="login-btn"
              onClick={onSubmit}
            >
              {isAuthenticating ? (
                <Loader className="spinner" size={20} />
              ) : (
                "Entrar"
              )}
            </button>
          </div>
        </form>

        <div className="register-link">
          <span>Não tem conta?</span>
          <Link to="/register">Criar conta</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
