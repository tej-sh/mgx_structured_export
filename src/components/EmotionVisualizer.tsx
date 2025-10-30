import React from 'react';
import { EmotionVector } from '@/lib/emotionEngine';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface EmotionVisualizerProps {
  emotion: EmotionVector;
  className?: string;
}

const emotionColors = {
  happy: 'bg-yellow-400 text-yellow-900',
  excited: 'bg-orange-400 text-orange-900',
  sad: 'bg-blue-400 text-blue-900',
  angry: 'bg-red-400 text-red-900',
  worried: 'bg-purple-400 text-purple-900',
  neutral: 'bg-gray-400 text-gray-900'
};

const emotionEmojis = {
  happy: '😊',
  excited: '🤩',
  sad: '😢',
  angry: '😠',
  worried: '😰',
  neutral: '😐'
};

export function EmotionVisualizer({ emotion, className = '' }: EmotionVisualizerProps) {
  // Get dominant emotion
  const emotions = { ...emotion };
  delete emotions.confidence;
  
  const dominantEmotion = Object.entries(emotions).reduce((max, [name, score]) => 
    score > max.score ? { name, score } : max, 
    { name: 'neutral', score: 0 }
  );

  // Get top 3 emotions for display
  const topEmotions = Object.entries(emotions)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .filter(([, score]) => score > 0.1);

  return (
    <Card className={`${className} transition-all duration-300`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-muted-foreground">Emotion Analysis</h3>
          <Badge variant="outline" className="text-xs">
            {(emotion.confidence * 100).toFixed(0)}% confident
          </Badge>
        </div>

        {/* Dominant Emotion Display */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="text-2xl">
            {emotionEmojis[dominantEmotion.name as keyof typeof emotionEmojis]}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium capitalize">
                {dominantEmotion.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {(dominantEmotion.score * 100).toFixed(0)}%
              </span>
            </div>
            <Progress 
              value={dominantEmotion.score * 100} 
              className="h-2 mt-1"
            />
          </div>
        </div>

        {/* Emotion Breakdown */}
        <div className="space-y-2">
          {topEmotions.map(([emotionName, score]) => (
            <div key={emotionName} className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span>{emotionEmojis[emotionName as keyof typeof emotionEmojis]}</span>
                <span className="capitalize">{emotionName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-purple-500"
                    style={{ width: `${score * 100}%` }}
                  />
                </div>
                <span className="text-muted-foreground w-8 text-right">
                  {(score * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Multi-modal indicators */}
        <div className="flex justify-center space-x-4 mt-3 pt-3 border-t">
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Text</span>
          </div>
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span>Voice</span>
          </div>
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            <span>Face</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}