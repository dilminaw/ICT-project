// File: src/pages/EmotionScanPage.jsx
import { useState, useRef, useEffect } from "react";
import { Bot, Mic, Camera, Upload, X, Play, Pause, Square } from "lucide-react";
import apiService from "../services/api.js";

export default function EmotionScanPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('face');
  const [userInput, setUserInput] = useState({
    notes: '',
    additionalComment: '',
    tag: '',
    moodRating: 5
  });

  // Camera and media refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);

  // Media states
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [recordedVideo, setRecordedVideo] = useState(null);

  // Start camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user'
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraOn(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Unable to access camera. Please check permissions.');
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
  };

  // Capture image from camera
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      
      canvas.toBlob((blob) => {
        setCapturedImage(blob);
      }, 'image/jpeg', 0.8);
    }
  };

  // Start audio recording
  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setRecordedAudio(blob);
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Unable to access microphone. Please check permissions.');
    }
  };

  // Stop audio recording
  const stopAudioRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  // Handle file upload
  const handleFileUpload = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      switch (type) {
        case 'face':
          setCapturedImage(file);
          break;
        case 'voice':
          setRecordedAudio(file);
          break;
        case 'body':
          setRecordedVideo(file);
          break;
      }
    }
  };

  // Analyze emotions
  const analyzeEmotions = async () => {
    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const formData = new FormData();
      formData.append('sessionId', `session_${Date.now()}`);
      formData.append('deviceInfo', JSON.stringify({
        type: 'webcam',
        browser: navigator.userAgent,
        os: navigator.platform,
        screenResolution: `${screen.width}x${screen.height}`
      }));
      formData.append('userInput', JSON.stringify(userInput));

      // Add captured media
      if (capturedImage) {
        formData.append('faceImage', capturedImage);
      }
      if (recordedAudio) {
        formData.append('voiceAudio', recordedAudio);
      }
      if (recordedVideo) {
        formData.append('bodyVideo', recordedVideo);
      }

      const response = await apiService.analyzeEmotion(formData);
      setAnalysisResult(response.data);
    } catch (err) {
      setError(err.message || 'Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
      stopAudioRecording();
    };
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-8">
      <h1 className="text-4xl font-bold text-center text-black mb-2 animate-fade-in">
        Check Your Mood
      </h1>
      <p className="text-center text-gray-600 mb-8">Your data is private and recorded</p>

      {/* Analysis Tabs */}
      <div className="flex flex-wrap justify-center gap-6 mb-8 animate-slide-up">
        <button
          onClick={() => setActiveTab('face')}
          className={`p-6 rounded-lg shadow-lg transition duration-300 transform hover:scale-105 flex flex-col items-center gap-3 ${
            activeTab === 'face' 
              ? 'bg-purple-200 text-purple-800' 
              : 'bg-purple-100 hover:bg-purple-200 text-black'
          }`}
        >
          <Camera className="w-8 h-8 animate-pulse" />
          <span className="font-semibold">Face</span>
        </button>
        
        <button
          onClick={() => setActiveTab('voice')}
          className={`p-6 rounded-lg shadow-lg transition duration-300 transform hover:scale-105 flex flex-col items-center gap-3 ${
            activeTab === 'voice' 
              ? 'bg-purple-200 text-purple-800' 
              : 'bg-purple-100 hover:bg-purple-200 text-black'
          }`}
        >
          <Mic className="w-8 h-8 animate-pulse" />
          <span className="font-semibold">Voice</span>
        </button>
        
        <button
          onClick={() => setActiveTab('body')}
          className={`p-6 rounded-lg shadow-lg transition duration-300 transform hover:scale-105 flex flex-col items-center gap-3 ${
            activeTab === 'body' 
              ? 'bg-purple-200 text-purple-800' 
              : 'bg-purple-100 hover:bg-purple-200 text-black'
          }`}
        >
          <Bot className="w-8 h-8 animate-pulse" />
          <span className="font-semibold">Body</span>
        </button>
      </div>

      {/* Media Capture Section */}
      <div className="w-full max-w-2xl mb-8">
        {activeTab === 'face' && (
          <div className="space-y-4">
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full rounded-lg ${!isCameraOn ? 'hidden' : ''}`}
              />
              <canvas ref={canvasRef} className="hidden" />
              
              {!isCameraOn && (
                <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Camera not active</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex gap-4 justify-center">
              {!isCameraOn ? (
                <button
                  onClick={startCamera}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                  Start Camera
                </button>
              ) : (
                <>
                  <button
                    onClick={captureImage}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    Capture Image
                  </button>
                  <button
                    onClick={stopCamera}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Stop Camera
                  </button>
                </>
              )}
              
              <label className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer">
                <Upload className="w-4 h-4 inline mr-2" />
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'face')}
                  className="hidden"
                />
              </label>
            </div>
            
            {capturedImage && (
              <div className="text-center">
                <p className="text-green-600 mb-2">✓ Image captured</p>
                <button
                  onClick={() => setCapturedImage(null)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="w-4 h-4 inline mr-1" />
                  Remove
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'voice' && (
          <div className="space-y-4">
            <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Mic className={`w-16 h-16 mx-auto mb-4 ${isRecording ? 'text-red-500 animate-pulse' : 'text-gray-400'}`} />
                <p className="text-gray-600">
                  {isRecording ? 'Recording...' : 'Voice recording'}
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 justify-center">
              {!isRecording ? (
                <button
                  onClick={startAudioRecording}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                  <Play className="w-4 h-4 inline mr-2" />
                  Start Recording
                </button>
              ) : (
                <button
                  onClick={stopAudioRecording}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  <Square className="w-4 h-4 inline mr-2" />
                  Stop Recording
                </button>
              )}
              
              <label className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer">
                <Upload className="w-4 h-4 inline mr-2" />
                Upload Audio
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => handleFileUpload(e, 'voice')}
                  className="hidden"
                />
              </label>
            </div>
            
            {recordedAudio && (
              <div className="text-center">
                <p className="text-green-600 mb-2">✓ Audio recorded</p>
                <button
                  onClick={() => setRecordedAudio(null)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="w-4 h-4 inline mr-1" />
                  Remove
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'body' && (
          <div className="space-y-4">
            <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Body language analysis</p>
              </div>
            </div>
            
            <div className="flex gap-4 justify-center">
              <label className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer">
                <Upload className="w-4 h-4 inline mr-2" />
                Upload Video
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleFileUpload(e, 'body')}
                  className="hidden"
                />
              </label>
            </div>
            
            {recordedVideo && (
              <div className="text-center">
                <p className="text-green-600 mb-2">✓ Video uploaded</p>
                <button
                  onClick={() => setRecordedVideo(null)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="w-4 h-4 inline mr-1" />
                  Remove
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* User Input Section */}
      <div className="w-full max-w-md space-y-4 mb-8 animate-fade-in">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mood Rating (1-10)
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={userInput.moodRating}
            onChange={(e) => setUserInput({...userInput, moodRating: parseInt(e.target.value)})}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1 (Very Low)</span>
            <span>{userInput.moodRating}</span>
            <span>10 (Very High)</span>
          </div>
        </div>
        
        <input
          type="text"
          placeholder="Enter a note..."
          value={userInput.notes}
          onChange={(e) => setUserInput({...userInput, notes: e.target.value})}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 hover:border-purple-400 transition"
        />
        
        <input
          type="text"
          placeholder="Additional comment..."
          value={userInput.additionalComment}
          onChange={(e) => setUserInput({...userInput, additionalComment: e.target.value})}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 hover:border-purple-400 transition"
        />
        
        <input
          type="text"
          placeholder="Optional tag..."
          value={userInput.tag}
          onChange={(e) => setUserInput({...userInput, tag: e.target.value})}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 hover:border-purple-400 transition"
        />
      </div>

      {/* Analysis Button */}
      <button
        onClick={analyzeEmotions}
        disabled={isAnalyzing}
        className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed mb-8"
      >
        {isAnalyzing ? 'Analyzing...' : 'Analyze Emotions'}
      </button>

      {/* Loading Animation */}
      {isAnalyzing && (
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-dashed border-purple-400 rounded-full animate-spin-slow mx-auto"></div>
          <p className="text-sm text-gray-400 mt-4 animate-fade-in">Analyzing with AI in real-time...</p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="w-full max-w-md bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Analysis Results */}
      {analysisResult && (
        <div className="w-full max-w-2xl bg-green-50 border border-green-200 rounded-lg p-6 animate-fade-in">
          <h3 className="text-xl font-semibold text-green-800 mb-4">Analysis Complete!</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-green-700 mb-2">Overall Assessment</h4>
              <p className="text-green-600">
                Mood: <span className="font-semibold capitalize">{analysisResult.analysis.overall.overallMood}</span>
              </p>
              <p className="text-green-600">
                Score: <span className="font-semibold">{analysisResult.analysis.overall.moodScore}/100</span>
              </p>
              <p className="text-green-600">
                Risk Level: <span className="font-semibold capitalize">{analysisResult.analysis.overall.riskLevel}</span>
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-green-700 mb-2">Recommendations</h4>
              <ul className="text-sm text-green-600">
                {analysisResult.analysis.overall.recommendations.map((rec, index) => (
                  <li key={index} className="mb-1">• {rec.replace(/_/g, ' ')}</li>
                ))}
              </ul>
            </div>
          </div>
          
          {analysisResult.analysis.overall.insights && (
            <div className="mt-4">
              <h4 className="font-medium text-green-700 mb-2">Insights</h4>
              <p className="text-green-600 text-sm">{analysisResult.analysis.overall.insights}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
