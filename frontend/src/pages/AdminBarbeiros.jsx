import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../contexts/authContext.jsx";
import { Trash2, User, Plus } from "lucide-react";
import Loading from "../components/Loading.jsx";
import BarbeirosForm from "../components/BarbeirosForm.jsx";

function AdminBarbeiros() {
  const [barbeiros, setBarbeiros] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchBarbeiros = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:3000/barbeiros", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Erro a consultar barbeiros");

        setBarbeiros(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBarbeiros();
  }, [token]);

  const handleDeleteBarbeiro = async (id) => {
    if (!confirm("Tem certeza que deseja excluir este barbeiro?")) return;

    try {
      const response = await fetch(`http://localhost:3000/barbeiro/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setBarbeiros(barbeiros.filter((b) => b.id !== id));
      }
    } catch (err) {
      console.error(err);
      setError("Erro ao excluir barbeiro");
    }
  };

  const handleBarbeiroAdded = () => {
    fetch("http://localhost:3000/barbeiros", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setBarbeiros(data))
      .catch((err) => console.error(err));
  };

  return (
    <>
      <div className="admin-header">
        <h2>Barbeiros</h2>
        <button className="btn-add-service" onClick={() => setShowAddModal(true)}>
          <Plus size={16} />
          Novo Barbeiro
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {isLoading ? (
        <Loading size={22}>barbeiros</Loading>
      ) : barbeiros.length === 0 ? (
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

      <BarbeirosForm
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleBarbeiroAdded}
      />
    </>
  );
}

export default AdminBarbeiros;
