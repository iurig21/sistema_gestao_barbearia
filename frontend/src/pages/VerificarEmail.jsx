import { useEffect, useState, useRef } from "react";
import { useSearchParams, Link } from "react-router";
import { API_URL } from "../config";
import { Loader, CheckCircle, XCircle } from "lucide-react";
import "../styles.css";

function VerificarEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading");
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      return;
    }

    fetch(`${API_URL}/verify-email?token=${token}`)
      .then((res) => {
        if (res.ok) setStatus("success");
        else setStatus("error");
      })
      .catch(() => setStatus("error"));
  }, [searchParams]);

  return (
    <div className="login-container">
      <div className="login-modal" style={{ textAlign: "center" }}>
        {status === "loading" && (
          <>
            <Loader className="spinner" size={40} />
            <p style={{ marginTop: "16px", color: "#555" }}>
              A verificar o seu email...
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle size={50} color="#4CAF50" />
            <h2 style={{ marginTop: "16px" }}>Email verificado com sucesso!</h2>
            <p style={{ color: "#555", marginBottom: "24px" }}>
              Já pode fazer as suas marcações.
            </p>
            <Link to="/login" className="login-btn" style={{ textDecoration: "none", padding: "10px 24px" }}>
              Ir para Login
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle size={50} color="#e74c3c" />
            <h2 style={{ marginTop: "16px" }}>Erro na verificação</h2>
            <p style={{ color: "#555", marginBottom: "24px" }}>
              O link é inválido ou já foi utilizado.
            </p>
            <Link to="/login" className="login-btn" style={{ textDecoration: "none", padding: "10px 24px" }}>
              Ir para Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default VerificarEmail;
