import { useState, useContext } from "react";
import { X, User } from "lucide-react";
import { AuthContext } from "../contexts/authContext";

function BarbeirosForm({ isOpen, onClose, onSuccess }) {
  const [nome, setNome] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    setNome("")

    try {
      const response = await fetch("http://localhost:3000/barbeiro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nome }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao criar barbeiro");
      }

      setNome("");
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Novo Barbeiro</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="appointment-form">
          {error && <div className="modal-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="nome">
              <User size={18} />
              Nome do Barbeiro *
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              className="form-input"
              placeholder="Digite o nome do barbeiro"
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-submit" disabled={isLoading}>
              {isLoading ? "Criando..." : "Criar Barbeiro"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BarbeirosForm;
