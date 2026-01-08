import { useState } from 'react';
import { useGym } from '../contexts/GymContext';

const COMMON_EXERCISES = [
  'Bench Press', 'Squat', 'Deadlift', 'Overhead Press',
  'Barbell Row', 'Pull-ups', 'Dips', 'Romanian Deadlift',
  'Leg Press', 'Leg Curl', 'Lat Pulldown', 'Bicep Curl'
];

export default function WorkoutLogger() {
  const { addWorkout, unit } = useGym();
  const [exercises, setExercises] = useState([]);
  const [notes, setNotes] = useState('');
  const [currentExercise, setCurrentExercise] = useState({
    name: '',
    sets: [{ reps: '', weight: '' }]
  });

  const addSet = () => {
    setCurrentExercise(prev => ({
      ...prev,
      sets: [...prev.sets, { reps: '', weight: '' }]
    }));
  };

  const updateSet = (index, field, value) => {
    setCurrentExercise(prev => ({
      ...prev,
      sets: prev.sets.map((set, i) => 
        i === index ? { ...set, [field]: parseFloat(value) || value } : set
      )
    }));
  };

  const removeSet = (index) => {
    setCurrentExercise(prev => ({
      ...prev,
      sets: prev.sets.filter((_, i) => i !== index)
    }));
  };

  const addExerciseToWorkout = () => {
    if (currentExercise.name && currentExercise.sets.some(s => s.reps && s.weight)) {
      const validSets = currentExercise.sets.filter(s => s.reps && s.weight);
      setExercises(prev => [...prev, { ...currentExercise, sets: validSets }]);
      setCurrentExercise({ name: '', sets: [{ reps: '', weight: '' }] });
    }
  };

  const removeExercise = (index) => {
    setExercises(prev => prev.filter((_, i) => i !== index));
  };

  const saveWorkout = () => {
    if (exercises.length > 0) {
      addWorkout({ exercises, notes });
      setExercises([]);
      setNotes('');
      setCurrentExercise({ name: '', sets: [{ reps: '', weight: '' }] });
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-blue-400">Log Workout</h2>
      
      {/* Current Exercise Form */}
      <div className="mb-6 bg-gray-700 p-4 rounded-lg">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Exercise</label>
          <input
            type="text"
            list="exercises"
            value={currentExercise.name}
            onChange={(e) => setCurrentExercise(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter or select exercise"
            className="w-full px-3 py-2 bg-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <datalist id="exercises">
            {COMMON_EXERCISES.map(ex => (
              <option key={ex} value={ex} />
            ))}
          </datalist>
        </div>

        {/* Sets */}
        <div className="space-y-2 mb-4">
          <label className="block text-sm font-medium">Sets</label>
          {currentExercise.sets.map((set, index) => (
            <div key={index} className="flex gap-2 items-center">
              <span className="text-gray-400 w-8">#{index + 1}</span>
              <input
                type="number"
                value={set.weight}
                onChange={(e) => updateSet(index, 'weight', e.target.value)}
                placeholder={`Weight (${unit})`}
                className="flex-1 px-3 py-2 bg-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="number"
                value={set.reps}
                onChange={(e) => updateSet(index, 'reps', e.target.value)}
                placeholder="Reps"
                className="w-24 px-3 py-2 bg-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              {currentExercise.sets.length > 1 && (
                <button
                  onClick={() => removeSet(index)}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={addSet}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition"
          >
            + Add Set
          </button>
          <button
            onClick={addExerciseToWorkout}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition font-medium"
          >
            Add to Workout
          </button>
        </div>
      </div>

      {/* Current Workout Summary */}
      {exercises.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-green-400">Current Workout</h3>
          <div className="space-y-2">
            {exercises.map((exercise, index) => (
              <div key={index} className="bg-gray-700 p-3 rounded-lg flex justify-between items-start">
                <div>
                  <div className="font-medium text-blue-300">{exercise.name}</div>
                  <div className="text-sm text-gray-400">
                    {exercise.sets.map((set, i) => (
                      <span key={i}>
                        {i > 0 && ', '}
                        {set.weight}{unit} × {set.reps}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => removeExercise(index)}
                  className="text-red-400 hover:text-red-300"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2 text-gray-300">Workout Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes (e.g., pause reps, form check, felt strong today...)"
              className="w-full px-3 py-2 bg-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              rows="3"
            />
          </div>
          <button
            onClick={saveWorkout}
            className="w-full mt-4 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition font-bold text-lg"
          >
            Save Workout 💪
          </button>
        </div>
      )}
    </div>
  );
}
