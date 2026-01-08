import { GymProvider, useGym } from './contexts/GymContext'
import WorkoutLogger from './components/WorkoutLogger'
import PersonalRecords from './components/PersonalRecords'
import ProgressCharts from './components/ProgressCharts'
import WeeklySummary from './components/WeeklySummary'

function AppContent() {
  const { unit, toggleUnit, clearAllData, workouts } = useGym();

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all workout data and personal records? This cannot be undone!')) {
      clearAllData();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex justify-between items-center mb-3">
            <div className="flex-1"></div>
            <h1 className="text-5xl font-bold bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              GymTrack
            </h1>
            <div className="flex-1 flex justify-end gap-2">
              <button
                onClick={toggleUnit}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition font-medium border border-gray-600"
                title="Toggle between kg and lbs"
              >
                {unit}
              </button>
              {workouts.length > 0 && (
                <button
                  onClick={handleClearData}
                  className="px-4 py-2 bg-red-900/50 hover:bg-red-800 rounded-lg transition font-medium border border-red-700"
                  title="Clear all data"
                >
                  Clear Data
                </button>
              )}
            </div>
          </div>
          <p className="text-gray-400 text-lg">Track your fitness journey, one rep at a time</p>
        </header>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <WorkoutLogger />
          <div className="space-y-6">
            <WeeklySummary />
            <PersonalRecords />
          </div>
        </div>

        <ProgressCharts />
      </div>
    </div>
  );
}

function App() {
  return (
    <GymProvider>
      <AppContent />
    </GymProvider>
  )
}

export default App
