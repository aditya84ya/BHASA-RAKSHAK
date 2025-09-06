'use client'

import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Mic, Video, FileText, Image, X, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'
import { useAuth } from '@/app/providers'
import toast from 'react-hot-toast'

const fileTypes = [
  { type: 'audio', icon: Mic, label: 'Audio', accept: { 'audio/*': ['.mp3', '.wav', '.m4a', '.ogg'] } },
  { type: 'video', icon: Video, label: 'Video', accept: { 'video/*': ['.mp4', '.mov', '.avi', '.webm'] } },
  { type: 'text', icon: FileText, label: 'Text', accept: { 'text/*': ['.txt', '.doc', '.docx'] } },
  { type: 'image', icon: Image, label: 'Images', accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.gif'] } },
]

export function UploadSection() {
  const [selectedType, setSelectedType] = useState('audio')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [metadata, setMetadata] = useState({
    title: '',
    description: '',
    dialect: '',
    tags: '',
    privacy: 'public' as 'public' | 'community' | 'research' | 'private'
  })

  // Recording states
  const [isRecordingAudio, setIsRecordingAudio] = useState(false)
  const [isRecordingVideo, setIsRecordingVideo] = useState(false)
  const [audioRecorder, setAudioRecorder] = useState<MediaRecorder | null>(null)
  const [videoRecorder, setVideoRecorder] = useState<MediaRecorder | null>(null)
  const [recordedAudioBlob, setRecordedAudioBlob] = useState<Blob | null>(null)
  const [recordedVideoBlob, setRecordedVideoBlob] = useState<Blob | null>(null)
  const [textStatus, setTextStatus] = useState('')

  const { user } = useAuth()
  const supabase = createClient()

  const onDrop = (acceptedFiles: File[]) => {
    setUploadedFiles(prev => [...prev, ...acceptedFiles])
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: fileTypes.find(ft => ft.type === selectedType)?.accept,
    multiple: true
  })

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  // Audio recording functions
  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const chunks: Blob[] = []

      recorder.ondataavailable = (e) => chunks.push(e.data)
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        setRecordedAudioBlob(blob)
        const file = new File([blob], `recorded-audio-${Date.now()}.webm`, { type: 'audio/webm' })
        setUploadedFiles(prev => [...prev, file])
        stream.getTracks().forEach(track => track.stop())
      }

      setAudioRecorder(recorder)
      recorder.start()
      setIsRecordingAudio(true)
      toast.success('Audio recording started')
    } catch (error) {
      console.error('Error starting audio recording:', error)
      toast.error('Failed to start audio recording. Please check microphone permissions.')
    }
  }

  const stopAudioRecording = () => {
    if (audioRecorder && isRecordingAudio) {
      audioRecorder.stop()
      setIsRecordingAudio(false)
      setAudioRecorder(null)
      toast.success('Audio recording stopped')
    }
  }

  // Video recording functions
  const startVideoRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      const recorder = new MediaRecorder(stream)
      const chunks: Blob[] = []

      recorder.ondataavailable = (e) => chunks.push(e.data)
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' })
        setRecordedVideoBlob(blob)
        const file = new File([blob], `recorded-video-${Date.now()}.webm`, { type: 'video/webm' })
        setUploadedFiles(prev => [...prev, file])
        stream.getTracks().forEach(track => track.stop())
      }

      setVideoRecorder(recorder)
      recorder.start()
      setIsRecordingVideo(true)
      toast.success('Video recording started')
    } catch (error) {
      console.error('Error starting video recording:', error)
      toast.error('Failed to start video recording. Please check camera and microphone permissions.')
    }
  }

  const stopVideoRecording = () => {
    if (videoRecorder && isRecordingVideo) {
      videoRecorder.stop()
      setIsRecordingVideo(false)
      setVideoRecorder(null)
      toast.success('Video recording stopped')
    }
  }

  const handleUpload = async () => {
    if (!user || (uploadedFiles.length === 0 && !textStatus.trim())) return

    setUploading(true)
    setUploadProgress(0)

    try {
      for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i]
        const fileExt = file.name.split('.').pop()
        const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
        
        console.log('Uploading file:', fileName)
        
        // Upload file to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('contributions')
          .upload(fileName, file)

        if (uploadError) {
          console.error('Storage upload error:', uploadError)
          throw new Error(`Storage error: ${uploadError.message}`)
        }

        console.log('File uploaded successfully:', uploadData)

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('contributions')
          .getPublicUrl(fileName)

        console.log('Public URL:', publicUrl)

        // Save contribution to database
        const { data: dbData, error: dbError } = await supabase
          .from('contributions')
          .insert({
            user_id: user.id,
            title: metadata.title || file.name,
            description: metadata.description,
            content_type: selectedType as 'audio' | 'video' | 'text' | 'image',
            file_url: publicUrl,
            file_size: file.size,
            dialect: metadata.dialect,
            tags: metadata.tags.split(',').map(tag => tag.trim()).filter(Boolean),
            privacy_setting: metadata.privacy
          })
          .select()

        if (dbError) {
          console.error('Database error:', dbError)
          throw new Error(`Database error: ${dbError.message}`)
        }

        console.log('Contribution saved:', dbData)
        setUploadProgress(((i + 1) / uploadedFiles.length) * 100)
      }

      toast.success('Files uploaded successfully!')
      setUploadedFiles([])
      setMetadata({
        title: '',
        description: '',
        dialect: '',
        tags: '',
        privacy: 'public'
      })
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(`Failed to upload files: ${error.message}`)
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Content</h2>

      {/* File Type Selection */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Content Type
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {fileTypes.map((fileType) => (
            <button
              key={fileType.type}
              onClick={() => setSelectedType(fileType.type)}
              className={`flex items-center justify-center p-4 rounded-lg border-2 transition-colors ${
                selectedType === fileType.type
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
              }`}
            >
              <fileType.icon className="w-6 h-6 mr-2" />
              <span className="font-medium">{fileType.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recording Options */}
      {(selectedType === 'audio' || selectedType === 'video') && (
        <div className="mb-6">
          <div className="flex items-center justify-center gap-4">
            {selectedType === 'audio' && (
              <button
                onClick={isRecordingAudio ? stopAudioRecording : startAudioRecording}
                className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-colors ${
                  isRecordingAudio
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
              >
                <Mic className="w-5 h-5 mr-2" />
                {isRecordingAudio ? 'Stop Recording' : 'Record Audio'}
              </button>
            )}
            {selectedType === 'video' && (
              <button
                onClick={isRecordingVideo ? stopVideoRecording : startVideoRecording}
                className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-colors ${
                  isRecordingVideo
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
              >
                <Video className="w-5 h-5 mr-2" />
                {isRecordingVideo ? 'Stop Recording' : 'Record Video'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Text Status Input */}
      {selectedType === 'text' && (
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Write Status
          </label>
          <textarea
            value={textStatus}
            onChange={(e) => setTextStatus(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Write your status update here..."
          />
        </div>
      )}

      {/* Drag & Drop Zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-lg font-medium text-gray-700 mb-2">
          {isDragActive ? 'Drop files here' : 'Drag & Drop Files'}
        </p>
        <p className="text-gray-500">Click to upload</p>
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Selected Files</h3>
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">{file.name}</span>
                  <span className="text-gray-500 ml-2">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {uploading && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Uploading:</span>
            <span className="text-sm text-gray-500">{Math.round(uploadProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Metadata Form */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            value={metadata.title}
            onChange={(e) => setMetadata(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter title"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Dialect
          </label>
          <input
            type="text"
            value={metadata.dialect}
            onChange={(e) => setMetadata(prev => ({ ...prev, dialect: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter dialect"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={metadata.description}
            onChange={(e) => setMetadata(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter description"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tags
          </label>
          <input
            type="text"
            value={metadata.tags}
            onChange={(e) => setMetadata(prev => ({ ...prev, tags: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter tags (comma separated)"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Privacy Setting
          </label>
          <select
            value={metadata.privacy}
            onChange={(e) => setMetadata(prev => ({ ...prev, privacy: e.target.value as any }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="public">Public</option>
            <option value="community">Community</option>
            <option value="research">Research</option>
            <option value="private">Private</option>
          </select>
        </div>
      </div>

      {/* Upload Button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleUpload}
          disabled={uploading || (uploadedFiles.length === 0 && !textStatus.trim())}
          className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {uploading ? 'Uploading...' : 'Upload Files'}
        </button>
      </div>
    </div>
  )
}
