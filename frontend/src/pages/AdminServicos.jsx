import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../contexts/authContext.jsx";
import { API_URL } from "../config";
import { Trash2, Edit, Scissors, Plus } from "lucide-react";
import Loading from "../components/Loading.jsx";
import ServiceForm from "../components/ServiceForm.jsx";

function AdminServicos() {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [editForm, setEditForm] = useState({
    nome: "",
    descricao: "",
    preco: "",
    imagem: "",
  });
  const [uploadingEditImage, setUploadingEditImage] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/services`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Erro a consultar serviços");

        setServices(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, [token]);

  const handleDeleteService = async (id) => {
    if (!confirm("Tem certeza que deseja excluir este serviço?")) return;

    try {
      const response = await fetch(`${API_URL}/services/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setServices(services.filter((s) => s.id !== id));
      }
    } catch (err) {
      console.error(err);
      setError("Erro ao excluir serviço");
    }
  };

  const handleEditService = (service) => {
    setEditingService(service.id);
    setEditForm({
      nome: service.nome,
      descricao: service.descricao,
      preco: service.preco,
      imagem: service.imagem,
    });
  };

  const handleEditImageUpload = async (file) => {
    try {
      setUploadingEditImage(true);
      setError("");

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Erro ao fazer upload da imagem");

      const data = await response.json();
      setEditForm({ ...editForm, imagem: data.filename });
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setUploadingEditImage(false);
    }
  };

  const handleUpdateService = async (id) => {
    try {
      const response = await fetch(`${API_URL}/services/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          newName: editForm.nome,
          newDescription: editForm.descricao,
          newPrice: editForm.preco,
          newImage: editForm.imagem,
        }),
      });

      if (response.ok) {
        setServices(services.map((s) => (s.id === id ? { ...s, ...editForm } : s)));
        setEditingService(null);
      }
    } catch (err) {
      console.error(err);
      setError("Erro ao atualizar serviço");
    }
  };

  const handleCancelEdit = () => {
    setEditingService(null);
    setEditForm({ nome: "", descricao: "", preco: "", imagem: "" });
  };

  const handleServiceAdded = (newService) => {
    setServices([...services, newService]);
  };

  return (
    <>
      <div className="admin-header">
        <h2>Serviços</h2>
        <button className="btn-add-service" onClick={() => setShowAddModal(true)}>
          <Plus size={16} />
          Novo Serviço
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {isLoading ? (
        <Loading size={22}>serviços</Loading>
      ) : services.length === 0 ? (
        <div className="empty-state">
          <Scissors size={48} />
          <p>Nenhum serviço encontrado</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Descrição</th>
                <th>Preço</th>
                <th>Imagem</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id}>
                  {editingService === service.id ? (
                    <>
                      <td>
                        <input
                          type="text"
                          className="edit-input"
                          value={editForm.nome}
                          onChange={(e) => setEditForm({ ...editForm, nome: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="edit-input"
                          value={editForm.descricao}
                          onChange={(e) => setEditForm({ ...editForm, descricao: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="edit-input"
                          value={editForm.preco}
                          onChange={(e) => setEditForm({ ...editForm, preco: e.target.value })}
                        />
                      </td>
                      <td>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "center" }}>
                          {editForm.imagem && !uploadingEditImage && (
                            <img
                              src={`${API_URL}/uploads/${editForm.imagem}`}
                              alt="Preview"
                              style={{
                                width: "60px",
                                height: "60px",
                                objectFit: "cover",
                                borderRadius: "6px",
                                border: "1px solid #2a2a2a",
                              }}
                            />
                          )}
                          <input
                            type="file"
                            className="edit-input"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) handleEditImageUpload(file);
                            }}
                            disabled={uploadingEditImage}
                          />
                          {uploadingEditImage && (
                            <span style={{ color: "#C8A870", fontSize: "11px" }}>A carregar...</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-table-save"
                            onClick={() => handleUpdateService(service.id)}
                            disabled={uploadingEditImage}
                          >
                            Salvar
                          </button>
                          <button className="btn-table-cancel" onClick={handleCancelEdit}>
                            Cancelar
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="service-name-cell">{service.nome}</td>
                      <td>{service.descricao}</td>
                      <td className="price-cell">{service.preco}€</td>
                      <td className="image-cell">
                        <img
                          src={`${API_URL}/uploads/${service.imagem}`}
                          alt={service.nome}
                          className="service-thumbnail"
                        />
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-table-edit"
                            onClick={() => handleEditService(service)}
                            title="Editar serviço"
                          >
                            <Edit size={16} />
                            Editar
                          </button>
                          <button
                            className="btn-table-delete"
                            onClick={() => handleDeleteService(service.id)}
                            title="Excluir serviço"
                          >
                            <Trash2 size={16} />
                            Excluir
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ServiceForm
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleServiceAdded}
        token={token}
      />
    </>
  );
}

export default AdminServicos;
