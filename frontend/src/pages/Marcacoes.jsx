import Navbar from "../components/Navbar.jsx";
import { CirclePlus, AlertTriangle } from "lucide-react";
import AppointmentsForm from "../components/AppointmentsForm.jsx";
import Appointments from "../components/Appointments.jsx";
import { useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from "../contexts/authContext.jsx";
import { Link } from "react-router";

function Marcacoes() {
  const [isOpen, setIsOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [marcacoes, setMarcacoes] = useState([]);
  const { token, authUser } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMarcacoes = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("http://localhost:3000/appointments", {
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
  }, [token]);

  useEffect(() => {
    fetchMarcacoes();
  }, [fetchMarcacoes]);

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

  const handleSuccess = () => {
    setSuccess(true);
    fetchMarcacoes();
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <>
      <Navbar />
      <div className="marcacoes-container">
        <div className="marcacoes-header">
          <h1>As Minhas Marcações</h1>
          {authUser.email_verificado && (
            <button
              className="btn-new-appointment"
              onClick={() => setIsOpen(true)}
            >
              <CirclePlus size={20} /> Nova marcação
            </button>
          )}
        </div>

        {!authUser.email_verificado ? (
          <div className="empty-state">
            <AlertTriangle size={48} color="#e74c3c" />
            <p>Email não verificado</p>
            <span>
              Deve verificar o seu email antes de poder fazer marcações.
              Verifique a sua caixa de correio.
            </span>
          </div>
        ) : (
          <>
            {success && (
              <p className="success-message">Operação realizada com sucesso!</p>
            )}

            {isOpen && (
              <AppointmentsForm
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onSuccess={handleSuccess}
              />
            )}

            <Appointments
              marcacoes={marcacoes}
              isLoading={isLoading}
              error={error}
              onDelete={handleDelete}
            />
          </>
        )}
      </div>
    </>
  );
}

export default Marcacoes;
