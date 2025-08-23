import { useContext, useMemo } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function useAuth() {
const ctx = useContext(AuthContext);
if (!ctx) throw new Error('useAuth must be used within an AuthProvider');

const { user, token, login, logout } = ctx;

return useMemo(() => ({
user,
token,
isAuthenticated: Boolean(token),
login,
logout,
ready: true
}), [user, token, login, logout]);
}

