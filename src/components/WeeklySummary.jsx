import { useGym } from '../contexts/GymContext';
import { format } from 'date-fns';

export default function WeeklySummary() {
  const { getWeeklySummary, unit, convertWeight } = useGym();
  const summary = getWeeklySummary();

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-orange-400">📊 This Week</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-linear-to-br from-blue-900/50 to-blue-700/30 p-4 rounded-lg border border-blue-500/30">
          <div className="text-3xl font-bold text-blue-300">{summary.totalWorkouts}</div>
          <div className="text-sm text-gray-400">Workouts</div>
        </div>
        
        <div className="bg-linear-to-br from-purple-900/50 to-purple-700/30 p-4 rounded-lg border border-purple-500/30">
          <div className="text-3xl font-bold text-purple-300">{summary.totalExercises}</div>
          <div className="text-sm text-gray-400">Exercises</div>
        </div>
        
        <div className="bg-linear-to-br from-green-900/50 to-green-700/30 p-4 rounded-lg border border-green-500/30">
          <div className="text-3xl font-bold text-green-300">{summary.totalSets}</div>
          <div className="text-sm text-gray-400">Sets</div>
        </div>
        
        <div className="bg-linear-to-br from-orange-900/50 to-orange-700/30 p-4 rounded-lg border border-orange-500/30">
          <div className="text-3xl font-bold text-orange-300">
            {(convertWeight(summary.totalVolume) / 1000).toFixed(1)}k
          </div>
          <div className="text-sm text-gray-400">Volume ({unit})</div>
        </div>
      </div>

      {summary.workouts.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-300">Recent Workouts</h3>
          <div className="space-y-3">
            {summary.workouts.map((workout) => (
              <div key={workout.id} className="bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-sm text-gray-400">
                    {format(new Date(workout.date), 'EEEE, MMM d')}
                  </div>
                  <div className="text-sm text-green-400 font-medium">
                    {workout.exercises.length} exercises
                  </div>
                </div>
                <div className="space-y-1">
                  {workout.exercises.map((exercise, idx) => (
                    <div key={idx} className="text-sm">
                      <span className="text-blue-300 font-medium">{exercise.name}</span>
                      <span className="text-gray-400"> - {exercise.sets.length} sets</span>
                    </div>
                  ))}
                  {workout.notes && (
                    <div className="mt-2 pt-2 border-t border-gray-600">
                      <div className="text-xs text-gray-500 mb-1">Notes:</div>
                      <div className="text-sm text-gray-300 italic">{workout.notes}</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {summary.workouts.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400 mb-2">No workouts this week yet.</p>
          <p className="text-sm text-gray-500">Time to hit the gym! 💪</p>
        </div>
      )}
    </div>
  );
}
