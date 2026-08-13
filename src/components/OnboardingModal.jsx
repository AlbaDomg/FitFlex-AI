import React, { useState } from 'react';
import { Sparkles, ArrowRight, Check, ShieldAlert, Clock, Dumbbell, Calendar, Target, User, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function OnboardingModal({ isOpen, onClose, onSave, initialProfile }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    gender: initialProfile?.gender || 'Hombre',
    age: initialProfile?.age || 26,
    weight: initialProfile?.weight || 76,
    experienceLevel: initialProfile?.experienceLevel || 'intermediate',
    goal: initialProfile?.goal || 'Hipertrofia / Agrandar Músculo',
    daysPerWeek: initialProfile?.daysPerWeek || 4,
    sessionTime: initialProfile?.sessionTime || 45,
    equipment: initialProfile?.equipment || 'gym',
    protectedZones: initialProfile?.protectedZones || []
  });

  if (!isOpen) return null;

  const toggleProtectedZone = (zoneId) => {
    setFormData(prev => ({
      ...prev,
      protectedZones: prev.protectedZones.includes(zoneId)
        ? prev.protectedZones.filter(z => z !== zoneId)
        : [...prev.protectedZones, zoneId]
    }));
  };

  const handleFinish = () => {
    onSave({
      ...formData,
      age: parseInt(formData.age) || 25,
      weight: parseFloat(formData.weight) || 70
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-zinc-100 relative overflow-hidden"
      >
        {/* Glow Header */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Perfil Genoma IA</h2>
              <p className="text-xs text-zinc-400">Paso {step} de 3 - Configuración Personalizada</p>
            </div>
          </div>
          
          {/* Progress Indicators */}
          <div className="flex space-x-1">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i <= step ? 'w-6 bg-emerald-500' : 'w-2 bg-zinc-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Biometrics, Experience & Goal */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2 block">
                Género & Biometría
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['Hombre', 'Mujer'].map(g => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setFormData({ ...formData, gender: g })}
                    className={`py-3 px-4 rounded-xl border text-sm font-semibold transition-all ${
                      formData.gender === g
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2 block">
                  Edad (Años)
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={e => setFormData({ ...formData, age: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-emerald-400 font-bold focus:outline-none focus:border-emerald-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2 block">
                  Peso Actual (kg)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.weight}
                  onChange={e => setFormData({ ...formData, weight: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-emerald-400 font-bold focus:outline-none focus:border-emerald-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>

            {/* Experience Level Selector for Smart Load Recommendation */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2 block flex items-center justify-between">
                <span>Nivel de Experiencia en Fuerza</span>
                <span className="text-[10px] text-emerald-400 font-normal">Calculador de Pesos IA</span>
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: 'beginner', title: 'Principiante', desc: '< 6 meses' },
                  { id: 'intermediate', title: 'Intermedio', desc: '6m - 2 años' },
                  { id: 'advanced', title: 'Avanzado', desc: '+2 años' }
                ].map(lvl => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, experienceLevel: lvl.id })}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      formData.experienceLevel === lvl.id
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold shadow-sm'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className="text-xs font-bold">{lvl.title}</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">{lvl.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2 block">
                Objetivo Principal
              </label>
              <div className="space-y-2">
                {[
                  { title: 'Hipertrofia / Agrandar Músculo', desc: 'Máxima masa muscular con tensión mecánica y sobrecarga.' },
                  { title: 'Pérdida de Grasa / Definición', desc: 'Preservar músculo reduciendo porcentaje graso.' },
                  { title: 'Recomposición Corporal', desc: 'Ganancia de fuerza y tono simultáneo.' }
                ].map(item => (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => setFormData({ ...formData, goal: item.title })}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                      formData.goal === item.title
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className="font-semibold text-sm">{item.title}</div>
                    <div className="text-xs text-zinc-500 mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Training Environment */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2 block">
                Días de Entrenamiento por Semana
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[2, 3, 4, 5, 6].map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setFormData({ ...formData, daysPerWeek: d })}
                    className={`py-3 rounded-xl border text-center text-sm font-bold transition-all ${
                      formData.daysPerWeek === d
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    {d} d
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2 block">
                Límite de Tiempo por Sesión
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { time: 30, label: '30 Minutos (Exprés)' },
                  { time: 45, label: '45 Minutos (Estándar)' },
                  { time: 60, label: '60 Minutos (Completo)' }
                ].map(t => (
                  <button
                    key={t.time}
                    type="button"
                    onClick={() => setFormData({ ...formData, sessionTime: t.time })}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      formData.sessionTime === t.time
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <Clock className="w-4 h-4 mx-auto mb-1 opacity-70" />
                    <span className="text-xs font-semibold">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2 block">
                Equipamiento Disponible
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'bodyweight', name: 'Peso Corporal' },
                  { id: 'dumbbells', name: 'Mancuernas' },
                  { id: 'gym', name: 'Gimnasio Completo' }
                ].map(eq => (
                  <button
                    key={eq.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, equipment: eq.id })}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      formData.equipment === eq.id
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <Dumbbell className="w-4 h-4 mx-auto mb-1 opacity-70" />
                    <span className="text-xs font-semibold">{eq.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Injury Filters */}
        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1 block">
                Filtro de Lesiones & Zonas a Proteger
              </label>
              <p className="text-xs text-zinc-500 mb-3">
                Selecciona si padeces dolor o lesión. El algoritmo sustituirá o evitará automáticamente ejercicios de alta compresión.
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'lumbar', name: 'Zona Lumbar / Espalda Baja' },
                  { id: 'hombros', name: 'Hombros / Manguito Rotador' },
                  { id: 'rodillas', name: 'Rodillas / Articulaciones' },
                  { id: 'muñecas', name: 'Muñecas / Antebrazos' }
                ].map(zone => {
                  const isChecked = formData.protectedZones.includes(zone.id);
                  return (
                    <button
                      key={zone.id}
                      type="button"
                      onClick={() => toggleProtectedZone(zone.id)}
                      className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                        isChecked
                          ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                          : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <ShieldAlert className={`w-4 h-4 ${isChecked ? 'text-amber-400' : 'text-zinc-600'}`} />
                        <span className="text-xs font-semibold">{zone.name}</span>
                      </div>
                      {isChecked && <Check className="w-4 h-4 text-amber-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* AI Summary Preview */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Generación de División Semanal IA</span>
              </div>
              <p className="text-xs text-emerald-200/90 leading-relaxed">
                Basado en {formData.daysPerWeek} días/semana con nivel {formData.experienceLevel === 'beginner' ? 'Principiante' : formData.experienceLevel === 'advanced' ? 'Avanzado' : 'Intermedio'} y {formData.equipment === 'gym' ? 'Gimnasio Completo' : formData.equipment === 'dumbbells' ? 'Mancuernas' : 'Peso Corporal'}, la IA calculará automáticamente tus repeticiones y cargas personalizadas.
              </p>
            </div>
          </motion.div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-zinc-800">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(prev => prev - 1)}
              className="px-4 py-2.5 rounded-xl border border-zinc-800 text-xs font-semibold text-zinc-400 hover:text-zinc-200"
            >
              Atrás
            </button>
          ) : (
            <span />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep(prev => prev + 1)}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 text-zinc-950 text-xs font-bold flex items-center space-x-2 hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
            >
              <span>Siguiente</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-zinc-950 text-xs font-extrabold flex items-center space-x-2 hover:from-emerald-400 hover:to-cyan-400 transition-all shadow-lg shadow-emerald-500/25"
            >
              <span>Generar Mi Genoma IA</span>
              <Sparkles className="w-4 h-4" />
            </button>
          )}
        </div>

      </motion.div>
    </div>
  );
}
