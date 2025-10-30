// Core emotion detection and fusion engine
export interface EmotionVector {
  happy: number;
  sad: number;
  angry: number;
  neutral: number;
  excited: number;
  worried: number;
  confidence: number;
}

export interface MultiModalEmotionInput {
  text?: string;
  audioFeatures?: AudioFeatures;
  facialFeatures?: FacialFeatures;
}

export interface AudioFeatures {
  volume: number;
  pitch: number;
  tempo: number;
  energy: number;
}

export interface FacialFeatures {
  expressions: {
    joy: number;
    sadness: number;
    anger: number;
    surprise: number;
    fear: number;
    disgust: number;
  };
  confidence: number;
}

export class EmotionEngine {
  // Text-based emotion detection using sentiment analysis
  analyzeTextEmotion(text: string): EmotionVector {
    if (!text.trim()) {
      return this.createNeutralEmotion();
    }

    const lowerText = text.toLowerCase();
    
    // Simple lexicon-based approach for MVP
    const emotionKeywords = {
      happy: ['happy', 'joy', 'excited', 'great', 'awesome', 'wonderful', 'love', 'amazing', 'fantastic', 'good', 'smile', 'laugh'],
      sad: ['sad', 'depressed', 'down', 'upset', 'crying', 'hurt', 'lonely', 'disappointed', 'terrible', 'awful', 'bad'],
      angry: ['angry', 'mad', 'furious', 'annoyed', 'frustrated', 'hate', 'disgusted', 'irritated', 'rage'],
      worried: ['worried', 'anxious', 'nervous', 'scared', 'afraid', 'concerned', 'stress', 'panic', 'fear'],
      excited: ['excited', 'thrilled', 'energetic', 'pumped', 'enthusiastic', 'eager', 'ready']
    };

    const scores = {
      happy: 0,
      sad: 0,
      angry: 0,
      worried: 0,
      excited: 0,
      neutral: 0.5
    };

    // Count emotion keywords
    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      const matches = keywords.filter(keyword => lowerText.includes(keyword)).length;
      scores[emotion as keyof typeof scores] = Math.min(matches * 0.3, 1.0);
    }

    // Normalize scores
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    if (totalScore > 0) {
      Object.keys(scores).forEach(key => {
        scores[key as keyof typeof scores] = scores[key as keyof typeof scores] / totalScore;
      });
    }

    return {
      ...scores,
      confidence: Math.min(totalScore, 1.0)
    };
  }

  // Voice emotion analysis (simplified for web deployment)
  analyzeVoiceEmotion(audioFeatures: AudioFeatures): EmotionVector {
    const { volume, pitch, tempo, energy } = audioFeatures;
    
    // Simple heuristic-based voice emotion detection
    const emotions = {
      happy: Math.max(0, (energy * 0.4 + tempo * 0.3 + (pitch > 0.6 ? 0.3 : 0))),
      excited: Math.max(0, (energy * 0.5 + tempo * 0.4 + volume * 0.1)),
      angry: Math.max(0, (volume * 0.4 + energy * 0.3 + (pitch > 0.7 ? 0.3 : 0))),
      sad: Math.max(0, (1 - energy) * 0.4 + (1 - tempo) * 0.3 + (pitch < 0.4 ? 0.3 : 0)),
      worried: Math.max(0, (pitch > 0.8 ? 0.4 : 0) + (tempo > 0.7 ? 0.3 : 0) + (1 - energy) * 0.3),
      neutral: 0.2
    };

    const confidence = Math.min((volume + energy + Math.abs(pitch - 0.5) * 2) / 3, 1.0);

    return { ...emotions, confidence };
  }

  // Facial emotion analysis (simplified computer vision)
  analyzeFacialEmotion(facialFeatures: FacialFeatures): EmotionVector {
    const { expressions } = facialFeatures;
    
    // Map facial expressions to our emotion categories
    const emotions = {
      happy: expressions.joy,
      sad: expressions.sadness,
      angry: expressions.anger,
      excited: Math.max(expressions.surprise, expressions.joy * 0.7),
      worried: Math.max(expressions.fear, expressions.surprise * 0.6),
      neutral: 1 - Math.max(...Object.values(expressions))
    };

    return {
      ...emotions,
      confidence: facialFeatures.confidence
    };
  }

  // Multi-modal emotion fusion using weighted combination
  fuseEmotions(inputs: {
    text?: EmotionVector;
    voice?: EmotionVector;
    facial?: EmotionVector;
  }): EmotionVector {
    const availableInputs = Object.values(inputs).filter(Boolean);
    
    if (availableInputs.length === 0) {
      return this.createNeutralEmotion();
    }

    // Dynamic weighting based on confidence scores
    const weights = {
      text: inputs.text?.confidence || 0,
      voice: inputs.voice?.confidence || 0,
      facial: inputs.facial?.confidence || 0
    };

    const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
    
    if (totalWeight === 0) {
      return this.createNeutralEmotion();
    }

    // Normalize weights
    Object.keys(weights).forEach(key => {
      weights[key as keyof typeof weights] = weights[key as keyof typeof weights] / totalWeight;
    });

    // Weighted fusion
    const fusedEmotion: EmotionVector = {
      happy: 0,
      sad: 0,
      angry: 0,
      neutral: 0,
      excited: 0,
      worried: 0,
      confidence: 0
    };

    if (inputs.text) {
      Object.keys(fusedEmotion).forEach(emotion => {
        fusedEmotion[emotion as keyof EmotionVector] += 
          (inputs.text![emotion as keyof EmotionVector] || 0) * weights.text;
      });
    }

    if (inputs.voice) {
      Object.keys(fusedEmotion).forEach(emotion => {
        fusedEmotion[emotion as keyof EmotionVector] += 
          (inputs.voice![emotion as keyof EmotionVector] || 0) * weights.voice;
      });
    }

    if (inputs.facial) {
      Object.keys(fusedEmotion).forEach(emotion => {
        fusedEmotion[emotion as keyof EmotionVector] += 
          (inputs.facial![emotion as keyof EmotionVector] || 0) * weights.facial;
      });
    }

    fusedEmotion.confidence = totalWeight / Object.keys(weights).length;

    return fusedEmotion;
  }

  // Get dominant emotion from vector
  getDominantEmotion(emotionVector: EmotionVector): string {
    const emotions = { ...emotionVector };
    delete emotions.confidence;
    
    return Object.entries(emotions).reduce((max, [emotion, score]) => 
      score > max.score ? { emotion, score } : max, 
      { emotion: 'neutral', score: 0 }
    ).emotion;
  }

  private createNeutralEmotion(): EmotionVector {
    return {
      happy: 0,
      sad: 0,
      angry: 0,
      neutral: 1,
      excited: 0,
      worried: 0,
      confidence: 0.5
    };
  }
}