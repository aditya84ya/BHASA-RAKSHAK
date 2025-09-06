'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'
import { Database } from '@/lib/supabase'
import { CheckCircle, XCircle, RotateCcw, Trophy } from 'lucide-react'
import toast from 'react-hot-toast'

type Quiz = Database['public']['Tables']['quizzes']['Row']

export function QuizzesSection() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchQuizzes()
  }, [])

  const fetchQuizzes = async () => {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      console.error('Error fetching quizzes:', error)
    } else {
      setQuizzes(data || [])
      if (data && data.length > 0) {
        setCurrentQuiz(data[0])
      }
    }
    setLoading(false)
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult || quizCompleted) return
    setSelectedAnswer(answerIndex)
  }

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || !currentQuiz) return

    const isCorrect = selectedAnswer === currentQuiz.correct_answer
    setShowResult(true)
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }))

    if (isCorrect) {
      toast.success('Correct!')
    } else {
      toast.error(`Incorrect. The correct answer is: ${currentQuiz.options[currentQuiz.correct_answer]}`)
    }
  }

  const handleNextQuestion = () => {
    const currentIndex = quizzes.findIndex(q => q.id === currentQuiz?.id)
    if (currentIndex < quizzes.length - 1) {
      setCurrentQuiz(quizzes[currentIndex + 1])
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      setQuizCompleted(true)
    }
  }

  const resetQuiz = () => {
    setCurrentQuiz(quizzes[0])
    setSelectedAnswer(null)
    setShowResult(false)
    setScore({ correct: 0, total: 0 })
    setQuizCompleted(false)
  }

  const getAnswerColor = (index: number) => {
    if (!showResult) {
      return selectedAnswer === index
        ? 'bg-primary-100 border-primary-500 text-primary-700'
        : 'bg-white border-gray-300 hover:border-gray-400'
    }

    if (index === currentQuiz?.correct_answer) {
      return 'bg-green-100 border-green-500 text-green-700'
    } else if (index === selectedAnswer && index !== currentQuiz?.correct_answer) {
      return 'bg-red-100 border-red-500 text-red-700'
    } else {
      return 'bg-gray-100 border-gray-300 text-gray-500'
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    )
  }

  if (quizzes.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No quizzes available</h3>
        <p className="text-gray-500">Check back later for new quiz content!</p>
      </div>
    )
  }

  if (quizCompleted) {
    const percentage = Math.round((score.correct / score.total) * 100)
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-8 h-8 text-yellow-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Completed!</h2>
        <p className="text-lg text-gray-600 mb-6">
          You scored {score.correct} out of {score.total} ({percentage}%)
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={resetQuiz}
            className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Quiz</span>
          </button>
        </div>
      </div>
    )
  }

  if (!currentQuiz) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <p className="text-gray-500">No quiz available</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Quiz</h2>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            Question {quizzes.findIndex(q => q.id === currentQuiz.id) + 1} of {quizzes.length}
          </span>
          <button
            onClick={resetQuiz}
            className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="text-sm font-medium">Reset</span>
          </button>
        </div>
      </div>

      {/* Score */}
      {score.total > 0 && (
        <div className="mb-6 p-4 bg-primary-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-primary-700">Current Score</span>
            <span className="text-lg font-bold text-primary-900">
              {score.correct}/{score.total}
            </span>
          </div>
        </div>
      )}

      {/* Question */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          {currentQuiz.question}
        </h3>

        <div className="space-y-3">
          {currentQuiz.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={showResult}
              className={`w-full p-4 text-left border-2 rounded-lg transition-all duration-200 ${
                getAnswerColor(index)
              } ${!showResult ? 'hover:shadow-md' : ''}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{option}</span>
                {showResult && index === currentQuiz.correct_answer && (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                )}
                {showResult && index === selectedAnswer && index !== currentQuiz.correct_answer && (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Explanation */}
      {showResult && currentQuiz.explanation && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Explanation:</h4>
          <p className="text-blue-800">{currentQuiz.explanation}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end">
        {!showResult ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={selectedAnswer === null}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={handleNextQuestion}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            {quizzes.findIndex(q => q.id === currentQuiz.id) < quizzes.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </button>
        )}
      </div>
    </div>
  )
}
