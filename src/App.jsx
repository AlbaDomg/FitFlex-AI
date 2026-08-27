import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { OnboardingModal } from './components/OnboardingModal';
import { GenomaProfile } from './components/GenomaProfile';
import { CustomWorkoutBuilder } from './components/CustomWorkoutBuilder';
import { InWorkoutPlayer } from './components/InWorkoutPlayer';
import { EvolutionAnalytics } from './components/EvolutionAnalytics';
import { VibeCheckModal } from './components/VibeCheckModal';
import { LoginScreen } from './components/LoginScreen';
import { AdminPanel } from './components/AdminPanel';
import { SettingsModal } from './components/SettingsModal';
import { AICoachModal } from './components/AICoachModal';
import { Bot, Sparkles } from 'lucide-react';

import { useAuth } from './hooks/useAuth';
import { useUserProfile } from './hooks/useUserProfile';
import { useLoadLog } from './hooks/useLoadLog';
import { useWorkoutSession } from './hooks/useWorkoutSession';
import { getRecommendedExercises, getRecommendedMethodologyForTime, organizeBiseriesForFullbody, isUpperBodyExercise, isLowerBodyExercise } from './data/exerciseDatabase';

export function App() {
  const authHooks = useAuth();
  const { currentUser, isAdmin, login, logout, updateUsername, authorizedList, addAuthorizedEmail, removeAuthorizedEmail } = authHooks;

  const [activeTab, setActiveTab] = useState('genoma');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isVibeCheckOpen, setIsVibeCheckOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCoachOpen, setIsCoachOpen] = useState(false);
  const [pendingWorkoutConfig, setPendingWorkoutConfig] = useState(null);

  // Core Custom State Management Hooks Scoped to Active User Email
  const profileHooks = useUserProfile(currentUser?.email);
  const loadLogHooks = useLoadLog(currentUser?.email);
  const sessionHooks = useWorkoutSession(loadLogHooks.addSetLog, currentUser?.email);

  const { profile, updateProfile, theme, toggleTheme, streakDays, completedSplitDays, markSplitDayCompleted, resetUserProfile } = profileHooks;
  const { session, startSession, resetSession } = sessionHooks;
  const { resetLoadLog } = loadLogHooks;

  // Auto-restore active workout player tab if a live session is active on reload
  React.useEffect(() => {
    if (session.isActive && !session.isCompleted) {
      setActiveTab('player');
    }
  }, [session.isActive, session.isCompleted]);

  // If user is not logged in / authorized, render Login Portal Screen
  if (!currentUser) {
    return <LoginScreen onLogin={login} />;
  }

  // Launch pre-workout vibe check when starting from builder
  const handleRequestStartWorkout = (exercises, methodology) => {
    setPendingWorkoutConfig({ exercises, methodology, dayLabel: null, isCustomOverride: true });
    setIsVibeCheckOpen(true);
  };

  // Launch pre-workout when user clicks a specific Split Day card in Genoma IA
  const handleSelectSplitDay = (dayItem) => {
    let recommended = getRecommendedExercises({
      equipment: profile.equipment || 'gym',
      muscleGroups: dayItem.muscles,
      protectedZones: profile.protectedZones || [],
      sessionTime: profile.sessionTime || 45
    });

    const methodology = getRecommendedMethodologyForTime(profile.sessionTime || 45);
    const isFullBody = (dayItem.title && dayItem.title.toLowerCase().includes('full body')) ||
                       (recommended.some(ex => isUpperBodyExercise(ex)) && recommended.some(ex => isLowerBodyExercise(ex)));

    if (methodology === 'biseries' && isFullBody) {
      recommended = organizeBiseriesForFullbody(recommended);
    }

    setPendingWorkoutConfig({
      exercises: recommended,
      methodology,
      dayLabel: dayItem.day,
      dayMuscles: dayItem.muscles,
      isFullBody
    });
    setIsVibeCheckOpen(true);
  };

  const handleConfirmVibe = (vibe, sessionDuration) => {
    if (pendingWorkoutConfig) {
      // Re-evaluate optimal methodology for the specific session duration chosen
      const effectiveMethodology = pendingWorkoutConfig.isCustomOverride
        ? pendingWorkoutConfig.methodology
        : getRecommendedMethodologyForTime(sessionDuration);

      let finalExercises = pendingWorkoutConfig.isCustomOverride
        ? [...pendingWorkoutConfig.exercises]
        : getRecommendedExercises({
            equipment: profile.equipment || 'gym',
            muscleGroups: pendingWorkoutConfig.dayMuscles || [],
            protectedZones: profile.protectedZones || [],
            sessionTime: sessionDuration
          });

      const isFullBody = pendingWorkoutConfig.isFullBody ||
        (finalExercises.some(ex => isUpperBodyExercise(ex)) && finalExercises.some(ex => isLowerBodyExercise(ex)));

      if (effectiveMethodology === 'biseries' && isFullBody) {
        finalExercises = organizeBiseriesForFullbody(finalExercises);
      }

      startSession(finalExercises, effectiveMethodology, vibe, sessionDuration);
      setIsVibeCheckOpen(false);
      setActiveTab('player');
    }
  };

  const handleFinishWorkout = () => {
    if (pendingWorkoutConfig?.dayLabel) {
      markSplitDayCompleted(pendingWorkoutConfig.dayLabel);
    }
    setActiveTab('evolution');
  };

  const handleResetApp = () => {
    resetUserProfile();
    resetLoadLog();
    resetSession();
    setIsOnboardingOpen(true);
    setActiveTab('genoma');
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#05070d] sports-bg-pattern text-slate-900 dark:text-zinc-100 font-sans transition-colors duration-250 selection:bg-emerald-500 selection:text-zinc-950 relative overflow-x-hidden">
      {/* Dynamic Ambient Neon Glow Accents */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-10 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Navbar Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        toggleTheme={toggleTheme}
        streakDays={streakDays}
        isSessionActive={session.isActive}
        currentUser={currentUser}
        isAdmin={isAdmin}
        onLogout={logout}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Router View */}
      <main className="pb-16">
        {activeTab === 'genoma' && (
          <GenomaProfile
            profile={profile}
            onSelectSplitDay={handleSelectSplitDay}
            completedSplitDays={completedSplitDays}
          />
        )}

        {activeTab === 'builder' && (
          <CustomWorkoutBuilder
            profile={profile}
            onStartWorkout={handleRequestStartWorkout}
          />
        )}

        {activeTab === 'player' && (
          <InWorkoutPlayer
            sessionHooks={sessionHooks}
            profile={profile}
            onFinishWorkout={handleFinishWorkout}
            onGoToBuilder={() => setActiveTab('builder')}
          />
        )}

        {activeTab === 'evolution' && (
          <EvolutionAnalytics
            loadLogHooks={loadLogHooks}
            profileHooks={profileHooks}
          />
        )}

        {activeTab === 'admin' && isAdmin && (
          <AdminPanel
            authorizedList={authorizedList}
            onAddEmail={addAuthorizedEmail}
            onRemoveEmail={removeAuthorizedEmail}
          />
        )}
      </main>

      {/* Onboarding Wizard Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen || (!profile.isCompleted && activeTab === 'genoma')}
        onClose={() => setIsOnboardingOpen(false)}
        onSave={updateProfile}
        initialProfile={profile}
      />

      {/* Pre-Workout Vibe Check & Session Duration Override Modal */}
      <VibeCheckModal
        isOpen={isVibeCheckOpen}
        onClose={() => setIsVibeCheckOpen(false)}
        onConfirm={handleConfirmVibe}
        defaultSessionTime={profile.sessionTime || 45}
      />

      {/* Floating AI Coach Trigger FAB Button */}
      <button
        onClick={() => setIsCoachOpen(true)}
        className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center space-x-2 shadow-2xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all transform border border-emerald-300/40 group"
        title="Consultar al Coach FitFlex IA"
      >
        <div className="w-6 h-6 rounded-full bg-slate-950/20 flex items-center justify-center">
          <Bot className="w-4 h-4 text-slate-950 group-hover:rotate-12 transition-transform" />
        </div>
        <span className="hidden sm:inline">COACH IA</span>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-950 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-950"></span>
        </span>
      </button>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentUser={currentUser}
        onUpdateUsername={updateUsername}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        onResetApp={handleResetApp}
        onLogout={logout}
      />

      {/* AI Coach Interactive Modal */}
      <AICoachModal
        isOpen={isCoachOpen}
        onClose={() => setIsCoachOpen(false)}
        userProfile={profile}
        activeSession={session}
      />
    </div>
  );
}

export default App;
