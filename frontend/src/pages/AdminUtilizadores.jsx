import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../contexts/authContext.jsx";
import { API_URL, getFileUrl } from "../config";
import { Trash2, User } from "lucide-react";
import Loading from "../components/Loading.jsx";

function AdminUtilizadores() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Erro a consultar utilizadores");

        setUsers(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [token]);

  const deleteUser = async (id) => {
    if (!confirm("Deseja excluir este utilizador?")) return;

    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setUsers(users.filter((user) => parseInt(user.id) !== parseInt(id)));
        return;
      }

      setError("Erro ao excluir utilizador!");
    } catch (err) {
      console.error(err);
      setError("Erro ao excluir utilizador");
    }
  };

  return (
    <>
      <div className="admin-header">
        <h2>Utilizadores</h2>
      </div>

      {error && <div className="error-message">{error}</div>}

      {isLoading ? (
        <Loading size={22}>utilizadores</Loading>
      ) : users.length === 0 ? (
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
                <th>Fotografia</th>
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
                      ? new Date(user.datanascimento).toLocaleDateString("pt-PT")
                      : "N/A"}
                  </td>
                  <td>{user.genero || "N/A"}</td>
                  <td className="image-cell">
                    {user.fotografia ? (
                      <img
                        src={getFileUrl(user.fotografia)}
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
                          window.open(getFileUrl(user.fotografia), "_blank")
                        }
                        title="Clique para ver em tamanho completo"
                      />
                    ) : (
                      <span style={{ color: "#888", fontSize: "12px" }}>Sem foto</span>
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
    </>
  );
}

export default AdminUtilizadores;
