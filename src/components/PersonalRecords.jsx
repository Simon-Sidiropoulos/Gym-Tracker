import { useGym } from '../contexts/GymContext';
import { format } from 'date-fns';

export default function PersonalRecords() {
  const { personalRecords, unit, convertWeight } = useGym();

  const records = Object.entries(personalRecords).sort((a, b) => 
    b[1].weight - a[1].weight
  );

  if (records.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-purple-400">🏆 Personal Records</h2>
        <p className="text-gray-400">No PRs yet. Start logging workouts to track your progress!</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-purple-400">🏆 Personal Records</h2>
      
      <div className="grid gap-4">
        {records.map(([exercise, record]) => (
          <div 
            key={exercise}
            className="bg-linear-to-r from-purple-900/50 to-pink-900/50 p-4 rounded-lg border border-purple-500/30"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-bold text-purple-300">{exercise}</h3>
              <span className="text-2xl font-bold text-yellow-400">{convertWeight(record.weight)} {unit}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-400">
              <span>{record.reps} reps</span>
              <span>{format(new Date(record.date), 'MMM d, yyyy')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
