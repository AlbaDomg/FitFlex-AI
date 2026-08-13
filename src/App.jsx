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

import { useAuth } from './hooks/useAuth';
import { useUserProfile } from './hooks/useUserProfile';
import { useLoadLog } from './hooks/useLoadLog';
import { useWorkoutSession } from './hooks/useWorkoutSession';
import { getRecommendedExercises, getRecommendedMethodologyForTime } from './data/exerciseDatabase';

export function App() {
  const authHooks = useAuth();
  const { currentUser, isAdmin, login, logout, updateUsername, authorizedList, addAuthorizedEmail, removeAuthorizedEmail } = authHooks;

  const [activeTab, setActiveTab] = useState('genoma');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isVibeCheckOpen, setIsVibeCheckOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [pendingWorkoutConfig, setPendingWorkoutConfig] = useState(null);

  // Core Custom State Management Hooks Scoped to Active User Email
  const profileHooks = useUserProfile(currentUser?.email);
  const loadLogHooks = useLoadLog(currentUser?.email);
  const sessionHooks = useWorkoutSession(loadLogHooks.addSetLog);

  const { profile, updateProfile, theme, toggleTheme, streakDays, completedSplitDays, markSplitDayCompleted, resetUserProfile } = profileHooks;
  const { session, startSession, resetSession } = sessionHooks;
  const { resetLoadLog } = loadLogHooks;

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
    const recommended = getRecommendedExercises({
      equipment: profile.equipment || 'gym',
      muscleGroups: dayItem.muscles,
      protectedZones: profile.protectedZones || []
    });

    const methodology = getRecommendedMethodologyForTime(profile.sessionTime || 45);

    setPendingWorkoutConfig({
      exercises: recommended,
      methodology,
      dayLabel: dayItem.day
    });
    setIsVibeCheckOpen(true);
  };

  const handleConfirmVibe = (vibe, sessionDuration) => {
    if (pendingWorkoutConfig) {
      // Re-evaluate optimal methodology for the specific session duration chosen
      const effectiveMethodology = pendingWorkoutConfig.isCustomOverride
        ? pendingWorkoutConfig.methodology
        : getRecommendedMethodologyForTime(sessionDuration);

      startSession(pendingWorkoutConfig.exercises, effectiveMethodology, vibe, sessionDuration);
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
    <div className={`min-h-screen bg-slate-50 dark:bg-black text-zinc-900 dark:text-zinc-50 font-sans transition-colors duration-250 selection:bg-emerald-500 selection:text-zinc-950`}>
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
    </div>
  );
}

export default App;
