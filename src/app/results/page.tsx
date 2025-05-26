'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrophyIcon, UsersIcon, ClockIcon } from '@heroicons/react/24/outline';

interface UserResult {
  name: string;
  score: number;
  timeTaken: number;
  completed: boolean;
}

interface QuizStats {
  totalParticipants: number;
  completedParticipants: number;
  averageScore: number;
  averageTime: number;
}

export default function ResultsPage() {
  const [results, setResults] = useState<UserResult[]>([]);
  const [stats, setStats] = useState<QuizStats>({
    totalParticipants: 0,
    completedParticipants: 0,
    averageScore: 0,
    averageTime: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await fetch('/api/results');
      if (!response.ok) throw new Error('Failed to fetch results');
      const data = await response.json();
      setResults(data.results);
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            No quiz results yet
          </h2>
          <p className="text-lg text-gray-600">
            Once users participate in the quiz, their results will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Quiz Results
          </h1>
          <p className="text-lg text-gray-600">
            See how everyone performed in the quiz!
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
              <UsersIcon className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Total Participants
            </h3>
            <p className="text-3xl font-bold text-blue-600">
              {stats.totalParticipants}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <TrophyIcon className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Completed Quiz
            </h3>
            <p className="text-3xl font-bold text-green-600">
              {stats.completedParticipants}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 mb-4">
              <TrophyIcon className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Average Score
            </h3>
            <p className="text-3xl font-bold text-purple-600">
              {stats.averageScore.toFixed(1)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 mb-4">
              <ClockIcon className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Average Time
            </h3>
            <p className="text-3xl font-bold text-orange-600">
              {Math.round(stats.averageTime)}s
            </p>
          </motion.div>
        </div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Leaderboard
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {results.map((result, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="px-6 py-4 flex items-center justify-between hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-blue-100">
                    <span className="text-blue-600 font-semibold">
                      {index + 1}
                    </span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-800">
                      {result.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Score: {result.score} / 15
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-600">
                    Time: {Math.round(result.timeTaken)}s
                  </p>
                  {result.completed ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Completed
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      In Progress
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
} 