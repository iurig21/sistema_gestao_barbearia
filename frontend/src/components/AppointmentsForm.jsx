import { useState, useEffect, useContext, useCallback } from "react";
import { X, Calendar, Clock, Scissors, User } from "lucide-react";
import { AuthContext } from "../contexts/authContext";

function AppointmentsForm({ isOpen, onClose, onSuccess }) {
  const [services, setServices] = useState([]);
  const [barbeiros, setBarbeiros] = useState([]);
  const [formData, setFormData] = useState({
    servicoID: "",
    data: "",
    hora: "",
    barbeiroID: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);

  const { token } = useContext(AuthContext);

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 18; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
      if (hour < 18) {
        slots.push(`${hour.toString().padStart(2, "0")}:30`);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const fetchServices = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:3000/services", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao carregar serviços");
      }

      const data = await response.json();
      setServices(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  }, [token]);

  const fetchBarbeiros = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:3000/barbeiros", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao carregar barbeiros");
      }

      const data = await response.json();
      setBarbeiros(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  }, [token]);

  const fetchBookedSlots = async (date, barbeiroID) => {
    try {
      const url = barbeiroID
        ? `http://localhost:3000/appointments/booked/${date}?barbeiroId=${barbeiroID}`
        : `http://localhost:3000/appointments/booked/${date}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao carregar horários");
      }

      const data = await response.json();
      setBookedSlots(data);
    } catch (err) {
      console.error(err);
      setBookedSlots([]);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchServices();
      fetchBarbeiros();
    }
  }, [isOpen, fetchBarbeiros, fetchServices]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3000/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao criar marcação");
      }

      setFormData({ servicoID: "", data: "", hora: "", barbeiroID: "" });
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "data" && value && formData.barbeiroID) {
      fetchBookedSlots(value, formData.barbeiroID);
    } else if (name === "barbeiroID" && value && formData.data) {
      fetchBookedSlots(formData.data, value);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Nova Marcação</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="appointment-form">
          {error && <div className="modal-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="servicoID">
              <Scissors size={18} />
              Serviço *
            </label>
            <select
              id="servicoID"
              name="servicoID"
              value={formData.servicoID}
              onChange={handleChange}
              required
              className="form-select"
            >
              <option value="">Selecione um serviço</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.nome} - {service.preco}€
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="barbeiroID">
              <User size={18} />
              Barbeiro *
            </label>
            <select
              id="barbeiroID"
              name="barbeiroID"
              value={formData.barbeiroID}
              onChange={handleChange}
              required
              className="form-select"
            >
              <option value="">Selecione um barbeiro</option>
              {barbeiros.map((barbeiro) => (
                <option key={barbeiro.id} value={barbeiro.id}>
                  {barbeiro.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="data">
                <Calendar size={18} />
                Data *
              </label>
              <input
                type="date"
                id="data"
                name="data"
                value={formData.data}
                onChange={handleChange}
                required
                min={new Date().toISOString().split("T")[0]}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="hora">
                <Clock size={18} />
                Hora *
              </label>
              <select
                id="hora"
                name="hora"
                value={formData.hora}
                onChange={handleChange}
                required
                className="form-select"
                disabled={!formData.data || !formData.barbeiroID}
              >
                <option value="">
                  {!formData.barbeiroID
                    ? "Selecione primeiro um barbeiro"
                    : !formData.data
                    ? "Selecione primeiro uma data"
                    : "Selecione uma hora"}
                </option>
                {timeSlots.map((time) => {
                  const isBooked = bookedSlots.includes(time);
                  return (
                    <option key={time} value={time} disabled={isBooked}>
                      {time} {isBooked ? "(Ocupado)" : ""}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? "A criar..." : "Confirmar Marcação"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AppointmentsForm;
