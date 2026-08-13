import React, { useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, Plus, Minus, Check, Clock, Sparkles, Flame, Volume2, ShieldCheck, Trophy, HelpCircle, X, RotateCcw, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { getMuscleSpanishName, calculatePersonalizedLoad } from '../data/exerciseDatabase';

export function InWorkoutPlayer({ sessionHooks, profile, onFinishWorkout, onGoToBuilder }) {
  const {
    session,
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
  } = sessionHooks;

  const {
    isActive,
    vibe,
    methodology,
    exercises = [],
    currentExerciseIndex = 0,
    currentSetIndex = 1,
    biseriesSubIndex = 0,
    completedSets = {},
    restTimerSeconds = 0,
    isResting = false,
    isSyncing = false,
    isCompleted = false
  } = session;

  const currentLinearIndex = getLinearIndex ? getLinearIndex() : 0;

  // Determine active exercise object taking linear index into account
  const isBiseries = methodology === 'biseries';
  const activeExerciseObj = exercises[currentLinearIndex] || exercises[currentExerciseIndex] || null;

  const exerciseA1 = isBiseries ? exercises[Math.floor(currentLinearIndex / 2) * 2] : null;
  const exerciseA2 = isBiseries ? exercises[Math.floor(currentLinearIndex / 2) * 2 + 1] : null;

  // Active Set Form Inputs (with Smart AI Personalised Initial Values)
  const initialSmartLoad = activeExerciseObj ? calculatePersonalizedLoad(
    activeExerciseObj,
    profile?.gender || 'Hombre',
    profile?.weight || 70,
    profile?.experienceLevel || 'intermediate',
    profile?.goal || 'Hipertrofia'
  ) : null;

  const [weightInput, setWeightInput] = useState(initialSmartLoad?.suggestedWeightKg || 50);
  const [repsInput, setRepsInput] = useState(initialSmartLoad?.defaultRepsNum || 10);
  const [rpeInput, setRpeInput] = useState(8);
  const [showTipsModal, setShowTipsModal] = useState(false);

  // Sync inputs when active exercise changes
  React.useEffect(() => {
    if (activeExerciseObj) {
      const smart = calculatePersonalizedLoad(
        activeExerciseObj,
        profile?.gender || 'Hombre',
        profile?.weight || 70,
        profile?.experienceLevel || 'intermediate',
        profile?.goal || 'Hipertrofia'
      );
      setWeightInput(smart.suggestedWeightKg);
      setRepsInput(smart.defaultRepsNum);
    }
  }, [currentLinearIndex, activeExerciseObj, profile]);

  // Fire celebratory confetti when workout completes
  React.useEffect(() => {
    if (isCompleted) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.log('Confetti failed to launch', e);
      }
    }
  }, [isCompleted]);

  if (!isActive && !isCompleted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-zinc-800 border border-zinc-700 flex items-center justify-center mx-auto text-zinc-400">
          <Play className="w-8 h-8 text-emerald-400 ml-1" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">No hay sesión activa</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Configura tus músculos y metodología en el Creador IA para iniciar la experiencia en vivo.
          </p>
        </div>
        <button
          onClick={onGoToBuilder}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-zinc-950 font-extrabold text-sm shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-cyan-400 transition-all"
        >
          Ir al Creador de Entrenamiento
        </button>
      </div>
    );
  }

  // Workout Completed Screen
  if (isCompleted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-10 text-center space-y-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-8 rounded-3xl bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-950 border border-emerald-500/30 shadow-2xl text-zinc-100 space-y-6"
        >
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto ring-8 ring-emerald-500/10">
            <Trophy className="w-10 h-10" />
          </div>

          <div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              ¡Entrenamiento Completado!
            </span>
            <h2 className="text-3xl font-extrabold mt-2 text-zinc-50">Sesión Finalizada con Éxito</h2>
            <p className="text-xs text-zinc-400 mt-1">
              Todos los datos han sido guardados en segundo plano por el motor de IA.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-800">
            <div className="p-3.5 rounded-2xl bg-zinc-950/60 border border-zinc-800">
              <div className="text-xs text-zinc-400 font-medium">Metodología</div>
              <div className="text-base font-extrabold text-emerald-400 capitalize mt-0.5">{methodology}</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-zinc-950/60 border border-zinc-800">
              <div className="text-xs text-zinc-400 font-medium">Vibe Check</div>
              <div className="text-base font-extrabold text-cyan-400 mt-0.5">{vibe} Energía</div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                resetSession();
                onFinishWorkout();
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-zinc-950 font-extrabold text-sm shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-cyan-400 transition-all"
            >
              Volver al Panel de Evolución
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const targetSetsCount = activeExerciseObj?.defaultSets || 3;

  const getCompletedSetsCount = (exerciseId) => {
    return Object.keys(completedSets).filter(key => key.startsWith(`${exerciseId}-`)).length;
  };

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-4 py-4 space-y-5">
      
      {/* Top Media Player Status Bar */}
      <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 backdrop-blur-md shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              Reproductor en Vivo
            </span>
            <div className="text-xs font-semibold text-zinc-200 capitalize">
              Modo {methodology} • Vibe {vibe}
            </div>
          </div>
        </div>

        {/* AI Background Sync Badge */}
        <div className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-bold transition-all ${
          isSyncing
            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse'
            : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
        }`}>
          <Sparkles className={`w-3.5 h-3.5 ${isSyncing ? 'text-emerald-400 animate-spin' : 'text-zinc-400'}`} />
          <span className="hidden sm:inline">{isSyncing ? 'IA Syncing Sincronizado...' : 'IA Sync Activo'}</span>
          <span className="sm:hidden">{isSyncing ? 'Syncing...' : 'Sync IA'}</span>
        </div>
      </div>

      {/* QUICK EXERCISE TRACK BAR (Directly tap any exercise to switch) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-zinc-400 px-1">
          <span>Ejercicios ({exercises.length})</span>
          <span>Toca para cambiar</span>
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
          {exercises.map((ex, idx) => {
            const completedCount = getCompletedSetsCount(ex.id);
            const totalSets = ex.defaultSets || 3;
            const isFinished = completedCount >= totalSets;
            const isActiveEx = currentLinearIndex === idx;

            return (
              <button
                key={ex.id}
                onClick={() => selectExerciseByLinearIndex(idx)}
                className={`flex items-center space-x-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  isActiveEx
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-md ring-2 ring-emerald-500/30'
                    : isFinished
                    ? 'border-zinc-800 bg-zinc-900/60 text-zinc-500 line-through'
                    : 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700'
                }`}
              >
                <span>{idx + 1}. {ex.name}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  isFinished ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-400'
                }`}>
                  {completedCount}/{totalSets} {isFinished ? '✓' : ''}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Biseries Track Selector Bar (If Biseries) */}
      {isBiseries && exerciseA1 && (
        <div className="grid grid-cols-2 gap-2.5 p-2 rounded-2xl bg-zinc-900 border border-zinc-800">
          <button
            onClick={() => selectExerciseByLinearIndex(Math.floor(currentLinearIndex / 2) * 2)}
            className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all ${
              currentLinearIndex % 2 === 0
                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-md ring-1 ring-emerald-500/20'
                : 'border-zinc-800 bg-zinc-950 text-zinc-500 hover:border-zinc-700'
            }`}
          >
            <div className="text-[10px] font-bold uppercase tracking-wider">A1 • Primer Ejercicio</div>
            <div className="text-xs font-bold truncate mt-0.5">{exerciseA1.name}</div>
          </button>

          <button
            onClick={() => exerciseA2 && selectExerciseByLinearIndex(Math.floor(currentLinearIndex / 2) * 2 + 1)}
            disabled={!exerciseA2}
            className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all ${
              currentLinearIndex % 2 === 1
                ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400 shadow-md ring-1 ring-cyan-500/20'
                : 'border-zinc-800 bg-zinc-950 text-zinc-500 hover:border-zinc-700'
            }`}
          >
            <div className="text-[10px] font-bold uppercase tracking-wider">A2 • Antagonista</div>
            <div className="text-xs font-bold truncate mt-0.5">{exerciseA2 ? exerciseA2.name : 'Individual'}</div>
          </button>
        </div>
      )}

      {/* Main Active Exercise Card Display */}
      {activeExerciseObj && (
        <motion.div
          key={`${activeExerciseObj.id}-${currentLinearIndex}`}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 sm:p-7 rounded-3xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 shadow-2xl text-zinc-100 relative space-y-5 overflow-hidden"
        >
          {/* Exercise Header & Manual Navigation Shortcuts */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[11px] font-bold uppercase tracking-wider border border-emerald-500/20">
                  {getMuscleSpanishName(activeExerciseObj.muscleGroup)}
                </span>
                <span className="text-[11px] text-zinc-400 font-semibold">
                  Ejercicio {currentLinearIndex + 1} de {exercises.length}
                </span>
              </div>

              <h2 className="text-xl sm:text-3xl font-extrabold text-zinc-50 leading-tight">
                {activeExerciseObj.name}
              </h2>
            </div>

            <div className="flex items-center space-x-1 flex-shrink-0">
              <button
                onClick={() => setShowTipsModal(true)}
                className="p-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 transition-colors"
                title="Ver Técnica & Form Tips"
              >
                <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
              </button>

              <button
                onClick={goToPrevExercise}
                disabled={currentLinearIndex === 0}
                className="p-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 disabled:opacity-30 transition-colors"
                title="Ejercicio Anterior"
              >
                <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <button
                onClick={goToNextExercise}
                className="p-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 transition-colors"
                title="Siguiente Ejercicio"
              >
                <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Interactive Set Selector Pills */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-400 font-semibold">
              <span>Serie a Registrar:</span>
              <span className="text-emerald-400">Serie {currentSetIndex} de {targetSetsCount}</span>
            </div>

            <div className="flex items-center space-x-2">
              {Array.from({ length: targetSetsCount }).map((_, setIdx) => {
                const sNum = setIdx + 1;
                const isSetDone = completedSets[`${activeExerciseObj.id}-${sNum}`]?.completed;
                const isSelectedSet = currentSetIndex === sNum;

                return (
                  <button
                    key={sNum}
                    onClick={() => selectSet(sNum)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                      isSelectedSet
                        ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400 ring-2 ring-emerald-500/30'
                        : isSetDone
                        ? 'border-zinc-800 bg-zinc-900/80 text-emerald-400'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-500 hover:border-zinc-700'
                    }`}
                  >
                    Serie {sNum} {isSetDone ? '✓' : ''}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Direct Input Card for Weight and Reps (Responsive Grid Fit) */}
          <div className="p-3.5 sm:p-5 rounded-2xl bg-zinc-950 border border-zinc-800/90 space-y-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center justify-between">
              <span>Registro de Cargas</span>
              <span className="text-[10px] text-emerald-400">Autoguardado IA</span>
            </div>

            {/* Steppers Grid - Responsive Stack on Mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Weight Stepper */}
              <div className="bg-zinc-900 p-2 sm:p-2.5 rounded-xl border border-zinc-800">
                <label className="text-[11px] text-zinc-400 font-semibold mb-1 block">Peso (kg)</label>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setWeightInput(prev => Math.max(0, parseFloat((prev - 2.5).toFixed(1))))}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-zinc-800 text-zinc-200 hover:bg-zinc-700 active:scale-95 flex items-center justify-center transition-all"
                  >
                    <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <input
                    type="number"
                    step="0.5"
                    value={weightInput}
                    onChange={e => setWeightInput(parseFloat(e.target.value) || 0)}
                    className="w-16 text-center font-black text-lg sm:text-xl bg-transparent text-emerald-400 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button
                    onClick={() => setWeightInput(prev => parseFloat((prev + 2.5).toFixed(1)))}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-zinc-800 text-zinc-200 hover:bg-zinc-700 active:scale-95 flex items-center justify-center transition-all"
                  >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>

              {/* Reps Stepper */}
              <div className="bg-zinc-900 p-2 sm:p-2.5 rounded-xl border border-zinc-800">
                <label className="text-[11px] text-zinc-400 font-semibold mb-1 block">Repeticiones</label>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setRepsInput(prev => Math.max(1, prev - 1))}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-zinc-800 text-zinc-200 hover:bg-zinc-700 active:scale-95 flex items-center justify-center transition-all"
                  >
                    <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <input
                    type="number"
                    value={repsInput}
                    onChange={e => setRepsInput(parseInt(e.target.value) || 1)}
                    className="w-16 text-center font-black text-lg sm:text-xl bg-transparent text-cyan-400 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button
                    onClick={() => setRepsInput(prev => prev + 1)}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-zinc-800 text-zinc-200 hover:bg-zinc-700 active:scale-95 flex items-center justify-center transition-all"
                  >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>

            </div>

            {/* RPE Slider */}
            <div>
              <div className="flex items-center justify-between text-xs text-zinc-400 font-semibold mb-1">
                <span>RPE (Esfuerzo Percibido): {rpeInput}/10</span>
                <span className="text-zinc-500 font-normal text-[11px]">
                  {rpeInput <= 6 ? 'Fácil' : rpeInput <= 8 ? 'Exigente' : 'Cerca del Fallo'}
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="10"
                step="0.5"
                value={rpeInput}
                onChange={e => setRpeInput(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 bg-zinc-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Action Buttons Row: Complete Set + Jump to Next Exercise */}
          <div className="space-y-3">
            <button
              onClick={() => completeActiveSet(weightInput, repsInput, rpeInput)}
              className="w-full py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-zinc-950 font-black text-sm sm:text-base flex items-center justify-center space-x-2 shadow-xl shadow-emerald-500/25 hover:from-emerald-400 hover:to-cyan-400 active:scale-[0.98] transition-all"
            >
              <Check className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" />
              <span>COMPLETAR SERIE & SYNC IA</span>
            </button>

            <div className="flex items-center justify-between gap-2.5">
              <button
                onClick={goToPrevExercise}
                disabled={currentLinearIndex === 0}
                className="w-1/2 py-2.5 px-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold text-zinc-300 flex items-center justify-center space-x-1 disabled:opacity-30 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Anterior</span>
              </button>

              <button
                onClick={goToNextExercise}
                className="w-1/2 py-2.5 px-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold text-emerald-400 flex items-center justify-center space-x-1 transition-all"
              >
                <span>Siguiente</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Dynamic Rest Timer Overlay */}
      <AnimatePresence>
        {isResting && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-xl"
          >
            <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl text-center space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold">
                <Clock className="w-4 h-4 animate-spin" />
                <span>
                  {methodology === 'biseries' && currentLinearIndex % 2 === 1
                    ? 'Transición Biserie A1 ➔ A2'
                    : 'Pausa de Descanso & Recuperación'}
                </span>
              </div>

              {/* Big Timer Countdown Ring */}
              <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-8 border-zinc-800" />
                <div className="text-5xl font-black tracking-tight text-emerald-400">
                  {restTimerSeconds}s
                </div>
              </div>

              <p className="text-xs text-zinc-400">
                Prepárate para la siguiente serie. El audio avisará al terminar.
              </p>

              {/* Controls */}
              <div className="flex items-center justify-center space-x-3">
                <button
                  onClick={() => addRestTime(30)}
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition-all"
                >
                  +30 Segundos
                </button>

                <button
                  onClick={skipRest}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-black transition-all shadow-lg shadow-emerald-500/20"
                >
                  Saltar Descanso
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form Tips Modal */}
      {showTipsModal && activeExerciseObj && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl text-zinc-100 space-y-4 relative">
            <button
              onClick={() => setShowTipsModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-zinc-800 text-zinc-400"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-zinc-50">{activeExerciseObj.name}</h3>
            <p className="text-xs text-zinc-400 leading-relaxed bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
              💡 {activeExerciseObj.tips}
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
