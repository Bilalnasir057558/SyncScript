import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../api/auth.api.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await getCurrentUser();
      setUser(res.data);
      console.log(res.data);
    } catch (error) {
        setUser(null);
    } finally {
        setLoading(false);
    }
  };

  // check auth on app load
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
        {children}
    </AuthContext.Provider>
  )
};

// custom hook for getting data from the context
export const useAuth = () => useContext(AuthContext);
