import { Link } from "react-router";
import { Mail } from "lucide-react";
import "../styles.css";

function ConfirmarEmail() {
  return (
    <div className="login-container">
      <div className="login-modal" style={{ textAlign: "center", maxWidth: "480px" }}>
        <Mail size={56} color="#C8A870" style={{ marginBottom: "16px" }} />
        <h2>Verifique o seu Email</h2>
        <p style={{ color: "#aaa", fontSize: "16px", lineHeight: "1.6", margin: "16px 0 24px" }}>
          Enviámos um email de verificação para a sua caixa de correio.
          Por favor, clique no botão no email para ativar a sua conta.
        </p>
        <p style={{ color: "#888", fontSize: "14px", marginBottom: "28px" }}>
          Não recebeu o email? Verifique a pasta de spam.
        </p>
        <Link
          to="/login"
          className="login-btn"
          style={{ textDecoration: "none", padding: "10px 28px", display: "inline-block" }}
        >
          Ir para Login
        </Link>
      </div>
    </div>
  );
}

export default ConfirmarEmail;
