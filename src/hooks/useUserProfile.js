import { useState, useEffect } from 'react';
import { getCloudData, setCloudData } from '../services/cloudSync';

export function useUserProfile(userEmail = 'guest') {
  const cleanEmail = userEmail ? userEmail.trim().toLowerCase() : 'guest';
  const STORAGE_KEY = `fitflex_profile_${cleanEmail}`;
  const THEME_KEY = 'fitflex_theme_v1';
  const STORAGE_COMPLETED_DAYS_KEY = `fitflex_completed_days_${cleanEmail}`;
  const STREAK_KEY = `fitflex_streak_${cleanEmail}`;
  const WEIGHT_KEY = `fitflex_weight_${cleanEmail}`;

  const DEFAULT_PROFILE = {
    gender: 'Hombre',
    age: 26,
    weight: 70,
    goal: 'Hipertrofia / Agrandar Músculo',
    daysPerWeek: 4,
    sessionTime: 45,
    equipment: 'gym',
    protectedZones: [],
    isCompleted: false,
    split: []
  };

  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(THEME_KEY) || 'dark';
    } catch {
      return 'dark';
    }
  });

  const [completedSplitDays, setCompletedSplitDays] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_COMPLETED_DAYS_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [streakDays, setStreakDays] = useState(() => {
    try {
      const saved = localStorage.getItem(STREAK_KEY);
      return saved ? parseInt(saved) : 0;
    } catch {
      return 0;
    }
  });

  const [weightHistory, setWeightHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(WEIGHT_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Cloud Sync: Fetch profile, split, streak and weight from Cloud when userEmail is active
  useEffect(() => {
    if (!cleanEmail || cleanEmail === 'guest') return;

    async function syncCloudProfile() {
      try {
        const cloudProfile = await getCloudData(`profile_${cleanEmail}`);
        if (cloudProfile && cloudProfile.isCompleted) {
          setProfile(cloudProfile);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudProfile));
        }

        const cloudDays = await getCloudData(`completed_days_${cleanEmail}`);
        if (cloudDays) {
          setCompletedSplitDays(cloudDays);
          localStorage.setItem(STORAGE_COMPLETED_DAYS_KEY, JSON.stringify(cloudDays));
        }

        const cloudStreak = await getCloudData(`streak_${cleanEmail}`);
        if (cloudStreak !== null && cloudStreak !== undefined) {
          setStreakDays(parseInt(cloudStreak));
          localStorage.setItem(STREAK_KEY, cloudStreak.toString());
        }

        const cloudWeight = await getCloudData(`weight_${cleanEmail}`);
        if (cloudWeight && Array.isArray(cloudWeight)) {
          setWeightHistory(cloudWeight);
          localStorage.setItem(WEIGHT_KEY, JSON.stringify(cloudWeight));
        }
      } catch (e) {
        console.error('Failed to sync profile from cloud', e);
      }
    }

    syncCloudProfile();
  }, [cleanEmail]);

  // Save profile locally + cloud
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      if (cleanEmail !== 'guest') {
        setCloudData(`profile_${cleanEmail}`, profile);
      }
    } catch (e) {
      console.error('Failed to save profile', e);
    }
  }, [profile, STORAGE_KEY, cleanEmail]);

  // Save completed split days locally + cloud
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_COMPLETED_DAYS_KEY, JSON.stringify(completedSplitDays));
      if (cleanEmail !== 'guest') {
        setCloudData(`completed_days_${cleanEmail}`, completedSplitDays);
      }
    } catch (e) {
      console.error('Failed to save completed days', e);
    }
  }, [completedSplitDays, STORAGE_COMPLETED_DAYS_KEY, cleanEmail]);

  // Save streak locally + cloud
  useEffect(() => {
    try {
      localStorage.setItem(STREAK_KEY, streakDays.toString());
      if (cleanEmail !== 'guest') {
        setCloudData(`streak_${cleanEmail}`, streakDays);
      }
    } catch (e) {
      console.error('Failed to save streak', e);
    }
  }, [streakDays, STREAK_KEY, cleanEmail]);

  // Save weight history locally + cloud
  useEffect(() => {
    try {
      localStorage.setItem(WEIGHT_KEY, JSON.stringify(weightHistory));
      if (cleanEmail !== 'guest') {
        setCloudData(`weight_${cleanEmail}`, weightHistory);
      }
    } catch (e) {
      console.error('Failed to save weight history', e);
    }
  }, [weightHistory, WEIGHT_KEY, cleanEmail]);

  // Sync dark class on html document element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const generateWeeklySplit = (days, goal) => {
    if (days <= 3) {
      return [
        { day: 'Día 1', title: 'Full Body A - Fuerza & Tensión', muscles: ['chest', 'back', 'quads', 'abs'], focus: 'Compuestos Principales' },
        { day: 'Día 2', title: 'Descanso / Movilidad', muscles: [], focus: 'Recuperación Activa' },
        { day: 'Día 3', title: 'Full Body B - Volumen & Bombeo', muscles: ['shoulders', 'biceps', 'triceps', 'hamstrings'], focus: 'Metabólico' },
        { day: 'Día 4', title: 'Descanso / Cardio', muscles: [], focus: 'Descanso' },
        { day: 'Día 5', title: 'Full Body C - Potencia Total', muscles: ['chest', 'back', 'quads', 'hamstrings'], focus: 'Tensión Mecánica' }
      ];
    } else if (days === 4) {
      return [
        { day: 'Día 1', title: 'Torso A (Pecho & Espalda & Hombros)', muscles: ['chest', 'back', 'shoulders'], focus: 'Hipertrofia Antagonista' },
        { day: 'Día 2', title: 'Pierna A (Cuádriceps & Isquios)', muscles: ['quads', 'hamstrings', 'abs'], focus: 'Fuerza de Tren Inferior' },
        { day: 'Día 3', title: 'Descanso', muscles: [], focus: 'Recuperación Genoma' },
        { day: 'Día 4', title: 'Torso B (Brazos & Enfoque Hombros)', muscles: ['shoulders', 'biceps', 'triceps'], focus: 'Detalle Muscular' },
        { day: 'Día 5', title: 'Pierna B (Isquios & Glúteos & Core)', muscles: ['hamstrings', 'quads', 'abs'], focus: 'Volumen Inferior' }
      ];
    } else {
      return [
        { day: 'Día 1', title: 'Push (Pecho, Hombro, Tríceps)', muscles: ['chest', 'shoulders', 'triceps'], focus: 'Empuje Estructurado' },
        { day: 'Día 2', title: 'Pull (Espalda, Bíceps, Core)', muscles: ['back', 'biceps', 'abs'], focus: 'Tracción & Densidad' },
        { day: 'Día 3', title: 'Legs (Cuádriceps & Isquios)', muscles: ['quads', 'hamstrings'], focus: 'Carga de Tren Inferior' },
        { day: 'Día 4', title: 'Torso General', muscles: ['chest', 'back', 'shoulders'], focus: 'Bombeo Metabólico' },
        { day: 'Día 5', title: 'Pierna & Brazos', muscles: ['quads', 'biceps', 'triceps', 'abs'], focus: 'Remate Semanal' }
      ];
    }
  };

  const updateProfile = (newProfileData) => {
    const split = generateWeeklySplit(newProfileData.daysPerWeek, newProfileData.goal);
    const updated = {
      ...newProfileData,
      isCompleted: true,
      split
    };
    setProfile(updated);
    if (cleanEmail !== 'guest') {
      setCloudData(`profile_${cleanEmail}`, updated);
    }
  };

  const markSplitDayCompleted = (dayLabel) => {
    const updatedDays = { ...completedSplitDays, [dayLabel]: true };
    const updatedStreak = streakDays + 1;
    setCompletedSplitDays(updatedDays);
    setStreakDays(updatedStreak);

    if (cleanEmail !== 'guest') {
      setCloudData(`completed_days_${cleanEmail}`, updatedDays);
      setCloudData(`streak_${cleanEmail}`, updatedStreak);
    }
  };

  const addWeightLog = (weightKg) => {
    const today = new Date().toISOString().split('T')[0];
    const updatedWeightHist = [...weightHistory, { date: today, weight: parseFloat(weightKg) }];
    const updatedProfile = { ...profile, weight: parseFloat(weightKg) };

    setWeightHistory(updatedWeightHist);
    setProfile(updatedProfile);

    if (cleanEmail !== 'guest') {
      setCloudData(`weight_${cleanEmail}`, updatedWeightHist);
      setCloudData(`profile_${cleanEmail}`, updatedProfile);
    }
  };

  const resetUserProfile = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_COMPLETED_DAYS_KEY);
    localStorage.removeItem(STREAK_KEY);
    localStorage.removeItem(WEIGHT_KEY);

    setProfile(DEFAULT_PROFILE);
    setCompletedSplitDays({});
    setStreakDays(0);
    setWeightHistory([]);

    if (cleanEmail !== 'guest') {
      setCloudData(`profile_${cleanEmail}`, DEFAULT_PROFILE);
      setCloudData(`completed_days_${cleanEmail}`, {});
      setCloudData(`streak_${cleanEmail}`, 0);
      setCloudData(`weight_${cleanEmail}`, []);
    }
  };

  return {
    profile,
    updateProfile,
    theme,
    toggleTheme,
    streakDays,
    setStreakDays,
    weightHistory,
    addWeightLog,
    completedSplitDays,
    markSplitDayCompleted,
    resetUserProfile
  };
}
