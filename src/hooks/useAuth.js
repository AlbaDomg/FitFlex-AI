import { useState, useEffect } from 'react';
import { getCloudData, setCloudData } from '../services/cloudSync';

const STORAGE_AUTH_USER_KEY = 'fitflex_active_user_v1';
const STORAGE_AUTHORIZED_EMAILS_KEY = 'fitflex_authorized_list_v1';

const DEFAULT_AUTHORIZED_LIST = [
  { email: 'albadege94@gmail.com', username: 'Alba (Admin)', role: 'admin', addedAt: '2026-08-13' }
];

export function useAuth() {
  const [authorizedList, setAuthorizedList] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_AUTHORIZED_EMAILS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved).filter(
          item => item.email.toLowerCase() !== 'admin@fitflex.ai' && item.email.toLowerCase() !== 'pareja@fitflex.ai'
        );

        if (!parsed.some(item => item.email.toLowerCase() === 'albadege94@gmail.com')) {
          parsed.unshift({ email: 'albadege94@gmail.com', username: 'Alba (Admin)', role: 'admin', addedAt: '2026-08-13' });
        }
        return parsed;
      }
      return DEFAULT_AUTHORIZED_LIST;
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

  // Cloud Sync Effect for Authorized Emails List
  useEffect(() => {
    async function syncCloudAuthList() {
      const remoteList = await getCloudData('authorized_users_list');
      if (remoteList && Array.isArray(remoteList) && remoteList.length > 0) {
        if (!remoteList.some(item => item.email.toLowerCase() === 'albadege94@gmail.com')) {
          remoteList.unshift({ email: 'albadege94@gmail.com', username: 'Alba (Admin)', role: 'admin', addedAt: '2026-08-13' });
        }
        setAuthorizedList(remoteList);
        localStorage.setItem(STORAGE_AUTHORIZED_EMAILS_KEY, JSON.stringify(remoteList));
      }
    }
    syncCloudAuthList();
  }, []);

  // Save authorized list
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_AUTHORIZED_EMAILS_KEY, JSON.stringify(authorizedList));
      setCloudData('authorized_users_list', authorizedList);
    } catch (e) {
      console.error('Failed to save authorized list', e);
    }
  }, [authorizedList]);

  // Save active current user session
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_AUTH_USER_KEY, JSON.stringify(currentUser));
        setCloudData(`user_session_${currentUser.email}`, currentUser);
      } else {
        localStorage.removeItem(STORAGE_AUTH_USER_KEY);
      }
    } catch (e) {
      console.error('Failed to save active user', e);
    }
  }, [currentUser]);

  // Login Handler
  const login = async (emailInput, usernameInput) => {
    const cleanEmail = emailInput.trim().toLowerCase();
    const cleanUsername = usernameInput.trim() || cleanEmail.split('@')[0];

    // Master Admin fallback override for albadege94@gmail.com
    if (cleanEmail === 'albadege94@gmail.com') {
      const adminData = {
        email: cleanEmail,
        username: cleanUsername || 'AlbaDomg',
        role: 'admin'
      };

      if (!authorizedList.some(i => i.email.toLowerCase() === cleanEmail)) {
        const newList = [{ email: cleanEmail, username: cleanUsername || 'AlbaDomg', role: 'admin', addedAt: '2026-08-13' }, ...authorizedList];
        setAuthorizedList(newList);
        setCloudData('authorized_users_list', newList);
      }

      setCurrentUser(adminData);
      setCloudData(`user_session_${cleanEmail}`, adminData);
      return { success: true, user: adminData };
    }

    // Check Cloud if authorized list has been updated remotely
    const remoteList = await getCloudData('authorized_users_list');
    const activeList = remoteList && Array.isArray(remoteList) ? remoteList : authorizedList;

    const foundAuth = activeList.find(item => item.email.toLowerCase() === cleanEmail);

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
    setCloudData(`user_session_${cleanEmail}`, userData);
    return { success: true, user: userData };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateUsername = (newUsername) => {
    if (!currentUser) return;
    const updated = { ...currentUser, username: newUsername };
    setCurrentUser(updated);
    const updatedList = authorizedList.map(i => (i.email.toLowerCase() === currentUser.email.toLowerCase() ? { ...i, username: newUsername } : i));
    setAuthorizedList(updatedList);
    setCloudData('authorized_users_list', updatedList);
    setCloudData(`user_session_${currentUser.email}`, updated);
  };

  const addAuthorizedEmail = (email, username = '', role = 'client') => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) return false;

    if (authorizedList.some(item => item.email.toLowerCase() === cleanEmail)) {
      return false;
    }

    const newAuthItem = {
      email: cleanEmail,
      username: username.trim() || cleanEmail.split('@')[0],
      role,
      addedAt: new Date().toISOString().split('T')[0]
    };

    const updatedList = [...authorizedList, newAuthItem];
    setAuthorizedList(updatedList);
    setCloudData('authorized_users_list', updatedList);
    return true;
  };

  const removeAuthorizedEmail = (emailToRemove) => {
    const cleanEmail = emailToRemove.trim().toLowerCase();
    if (cleanEmail === 'albadege94@gmail.com') return;

    const updatedList = authorizedList.filter(item => item.email.toLowerCase() !== cleanEmail);
    setAuthorizedList(updatedList);
    setCloudData('authorized_users_list', updatedList);

    if (currentUser && currentUser.email.toLowerCase() === cleanEmail) {
      logout();
    }
  };

  return {
    currentUser,
    authorizedList,
    login,
    logout,
    updateUsername,
    addAuthorizedEmail,
    removeAuthorizedEmail,
    isAdmin: currentUser?.role === 'admin'
  };
}
