import { useEffect, useState } from "react";
import { AuthContext } from "../contexts/authContext.jsx";
import { API_URL } from "../config";
import { useContext } from "react";
import { Loader } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import Loading from "../components/Loading.jsx";

function Services() {
  const [services, setServices] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/services`, {
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

  return (
    <>
    <Navbar/>
      <div className="services-container">
        <h1 className="services-title">Serviços</h1>

        {error && <p className="error-message"> {error} </p>}

        {isLoading ? (
          <Loading size={32}>serviços</Loading>
        ) : (
          <div className="services-grid">
            {services.map((service) => (
              <div key={service.id} className="service-card">
                <div className="service-image-container">
                  <img
                    src={`${API_URL}/uploads/${service.imagem}`}
                    alt={service.nome}
                    className="service-image"
                  />
                </div>
                <div className="service-content">
                  <h3 className="service-name">{service.nome}</h3>
                  <p className="service-description">{service.descricao}</p>
                  <div className="service-footer">
                    <span className="service-price">{service.preco}€</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Services;
