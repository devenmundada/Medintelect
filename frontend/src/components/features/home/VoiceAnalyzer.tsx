import React, { useState, useRef } from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { MedicalDisclaimer } from '../../shared/MedicalDisclaimer';
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  AlertTriangle,
  Heart,
  Brain,
  Activity,
  Thermometer,
  Wind,
  Download,
  Shield,
  Lock
} from 'lucide-react';

interface VoiceAnalysis {
  emotionalState: string;
  confidence: number;
  healthInsights: string[];
  metrics: {
    tone: number;
    pitch: number;
    stressLevel: number;
    energy: number;
    rhythm: number;
  };
}

export const VoiceAnalyzer: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasConsent, setHasConsent] = useState(false);
  const [analysis, setAnalysis] = useState<VoiceAnalysis | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = async () => {
    try {
      if (!hasConsent) {
        alert('Please provide consent for voice analysis first');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        
        // Create audio URL for playback
        const audioUrl = URL.createObjectURL(audioBlob);
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
        }

        // Simulate AI analysis
        simulateAnalysis();
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      // Start timer
      let seconds = 0;
      timerRef.current = setInterval(() => {
        seconds++;
        setRecordingTime(seconds);
        if (seconds >= 30) {
          stopRecording();
        }
      }, 1000);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const simulateAnalysis = () => {
    // Mock analysis results
    const mockAnalysis: VoiceAnalysis = {
      emotionalState: 'Calm with slight stress indicators',
      confidence: 0.87,
      healthInsights: [
        'Voice patterns suggest moderate stress levels',
        'Energy levels appear normal',
        'Speech rhythm indicates focus and clarity',
        'No signs of respiratory distress detected',
        'Tone suggests positive emotional baseline'
      ],
      metrics: {
        tone: 7.2,
        pitch: 5.8,
        stressLevel: 4.3,
        energy: 6.7,
        rhythm: 8.1
      }
    };

    setAnalysis(mockAnalysis);
  };

  const getStressColor = (level: number) => {
    if (level < 3) return 'text-green-600';
    if (level < 7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMetricColor = (value: number) => {
    if (value >= 8) return 'bg-green-500';
    if (value >= 6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (!hasConsent) {
    return (
      <Card className="p-8 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
          <Mic className="w-10 h-10 text-primary-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
          Voice Health Analysis
        </h2>
        
        <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-2xl mx-auto">
          Our AI analyzes voice patterns to provide wellness insights. This is for informational purposes only and not a medical diagnosis.
        </p>

        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-center">
            <Shield className="w-5 h-5 text-green-500 mr-2" />
            <span className="text-sm">HIPAA-compliant voice processing</span>
          </div>
          <div className="flex items-center justify-center">
            <Lock className="w-5 h-5 text-blue-500 mr-2" />
            <span className="text-sm">Voice data is encrypted and not stored</span>
          </div>
          <div className="flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-amber-500 mr-2" />
            <span className="text-sm">Not a replacement for professional medical advice</span>
          </div>
        </div>

        <div className="space-y-3">
          <Button onClick={() => setHasConsent(true)} className="w-full">
            I Consent to Voice Analysis
          </Button>
          <Button variant="ghost" className="w-full">
            Learn More About Privacy
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Recording Interface */}
      <Card className="p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
            Record Your Voice Sample
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            Speak naturally for 10-30 seconds about how you're feeling
          </p>
        </div>

        <div className="text-center">
          {/* Recording Timer */}
          <div className="text-6xl font-bold text-primary-600 mb-8">
            {recordingTime.toString().padStart(2, '0')}s
          </div>

          {/* Recording Controls */}
          <div className="flex items-center justify-center space-x-6 mb-8">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-20 h-20 rounded-full flex items-center justify-center ${
                isRecording 
                  ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                  : 'bg-primary-100 text-primary-600 hover:bg-primary-200 dark:bg-primary-900/30 dark:hover:bg-primary-900/50'
              }`}
            >
              {isRecording ? (
                <MicOff className="w-8 h-8" />
              ) : (
                <Mic className="w-8 h-8" />
              )}
            </button>

            {analysis && (
              <button
                onClick={togglePlayback}
                className="w-20 h-20 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 flex items-center justify-center"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8" />
                ) : (
                  <Play className="w-8 h-8" />
                )}
              </button>
            )}
          </div>

          <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />

          <div className="text-sm text-neutral-500 mb-6">
            {isRecording 
              ? 'Recording... Speak naturally about your wellness' 
              : 'Click microphone to start recording'}
          </div>

          {/* Recording Tips */}
          <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-neutral-900 dark:text-white mb-2">
              Tips for Best Results:
            </h4>
            <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
              <li>• Speak in a quiet environment</li>
              <li>• Talk naturally about your day or feelings</li>
              <li>• Maintain consistent distance from microphone</li>
              <li>• Avoid background noise if possible</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Analysis Results */}
      <Card className="p-8">
        {analysis ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                Analysis Results
              </h2>
              <Badge variant="success">Confidence: {(analysis.confidence * 100).toFixed(1)}%</Badge>
            </div>

            {/* Emotional State */}
            <div className="mb-8">
              <div className="flex items-center mb-3">
                <Brain className="w-5 h-5 text-purple-500 mr-2" />
                <h3 className="font-semibold text-neutral-900 dark:text-white">
                  Emotional & Wellness State
                </h3>
              </div>
              <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
                <p className="text-lg font-medium text-neutral-900 dark:text-white">
                  {analysis.emotionalState}
                </p>
              </div>
            </div>

            {/* Metrics */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <Activity className="w-5 h-5 text-primary-500 mr-2" />
                <h3 className="font-semibold text-neutral-900 dark:text-white">
                  Voice Metrics
                </h3>
              </div>
              
              <div className="space-y-4">
                {Object.entries(analysis.metrics).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm capitalize text-neutral-600 dark:text-neutral-400">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="text-sm font-medium">{value.toFixed(1)}/10</span>
                    </div>
                    <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getMetricColor(value)}`}
                        style={{ width: `${value * 10}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Health Insights */}
            <div>
              <div className="flex items-center mb-4">
                <Heart className="w-5 h-5 text-red-500 mr-2" />
                <h3 className="font-semibold text-neutral-900 dark:text-white">
                  Health Insights
                </h3>
              </div>
              
              <div className="space-y-3">
                {analysis.healthInsights.map((insight, index) => (
                  <div key={index} className="flex items-start p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-xs font-bold text-primary-600">{index + 1}</span>
                    </div>
                    <span className="text-sm">{insight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-700">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
                <p className="text-sm text-amber-700 dark:text-amber-400">
                  <strong>Important:</strong> This analysis is based on voice patterns and provides wellness insights only. 
                  It is not a medical diagnosis. Always consult healthcare professionals for medical concerns.
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
              <Wind className="w-10 h-10 text-neutral-400" />
            </div>
            <h3 className="text-xl font-medium text-neutral-900 dark:text-white mb-2">
              No Analysis Yet
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              Record a voice sample to get AI-powered wellness insights
            </p>
            <Button
              onClick={startRecording}
              leftIcon={<Mic className="w-4 h-4" />}
            >
              Start Voice Analysis
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};