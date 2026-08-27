import React, { useState, useEffect, useRef } from 'react';
import { Bot, Sparkles, Send, X, Dumbbell, ShieldAlert, HeartPulse, Zap, Flame, RefreshCw, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { askAICoach } from '../services/aiCoachService';

export function AICoachModal({ isOpen, onClose, userProfile = {}, activeSession = null }) {
  const [messages, setMessages] = useState([
    {
      sender: 'coach',
      text: '¡Hola, Atleta! 👋 Soy tu **Coach FitFlex IA**. Estoy aquí para guiarte en técnica de ejercicios, sustituciones de máquinas, prevención de molestias o dudas de nutrición. ¿En qué te ayudo hoy?'
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const currentExercise = activeSession?.exercises?.[activeSession?.currentExerciseIndex];

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSend = async (queryText) => {
    const textToSend = typeof queryText === 'string' && queryText.trim() ? queryText.trim() : inputQuery.trim();
    if (!textToSend || isTyping) return;

    const userMsg = { sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    try {
      const response = await askAICoach(textToSend, userProfile, activeSession);
      setMessages(prev => [...prev, { sender: 'coach', text: response.reply, engine: response.engine || 'FitFlex Coach Agent' }]);
    } catch (e) {
      setMessages(prev => [...prev, { sender: 'coach', text: '⚠️ Ocurrió un inconveniente al consultar el Coach. Por favor intenta de nuevo.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickPrompts = [
    { label: '🎯 Técnica de ejercicio', query: currentExercise ? `¿Cómo ejecuto con técnica perfecta ${currentExercise.name}?` : '¿Cómo ejecuto correctamente mis ejercicios de hoy?' },
    { label: '🔄 Sustituir por máquina ocupada', query: currentExercise ? `Máquina ocupada: ¿Qué alternativa tengo para ${currentExercise.name}?` : '¿Por qué ejercicios puedo sustituir si hay máquinas ocupadas?' },
    { label: '🩹 Molestias o dolor', query: 'Siento molestias en la articulación, ¿cómo ajusto el ejercicio?' },
    { label: '🥗 Nutrición post-entreno', query: '¿Qué debería comer al terminar este entrenamiento para máxima hipertrofia?' },
    { label: '🔥 Chute de motivación', query: 'Dame un motivo de motivación para dar el 100% hoy' }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          className="w-full max-w-2xl h-[85vh] sm:h-[650px] sports-card border border-emerald-500/40 shadow-2xl flex flex-col overflow-hidden relative backdrop-blur-2xl"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-800/90 bg-slate-900/90 flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 transform -rotate-3">
                <Bot className="w-6 h-6 text-slate-950 font-black" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg font-black text-white uppercase tracking-tight">COACH FITFLEX <span className="text-emerald-400">IA</span></h2>
                  <span className="athletic-badge px-2 py-0.5 rounded text-[9px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 uppercase">
                    ONLINE
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-semibold flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-cyan-400 inline" />
                  <span>
                    {currentExercise ? `En vivo: ${currentExercise.name}` : `Asistente Inteligente de Alto Rendimiento`}
                  </span>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Prompt Bar */}
          <div className="px-4 py-2.5 bg-slate-950/70 border-b border-slate-800/60 overflow-x-auto flex items-center space-x-2 no-scrollbar">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex-shrink-0 flex items-center space-x-1">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>ATAJOS:</span>
            </span>
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p.query)}
                className="flex-shrink-0 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 text-xs font-extrabold text-slate-200 transition-all hover:scale-105"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-slate-950/40">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 shadow-lg text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-extrabold rounded-br-none'
                      : 'bg-slate-900/90 border border-slate-800 text-slate-100 rounded-bl-none font-medium'
                  }`}
                >
                  <div className="whitespace-pre-line">
                    {msg.text}
                  </div>
                  {msg.engine && (
                    <div className="mt-2 text-[9px] font-extrabold text-emerald-400/80 uppercase tracking-widest flex items-center justify-end space-x-1">
                      <Sparkles className="w-2.5 h-2.5 inline" />
                      <span>{msg.engine}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-900/90 border border-slate-800 text-slate-300 rounded-2xl rounded-bl-none p-3.5 flex items-center space-x-2 text-xs font-bold">
                  <Bot className="w-4 h-4 text-emerald-400 animate-spin" />
                  <span>Coach FitFlex está analizando tu consulta...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 sm:p-4 bg-slate-900/90 border-t border-slate-800 flex items-center space-x-2">
            <input
              type="text"
              placeholder="Pregunta sobre técnica, alternativas, molestias o consejos..."
              value={inputQuery}
              onChange={e => setInputQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-medium transition-all"
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputQuery.trim() || isTyping}
              className="p-3 sm:px-5 sm:py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center space-x-1.5 shadow-lg shadow-emerald-500/20 hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <span className="hidden sm:inline">PREGUNTAR</span>
              <Send className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
