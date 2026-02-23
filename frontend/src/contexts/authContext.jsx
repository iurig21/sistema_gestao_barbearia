import { useState, createContext, useEffect } from "react";
import { Loader } from "lucide-react";

const AuthContext = createContext();
export { AuthContext };

function AuthProvider({ children }) {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token") ?? null);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const [authUser, setAuthUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          const userResponse = await fetch("http://localhost:3000/check-auth", {
            method: "POST",
            headers: { Authorization: `Bearer ${storedToken}` },
          });

          if (userResponse.ok) {
            const userData = await userResponse.json();
            setAuthUser(userData);
            setIsAuthenticated(true);
            setToken(storedToken);
          } else {
            localStorage.removeItem("token");
            setIsAuthenticated(false);
            setToken(null);
          }
        } catch (err) {
          console.error("Auth check failed:", err);
          localStorage.removeItem("token");
          setIsAuthenticated(false);
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  async function Login(email, password) {
    try {
      setIsAuthenticating(true);

      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }

      const token = await response.json();
      localStorage.setItem("token", token);
      setToken(token);
      setIsAuthenticated(true);

      const userResponse = await fetch("http://localhost:3000/check-auth", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        setAuthUser(userData);
      }

      return true;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setIsAuthenticating(false);
    }
  }

  async function Register(userData) {
    try {
      setIsAuthenticating(true);

      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      return data;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setIsAuthenticating(false);
    }
  }

  function Logout() {
    localStorage.removeItem("token");
    setToken(null);
    setIsAuthenticated(false);
    setAuthUser({});
    return true;
  }

  if (isLoading) {
    return <Loader className="spinner" size={40}/>;
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticating,
        setIsAuthenticating,
        token,
        setToken,
        Login,
        Register,
        isAuthenticated,
        setIsAuthenticated,
        authUser,
        setAuthUser,
        Logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
