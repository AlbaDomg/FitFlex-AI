import React, { useState, useMemo } from 'react';
import { Sparkles, Dumbbell, Zap, Layers, RefreshCw, Trash2, ArrowUp, ArrowDown, Play, Check, Flame, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MUSCLE_GROUPS, METHODOLOGIES, EXERCISE_DATABASE, getRecommendedExercises, getMuscleSpanishName, calculatePersonalizedLoad, getRecommendedMethodologyForTime } from '../data/exerciseDatabase';

export function CustomWorkoutBuilder({ profile, onStartWorkout }) {
  const [selectedMuscles, setSelectedMuscles] = useState(['chest', 'back']);
  const [selectedMethodology, setSelectedMethodology] = useState(() => getRecommendedMethodologyForTime(profile?.sessionTime || 45));
  const [customExercises, setCustomExercises] = useState([]);

  // Filter available exercises based on equipment and protected zones
  const recommendedPool = useMemo(() => {
    return getRecommendedExercises({
      equipment: profile?.equipment || 'gym',
      muscleGroups: selectedMuscles,
      protectedZones: profile?.protectedZones || []
    });
  }, [profile, selectedMuscles]);

  // AI Recommendation Trigger: Auto-build balanced routine when muscles or methodology changes
  const generateAIRoutine = () => {
    if (recommendedPool.length === 0) {
      setCustomExercises([]);
      return;
    }

    let result = [];
    if (selectedMethodology === 'biseries') {
      const primaryList = recommendedPool.filter(e => e.muscleGroup === selectedMuscles[0]);
      const secondaryList = recommendedPool.filter(e => e.muscleGroup === (selectedMuscles[1] || selectedMuscles[0]));

      for (let i = 0; i < Math.min(3, Math.max(primaryList.length, secondaryList.length)); i++) {
        if (primaryList[i]) result.push(primaryList[i]);
        if (secondaryList[i]) result.push(secondaryList[i]);
      }

      if (result.length % 2 !== 0 && recommendedPool.length > result.length) {
        const extra = recommendedPool.find(e => !result.some(r => r.id === e.id));
        if (extra) result.push(extra);
      }
    } else {
      result = recommendedPool.slice(0, 5);
    }

    setCustomExercises(result);
  };

  React.useEffect(() => {
    setSelectedMethodology(getRecommendedMethodologyForTime(profile?.sessionTime || 45));
  }, [profile?.sessionTime]);

  React.useEffect(() => {
    generateAIRoutine();
  }, [selectedMuscles, selectedMethodology, recommendedPool]);

  const toggleMuscle = (muscleId) => {
    setSelectedMuscles(prev => {
      if (prev.includes(muscleId)) {
        if (prev.length === 1) return prev;
        return prev.filter(m => m !== muscleId);
      } else {
        return [...prev, muscleId];
      }
    });
  };

  const swapExercise = (index) => {
    const current = customExercises[index];
    if (!current) return;

    const alternatives = EXERCISE_DATABASE.filter(
      e => e.muscleGroup === current.muscleGroup && !customExercises.some(c => c.id === e.id)
    );

    if (alternatives.length > 0) {
      const replacement = alternatives[0];
      const updated = [...customExercises];
      updated[index] = replacement;
      setCustomExercises(updated);
    }
  };

  const removeExercise = (index) => {
    setCustomExercises(prev => prev.filter((_, i) => i !== index));
  };

  const moveExercise = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= customExercises.length) return;
    const updated = [...customExercises];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setCustomExercises(updated);
  };

  const estimatedDurationMinutes = useMemo(() => {
    const currentMethObj = METHODOLOGIES.find(m => m.id === selectedMethodology);
    const restPerSet = currentMethObj?.defaultRestBetweenPairsSec || 60;
    let totalSets = 0;
    customExercises.forEach(e => {
      totalSets += e.defaultSets || 3;
    });

    const timeInSets = totalSets * 0.75;
    const timeInRest = (totalSets * restPerSet) / 60;
    return Math.round(timeInSets + timeInRest + 5);
  }, [customExercises, selectedMethodology]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-500 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Asistente IA en Tiempo Real</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Creador de Entrenamiento Personalizado
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Selecciona tus músculos y metodología deseada. La IA sugerirá las mejores tarjetas de ejercicios.
          </p>
        </div>

        <button
          onClick={generateAIRoutine}
          className="px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-bold flex items-center space-x-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all border border-zinc-300 dark:border-zinc-700 self-start md:self-auto"
        >
          <RefreshCw className="w-4 h-4 text-emerald-500" />
          <span>Regenerar Sugerencias IA</span>
        </button>
      </div>

      {/* Muscle Selector Grid */}
      <div className="space-y-3">
        <label className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block w-full">
          1. Selecciona Grupos Musculares Objetivo
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {MUSCLE_GROUPS.map(muscle => {
            const isSelected = selectedMuscles.includes(muscle.id);
            return (
              <button
                key={muscle.id}
                type="button"
                onClick={() => toggleMuscle(muscle.id)}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center space-y-1 ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold shadow-sm'
                    : 'border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400'
                }`}
              >
                <span className="text-xs">{muscle.name}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-emerald-500" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Methodology Picker Grid */}
      <div className="space-y-3">
        <label className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block w-full">
          2. Selecciona la Metodología de Entrenamiento
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {METHODOLOGIES.map(meth => {
            const isSelected = selectedMethodology === meth.id;
            return (
              <button
                key={meth.id}
                type="button"
                onClick={() => setSelectedMethodology(meth.id)}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/15 text-zinc-900 dark:text-zinc-100 shadow-md'
                    : 'border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-extrabold text-sm">{meth.name}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      {meth.badge}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {meth.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* AI Exercise Cards List & Responsive Action Bar */}
      <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <h2 className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-zinc-100">
              Rutina Generada ({customExercises.length} Ejercicios)
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-bold border border-cyan-500/20 whitespace-nowrap">
              ~ {estimatedDurationMinutes} min
            </span>
          </div>

          <button
            onClick={() => onStartWorkout(customExercises, selectedMethodology)}
            disabled={customExercises.length === 0}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-zinc-950 font-extrabold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-md shadow-emerald-500/20 hover:from-emerald-400 hover:to-cyan-400 transition-all disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-zinc-950" />
            <span>Iniciar Entrenamiento en Vivo</span>
          </button>
        </div>

        {/* Exercises List */}
        <div className="space-y-3">
          <AnimatePresence>
            {customExercises.map((ex, idx) => {
              const isBiseriesPair = selectedMethodology === 'biseries';
              const biseriesLabel = isBiseriesPair ? (idx % 2 === 0 ? `A1 (Pareja ${Math.floor(idx / 2) + 1})` : `A2 (Pareja ${Math.floor(idx / 2) + 1})`) : null;

              return (
                <motion.div
                  key={`${ex.id}-${idx}`}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm ${
                    biseriesLabel && idx % 2 === 0
                      ? 'border-l-4 border-l-emerald-500 border-zinc-200 dark:border-zinc-800'
                      : biseriesLabel && idx % 2 === 1
                      ? 'border-l-4 border-l-cyan-500 border-zinc-200 dark:border-zinc-800'
                      : 'border-zinc-200 dark:border-zinc-800'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-black text-xs text-zinc-600 dark:text-zinc-300 mt-0.5">
                      {idx + 1}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        {biseriesLabel && (
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            idx % 2 === 0 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400'
                          }`}>
                            {biseriesLabel}
                          </span>
                        )}
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                          {getMuscleSpanishName(ex.muscleGroup)}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                        {ex.name}
                      </h3>
                      
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-xl">
                        💡 {ex.tips}
                      </p>
                    </div>
                  </div>

                  {/* Right Actions & Meta */}
                  <div className="flex items-center justify-between sm:justify-end space-x-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-zinc-100 dark:border-zinc-800">
                    <div className="text-left sm:text-right">
                      {(() => {
                        const smartLoad = calculatePersonalizedLoad(ex, profile?.gender, profile?.weight, profile?.experienceLevel, profile?.goal, selectedMethodology);
                        return (
                          <>
                            <div className="text-xs font-bold text-zinc-900 dark:text-zinc-200">
                              {ex.defaultSets || 3} Series x {smartLoad.targetReps} Reps
                            </div>
                            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                              Carga IA: {smartLoad.suggestedWeightKg > 0 ? `${smartLoad.suggestedWeightKg} kg` : 'Peso Corporal'}
                            </div>
                          </>
                        );
                      })()}
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => moveExercise(idx, -1)}
                        disabled={idx === 0}
                        className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 disabled:opacity-30"
                        title="Mover Arriba"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => moveExercise(idx, 1)}
                        disabled={idx === customExercises.length - 1}
                        className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 disabled:opacity-30"
                        title="Mover Abajo"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => swapExercise(idx)}
                        className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-cyan-600 dark:text-cyan-400"
                        title="Cambiar Ejercicio por Alternativo IA"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => removeExercise(idx)}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500"
                        title="Eliminar de la sesión"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

    </div>
  );
}
