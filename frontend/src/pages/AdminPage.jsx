import { useEffect, useState } from "react";
import { AuthContext } from "../contexts/authContext.jsx";
import { useContext } from "react";
import { Loader, Trash2, Calendar, Clock, User } from "lucide-react";
import Loading from "../components/Loading.jsx";

function AdminPage() {
  const [marcacoes, setMarcacoes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const { token, Logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchMarcacoes = async () => {
      try {
        setError(null)
        setSuccess(false)
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
    fetchMarcacoes()
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
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
      setError("Erro ao cancelar marcação");
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
      {success && <div className="success-message"> Marcação excluída com sucesso! </div>}

      {isLoading ? (
        <Loading />
      ) : marcacoes.length === 0 ? (
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
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {marcacoes.map((marcacao, idx) => (
                <tr key={idx}>
                  <td className="user-cell">{marcacao.usuario_nome}</td>
                  <td>{marcacao.data_formatada}</td>
                  <td>{marcacao.hora_formatada}</td>
                  <td className="service-cell">{marcacao.servico_nome}</td>
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
    </div>
  );
}

export default AdminPage;
