import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser, getProfile, updateProfile } from '../services/AuthService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const profile = await getProfile(token);
          setUser(profile);
        } catch (err) {
          console.error('Token verification failed:', err);
          logout();
        }
      }
      setIsLoading(false);
    };

    verifyToken();
  }, [token]);

  const login = async (credentials) => {
    try {
      const { user, access_token } = await loginUser(credentials);
      localStorage.setItem('token', access_token);
      setToken(access_token);
      setUser(user);
      setError(null);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const { user, access_token } = await registerUser(userData);
      localStorage.setItem('token', access_token);
      setToken(access_token);
      setUser(user);
      setError(null);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  const updateUserProfile = async (profileData) => {
    try {
      const updatedUser = await updateProfile(token, profileData);
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      setError(err.message || 'Profile update failed');
      throw err;
    }
  };

  const isAdmin = (group) => {
    if (!user || !group) return false;
    return group.creator_id === user.id || 
           (group.member_status && group.member_status === 'admin');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        error,
        login,
        register,
        logout,
        updateUserProfile,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);