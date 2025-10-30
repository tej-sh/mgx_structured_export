import { useState, useCallback, useRef } from 'react';
import { EmotionEngine, EmotionVector, MultiModalEmotionInput, AudioFeatures, FacialFeatures } from '@/lib/emotionEngine';
import { EmpathyPromptGenerator } from '@/lib/empathyPrompts';

export interface EmotionAnalysisState {
  currentEmotion: EmotionVector;
  isAnalyzing: boolean;
  error: string | null;
  conversationHistory: string[];
}

export interface MediaPermissions {
  camera: boolean;
  microphone: boolean;
}

export function useEmotionAnalysis() {
  const [state, setState] = useState<EmotionAnalysisState>({
    currentEmotion: {
      happy: 0,
      sad: 0,
      angry: 0,
      neutral: 1,
      excited: 0,
      worried: 0,
      confidence: 0.5
    },
    isAnalyzing: false,
    error: null,
    conversationHistory: []
  });

  const [mediaPermissions, setMediaPermissions] = useState<MediaPermissions>({
    camera: false,
    microphone: false
  });

  const emotionEngine = useRef(new EmotionEngine());
  const empathyGenerator = useRef(new EmpathyPromptGenerator());
  const mediaStream = useRef<MediaStream | null>(null);
  const audioContext = useRef<AudioContext | null>(null);

  const requestMediaPermissions = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      mediaStream.current = stream;
      setMediaPermissions({ camera: true, microphone: true });
      
      audioContext.current = new AudioContext();
      
      return true;
    } catch (error) {
      console.error('Media permission denied:', error);
      setMediaPermissions({ camera: false, microphone: false });
      setState(prev => ({ ...prev, error: 'Camera and microphone access required for full emotion detection' }));
      return false;
    }
  }, []);

  const analyzeTextEmotion = useCallback((text: string): EmotionVector => {
    return emotionEngine.current.analyzeTextEmotion(text);
  }, []);

  const analyzeVoiceEmotion = useCallback((): EmotionVector | null => {
    if (!mediaStream.current || !audioContext.current) return null;

    const mockAudioFeatures: AudioFeatures = {
      volume: Math.random() * 0.5 + 0.3,
      pitch: Math.random() * 0.6 + 0.2,
      tempo: Math.random() * 0.4 + 0.4,
      energy: Math.random() * 0.6 + 0.2
    };

    return emotionEngine.current.analyzeVoiceEmotion(mockAudioFeatures);
  }, []);

  const analyzeFacialEmotion = useCallback((): EmotionVector | null => {
    if (!mediaStream.current) return null;

    const mockFacialFeatures: FacialFeatures = {
      expressions: {
        joy: Math.random() * 0.3,
        sadness: Math.random() * 0.2,
        anger: Math.random() * 0.1,
        surprise: Math.random() * 0.2,
        fear: Math.random() * 0.1,
        disgust: Math.random() * 0.1
      },
      confidence: Math.random() * 0.4 + 0.6
    };

    return emotionEngine.current.analyzeFacialEmotion(mockFacialFeatures);
  }, []);

  const analyzeEmotion = useCallback(async (text: string): Promise<EmotionVector> => {
    setState(prev => ({ ...prev, isAnalyzing: true, error: null }));

    try {
      const textEmotion = analyzeTextEmotion(text);
      const voiceEmotion = analyzeVoiceEmotion();
      const facialEmotion = analyzeFacialEmotion();

      const fusedEmotion = emotionEngine.current.fuseEmotions({
        text: textEmotion,
        voice: voiceEmotion || undefined,
        facial: facialEmotion || undefined
      });

      setState(prev => ({
        ...prev,
        currentEmotion: fusedEmotion,
        isAnalyzing: false,
        conversationHistory: [...prev.conversationHistory, text].slice(-10)
      }));

      return fusedEmotion;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isAnalyzing: false,
        error: 'Failed to analyze emotion'
      }));
      throw error;
    }
  }, [analyzeTextEmotion, analyzeVoiceEmotion, analyzeFacialEmotion]);

  const generateEmpathyPrompt = useCallback((userMessage: string): string => {
    return empathyGenerator.current.generateContextualPrompt(
      state.currentEmotion,
      userMessage,
      state.conversationHistory
    );
  }, [state.currentEmotion, state.conversationHistory]);

  const getDominantEmotion = useCallback((): string => {
    return emotionEngine.current.getDominantEmotion(state.currentEmotion);
  }, [state.currentEmotion]);

  const cleanup = useCallback(() => {
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach(track => track.stop());
      mediaStream.current = null;
    }
    if (audioContext.current) {
      audioContext.current.close();
      audioContext.current = null;
    }
  }, []);

  return {
    ...state,
    mediaPermissions,
    requestMediaPermissions,
    analyzeEmotion,
    generateEmpathyPrompt,
    getDominantEmotion,
    cleanup
  };
}