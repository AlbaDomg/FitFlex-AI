import React from 'react';
import { Dumbbell, Sparkles, Flame, Moon, Sun, Activity, Trophy, ShieldCheck, User, Settings, Zap } from 'lucide-react';

export function Navbar({ activeTab, setActiveTab, theme, toggleTheme, streakDays, isSessionActive, currentUser, isAdmin, onLogout, onOpenSettings }) {
  const navItems = [
    { id: 'genoma', label: 'Genoma IA', icon: Sparkles },
    { id: 'builder', label: 'Creador IA', icon: Dumbbell, highlight: true },
    { id: 'player', label: 'En Vivo', icon: Activity, badge: isSessionActive },
    { id: 'evolution', label: 'Evolución', icon: Trophy },
  ];

  if (isAdmin) {
    navItems.push({ id: 'admin', label: 'Membresías', icon: ShieldCheck });
  }

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-emerald-500/20 dark:border-emerald-500/20 shadow-2xl backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand + Athletic Sub-label */}
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setActiveTab('genoma')}>
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-105 transition-transform duration-300 transform -rotate-3">
                <Dumbbell className="w-6 h-6 text-slate-950 font-black" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping opacity-75" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-brand text-2xl tracking-wider text-slate-900 dark:text-white uppercase">
                  FIT<span className="text-emerald-500 dark:text-emerald-400">FLEX</span>
                </span>
                <span className="athletic-badge px-1.5 py-0.5 rounded text-[10px] font-black bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 uppercase tracking-widest shadow-sm">
                  PRO IA
                </span>
              </div>
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden sm:block">
                High Performance Training System
              </p>
            </div>
          </div>

          {/* Athletic Navigation Deck (Desktop & Tablet) */}
          <nav className="hidden md:flex items-center space-x-1.5 p-1.5 rounded-2xl bg-slate-200/60 dark:bg-slate-900/80 border border-slate-300/50 dark:border-slate-800/80 backdrop-blur-md">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              if (item.highlight) {
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className="relative px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center space-x-2 bg-gradient-to-r from-emerald-400 via-emerald-500 to-cyan-400 text-slate-950 shadow-lg shadow-emerald-500/25 hover:brightness-110 active:scale-95 transition-all transform hover:-translate-y-0.5"
                  >
                    <Icon className="w-4 h-4 text-slate-950" />
                    <span>{item.label}</span>
                    <Zap className="w-3 h-3 fill-slate-950 text-slate-950 ml-0.5 animate-bounce" />
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-2 ${
                    isActive
                      ? 'bg-slate-900 dark:bg-slate-800 text-emerald-400 shadow-md border border-emerald-500/30'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-300/40 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>

                  {item.badge && (
                    <span className="relative flex h-2.5 w-2.5 ml-1">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Status Badges & Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* User Chip */}
            {currentUser && (
              <div className="hidden lg:flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-200/70 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 text-xs font-bold transition-all">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span className="text-slate-800 dark:text-slate-200 max-w-[110px] truncate uppercase tracking-tight">
                  {currentUser.username}
                </span>
              </div>
            )}

            {/* Streak Counter Badge */}
            <div className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-500 text-xs font-black uppercase tracking-wider shadow-sm">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
              <span>{streakDays} DAYS</span>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-200/80 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-emerald-500/50 transition-all hover:scale-105 active:scale-95"
              title={theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Settings Trigger */}
            <button
              onClick={onOpenSettings}
              className="p-2.5 rounded-xl bg-slate-200/80 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-emerald-500/50 transition-all hover:scale-105 active:scale-95"
              title="Configuración de Cuenta"
            >
              <Settings className="w-4 h-4 text-emerald-400" />
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Bottom Athletic Nav Hub */}
      <div className="md:hidden border-t border-slate-200 dark:border-slate-800/90 bg-slate-100/95 dark:bg-slate-950/95 backdrop-blur-xl px-2 py-2 flex justify-around shadow-2xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center py-1.5 px-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400 font-extrabold border border-emerald-500/30'
                  : 'text-slate-500 dark:text-slate-400 font-medium'
              }`}
            >
              <Icon className={`w-4 h-4 mb-1 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span className="text-[10px] uppercase tracking-wider">{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}

