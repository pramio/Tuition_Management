import { useContext, useMemo } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');

  const { user, token, login, signup, logout } = ctx; // Added signup here

  return useMemo(() => ({
    user,
    token,
    isAuthenticated: Boolean(token),
    login,
    signup, // Added signup here
    logout,
    ready: true
  }), [user, token, login, signup, logout]);
}
