 'use client'

import { Database } from '@/lib/supabase'
import { Play, Pause, Volume2, Maximize } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

type Contribution = Database['public']['Tables']['contributions']['Row']

interface ContentPlayerProps {
  contribution: Contribution
}

export function ContentPlayer({ contribution }: ContentPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [showControls, setShowControls] = useState(false)
  const playerRef = useRef<HTMLVideoElement | HTMLAudioElement>(null)

  useEffect(() => {
    const player = playerRef.current
    if (!player) return

    const updateTime = () => setCurrentTime(player.currentTime)
    const updateDuration = () => setDuration(player.duration)
    const handleEnded = () => setIsPlaying(false)

    player.addEventListener('timeupdate', updateTime)
    player.addEventListener('loadedmetadata', updateDuration)
    player.addEventListener('ended', handleEnded)

    return () => {
      player.removeEventListener('timeupdate', updateTime)
      player.removeEventListener('loadedmetadata', updateDuration)
      player.removeEventListener('ended', handleEnded)
    }
  }, [])

  const togglePlay = () => {
    const player = playerRef.current
    if (!player) return

    if (isPlaying) {
      player.pause()
    } else {
      player.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const player = playerRef.current
    if (!player) return

    const time = parseFloat(e.target.value)
    player.currentTime = time
    setCurrentTime(time)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const player = playerRef.current
    if (!player) return

    const newVolume = parseFloat(e.target.value)
    player.volume = newVolume
    setVolume(newVolume)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const renderPlayer = () => {
    if (!contribution.file_url) {
      return (
        <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">No media file available</p>
        </div>
      )
    }

    if (contribution.content_type === 'video') {
      return (
        <video
          ref={playerRef as React.RefObject<HTMLVideoElement>}
          src={contribution.file_url}
          className="w-full h-64 bg-black rounded-lg"
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
        />
      )
    } else if (contribution.content_type === 'audio') {
      return (
        <div className="w-full h-64 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
          <audio
            ref={playerRef as React.RefObject<HTMLAudioElement>}
            src={contribution.file_url}
            className="w-full"
          />
        </div>
      )
    } else if (contribution.content_type === 'image') {
      return (
        <Image
          src={contribution.file_url}
          alt={contribution.title}
          width={640}
          height={256}
          className="w-full h-64 object-cover rounded-lg"
        />
      )
    } else {
      return (
        <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center p-8 relative">
          <div className="text-center">
            <p className="text-gray-700 mb-4">{contribution.transcript || 'No content available'}</p>
            {contribution.transcript && (
              <button
                onClick={() => speakText(contribution.transcript!)}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Text to Speech
              </button>
            )}
          </div>
        </div>
      )
    }
  }

  const speakText = async (text: string) => {
    try {
      const response = await fetch('https://texttospeech.googleapis.com/v1/text:synthesize?key=AIzaSyBiGfrOAZ2uN1vfw-ZX8bqiFE3KKkzmJ_w', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: { text },
          voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
          audioConfig: { audioEncoding: 'MP3' },
        }),
      })

      if (!response.ok) {
        throw new Error('TTS API request failed')
      }

      const data = await response.json()
      const audio = new Audio('data:audio/mp3;base64,' + data.audioContent)
      audio.play()
    } catch (error) {
      console.error('TTS error:', error)
      alert('Text-to-Speech failed. Please try again.')
    }
  }

  const [isRecognizing, setIsRecognizing] = useState(false)
  const [transcript, setTranscript] = useState('')
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const startRecognition = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        const audioBase64 = await blobToBase64(audioBlob)
        await sendToSpeechAPI(audioBase64)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecognizing(true)

      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop()
          setIsRecognizing(false)
        }
      }, 5000) // Record for 5 seconds
    } catch (error) {
      console.error('Error starting recognition:', error)
      alert('Failed to start speech recognition.')
    }
  }

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1]
        resolve(base64)
      }
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }

  const sendToSpeechAPI = async (audioBase64: string) => {
    try {
      const response = await fetch('https://speech.googleapis.com/v1/speech:recognize?key=AIzaSyBiGfrOAZ2uN1vfw-ZX8bqiFE3KKkzmJ_w', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          config: {
            encoding: 'LINEAR16',
            sampleRateHertz: 16000,
            languageCode: 'en-US',
          },
          audio: {
            content: audioBase64,
          },
        }),
      })

      if (!response.ok) {
        throw new Error('STT API request failed')
      }

      const data = await response.json()
      const recognizedText = data.results?.[0]?.alternatives?.[0]?.transcript || 'No speech detected'
      setTranscript(recognizedText)
      alert('Recognized text: ' + recognizedText)
    } catch (error) {
      console.error('STT error:', error)
      alert('Speech-to-Text failed. Please try again.')
    }
  }

  return (
    <div className="relative">
      {renderPlayer()}
      
      {/* Play/Pause Overlay */} 
      {(contribution.content_type === 'video' || contribution.content_type === 'audio') && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={togglePlay}
            className="bg-black bg-opacity-50 text-white rounded-full p-4 hover:bg-opacity-70 transition-all duration-300"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8" />
            ) : (
              <Play className="w-8 h-8 ml-1" />
            )}
          </button>
        </div>
      )}

      {/* Controls */}
      {(contribution.content_type === 'video' || contribution.content_type === 'audio') && (
        <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 rounded-b-lg transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}>
          {/* Progress Bar */}
          <div className="mb-4">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div className="flex space-x-4 mb-2">
            {contribution.content_type === 'audio' && (
              <button
                onClick={startRecognition}
                disabled={isRecognizing}
                className="bg-primary-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                {isRecognizing ? 'Listening...' : 'Speech to Text'}
              </button>
            )}
            {contribution.content_type !== 'audio' && contribution.transcript && (
              <button
                onClick={() => speakText(contribution.transcript!)}
                className="bg-primary-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-primary-700 transition-colors"
              >
                Text to Speech
              </button>
            )}
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-4">
              <button onClick={togglePlay}>
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </button>
              
              <div className="flex items-center space-x-2">
                <Volume2 className="w-4 h-4" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              
              <span className="text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <button>
                <Maximize className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
