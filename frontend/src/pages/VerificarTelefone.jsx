import { useState, useRef } from "react";
import { useSearchParams, Link } from "react-router";
import { API_URL } from "../config";
import { Loader, CheckCircle, XCircle, Smartphone } from "lucide-react";
import "../styles.css";

function VerificarTelefone() {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [status, setStatus] = useState("input");
  const [error, setError] = useState("");
  const [resending, setResending] = useState(false);
  const inputRefs = useRef([]);

  function handleChange(index, value) {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index, e) {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const newCode = [...code];
    for (let i = 0; i < 6; i++) {
      newCode[i] = pasted[i] || "";
    }
    setCode(newCode);
    const nextEmpty = newCode.findIndex((c) => !c);
    inputRefs.current[nextEmpty === -1 ? 5 : nextEmpty]?.focus();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const fullCode = code.join("");
    if (fullCode.length !== 6) {
      setError("Introduza o código completo de 6 dígitos");
      return;
    }

    setStatus("loading");
    setError("");

    try {
      const response = await fetch(`${API_URL}/verify-phone`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: Number(userId), code: fullCode }),
      });

      if (response.ok) {
        setStatus("success");
        sessionStorage.removeItem("pendingVerifyUserId");
      } else {
        const data = await response.json();
        setError(data.message || "Código inválido");
        setStatus("input");
      }
    } catch {
      setError("Erro de ligação ao servidor");
      setStatus("input");
    }
  }

  async function handleResend() {
    setResending(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/resend-phone-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: Number(userId) }),
      });

      if (response.ok) {
        setCode(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } else {
        const data = await response.json();
        setError(data.message || "Erro ao reenviar código");
      }
    } catch {
      setError("Erro de ligação ao servidor");
    } finally {
      setResending(false);
    }
  }

  if (!userId) {
    return (
      <div className="login-container">
        <div className="login-modal" style={{ textAlign: "center" }}>
          <XCircle size={50} color="#e74c3c" />
          <h2 style={{ marginTop: "16px" }}>Erro</h2>
          <p style={{ color: "#aaa", marginBottom: "24px" }}>Link de verificação inválido.</p>
          <Link to="/login" className="login-btn" style={{ textDecoration: "none", padding: "10px 24px" }}>
            Ir para Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-modal" style={{ textAlign: "center", maxWidth: "460px" }}>
        {status === "success" ? (
          <>
            <CheckCircle size={50} color="#4CAF50" />
            <h2 style={{ marginTop: "16px" }}>Telefone verificado com sucesso!</h2>
            <p style={{ color: "#aaa", marginBottom: "24px" }}>
              O seu número foi verificado. Já pode fazer login.
            </p>
            <Link to="/login" className="login-btn" style={{ textDecoration: "none", padding: "10px 24px" }}>
              Ir para Login
            </Link>
          </>
        ) : (
          <>
            <Smartphone size={50} color="#C8A870" />
            <h2 style={{ marginTop: "16px" }}>Verificar Telefone</h2>
            <p style={{ color: "#aaa", fontSize: "15px", margin: "12px 0 24px" }}>
              Introduza o código de 6 dígitos enviado para o seu WhatsApp.
            </p>

            <form onSubmit={handleSubmit}>
              <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "20px" }}>
                {code.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (inputRefs.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onPaste={i === 0 ? handlePaste : undefined}
                    style={{
                      width: "48px",
                      height: "56px",
                      textAlign: "center",
                      fontSize: "24px",
                      fontWeight: "bold",
                      background: "#0f0f0f",
                      border: "1px solid #2a2a2a",
                      borderRadius: "8px",
                      color: "#fff",
                      outline: "none",
                    }}
                  />
                ))}
              </div>

              {error && <p className="error-message" style={{ marginBottom: "16px" }}>{error}</p>}

              <button
                type="submit"
                className="login-btn"
                disabled={status === "loading"}
                style={{ width: "100%", marginBottom: "12px" }}
              >
                {status === "loading" ? <Loader className="spinner" size={20} /> : "Verificar"}
              </button>
            </form>

            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              style={{
                background: "none",
                border: "none",
                color: "#C8A870",
                cursor: "pointer",
                fontSize: "14px",
                textDecoration: "underline",
              }}
            >
              {resending ? "A reenviar..." : "Reenviar código"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default VerificarTelefone;
