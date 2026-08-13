import { useState, useEffect, useRef } from 'react';

// Web Audio API helper for high-legibility sound alerts in loud gym environments
function playTimerSound(type = 'beep') {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'beep') {
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } else if (type === 'finish') {
      osc.frequency.setValueAtTime(1046.5, ctx.currentTime);
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    }
  } catch (e) {
    console.log('Audio playback constrained by browser policy', e);
  }
}

export function useWorkoutSession(addSetLogFn, userEmail = 'guest') {
  const cleanEmail = userEmail ? userEmail.trim().toLowerCase() : 'guest';
  const SESSION_STORAGE_KEY = `fitflex_live_session_${cleanEmail}`;

  const DEFAULT_SESSION = {
    isActive: false,
    vibe: 'Media',
    sessionDuration: 45,
    methodology: 'biseries',
    exercises: [],
    currentExerciseIndex: 0,
    currentSetIndex: 1,
    biseriesSubIndex: 0,
    completedSets: {},
    startTime: null,
    restTimerSeconds: 0,
    isResting: false,
    isSyncing: false,
    isCompleted: false
  };

  const [session, setSession] = useState(() => {
    try {
      const saved = localStorage.getItem(SESSION_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.isActive) {
          return {
            ...parsed,
            isResting: false,
            restTimerSeconds: 0
          };
        }
      }
      return DEFAULT_SESSION;
    } catch {
      return DEFAULT_SESSION;
    }
  });

  const timerRef = useRef(null);

  // Persist session to localStorage
  useEffect(() => {
    try {
      if (session.isActive && !session.isCompleted) {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      } else {
        localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to save live session to localStorage', e);
    }
  }, [session, SESSION_STORAGE_KEY]);

  // Prevent accidental page unload / refresh during an active workout
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (session.isActive && !session.isCompleted) {
        e.preventDefault();
        e.returnValue = 'Tienes un entrenamiento en curso. ¿Seguro que deseas salir?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [session.isActive, session.isCompleted]);

  // Countdown timer effect
  useEffect(() => {
    if (session.isResting && session.restTimerSeconds > 0) {
      timerRef.current = setInterval(() => {
        setSession(prev => {
          if (prev.restTimerSeconds <= 1) {
            clearInterval(timerRef.current);
            playTimerSound('finish');
            return {
              ...prev,
              restTimerSeconds: 0,
              isResting: false
            };
          }
          if (prev.restTimerSeconds <= 4) {
            playTimerSound('beep');
          }
          return {
            ...prev,
            restTimerSeconds: prev.restTimerSeconds - 1
          };
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [session.isResting, session.restTimerSeconds]);

  // Start workout session with dynamic sessionDuration override and energy vibe check
  const startSession = (exercises, methodology = 'biseries', vibe = 'Media', sessionDuration = 45) => {
    let adjustedExercises = [...exercises];
    const numericDuration = parseInt(sessionDuration) || 45;

    // 1. Dynamically trim or expand sets based on session duration override
    if (numericDuration <= 30) {
      adjustedExercises = exercises.map(ex => ({
        ...ex,
        defaultSets: 2
      }));
    } else if (numericDuration >= 90) {
      adjustedExercises = exercises.map(ex => ({
        ...ex,
        defaultSets: Math.min(5, (ex.defaultSets || 3) + 1)
      }));
    }

    // 2. Adjust sets based on Energy Vibe
    if (vibe === 'Baja') {
      adjustedExercises = adjustedExercises.map(ex => ({
        ...ex,
        defaultSets: Math.max(2, (ex.defaultSets || 3) - 1)
      }));
    } else if (vibe === 'Alta') {
      adjustedExercises = adjustedExercises.map(ex => ({
        ...ex,
        defaultSets: (ex.defaultSets || 3) + 1
      }));
    }

    setSession({
      isActive: true,
      vibe,
      sessionDuration: numericDuration,
      methodology,
      exercises: adjustedExercises,
      currentExerciseIndex: 0,
      currentSetIndex: 1,
      biseriesSubIndex: 0,
      completedSets: {},
      startTime: Date.now(),
      restTimerSeconds: 0,
      isResting: false,
      isSyncing: false,
      isCompleted: false
    });
  };

  const getActiveExercise = () => {
    if (session.exercises.length === 0) return null;
    if (session.methodology === 'biseries' && session.biseriesSubIndex === 1) {
      return session.exercises[session.currentExerciseIndex + 1] || session.exercises[session.currentExerciseIndex];
    }
    return session.exercises[session.currentExerciseIndex];
  };

  const getLinearIndex = () => {
    if (session.methodology === 'biseries') {
      return session.currentExerciseIndex + session.biseriesSubIndex;
    }
    return session.currentExerciseIndex;
  };

  const completeActiveSet = (setWeight, setReps, rpe = 8) => {
    const currentEx = getActiveExercise();
    if (!currentEx) return;

    const setKey = `${currentEx.id}-${session.currentSetIndex}`;

    setSession(prev => ({
      ...prev,
      isSyncing: true,
      completedSets: {
        ...prev.completedSets,
        [setKey]: {
          weight: setWeight,
          reps: setReps,
          rpe,
          completed: true
        }
      }
    }));

    if (addSetLogFn) {
      addSetLogFn({
        exerciseId: currentEx.id,
        exerciseName: currentEx.name,
        muscleGroup: currentEx.muscleGroup,
        weight: setWeight,
        reps: setReps,
        rpe,
        methodology: session.methodology
      });
    }

    setTimeout(() => {
      setSession(prev => ({ ...prev, isSyncing: false }));
    }, 400);

    // Calculate rest time dynamically based on sessionDuration (shorter rest for express workouts)
    const baseRestSec = session.sessionDuration <= 30 ? 45 : session.sessionDuration >= 90 ? 90 : 60;

    if (session.methodology === 'biseries' && session.exercises.length > session.currentExerciseIndex + 1) {
      if (session.biseriesSubIndex === 0) {
        setSession(prev => ({
          ...prev,
          biseriesSubIndex: 1,
          restTimerSeconds: 10,
          isResting: true
        }));
      } else {
        const targetSets = currentEx.defaultSets || 3;
        if (session.currentSetIndex < targetSets) {
          setSession(prev => ({
            ...prev,
            currentSetIndex: prev.currentSetIndex + 1,
            biseriesSubIndex: 0,
            restTimerSeconds: baseRestSec,
            isResting: true
          }));
        } else {
          const nextPairIndex = session.currentExerciseIndex + 2;
          if (nextPairIndex < session.exercises.length) {
            setSession(prev => ({
              ...prev,
              currentExerciseIndex: nextPairIndex,
              currentSetIndex: 1,
              biseriesSubIndex: 0,
              restTimerSeconds: baseRestSec,
              isResting: true
            }));
          } else {
            finishWorkout();
          }
        }
      }
    } else {
      const targetSets = currentEx.defaultSets || 3;
      if (session.currentSetIndex < targetSets) {
        const restSec = session.methodology === 'circuit' ? 30 : session.methodology === 'dropset' ? 20 : baseRestSec;
        setSession(prev => ({
          ...prev,
          currentSetIndex: prev.currentSetIndex + 1,
          restTimerSeconds: restSec,
          isResting: true
        }));
      } else {
        if (session.currentExerciseIndex + 1 < session.exercises.length) {
          setSession(prev => ({
            ...prev,
            currentExerciseIndex: prev.currentExerciseIndex + 1,
            currentSetIndex: 1,
            restTimerSeconds: baseRestSec + 15,
            isResting: true
          }));
        } else {
          finishWorkout();
        }
      }
    }
  };

  const goToNextExercise = () => {
    const currentLinear = getLinearIndex();
    const nextLinear = currentLinear + 1;

    if (nextLinear < session.exercises.length) {
      if (session.methodology === 'biseries') {
        const pairIndex = Math.floor(nextLinear / 2) * 2;
        const subIndex = nextLinear % 2;
        setSession(prev => ({
          ...prev,
          currentExerciseIndex: pairIndex,
          biseriesSubIndex: subIndex,
          currentSetIndex: 1,
          isResting: false,
          restTimerSeconds: 0
        }));
      } else {
        setSession(prev => ({
          ...prev,
          currentExerciseIndex: nextLinear,
          currentSetIndex: 1,
          biseriesSubIndex: 0,
          isResting: false,
          restTimerSeconds: 0
        }));
      }
    } else {
      finishWorkout();
    }
  };

  const goToPrevExercise = () => {
    const currentLinear = getLinearIndex();
    const prevLinear = Math.max(0, currentLinear - 1);

    if (session.methodology === 'biseries') {
      const pairIndex = Math.floor(prevLinear / 2) * 2;
      const subIndex = prevLinear % 2;
      setSession(prev => ({
        ...prev,
        currentExerciseIndex: pairIndex,
        biseriesSubIndex: subIndex,
        currentSetIndex: 1,
        isResting: false,
        restTimerSeconds: 0
      }));
    } else {
      setSession(prev => ({
        ...prev,
        currentExerciseIndex: prevLinear,
        currentSetIndex: 1,
        biseriesSubIndex: 0,
        isResting: false,
        restTimerSeconds: 0
      }));
    }
  };

  const selectExerciseByLinearIndex = (linearIdx) => {
    if (linearIdx >= 0 && linearIdx < session.exercises.length) {
      if (session.methodology === 'biseries') {
        const pairIndex = Math.floor(linearIdx / 2) * 2;
        const subIndex = linearIdx % 2;
        setSession(prev => ({
          ...prev,
          currentExerciseIndex: pairIndex,
          biseriesSubIndex: subIndex,
          currentSetIndex: 1,
          isResting: false,
          restTimerSeconds: 0
        }));
      } else {
        setSession(prev => ({
          ...prev,
          currentExerciseIndex: linearIdx,
          currentSetIndex: 1,
          biseriesSubIndex: 0,
          isResting: false,
          restTimerSeconds: 0
        }));
      }
    }
  };

  const selectSet = (setNumber) => {
    setSession(prev => ({
      ...prev,
      currentSetIndex: setNumber
    }));
  };

  const skipRest = () => {
    setSession(prev => ({ ...prev, isResting: false, restTimerSeconds: 0 }));
  };

  const addRestTime = (seconds = 30) => {
    setSession(prev => ({ ...prev, restTimerSeconds: prev.restTimerSeconds + seconds, isResting: true }));
  };

  const finishWorkout = () => {
    setSession(prev => ({
      ...prev,
      isActive: false,
      isCompleted: true,
      isResting: false
    }));
  };

  const resetSession = () => {
    setSession({
      isActive: false,
      vibe: 'Media',
      sessionDuration: 45,
      methodology: 'biseries',
      exercises: [],
      currentExerciseIndex: 0,
      currentSetIndex: 1,
      biseriesSubIndex: 0,
      completedSets: {},
      startTime: null,
      restTimerSeconds: 0,
      isResting: false,
      isSyncing: false,
      isCompleted: false
    });
  };

  return {
    session,
    startSession,
    completeActiveSet,
    goToNextExercise,
    goToPrevExercise,
    selectExerciseByLinearIndex,
    selectSet,
    skipRest,
    addRestTime,
    finishWorkout,
    resetSession,
    getLinearIndex
  };
}
