// Empathy prompt templates and response conditioning based on research
import { EmotionVector } from './emotionEngine';

export interface EmpathyPrompt {
  systemPrompt: string;
  emotionContext: string;
  responseGuidelines: string;
}

export class EmpathyPromptGenerator {
  // Generate empathetic response prompts based on detected emotion
  generatePrompt(emotionVector: EmotionVector, conversationHistory: string[], userMessage: string): EmpathyPrompt {
    const dominantEmotion = this.getDominantEmotion(emotionVector);
    const emotionIntensity = this.getEmotionIntensity(emotionVector, dominantEmotion);
    
    const systemPrompt = this.getSystemPrompt();
    const emotionContext = this.getEmotionContext(dominantEmotion, emotionIntensity, emotionVector);
    const responseGuidelines = this.getResponseGuidelines(dominantEmotion, emotionIntensity);

    return {
      systemPrompt,
      emotionContext,
      responseGuidelines
    };
  }

  private getSystemPrompt(): string {
    return `You are an empathetic AI assistant designed to provide emotional support and understanding. Your responses should:
- Show genuine care and concern for the user's emotional state
- Acknowledge and validate their feelings
- Provide supportive and helpful responses
- Maintain appropriate boundaries while being warm and caring
- Use natural, conversational language
- Be concise but meaningful
- Never dismiss or minimize their emotions
- Offer gentle guidance when appropriate`;
  }

  private getEmotionContext(emotion: string, intensity: number, emotionVector: EmotionVector): string {
    const intensityLevel = intensity > 0.7 ? 'high' : intensity > 0.4 ? 'moderate' : 'low';
    
    const contexts = {
      happy: {
        high: `The user is expressing strong happiness and joy (confidence: ${emotionVector.confidence.toFixed(2)}). Share in their positive emotions and encourage this uplifting moment.`,
        moderate: `The user seems pleased and content. Acknowledge their positive feelings and maintain the upbeat tone.`,
        low: `The user shows subtle signs of happiness. Gently reflect their positive mood.`
      },
      sad: {
        high: `The user is experiencing significant sadness or distress (confidence: ${emotionVector.confidence.toFixed(2)}). Provide compassionate support and validation of their difficult emotions.`,
        moderate: `The user appears to be feeling down or upset. Offer gentle comfort and understanding.`,
        low: `The user may be feeling slightly sad or disappointed. Show empathy and care.`
      },
      angry: {
        high: `The user is expressing strong anger or frustration (confidence: ${emotionVector.confidence.toFixed(2)}). Acknowledge their feelings without escalating, and help them process these emotions.`,
        moderate: `The user seems frustrated or annoyed. Validate their feelings and offer perspective.`,
        low: `The user shows mild irritation. Acknowledge their concerns calmly.`
      },
      worried: {
        high: `The user is experiencing significant anxiety or worry (confidence: ${emotionVector.confidence.toFixed(2)}). Provide reassurance and help them feel more secure.`,
        moderate: `The user appears anxious or concerned. Offer comfort and support.`,
        low: `The user seems slightly worried. Provide gentle reassurance.`
      },
      excited: {
        high: `The user is very excited and energetic (confidence: ${emotionVector.confidence.toFixed(2)}). Match their enthusiasm while keeping them grounded.`,
        moderate: `The user is showing excitement and energy. Share in their positive energy.`,
        low: `The user seems mildly excited. Encourage their positive feelings.`
      },
      neutral: {
        high: `The user appears emotionally balanced. Maintain a warm, supportive tone.`,
        moderate: `The user seems calm and neutral. Be friendly and approachable.`,
        low: `The user's emotional state is unclear. Be gentle and inviting.`
      }
    };

    return contexts[emotion as keyof typeof contexts]?.[intensityLevel] || contexts.neutral.moderate;
  }

  private getResponseGuidelines(emotion: string, intensity: number): string {
    const guidelines = {
      happy: `- Celebrate with them and share their joy
- Ask about what's making them happy
- Encourage them to savor the positive moment
- Use upbeat, warm language`,
      
      sad: `- Validate their feelings with phrases like "That sounds really difficult" or "I can understand why you'd feel that way"
- Avoid trying to immediately "fix" their sadness
- Offer comfort and presence
- Ask if they'd like to talk more about what's bothering them
- Use gentle, caring language`,
      
      angry: `- Acknowledge their frustration without judgment
- Help them feel heard and understood
- Avoid escalating language
- Offer perspective when appropriate
- Use calm, steady language`,
      
      worried: `- Provide reassurance and comfort
- Help them break down their concerns
- Offer practical support when possible
- Use soothing, confident language
- Remind them they're not alone`,
      
      excited: `- Share in their enthusiasm
- Ask questions to learn more about their excitement
- Help them channel their energy positively
- Use energetic but balanced language`,
      
      neutral: `- Be warm and inviting
- Ask open-ended questions to understand their needs
- Maintain a supportive, friendly tone
- Be ready to adapt to their emotional state`
    };

    return guidelines[emotion as keyof typeof guidelines] || guidelines.neutral;
  }

  // Generate contextual response based on emotion and conversation history
  generateContextualPrompt(emotionVector: EmotionVector, userMessage: string, conversationHistory: string[] = []): string {
    const empathyPrompt = this.generatePrompt(emotionVector, conversationHistory, userMessage);
    
    const contextHistory = conversationHistory.length > 0 
      ? `\n\nConversation context: ${conversationHistory.slice(-3).join(' ')}`
      : '';

    return `${empathyPrompt.systemPrompt}

${empathyPrompt.emotionContext}

${empathyPrompt.responseGuidelines}

User's current message: "${userMessage}"${contextHistory}

Respond with empathy and care, keeping your response concise but meaningful (1-3 sentences). Focus on emotional support and understanding.`;
  }

  private getDominantEmotion(emotionVector: EmotionVector): string {
    const emotions = { ...emotionVector };
    delete emotions.confidence;
    
    return Object.entries(emotions).reduce((max, [emotion, score]) => 
      score > max.score ? { emotion, score } : max, 
      { emotion: 'neutral', score: 0 }
    ).emotion;
  }

  private getEmotionIntensity(emotionVector: EmotionVector, dominantEmotion: string): number {
    return emotionVector[dominantEmotion as keyof EmotionVector] || 0;
  }
}