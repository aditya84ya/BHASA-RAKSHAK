 'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Trophy, RotateCcw, ArrowLeft } from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAuth } from '../app/providers'
import toast from 'react-hot-toast'

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

const demoQuestions: Question[] = [
  {
    id: 1,
    question: "What does 'Namaste' mean in Hindi?",
    options: ["Hello", "Goodbye", "Thank you", "Please"],
    correctAnswer: 0,
    explanation: "Namaste is a common greeting in Hindi meaning 'Hello' or 'I bow to you'."
  },
  {
    id: 2,
    question: "Which of these is a dialect of Hindi spoken in Rajasthan?",
    options: ["Marwari", "Bengali", "Tamil", "Telugu"],
    correctAnswer: 0,
    explanation: "Marwari is a dialect of Hindi spoken primarily in Rajasthan."
  },
  {
    id: 3,
    question: "What is the Hindi word for 'water'?",
    options: ["Agni", "Jal", "Vayu", "Prithvi"],
    correctAnswer: 1,
    explanation: "Jal (जल) means water in Hindi."
  },
  {
    id: 4,
    question: "Which script is used to write Hindi?",
    options: ["Devanagari", "Arabic", "Latin", "Cyrillic"],
    correctAnswer: 0,
    explanation: "Hindi is written in the Devanagari script."
  },
  {
    id: 5,
    question: "What does 'Dhanyavaad' mean?",
    options: ["Welcome", "Excuse me", "Thank you", "Sorry"],
    correctAnswer: 2,
    explanation: "Dhanyavaad (धन्यवाद) means 'Thank you' in Hindi."
  }
]

interface QuizGameProps {
  onBack?: () => void
}

export function QuizGame({ onBack }: QuizGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [startTime, setStartTime] = useState<number>(Date.now())

  const { user } = useAuth()
  const supabase = createClientComponentClient()

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
    setShowExplanation(true)

    if (answerIndex === demoQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestion < demoQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      setGameCompleted(true)
      setShowResult(true)
    }
  }

  const saveGameRecord = async (finalScore: number, timeTaken: number) => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('game_records')
        .insert({
          user_id: user.id,
          game_type: 'quiz',
          score: finalScore,
          total_questions: demoQuestions.length,
          time_taken: Math.floor(timeTaken / 1000), // Convert to seconds
          difficulty_level: 'medium'
        })

      if (error) {
        console.error('Error saving game record:', error)
        toast.error('Failed to save game record: ' + error.message)
      } else {
        toast.success('Game record saved!')
      }
    } catch (error) {
      console.error('Error saving game record:', error)
      toast.error('Failed to save game record')
    }
  }

  useEffect(() => {
    if (gameCompleted && user) {
      const timeTaken = Date.now() - startTime
      saveGameRecord(score, timeTaken)
    }
  }, [gameCompleted, user, score, startTime, saveGameRecord])

  const handleRestart = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setScore(0)
    setShowResult(false)
    setShowExplanation(false)
    setGameCompleted(false)
    setStartTime(Date.now())
  }

  const getScoreMessage = () => {
    const percentage = (score / demoQuestions.length) * 100
    if (percentage >= 80) return "Excellent! You're a language expert!"
    if (percentage >= 60) return "Good job! Keep practicing!"
    if (percentage >= 40) return "Not bad! Try again to improve!"
    return "Keep learning! Practice makes perfect!"
  }

  if (gameCompleted) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Quiz Completed!</h2>
        <div className="mb-6">
          <div className="text-4xl font-bold text-primary-600 mb-2">
            {score}/{demoQuestions.length}
          </div>
          <p className="text-gray-600">{getScoreMessage()}</p>
        </div>
        <button
          onClick={handleRestart}
          className="flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors mx-auto"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Take Quiz Again</span>
        </button>
      </div>
    )
  }

  const question = demoQuestions[currentQuestion]

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}
            <h2 className="text-xl font-bold text-gray-900">Language Quiz</h2>
          </div>
          <span className="text-sm text-gray-500">
            Question {currentQuestion + 1} of {demoQuestions.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / demoQuestions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {question.question}
        </h3>

        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={selectedAnswer !== null}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                selectedAnswer === null
                  ? 'border-gray-200 hover:border-primary-300 hover:bg-primary-50'
                  : selectedAnswer === index
                  ? index === question.correctAnswer
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                  : index === question.correctAnswer && showExplanation
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">{option}</span>
                {selectedAnswer !== null && (
                  <div>
                    {index === question.correctAnswer ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : selectedAnswer === index ? (
                      <XCircle className="w-5 h-5 text-red-500" />
                    ) : null}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {showExplanation && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800">{question.explanation}</p>
        </div>
      )}

      {selectedAnswer !== null && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Score: {score}/{currentQuestion + 1}
          </div>
          <button
            onClick={handleNextQuestion}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            {currentQuestion < demoQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </button>
        </div>
      )}
    </div>
  )
}
