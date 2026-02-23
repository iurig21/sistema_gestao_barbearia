import { Link, useLocation } from "react-router";
import { Mail, Smartphone } from "lucide-react";
import "../styles.css";

function ConfirmarRegisto() {
  const location = useLocation();
  const userId = location.state?.userId;

  return (
    <div className="login-container">
      <div className="login-modal" style={{ textAlign: "center", maxWidth: "520px" }}>
        <h2 style={{ marginBottom: "24px" }}>Verifique a sua conta</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginBottom: "28px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", textAlign: "left" }}>
            <Mail size={32} color="#C8A870" style={{ flexShrink: 0, marginTop: "2px" }} />
            <div>
              <h3 style={{ color: "#fff", margin: "0 0 4px", fontSize: "16px" }}>Verificar Email</h3>
              <p style={{ color: "#aaa", margin: 0, fontSize: "14px", lineHeight: "1.5" }}>
                Enviámos um email de verificação. Clique no botão no email para verificar.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", textAlign: "left" }}>
            <Smartphone size={32} color="#C8A870" style={{ flexShrink: 0, marginTop: "2px" }} />
            <div>
              <h3 style={{ color: "#fff", margin: "0 0 4px", fontSize: "16px" }}>Verificar Telefone</h3>
              <p style={{ color: "#aaa", margin: 0, fontSize: "14px", lineHeight: "1.5" }}>
                Enviámos um código de 6 dígitos para o seu WhatsApp. Clique no botão abaixo para introduzir o código.
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "center" }}>
          {userId && (
            <Link
              to={`/verificar-telefone?userId=${userId}`}
              className="login-btn"
              style={{ textDecoration: "none", padding: "10px 28px", display: "inline-block" }}
            >
              Verificar Telefone
            </Link>
          )}
          <Link
            to="/login"
            style={{ color: "#C8A870", fontSize: "14px" }}
          >
            Ir para Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ConfirmarRegisto;
