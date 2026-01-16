import { useEffect, useState } from "react";
import { AuthContext } from "../contexts/authContext.jsx";
import { useContext } from "react";
import {
  Loader,
  Trash2,
  Calendar,
  Clock,
  User,
  Edit,
  Scissors,
  Plus,
} from "lucide-react";
import Loading from "../components/Loading.jsx";
import ServiceForm from "../components/ServiceForm.jsx";
import BarbeirosForm from "../components/BarbeirosForm.jsx";

function AdminPage() {
  const [marcacoes, setMarcacoes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [services, setServices] = useState([]);
  const [barbeiros, setBarbeiros] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [editForm, setEditForm] = useState({
    nome: "",
    descricao: "",
    preco: "",
    imagem: "",
  });
  const [uploadingEditImage, setUploadingEditImage] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddBarbeiroModal, setShowAddBarbeiroModal] = useState(false);
  const [filterBarbeiro, setFilterBarbeiro] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterDateInput, setFilterDateInput] = useState("");

  const { token, Logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchMarcacoes = async () => {
      try {
        setError(null);
        setSuccess(false);
        setIsLoading(true);
        setError(null);

        const response = await fetch("http://localhost:3000/appointments/all", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const responseJSON = await response.json();

        if (!response.ok) {
          throw new Error(responseJSON.message || "Erro a consultar marcações");
        }

        setMarcacoes(responseJSON);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMarcacoes();
  }, [token]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:3000/services", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const responseJSON = await response.json();

        if (!response.ok) {
          throw new Error(responseJSON.message || "Erro a consultar serviços");
        }

        setServices(responseJSON);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, [token]);

  useEffect(() => {
    const fetchBarbeiros = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:3000/barbeiros", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const responseJSON = await response.json();

        if (!response.ok) {
          throw new Error(responseJSON.message || "Erro a consultar barbeiros");
        }

        setBarbeiros(responseJSON);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBarbeiros();
  }, [token]);

  const handleDelete = async (id) => {
    if (!confirm("Tem certeza que deseja cancelar esta marcação?")) return;

    try {
      const response = await fetch(`http://localhost:3000/appointments/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setMarcacoes(marcacoes.filter((marcacao) => marcacao.id !== id));
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
      setError("Erro ao cancelar marcação");
    }
  };

  const handleDeleteService = async (id) => {
    if (!confirm("Tem certeza que deseja excluir este serviço?")) return;

    try {
      const response = await fetch(`http://localhost:3000/services/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setServices(services.filter((service) => service.id !== id));
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

      const response = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erro ao fazer upload da imagem");
      }

      const data = await response.json();
      setEditForm({ ...editForm, imagem: data.filename });
    } catch (err) {
      setError(err.message);
      console.error("Upload error:", err);
    } finally {
      setUploadingEditImage(false);
    }
  };

  const handleUpdateService = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/services/${id}`, {
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
        setServices(
          services.map((s) => (s.id === id ? { ...s, ...editForm } : s))
        );
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

  const handleDeleteBarbeiro = async (id) => {
    if (!confirm("Tem certeza que deseja excluir este barbeiro?")) return;

    try {
      const response = await fetch(`http://localhost:3000/barbeiro/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setBarbeiros(barbeiros.filter((barbeiro) => barbeiro.id !== id));
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
      setError("Erro ao excluir barbeiro");
    }
  };

  const handleBarbeiroAdded = () => {
    fetch("http://localhost:3000/barbeiros", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setBarbeiros(data))
      .catch((err) => console.error(err));
  };

  const filteredMarcacoes = marcacoes.filter((marcacao) => {
    const matchesBarbeiro =
      !filterBarbeiro || marcacao.barbeiro_id === parseInt(filterBarbeiro);
    const matchesDate = !filterDate || marcacao.data_formatada === filterDate;
    return matchesBarbeiro && matchesDate;
  });

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Painel de Administração</h1>
        <button className="btn-logout" onClick={Logout}>
          Logout
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && (
        <div className="success-message"> Marcação excluída com sucesso! </div>
      )}

      <div className="filter-section">
        <div className="filter-group">
          <label htmlFor="filter-barbeiro">Filtrar por Barbeiro:</label>
          <select
            id="filter-barbeiro"
            className="filter-select"
            value={filterBarbeiro}
            onChange={(e) => setFilterBarbeiro(e.target.value)}
          >
            <option value="">Todos os barbeiros</option>
            {barbeiros.map((barbeiro) => (
              <option key={barbeiro.id} value={barbeiro.id}>
                {barbeiro.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="filter-date">Filtrar por Data:</label>
          <input
            type="date"
            id="filter-date"
            className="filter-input"
            value={filterDateInput}
            onChange={(e) => {
              const selectedDate = e.target.value;
              setFilterDateInput(selectedDate);
              if (selectedDate) {
                const [year, month, day] = selectedDate.split("-");
                const formattedDate = `${day}/${month}/${year}`;
                setFilterDate(formattedDate);
              } else {
                setFilterDate("");
              }
            }}
          />
        </div>

        {(filterBarbeiro || filterDate) && (
          <button
            className="btn-clear-filters"
            onClick={() => {
              setFilterBarbeiro("");
              setFilterDate("");
              setFilterDateInput("");
            }}
          >
            Limpar Filtros
          </button>
        )}
      </div>

      {isLoading ? (
        <Loading size={22}>marcações</Loading>
      ) : filteredMarcacoes.length === 0 ? (
        <div className="empty-state">
          <Calendar size={48} />
          <p>Nenhuma marcação encontrada</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>
                  <User size={16} /> Cliente
                </th>
                <th>
                  <Calendar size={16} /> Data
                </th>
                <th>
                  <Clock size={16} /> Hora
                </th>
                <th>Serviço</th>
                <th>Barbeiro</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredMarcacoes.map((marcacao, idx) => (
                <tr key={idx}>
                  <td className="user-cell">{marcacao.usuario_nome}</td>
                  <td>{marcacao.data_formatada}</td>
                  <td>{marcacao.hora_formatada}</td>
                  <td className="service-cell">{marcacao.servico_nome}</td>
                  <td className="barbeiro-cell">
                    {marcacao.barbeiro_nome || "N/A"}
                  </td>
                  <td>
                    <button
                      className="btn-table-delete"
                      onClick={() => handleDelete(marcacao.id)}
                      title="Cancelar marcação"
                    >
                      <Trash2 size={16} />
                      Cancelar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="admin-section-divider"></div>

      <div className="admin-header">
        <h2>Gestão de Serviços</h2>
        <button
          className="btn-add-service"
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={16} />
          Novo Serviço
        </button>
      </div>

      {services.length === 0 ? (
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
                          onChange={(e) =>
                            setEditForm({ ...editForm, nome: e.target.value })
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="edit-input"
                          value={editForm.descricao}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              descricao: e.target.value,
                            })
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="edit-input"
                          value={editForm.preco}
                          onChange={(e) =>
                            setEditForm({ ...editForm, preco: e.target.value })
                          }
                        />
                      </td>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "4px",
                          }}
                        >
                          <input
                            type="file"
                            className="edit-input"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                handleEditImageUpload(file);
                              }
                            }}
                            disabled={uploadingEditImage}
                          />
                          {uploadingEditImage && (
                            <span
                              style={{ color: "#C8A870", fontSize: "11px" }}
                            >
                              Uploading...
                            </span>
                          )}
                          {editForm.imagem && !uploadingEditImage && (
                            <span
                              style={{ color: "#10b981", fontSize: "11px" }}
                            >
                              ✓ {editForm.imagem}
                            </span>
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
                          <button
                            className="btn-table-cancel"
                            onClick={handleCancelEdit}
                          >
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
                          src={`http://localhost:3000/uploads/${service.imagem}`}
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

      <div className="admin-section-divider"></div>

      <div className="admin-header">
        <h2>Gestão de Barbeiros</h2>
        <button
          className="btn-add-service"
          onClick={() => setShowAddBarbeiroModal(true)}
        >
          <Plus size={16} />
          Novo Barbeiro
        </button>
      </div>

      {barbeiros.length === 0 ? (
        <div className="empty-state">
          <User size={48} />
          <p>Nenhum barbeiro encontrado</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {barbeiros.map((barbeiro) => (
                <tr key={barbeiro.id}>
                  <td className="barbeiro-name-cell">{barbeiro.nome}</td>
                  <td>
                    <button
                      className="btn-table-delete"
                      onClick={() => handleDeleteBarbeiro(barbeiro.id)}
                      title="Excluir barbeiro"
                    >
                      <Trash2 size={16} />
                      Excluir
                    </button>
                  </td>
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
      <BarbeirosForm
        isOpen={showAddBarbeiroModal}
        onClose={() => setShowAddBarbeiroModal(false)}
        onSuccess={handleBarbeiroAdded}
      />
    </div>
  );
}

export default AdminPage;
