import { useState, useEffect } from 'react';

const STORAGE_AUTH_USER_KEY = 'fitflex_active_user_v1';
const STORAGE_AUTHORIZED_EMAILS_KEY = 'fitflex_authorized_list_v1';

// Initial default authorized users list (Admin + partner demo email)
const DEFAULT_AUTHORIZED_LIST = [
  { email: 'admin@fitflex.ai', username: 'Administrador Principal', role: 'admin', addedAt: '2026-08-13' },
  { email: 'albadomg@gmail.com', username: 'Alba (Admin)', role: 'admin', addedAt: '2026-08-13' },
  { email: 'pareja@fitflex.ai', username: 'Mi Pareja', role: 'client', addedAt: '2026-08-13' }
];

export function useAuth() {
  const [authorizedList, setAuthorizedList] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_AUTHORIZED_EMAILS_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_AUTHORIZED_LIST;
    } catch {
      return DEFAULT_AUTHORIZED_LIST;
    }
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_AUTH_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Save authorized list
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_AUTHORIZED_EMAILS_KEY, JSON.stringify(authorizedList));
    } catch (e) {
      console.error('Failed to save authorized list', e);
    }
  }, [authorizedList]);

  // Save active current user session
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_AUTH_USER_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_AUTH_USER_KEY);
      }
    } catch (e) {
      console.error('Failed to save active user', e);
    }
  }, [currentUser]);

  // Login Handler
  const login = (emailInput, usernameInput) => {
    const cleanEmail = emailInput.trim().toLowerCase();
    const cleanUsername = usernameInput.trim() || cleanEmail.split('@')[0];

    // Check if email is in authorized list
    const foundAuth = authorizedList.find(item => item.email.toLowerCase() === cleanEmail);

    if (!foundAuth) {
      return {
        success: false,
        message: `Acceso Denegado. El correo "${cleanEmail}" no tiene una suscripción activa a FitFlex AI. Contacta con el Administrador para activar tu membresía.`
      };
    }

    const userData = {
      email: cleanEmail,
      username: cleanUsername || foundAuth.username,
      role: foundAuth.role || 'client'
    };

    setCurrentUser(userData);
    return { success: true, user: userData };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Admin Actions
  const addAuthorizedEmail = (email, username = '', role = 'client') => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) return false;

    // Check if already exists
    if (authorizedList.some(item => item.email.toLowerCase() === cleanEmail)) {
      return false;
    }

    const newAuthItem = {
      email: cleanEmail,
      username: username.trim() || cleanEmail.split('@')[0],
      role,
      addedAt: new Date().toISOString().split('T')[0]
    };

    setAuthorizedList(prev => [...prev, newAuthItem]);
    return true;
  };

  const removeAuthorizedEmail = (emailToRemove) => {
    const cleanEmail = emailToRemove.trim().toLowerCase();
    setAuthorizedList(prev => prev.filter(item => item.email.toLowerCase() !== cleanEmail));

    // If currently logged in user is removed, log them out immediately
    if (currentUser && currentUser.email.toLowerCase() === cleanEmail) {
      logout();
    }
  };

  return {
    currentUser,
    authorizedList,
    login,
    logout,
    addAuthorizedEmail,
    removeAuthorizedEmail,
    isAdmin: currentUser?.role === 'admin'
  };
}
