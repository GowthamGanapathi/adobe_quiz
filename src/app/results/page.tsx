'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { UsersIcon } from '@heroicons/react/24/outline';
import Confetti from 'react-confetti';

interface UserResult {
  name: string;
  ldap?: string;
  mobileNumber?: string;
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
  const [search, setSearch] = useState('');
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    fetchResults();
    const interval = setInterval(() => {
      setShowConfetti(prev => !prev);
    }, 10000); // 2 seconds
    return () => clearInterval(interval);
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

  // Filtered results based on search
  const filteredResults = results.filter(result => {
    const term = search.toLowerCase();
    return (
      result.name.toLowerCase().includes(term) ||
      (result.ldap && result.ldap.toLowerCase().includes(term)) ||
      (result.mobileNumber && result.mobileNumber.includes(term))
    );
  });

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
      {showConfetti && <Confetti />}
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
        <div className="flex justify-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center min-w-[260px] min-h-[220px] border border-blue-100"
            style={{
              background: "linear-gradient(135deg, #f0f7ff 0%, #e0e7ff 100%)",
            }}
          >
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-50 mb-6 shadow-sm">
              <UsersIcon className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center tracking-wide">
              Total Participants
            </h3>
            <p className="text-5xl font-extrabold text-blue-600 text-center drop-shadow-lg mt-2">
              {stats.totalParticipants}
            </p>
          </motion.div>
        </div>

        {/* Search Input */}
        <div className="mb-6 flex justify-center">
          <input
            type="text"
            placeholder="Search by name or LDAP"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-500 bg-white"
          />
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
              {search ? 'Search Results' : 'Leaderboard'}
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredResults.map((result, index) => (
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
                    {result.ldap && (
                      <p className="text-xs text-gray-400">LDAP: {result.ldap}</p>
                    )}
                    {result.mobileNumber && (
                      <p className="text-xs text-gray-400">Mobile: {result.mobileNumber}</p>
                    )}
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
            {filteredResults.length === 0 && (
              <div className="px-6 py-4 text-center text-gray-500">
                No results found.
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
} 