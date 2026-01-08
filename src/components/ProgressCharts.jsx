import { useState } from 'react';
import { useGym } from '../contexts/GymContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format } from 'date-fns';

export default function ProgressCharts() {
  const { getExerciseHistory, personalRecords, unit, convertWeight } = useGym();
  const [selectedExercise, setSelectedExercise] = useState('');

  const exercises = Object.keys(personalRecords);
  const history = selectedExercise ? getExerciseHistory(selectedExercise) : [];

  const chartData = history.map(entry => {
    const maxWeight = Math.max(...entry.sets.map(s => s.weight));
    const totalVolume = entry.sets.reduce((sum, s) => sum + (s.weight * s.reps), 0);
    
    return {
      date: format(new Date(entry.date), 'MMM d'),
      maxWeight: parseFloat(convertWeight(maxWeight)),
      totalVolume: parseFloat(convertWeight(totalVolume)),
      avgReps: (entry.sets.reduce((sum, s) => sum + s.reps, 0) / entry.sets.length).toFixed(1)
    };
  });

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-green-400">📈 Progress Charts</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Select Exercise</label>
        <select
          value={selectedExercise}
          onChange={(e) => setSelectedExercise(e.target.value)}
          className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
        >
          <option value="">Choose an exercise...</option>
          {exercises.map(ex => (
            <option key={ex} value={ex}>{ex}</option>
          ))}
        </select>
      </div>

      {selectedExercise && chartData.length > 0 ? (
        <div className="space-y-8">
          {/* Max Weight Chart */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-300">Max Weight Progression</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                  labelStyle={{ color: '#F3F4F6' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="maxWeight" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', r: 5 }}
                  name={`Max Weight (${unit})`}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Volume Chart */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-purple-300">Total Volume</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                  labelStyle={{ color: '#F3F4F6' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="totalVolume" 
                  stroke="#A855F7" 
                  strokeWidth={3}
                  dot={{ fill: '#A855F7', r: 5 }}
                  name={`Volume (${unit})`}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-gray-700 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-400">
                {Math.max(...chartData.map(d => d.maxWeight))}
              </div>
              <div className="text-sm text-gray-400">Peak Weight</div>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-400">
                {Math.max(...chartData.map(d => d.totalVolume))}
              </div>
              <div className="text-sm text-gray-400">Max Volume</div>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-400">
                {chartData.length}
              </div>
              <div className="text-sm text-gray-400">Sessions</div>
            </div>
          </div>
        </div>
      ) : selectedExercise ? (
        <p className="text-gray-400 text-center py-8">No data available for this exercise yet.</p>
      ) : (
        <p className="text-gray-400 text-center py-8">Select an exercise to view progress charts.</p>
      )}
    </div>
  );
}
