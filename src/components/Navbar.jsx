import React from 'react';
import { Dumbbell, Sparkles, Flame, Moon, Sun, Activity, Trophy, ShieldCheck, LogOut, User, Settings } from 'lucide-react';

export function Navbar({ activeTab, setActiveTab, theme, toggleTheme, streakDays, isSessionActive, currentUser, isAdmin, onLogout, onOpenSettings }) {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-zinc-200 dark:border-zinc-800 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand + Mobile Sub-Username */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('builder')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Dumbbell className="w-6 h-6 text-zinc-950 font-bold" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-zinc-900 dark:text-zinc-50 leading-none block">
                FitFlex <span className="text-emerald-500 dark:text-emerald-400">AI</span>
              </span>
              {currentUser && (
                <span className="text-[10px] font-extrabold text-zinc-500 dark:text-zinc-400 flex items-center space-x-1 mt-0.5 md:hidden">
                  <User className="w-2.5 h-2.5 text-emerald-500 inline flex-shrink-0" />
                  <span className="truncate max-w-[90px]">{currentUser.username}</span>
                </span>
              )}
            </div>
          </div>

          {/* Navigation Links (Desktop & Tablet) */}
          <nav className="hidden md:flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('genoma')}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'genoma'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              Genoma IA
            </button>

            {/* Permanent Primary Solid Creador IA Button */}
            <button
              onClick={() => setActiveTab('builder')}
              className="px-4 py-2 rounded-full text-sm font-black flex items-center space-x-1.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-zinc-950 shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-cyan-400 active:scale-95 transition-all"
            >
              <Dumbbell className="w-4 h-4 text-zinc-950 font-bold" />
              <span>Creador IA</span>
            </button>

            <button
              onClick={() => setActiveTab('player')}
              className={`relative px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'player'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <span>En Vivo</span>
              {isSessionActive && (
                <span className="ml-2 relative flex h-2 w-2 inline-block">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('evolution')}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'evolution'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              Evolución
            </button>

            {isAdmin && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeTab === 'admin'
                    ? 'bg-cyan-500/10 text-cyan-400 font-semibold border border-cyan-500/20'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                Membresías
              </button>
            )}
          </nav>

          {/* Right Status Badges & Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* User Chip (Desktop only) */}
            {currentUser && (
              <div className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-bold transition-all">
                <User className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                <span className="text-zinc-800 dark:text-zinc-200 max-w-[120px] truncate">
                  {currentUser.username}
                </span>
              </div>
            )}

            {/* Streak Counter */}
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-bold">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
              <span>{streakDays} Días</span>
            </div>

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              title={theme === 'dark' ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-zinc-700" />}
            </button>

            {/* Settings Gear Modal Trigger Button */}
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              title="Configuración de Cuenta & Genoma"
            >
              <Settings className="w-5 h-5 text-emerald-400" />
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/90 px-2 py-1.5 flex justify-around">
        <button
          onClick={() => setActiveTab('genoma')}
          className={`flex flex-col items-center py-1 px-3 text-xs font-medium ${
            activeTab === 'genoma' ? 'text-emerald-500 font-bold' : 'text-zinc-500 dark:text-zinc-400'
          }`}
        >
          <Sparkles className="w-4 h-4 mb-0.5" />
          Genoma
        </button>
        <button
          onClick={() => setActiveTab('builder')}
          className={`flex flex-col items-center py-1 px-3 text-xs font-medium ${
            activeTab === 'builder' ? 'text-emerald-500 font-bold' : 'text-zinc-500 dark:text-zinc-400'
          }`}
        >
          <Dumbbell className="w-4 h-4 mb-0.5 text-emerald-400" />
          Creador
        </button>
        <button
          onClick={() => setActiveTab('player')}
          className={`relative flex flex-col items-center py-1 px-3 text-xs font-medium ${
            activeTab === 'player' ? 'text-emerald-500 font-bold' : 'text-zinc-500 dark:text-zinc-400'
          }`}
        >
          <Activity className="w-4 h-4 mb-0.5" />
          En Vivo
          {isSessionActive && (
            <span className="absolute top-1 right-3 h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('evolution')}
          className={`flex flex-col items-center py-1 px-3 text-xs font-medium ${
            activeTab === 'evolution' ? 'text-emerald-500 font-bold' : 'text-zinc-500 dark:text-zinc-400'
          }`}
        >
          <Trophy className="w-4 h-4 mb-0.5" />
          Evolución
        </button>
        {isAdmin && (
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex flex-col items-center py-1 px-3 text-xs font-medium ${
              activeTab === 'admin' ? 'text-cyan-400 font-bold' : 'text-zinc-500 dark:text-zinc-400'
            }`}
          >
            <ShieldCheck className="w-4 h-4 mb-0.5" />
            Admin
          </button>
        )}
      </div>
    </header>
  );
}
