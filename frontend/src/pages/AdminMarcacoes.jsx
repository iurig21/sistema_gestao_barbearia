import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../contexts/authContext.jsx";
import { API_URL } from "../config";
import { Trash2, Calendar, Clock, User } from "lucide-react";
import Loading from "../components/Loading.jsx";

function AdminMarcacoes() {
  const [marcacoes, setMarcacoes] = useState([]);
  const [barbeiros, setBarbeiros] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [filterBarbeiro, setFilterBarbeiro] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterDateInput, setFilterDateInput] = useState("");

  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [marcacoesRes, barbeirosRes] = await Promise.all([
          fetch(`${API_URL}/appointments/all`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/barbeiros`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const marcacoesData = await marcacoesRes.json();
        const barbeirosData = await barbeirosRes.json();

        if (!marcacoesRes.ok) throw new Error(marcacoesData.message || "Erro a consultar marcações");
        if (!barbeirosRes.ok) throw new Error(barbeirosData.message || "Erro a consultar barbeiros");

        setMarcacoes(marcacoesData);
        setBarbeiros(barbeirosData);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const handleDelete = async (id) => {
    if (!confirm("Tem certeza que deseja cancelar esta marcação?")) return;

    try {
      const response = await fetch(`${API_URL}/appointments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setMarcacoes(marcacoes.filter((m) => m.id !== id));
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
      setError("Erro ao cancelar marcação");
    }
  };

  const filteredMarcacoes = marcacoes.filter((marcacao) => {
    const matchesBarbeiro = !filterBarbeiro || marcacao.barbeiro_id === parseInt(filterBarbeiro);
    const matchesDate = !filterDate || marcacao.data_formatada === filterDate;
    return matchesBarbeiro && matchesDate;
  });

  return (
    <>
      <div className="admin-header">
        <h2>Marcações</h2>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && (
        <div className="success-message">Marcação cancelada com sucesso!</div>
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
                setFilterDate(`${day}/${month}/${year}`);
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
                <th><User size={16} /> Cliente</th>
                <th><Calendar size={16} /> Data</th>
                <th><Clock size={16} /> Hora</th>
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
                  <td className="barbeiro-cell">{marcacao.barbeiro_nome || "N/A"}</td>
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
    </>
  );
}

export default AdminMarcacoes;
