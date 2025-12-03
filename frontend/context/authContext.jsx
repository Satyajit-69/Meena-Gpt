import { createContext, useState, useRef, useEffect, useContext } from "react";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  // ALERT SYSTEM
  const [alert, setAlert] = useState({
    open: false,
    type: "success",
    message: "",
  });

  const alertTimeoutRef = useRef(null);

  const showAlert = (type, message) => {
    if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);

    setAlert({ open: true, type, message });

    alertTimeoutRef.current = setTimeout(() => {
      setAlert((prev) => ({ ...prev, open: false }));
    }, 3000);
  };

  useEffect(() => {
    return () => clearTimeout(alertTimeoutRef.current);
  }, []);

  // -------------------------
  // LOGIN
  // -------------------------
  const login = async (email, password) => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || "Login failed");

      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));

      showAlert("success", "Login successful");
      return { success: true };
    } catch (err) {
      showAlert("error", err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // REGISTER
  // -------------------------
  const register = async (name, email, password) => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:8000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || "Registration failed");

      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));

      showAlert("success", "Account created successfully");
      return { success: true };
    } catch (err) {
      showAlert("error", err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // LOGOUT
  // -------------------------
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    showAlert("info", "Logged out");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      <Snackbar
        open={alert.open}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={() => setAlert((prev) => ({ ...prev, open: false }))}
      >
        <Alert severity={alert.type} variant="filled">
          {alert.message}
        </Alert>
      </Snackbar>

      {children}
    </AuthContext.Provider>
  );
};

// -------------------------
// CUSTOM HOOK
// -------------------------
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
