import { createContext, useContext, useState, useEffect } from 'react';
import { startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';

const GymContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useGym = () => {
  const context = useContext(GymContext);
  if (!context) {
    throw new Error('useGym must be used within GymProvider');
  }
  return context;
};

export const GymProvider = ({ children }) => {
  const [workouts, setWorkouts] = useState(() => {
    const saved = localStorage.getItem('gymWorkouts');
    return saved ? JSON.parse(saved) : [];
  });

  const [personalRecords, setPersonalRecords] = useState(() => {
    const saved = localStorage.getItem('gymPRs');
    return saved ? JSON.parse(saved) : {};
  });

  const [unit, setUnit] = useState(() => {
    const saved = localStorage.getItem('gymUnit');
    return saved || 'lbs';
  });

  useEffect(() => {
    localStorage.setItem('gymWorkouts', JSON.stringify(workouts));
  }, [workouts]);

  useEffect(() => {
    localStorage.setItem('gymPRs', JSON.stringify(personalRecords));
  }, [personalRecords]);

  useEffect(() => {
    localStorage.setItem('gymUnit', unit);
  }, [unit]);

  const toggleUnit = () => {
    setUnit(prev => prev === 'lbs' ? 'kg' : 'lbs');
  };

  const convertWeight = (weight) => {
    if (unit === 'kg') {
      return Math.round(weight / 2.20462);
    }
    return Math.round(weight);
  };

  const addWorkout = (workout) => {
    // Convert weights to lbs if user is entering in kg
    const normalizedWorkout = {
      ...workout,
      exercises: workout.exercises.map(exercise => ({
        ...exercise,
        sets: exercise.sets.map(set => ({
          ...set,
          weight: unit === 'kg' ? set.weight * 2.20462 : set.weight
        }))
      }))
    };

    const newWorkout = {
      ...normalizedWorkout,
      id: Date.now(),
      date: new Date().toISOString(),
    };
    setWorkouts(prev => [newWorkout, ...prev]);

    // Update PRs if needed
    normalizedWorkout.exercises.forEach(exercise => {
      const exerciseName = exercise.name;
      const maxWeight = Math.max(...exercise.sets.map(set => set.weight));
      
      if (!personalRecords[exerciseName] || maxWeight > personalRecords[exerciseName].weight) {
        setPersonalRecords(prev => ({
          ...prev,
          [exerciseName]: {
            weight: maxWeight,
            date: newWorkout.date,
            reps: exercise.sets.find(set => set.weight === maxWeight)?.reps || 0
          }
        }));
      }
    });
  };

  const deleteWorkout = (id) => {
    setWorkouts(prev => prev.filter(w => w.id !== id));
  };

  const getWeeklySummary = () => {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

    const weekWorkouts = workouts.filter(w => {
      const workoutDate = new Date(w.date);
      return isWithinInterval(workoutDate, { start: weekStart, end: weekEnd });
    });

    const totalWorkouts = weekWorkouts.length;
    const totalExercises = weekWorkouts.reduce((sum, w) => sum + w.exercises.length, 0);
    const totalSets = weekWorkouts.reduce((sum, w) => 
      sum + w.exercises.reduce((exerciseSum, e) => exerciseSum + e.sets.length, 0), 0
    );
    const totalVolume = weekWorkouts.reduce((sum, w) => 
      sum + w.exercises.reduce((exerciseSum, e) => 
        exerciseSum + e.sets.reduce((setSum, s) => setSum + (s.weight * s.reps), 0), 0
      ), 0
    );

    return {
      totalWorkouts,
      totalExercises,
      totalSets,
      totalVolume,
      workouts: weekWorkouts
    };
  };

  const getExerciseHistory = (exerciseName) => {
    return workouts
      .filter(w => w.exercises.some(e => e.name === exerciseName))
      .map(w => ({
        date: w.date,
        ...w.exercises.find(e => e.name === exerciseName)
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const clearAllData = () => {
    setWorkouts([]);
    setPersonalRecords({});
    localStorage.removeItem('gymWorkouts');
    localStorage.removeItem('gymPRs');
  };

  return (
    <GymContext.Provider value={{
      workouts,
      personalRecords,
      unit,
      toggleUnit,
      convertWeight,
      addWorkout,
      deleteWorkout,
      getWeeklySummary,
      getExerciseHistory,
      clearAllData
    }}>
      {children}
    </GymContext.Provider>
  );
};
