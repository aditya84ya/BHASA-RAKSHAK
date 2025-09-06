'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'
import { Database } from '@/lib/supabase'
import { ChevronLeft, ChevronRight, RotateCcw, Check, X } from 'lucide-react'
import toast from 'react-hot-toast'

type Flashcard = Database['public']['Tables']['flashcards']['Row']

export function FlashcardsSection() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [loading, setLoading] = useState(true)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [showAnswer, setShowAnswer] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    fetchFlashcards()
  }, [])

  const fetchFlashcards = async () => {
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) {
      console.error('Error fetching flashcards:', error)
    } else {
      setFlashcards(data || [])
    }
    setLoading(false)
  }

  const currentCard = flashcards[currentIndex]

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setIsFlipped(false)
      setShowAnswer(false)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setIsFlipped(false)
      setShowAnswer(false)
    }
  }

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
    setShowAnswer(true)
  }

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(prev => ({ ...prev, correct: prev.correct + 1 }))
      toast.success('Correct!')
    } else {
      toast.error('Incorrect. Try again!')
    }
    setScore(prev => ({ ...prev, total: prev.total + 1 }))
  }

  const resetCards = () => {
    setCurrentIndex(0)
    setIsFlipped(false)
    setShowAnswer(false)
    setScore({ correct: 0, total: 0 })
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

  if (flashcards.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No flashcards available</h3>
        <p className="text-gray-500">Check back later for new learning content!</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Flashcards</h2>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            {currentIndex + 1} of {flashcards.length}
          </span>
          <button
            onClick={resetCards}
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
            <span className="text-sm font-medium text-primary-700">Score</span>
            <span className="text-lg font-bold text-primary-900">
              {score.correct}/{score.total} ({Math.round((score.correct / score.total) * 100)}%)
            </span>
          </div>
        </div>
      )}

      {/* Flashcard */}
      <div className="relative">
        <div
          className={`w-full h-64 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-500 transform ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          onClick={handleFlip}
        >
          <div className="text-center p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {isFlipped ? 'Answer' : 'Question'}
            </h3>
            <p className="text-lg text-gray-700">
              {isFlipped ? currentCard?.back_text : currentCard?.front_text}
            </p>
          </div>
        </div>

        {/* Flip indicator */}
        <div className="absolute top-4 right-4">
          <button
            onClick={handleFlip}
            className="w-8 h-8 bg-white bg-opacity-80 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all"
          >
            <RotateCcw className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Answer buttons */}
      {showAnswer && (
        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={() => handleAnswer(false)}
            className="flex items-center space-x-2 px-6 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            <X className="w-5 h-5" />
            <span>Incorrect</span>
          </button>
          <button
            onClick={() => handleAnswer(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
          >
            <Check className="w-5 h-5" />
            <span>Correct</span>
          </button>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <div className="flex space-x-2">
          {flashcards.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index)
                setIsFlipped(false)
                setShowAnswer(false)
              }}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex
                  ? 'bg-primary-600'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={currentIndex === flashcards.length - 1}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
