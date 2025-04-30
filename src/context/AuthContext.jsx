import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/login/', {username: username, password: password});
      localStorage.token = res.data.token;
      axios.defaults.headers.common['Authorization'] = 'Token ' + localStorage.token;
      setLoading(false);
      return res;
    } catch (error) {
      setLoading(false);
      return error;
    }
  };

  const logout = async () => {
    try {
      axios.post('/api/auth/logout/');
      setUser(null);
      delete axios.defaults.headers.common['Authorization'];
      localStorage.clear();
      return;
    } catch (error) {
      setLoading(false);
      return error;
    }
  };

  const isAuthenticated = () => {
    return !!user;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;