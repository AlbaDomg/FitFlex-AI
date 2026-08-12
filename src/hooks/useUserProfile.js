import { useState, useEffect } from 'react';

const STORAGE_KEY = 'fitflex_user_profile_v1';
const THEME_KEY = 'fitflex_theme_v1';
const STORAGE_COMPLETED_DAYS_KEY = 'fitflex_completed_split_days_v1';

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

export function useUserProfile() {
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
      const saved = localStorage.getItem('fitflex_streak_days_v1');
      return saved ? parseInt(saved) : 0;
    } catch {
      return 0;
    }
  });

  const [weightHistory, setWeightHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('fitflex_weight_history_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save profile
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save profile', e);
    }
  }, [profile]);

  // Save completed split days
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_COMPLETED_DAYS_KEY, JSON.stringify(completedSplitDays));
    } catch (e) {
      console.error('Failed to save completed days', e);
    }
  }, [completedSplitDays]);

  // Save streak
  useEffect(() => {
    try {
      localStorage.setItem('fitflex_streak_days_v1', streakDays.toString());
    } catch (e) {
      console.error('Failed to save streak', e);
    }
  }, [streakDays]);

  // Save weight history
  useEffect(() => {
    try {
      localStorage.setItem('fitflex_weight_history_v1', JSON.stringify(weightHistory));
    } catch (e) {
      console.error('Failed to save weight history', e);
    }
  }, [weightHistory]);

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
    localStorage.removeItem('fitflex_streak_days_v1');
    localStorage.removeItem('fitflex_weight_history_v1');

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
