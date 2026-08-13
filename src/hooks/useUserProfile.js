import { useState, useEffect } from 'react';

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

  // Re-sync when userEmail changes (account switching)
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem(STORAGE_KEY);
      setProfile(savedProfile ? JSON.parse(savedProfile) : DEFAULT_PROFILE);

      const savedDays = localStorage.getItem(STORAGE_COMPLETED_DAYS_KEY);
      setCompletedSplitDays(savedDays ? JSON.parse(savedDays) : {});

      const savedStreak = localStorage.getItem(STREAK_KEY);
      setStreakDays(savedStreak ? parseInt(savedStreak) : 0);

      const savedWeight = localStorage.getItem(WEIGHT_KEY);
      setWeightHistory(savedWeight ? JSON.parse(savedWeight) : []);
    } catch (e) {
      console.error('Failed to sync user storage', e);
    }
  }, [cleanEmail]);

  // Save profile
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save profile', e);
    }
  }, [profile, STORAGE_KEY]);

  // Save completed split days
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_COMPLETED_DAYS_KEY, JSON.stringify(completedSplitDays));
    } catch (e) {
      console.error('Failed to save completed days', e);
    }
  }, [completedSplitDays, STORAGE_COMPLETED_DAYS_KEY]);

  // Save streak
  useEffect(() => {
    try {
      localStorage.setItem(STREAK_KEY, streakDays.toString());
    } catch (e) {
      console.error('Failed to save streak', e);
    }
  }, [streakDays, STREAK_KEY]);

  // Save weight history
  useEffect(() => {
    try {
      localStorage.setItem(WEIGHT_KEY, JSON.stringify(weightHistory));
    } catch (e) {
      console.error('Failed to save weight history', e);
    }
  }, [weightHistory, WEIGHT_KEY]);

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
    setProfile({
      ...newProfileData,
      isCompleted: true,
      split
    });
  };

  const markSplitDayCompleted = (dayLabel) => {
    setCompletedSplitDays(prev => ({ ...prev, [dayLabel]: true }));
    setStreakDays(prev => prev + 1);
  };

  const addWeightLog = (weightKg) => {
    const today = new Date().toISOString().split('T')[0];
    setWeightHistory(prev => [...prev, { date: today, weight: parseFloat(weightKg) }]);
    setProfile(prev => ({ ...prev, weight: parseFloat(weightKg) }));
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
