import { useState, useEffect } from 'react';

const STORAGE_LOGS_KEY = 'fitflex_load_logs_v1';
const STORAGE_BADGES_KEY = 'fitflex_badges_v1';

const INITIAL_BADGES = [
  { id: 'b1', title: 'Genoma Inicial', desc: 'Completaste la configuración del Perfil IA', icon: 'Sparkles', unlocked: false },
  { id: 'b2', title: 'Primer Empuje', desc: 'Completaste tu primera sesión de entrenamiento', icon: 'Dumbbell', unlocked: false },
  { id: 'b3', title: 'Maestro Biseries', desc: 'Realizaste una sesión completa en modo Biseries Antagonistas', icon: 'Flame', unlocked: false },
  { id: 'b4', title: 'Racha de Acero', desc: 'Mantuviste 4 días seguidos de constancia', icon: 'Zap', unlocked: false },
  { id: 'b5', title: 'Sobrecarga Progresiva', desc: 'Aumentaste peso o repeticiones en el mismo ejercicio', icon: 'TrendingUp', unlocked: false },
  { id: 'b6', title: 'Modo Bestia', desc: 'Completaste un entrenamiento con Nivel de Energía Alto ⚡⚡⚡', icon: 'Trophy', unlocked: false }
];

export function useLoadLog() {
  const [logs, setLogs] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LOGS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [badges, setBadges] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_BADGES_KEY);
      return saved ? JSON.parse(saved) : INITIAL_BADGES;
    } catch {
      return INITIAL_BADGES;
    }
  });

  // Save logs
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_LOGS_KEY, JSON.stringify(logs));
    } catch (e) {
      console.error('Failed to store logs', e);
    }
  }, [logs]);

  // Save badges
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_BADGES_KEY, JSON.stringify(badges));
    } catch (e) {
      console.error('Failed to store badges', e);
    }
  }, [badges]);

  // Background auto-sync function when user completes a set in the In-Workout Player
  const addSetLog = (setLogData) => {
    const { exerciseId, exerciseName, muscleGroup, weight, reps, rpe = 8, methodology } = setLogData;
    
    // Calculate 1RM estimate: Weight * (1 + Reps / 30)
    const numericWeight = parseFloat(weight) || 0;
    const numericReps = parseInt(reps) || 0;
    const estimated1RM = parseFloat((numericWeight * (1 + numericReps / 30)).toFixed(1));

    // Check if this is a PR for this exercise
    const previousLogs = logs.filter(l => l.exerciseId === exerciseId);
    const maxPrevWeight = previousLogs.reduce((max, l) => Math.max(max, l.weight || 0), 0);
    const isPR = numericWeight > maxPrevWeight && previousLogs.length > 0;

    const newLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString().split('T')[0],
      exerciseId,
      exerciseName,
      muscleGroup: muscleGroup || 'general',
      weight: numericWeight,
      reps: numericReps,
      rpe,
      estimated1RM,
      isPR,
      methodology
    };

    setLogs(prev => [newLog, ...prev]);

    // Check for badge unlocks
    unlockBadge('b2'); // Primer Empuje
    if (isPR) {
      unlockBadge('b5'); // Sobrecarga Progresiva
    }
    if (methodology === 'biseries') {
      unlockBadge('b3'); // Maestro Biseries
    }

    return newLog;
  };

  const unlockBadge = (badgeId) => {
    setBadges(prev =>
      prev.map(b => (b.id === badgeId ? { ...b, unlocked: true, date: new Date().toISOString().split('T')[0] } : b))
    );
  };

  // Get historical data for a specific exercise for overload graphs
  const getExerciseHistory = (exerciseId) => {
    return logs
      .filter(l => l.exerciseId === exerciseId)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  };

  // Get volume distribution per muscle group
  const getVolumeByMuscle = () => {
    const volumeMap = {};
    logs.forEach(log => {
      const muscle = log.muscleGroup || 'Otros';
      const vol = (log.weight || 0) * (log.reps || 0);
      volumeMap[muscle] = (volumeMap[muscle] || 0) + vol;
    });

    return Object.entries(volumeMap).map(([muscle, volume]) => ({
      muscle,
      volume
    }));
  };

  const resetLoadLog = () => {
    localStorage.removeItem(STORAGE_LOGS_KEY);
    localStorage.removeItem(STORAGE_BADGES_KEY);
    setLogs([]);
    setBadges(INITIAL_BADGES);
  };

  return {
    logs,
    addSetLog,
    getExerciseHistory,
    getVolumeByMuscle,
    badges,
    unlockBadge,
    resetLoadLog
  };
}
