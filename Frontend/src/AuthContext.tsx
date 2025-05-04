import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import {jwtDecode} from "jwt-decode";

interface User {
  userId: string;
  role: string;
}

// Define AuthContext types
interface AuthContextType {
  isLoggedIn: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  user: User | null;
}

interface TokenPayload {
  exp: number; // Expiration timestamp
  UserId: string;
  Role: string;
}

// Create AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider Component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [user, setUser] = useState<User | null>(null);
  const isLoggedIn = !!token;

  const processToken = (jwtToken: string): boolean => {
    try {
      const decoded: TokenPayload = jwtDecode(jwtToken);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        return false;
      }

      

      const userData = { userId: decoded.UserId, role: decoded.Role };
      setUser(userData);
      console.log(userData)
      localStorage.setItem("user", JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error("Token processing error:", error);
      return false;
    }
  };



 const login = (jwtToken: string) => {
    localStorage.setItem("token", jwtToken);
    setToken(jwtToken);
    processToken(jwtToken);
  };

// Logout function
const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  setToken(null);
  setUser(null);
};

// Validate token on initial load
useEffect(() => {
  if (token) {
    const valid = processToken(token);
    if (!valid) logout();
  }
}, [token]);

  return (
    <AuthContext.Provider value={{  isLoggedIn, token,  user,login, logout}}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};



