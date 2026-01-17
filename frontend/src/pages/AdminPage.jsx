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
  const [users, setUsers] = useState([]);

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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:3000/users", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const responseJSON = await response.json();

        if (!response.ok) {
          throw new Error(
            responseJSON.message || "Erro a consultar utilizadores",
          );
        }

        setUsers(responseJSON);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
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
          services.map((s) => (s.id === id ? { ...s, ...editForm } : s)),
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

  const deleteUser = async (id) => {
    if (!confirm("Deseja excluir este utilizador?")) return;

    try {
      const response = await fetch("http://localhost:3000/users/" + id, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setUsers(users.filter((user) => parseInt(user.id) !== parseInt(id)));
        setMarcacoes(
          marcacoes.filter(
            (marcacao) => parseInt(marcacao.user_id) !== parseInt(id),
          ),
        );
        return;
      }

      setError("Erro ao excluir utilizador!");
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("Erro ao excluir utilizador");
    }
  };

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

      <div className="admin-header">
        <h2>Marcações</h2>
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
        <h2>Utilizadores</h2>
      </div>

      {users.length === 0 ? (
        <div className="empty-state">
          <User size={48} />
          <p>Nenhum utilizador encontrado</p>
        </div>
      ) : (
        <div className="users-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Telemóvel</th>
                <th>Data Nascimento</th>
                <th>Género</th>
                <th>Role</th>
                <th>Fotografia</th>
                <th>Documento ID</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="user-cell">{user.nome}</td>
                  <td>{user.email}</td>
                  <td>{user.telefone}</td>
                  <td>
                    {user.datanascimento
                      ? new Date(user.datanascimento).toLocaleDateString(
                          "pt-PT",
                        )
                      : "N/A"}
                  </td>
                  <td>{user.genero || "N/A"}</td>
                  <td className="barbeiro-cell">{user.role}</td>
                  <td className="image-cell">
                    {user.fotografia ? (
                      <img
                        src={`http://localhost:3000/uploads/${user.fotografia}`}
                        alt={user.nome}
                        width="60"
                        height="60"
                        style={{
                          cursor: "pointer",
                          objectFit: "cover",
                          borderRadius: "6px",
                          border: "1px solid #2a2a2a",
                          display: "block",
                          margin: "0 auto",
                        }}
                        onClick={() =>
                          window.open(
                            `http://localhost:3000/uploads/${user.fotografia}`,
                            "_blank",
                          )
                        }
                        title="Clique para ver em tamanho completo"
                      />
                    ) : (
                      <span style={{ color: "#888", fontSize: "12px" }}>
                        Sem foto
                      </span>
                    )}
                  </td>
                  <td className="image-cell">
                    {user.documento ? (
                      user.documento.endsWith(".pdf") ? (
                        <div
                          style={{
                            width: "60px",
                            height: "60px",
                            cursor: "pointer",
                            position: "relative",
                            margin: "0 auto",
                            overflow: "hidden",
                            borderRadius: "6px",
                            border: "1px solid #2a2a2a",
                            background: "#0f0f0f",
                          }}
                          onClick={() =>
                            window.open(
                              `http://localhost:3000/uploads/${user.documento}`,
                              "_blank",
                            )
                          }
                          title="Clique para ver o documento PDF completo"
                        >
                          <iframe
                            src={`http://localhost:3000/uploads/${user.documento}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                            width="60"
                            height="60"
                            style={{
                              border: "none",
                              pointerEvents: "none",
                              transform: "scale(1)",
                              transformOrigin: "0 0",
                            }}
                          />
                        </div>
                      ) : (
                        <img
                          src={`http://localhost:3000/uploads/${user.documento}`}
                          alt="Documento"
                          width="60"
                          height="60"
                          style={{
                            cursor: "pointer",
                            objectFit: "cover",
                            borderRadius: "6px",
                            border: "1px solid #2a2a2a",
                            display: "block",
                            margin: "0 auto",
                          }}
                          onClick={() =>
                            window.open(
                              `http://localhost:3000/uploads/${user.documento}`,
                              "_blank",
                            )
                          }
                          title="Clique para ver em tamanho completo"
                        />
                      )
                    ) : (
                      <span style={{ color: "#888", fontSize: "12px" }}>
                        Sem documento
                      </span>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn-table-delete"
                      onClick={() => deleteUser(user.id)}
                      title="Excluir utilizador"
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

      <div className="admin-section-divider"></div>

      <div className="admin-header">
        <h2>Serviços</h2>
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
                            gap: "8px",
                            alignItems: "center",
                          }}
                        >
                          {editForm.imagem && !uploadingEditImage && (
                            <img
                              src={`http://localhost:3000/uploads/${editForm.imagem}`}
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
                              A carregar...
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
        <h2>Barbeiros</h2>
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
