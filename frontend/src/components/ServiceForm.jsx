import { useState } from "react";
import { Loader, X } from "lucide-react";
import { API_URL } from "../config";

function ServiceForm({ isOpen, onClose, onSuccess, token }) {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [addForm, setAddForm] = useState({
    nome: "",
    descricao: "",
    preco: "",
    imagem: "",
  });

  const handleImageUpload = async (file) => {
    try {
      setUploadingImage(true);
      setError("");

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erro ao fazer upload da imagem");
      }

      const data = await response.json();
      setAddForm({ ...addForm, imagem: data.filename });
    } catch (err) {
      setError(err.message);
      console.error("Upload error:", err);
    } finally {
      setUploadingImage(false);
    }
  };

  const addService = async (e) => {
    e.preventDefault();

    if (
      !addForm.nome.trim() ||
      !addForm.descricao.trim() ||
      !addForm.preco ||
      !addForm.imagem
    ) {
      setError("Todos os campos são obrigatórios");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome: addForm.nome,
          descricao: addForm.descricao,
          preco: addForm.preco,
          imagem: addForm.imagem,
        }),
      });

      const responseJSON = await response.json();

      if (!response.ok) {
        throw new Error(responseJSON.message || "Erro ao criar serviço");
      }

      setAddForm({ nome: "", descricao: "", preco: "", imagem: "" });
      setError("");
      onSuccess(responseJSON);
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message || "Erro ao criar serviço");
    }
  };

  const handleClose = () => {
    setAddForm({ nome: "", descricao: "", preco: "", imagem: "" });
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Adicionar Novo Serviço</h2>
          <button className="modal-close" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <form className="service-form" onSubmit={addService}>
          <div className="input-group">
            <label>Nome do Serviço</label>
            <input
              type="text"
              placeholder="Ex: Corte de Cabelo"
              value={addForm.nome}
              onChange={(e) => setAddForm({ ...addForm, nome: e.target.value })}
              maxLength={50}
            />
          </div>

          <div className="input-group">
            <label>Descrição</label>
            <textarea
              placeholder="Descreva o serviço..."
              value={addForm.descricao}
              onChange={(e) =>
                setAddForm({ ...addForm, descricao: e.target.value })
              }
              rows={3}
              maxLength={200}
            />
          </div>

          <div className="input-group">
            <label>Preço (€)</label>
            <input
              type="number"
              placeholder="0.00"
              step="0.01"
              min="0"
              value={addForm.preco}
              onChange={(e) =>
                setAddForm({ ...addForm, preco: e.target.value })
              }
            />
          </div>

          <div className="input-group">
            <label>Imagem {addForm.imagem && "✓"}</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  handleImageUpload(file);
                }
              }}
              disabled={uploadingImage}
            />
            {uploadingImage && (
              <span style={{ color: "#C8A870", fontSize: "11px" }}>
                Uploading...
              </span>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-actions">
            <button
              type="button"
              className="btn-modal-cancel"
              onClick={handleClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-modal-submit"
              disabled={uploadingImage}
            >
              {uploadingImage ? (
                <Loader className="spinner" size={16} />
              ) : (
                "Criar Serviço"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ServiceForm;
