'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Confetti from 'react-confetti';
import questionsData from '@/questions.json';

interface Question {
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correctanswer: string;
}

interface QuizState {
  currentQuestionIndex: number;
  score: number;
  timeTaken: number;
  answers: Array<{
    questionId: string;
    selectedAnswer: string;
    isCorrect: boolean;
    timeTaken: number;
  }>;
}

const getRandomQuestions = (questions: Question[], count: number) => {
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export default function QuizPage() {
  const params = useParams<{ userId: string }>();
  const userId = params.userId;
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    score: 0,
    timeTaken: 0,
    answers: [],
  });
  const [timeLeft, setTimeLeft] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleAnswer = useCallback((selectedAnswer: string) => {
    const currentQuestion = questions[quizState.currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctanswer;
    const timeTakenForQuestion = 5 - timeLeft;

    setQuizState((prev) => ({
      ...prev,
      score: prev.score + (isCorrect ? 1 : 0),
      timeTaken: prev.timeTaken + timeTakenForQuestion,
      answers: [
        ...prev.answers,
        {
          questionId: String(quizState.currentQuestionIndex),
          selectedAnswer,
          isCorrect,
          timeTaken: timeTakenForQuestion,
        },
      ],
      currentQuestionIndex: prev.currentQuestionIndex + 1,
    }));

    setTimeLeft(5);
  }, [questions, quizState.currentQuestionIndex, timeLeft]);

  const handleTimeUp = useCallback(() => {
    handleAnswer(''); // Empty string indicates time up
  }, [handleAnswer]);

  const handleQuizCompletion = useCallback(async () => {
    try {
      const response = await fetch(`/api/quiz/${userId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          score: quizState.score,
          timeTaken: quizState.timeTaken,
          answers: quizState.answers,
        }),
      });

      if (!response.ok) throw new Error('Failed to save quiz results');
      
      setShowConfetti(true);
      setTimeout(() => {
        router.push('/results');
      }, 3000);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save quiz results');
    }
  }, [userId, quizState, router]);

  const fetchQuestions = useCallback(async () => {
    try {
      // Randomly select 15 questions from the static JSON
      setQuestions(getRandomQuestions(questionsData, 15));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load questions');
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  useEffect(() => {
    if (quizState.currentQuestionIndex >= questions.length) {
      handleQuizCompletion();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizState.currentQuestionIndex, questions.length, handleQuizCompletion, handleTimeUp]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (quizState.currentQuestionIndex >= questions.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {showConfetti && <Confetti />}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Quiz Completed!
          </h2>
          <p className="text-lg text-gray-600">
            Redirecting to results...
          </p>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = questions[quizState.currentQuestionIndex];

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-gray-600">
              Question {quizState.currentQuestionIndex + 1} of {questions.length}
            </div>
            <div className="text-sm font-medium text-gray-600">
              Time Left: {timeLeft}s
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={quizState.currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-semibold text-gray-800">
                {currentQuestion.question}
              </h2>

              <div className="grid gap-3">
                {[currentQuestion.option1, currentQuestion.option2, currentQuestion.option3, currentQuestion.option4].map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    className="w-full p-4 text-left rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
} 