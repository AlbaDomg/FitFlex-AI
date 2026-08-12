import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { OnboardingModal } from './components/OnboardingModal';
import { GenomaProfile } from './components/GenomaProfile';
import { CustomWorkoutBuilder } from './components/CustomWorkoutBuilder';
import { InWorkoutPlayer } from './components/InWorkoutPlayer';
import { EvolutionAnalytics } from './components/EvolutionAnalytics';
import { VibeCheckModal } from './components/VibeCheckModal';

import { useUserProfile } from './hooks/useUserProfile';
import { useLoadLog } from './hooks/useLoadLog';
import { useWorkoutSession } from './hooks/useWorkoutSession';
import { getRecommendedExercises } from './data/exerciseDatabase';

export function App() {
  const [activeTab, setActiveTab] = useState('genoma');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isVibeCheckOpen, setIsVibeCheckOpen] = useState(false);
  const [pendingWorkoutConfig, setPendingWorkoutConfig] = useState(null);

  // Core Custom State Management Hooks
  const profileHooks = useUserProfile();
  const loadLogHooks = useLoadLog();
  const sessionHooks = useWorkoutSession(loadLogHooks.addSetLog);

  const { profile, updateProfile, theme, toggleTheme, streakDays, completedSplitDays, markSplitDayCompleted, resetUserProfile } = profileHooks;
  const { session, startSession, resetSession } = sessionHooks;
  const { resetLoadLog } = loadLogHooks;

  // Launch pre-workout vibe check when starting from builder
  const handleRequestStartWorkout = (exercises, methodology) => {
    setPendingWorkoutConfig({ exercises, methodology, dayLabel: null });
    setIsVibeCheckOpen(true);
  };

  // Launch pre-workout when user clicks a specific Split Day card in Genoma IA
  const handleSelectSplitDay = (dayItem) => {
    const recommended = getRecommendedExercises({
      equipment: profile.equipment || 'gym',
      muscleGroups: dayItem.muscles,
      protectedZones: profile.protectedZones || []
    });

    const isTorsoOrAntagonist = dayItem.muscles.includes('chest') && dayItem.muscles.includes('back');
    const methodology = isTorsoOrAntagonist ? 'biseries' : 'classic';

    setPendingWorkoutConfig({
      exercises: recommended,
      methodology,
      dayLabel: dayItem.day
    });
    setIsVibeCheckOpen(true);
  };

  const handleConfirmVibe = (vibe) => {
    if (pendingWorkoutConfig) {
      startSession(pendingWorkoutConfig.exercises, pendingWorkoutConfig.methodology, vibe);
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
      />

      {/* Main Content Router View */}
      <main className="pb-16">
        {activeTab === 'genoma' && (
          <GenomaProfile
            profile={profile}
            onOpenOnboarding={() => setIsOnboardingOpen(true)}
            onStartCustomBuilder={() => setActiveTab('builder')}
            onSelectSplitDay={handleSelectSplitDay}
            completedSplitDays={completedSplitDays}
            onResetApp={handleResetApp}
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
      </main>

      {/* Onboarding Wizard Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen || (!profile.isCompleted && activeTab === 'genoma')}
        onClose={() => setIsOnboardingOpen(false)}
        onSave={updateProfile}
        initialProfile={profile}
      />

      {/* Pre-Workout Vibe Check Modal */}
      <VibeCheckModal
        isOpen={isVibeCheckOpen}
        onClose={() => setIsVibeCheckOpen(false)}
        onConfirm={handleConfirmVibe}
      />
    </div>
  );
}

export default App;
