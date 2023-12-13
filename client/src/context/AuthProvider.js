import { createContext, useState } from "react";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({});

  const logout = () => setAuth({});

  return (
    <AuthContext.Provider value={{ auth, setAuth, logout }}>
      { children }
    </AuthContext.Provider>
  );
}

export default AuthContext;
