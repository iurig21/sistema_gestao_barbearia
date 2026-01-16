import { Loader, Calendar, Clock, Trash2 } from "lucide-react";
import Loading from "./Loading";

function Appointments({ marcacoes, isLoading, error, onDelete }) {
  if (isLoading) return <Loading size={22}>marcações</Loading>
  
  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (marcacoes.length === 0) {
    return (
      <div className="empty-state">
        <Calendar size={48} />
        <p>Ainda não tem marcações</p>
        <span>Crie a sua primeira marcação usando o botão acima</span>
      </div>
    );
  }

  return (
    <div className="appointments-grid">
      {marcacoes.map((marcacao) => (
        <div key={marcacao.id} className="appointment-card">
          <div className="appointment-header">
            <div className="appointment-date">
              <Calendar size={18} />
              <span>{marcacao.data_formatada}</span>
            </div>
            <div className="appointment-time">
              <Clock size={18} />
              <span>{marcacao.hora_formatada}</span>
            </div>
          </div>
          <div className="appointment-body">
            <h3>
              <span className="label">Serviço:</span> {marcacao.nome_servico}
            </h3>
          </div>
          <div className="appointment-footer">
            <button
              className="btn-delete"
              onClick={() => onDelete(marcacao.id)}
            >
              <Trash2 size={18} />
              Cancelar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Appointments;
