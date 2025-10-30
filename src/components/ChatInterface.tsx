import React, { useState, useRef, useEffect } from 'react';

import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';

import { Card, CardContent } from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';

import { Mic, MicOff, Video, VideoOff, Send, Bot, User } from 'lucide-react';

import { useEmotionAnalysis } from '@/hooks/useEmotionAnalysis';

import { EmotionVisualizer } from './EmotionVisualizer';



interface Message {

  id: string;

  content: string;

  sender: 'user' | 'ai';

  timestamp: Date;

  emotion?: string;

}



interface ChatInterfaceProps {

  className?: string;

}



export function ChatInterface({ className = '' }: ChatInterfaceProps) {

  const [messages, setMessages] = useState<Message[]>([

    {

      id: '1',

      content: "Hello! I'm here to listen and support you. How are you feeling today?",

      sender: 'ai',

      timestamp: new Date()

    }

  ]);

  const [inputValue, setInputValue] = useState('');

  const [isTyping, setIsTyping] = useState(false);

  const [mediaEnabled, setMediaEnabled] = useState({ camera: false, microphone: false });



  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {

    currentEmotion,

    isAnalyzing,

    error,

    mediaPermissions,

    requestMediaPermissions,

    analyzeEmotion,

    generateEmpathyPrompt,

    getDominantEmotion

  } = useEmotionAnalysis();



  const scrollToBottom = () => {

    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  };



  useEffect(() => {

    scrollToBottom();

  }, [messages]);



  // Generate AI response using empathy prompts

  const generateAIResponse = async (userMessage: string, emotionPrompt: string): Promise<string> => {

    // Simulate API call to LLM with empathy prompt

    // In production, this would call OpenAI, Claude, or similar API

    const responses = {

      happy: [

        "That's wonderful to hear! Your happiness is really coming through. What's been bringing you such joy?",

        "I can feel the positive energy in your message! It's great to see you in such good spirits.",

        "Your enthusiasm is contagious! I'm so glad you're feeling happy right now."

      ],

      sad: [

        "I can hear that you're going through a difficult time. That sounds really hard, and I want you to know that your feelings are completely valid.",

        "I'm sorry you're feeling this way. It takes courage to share when you're struggling. I'm here to listen.",

        "Thank you for trusting me with how you're feeling. Sadness can be overwhelming, but you don't have to face it alone."

      ],

      angry: [

        "I can sense your frustration, and that's completely understandable. Sometimes things just don't go the way we hope they will.",

        "It sounds like something has really upset you. Your anger is valid - would you like to talk more about what's bothering you?",

        "I hear the frustration in your words. It's okay to feel angry when things aren't fair or don't make sense."

      ],

      worried: [

        "I can tell you're feeling anxious about this. Worry can be really overwhelming, but you're not alone in this.",

        "It sounds like you have a lot on your mind. Sometimes talking through our worries can help make them feel more manageable.",

        "I understand that you're feeling concerned. It's natural to worry, and I'm here to help you work through these feelings."

      ],

      excited: [

        "Your excitement is absolutely infectious! I love hearing about things that bring you such energy and joy.",

        "Wow, I can really feel your enthusiasm! It's amazing when something gets us this excited.",

        "Your energy is wonderful! Tell me more about what's got you feeling so pumped up."

      ],

      neutral: [

        "I'm here and listening. Sometimes it helps just to have someone to talk to, even when we're not sure exactly how we're feeling.",

        "Thank you for sharing with me. I'm here to support you in whatever way feels helpful right now.",

        "I appreciate you taking the time to connect. How can I best support you today?"

      ]

    };



    const dominantEmotion = getDominantEmotion();

    const emotionResponses = responses[dominantEmotion as keyof typeof responses] || responses.neutral;

    

    // Simulate processing delay

    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    

    return emotionResponses[Math.floor(Math.random() * emotionResponses.length)];

  };



  const handleSendMessage = async () => {

    if (!inputValue.trim()) return;



    const userMessage: Message = {

      id: Date.now().toString(),

      content: inputValue.trim(),

      sender: 'user',

      timestamp: new Date()

    };



    setMessages(prev => [...prev, userMessage]);

    setInputValue('');

    setIsTyping(true);



    try {

      // Analyze emotion from user message

      const emotion = await analyzeEmotion(userMessage.content);

      const dominantEmotion = getDominantEmotion();

      

      // Generate empathy prompt

      const empathyPrompt = generateEmpathyPrompt(userMessage.content);

      

      // Generate AI response

      const aiResponse = await generateAIResponse(userMessage.content, empathyPrompt);

      

      const aiMessage: Message = {

        id: (Date.now() + 1).toString(),

        content: aiResponse,

        sender: 'ai',

        timestamp: new Date(),

        emotion: dominantEmotion

      };



      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {

      console.error('Error generating response:', error);

      const errorMessage: Message = {

        id: (Date.now() + 1).toString(),

        content: "I'm sorry, I'm having trouble responding right now. Please try again.",

        sender: 'ai',

        timestamp: new Date()

      };

      setMessages(prev => [...prev, errorMessage]);

    } finally {

      setIsTyping(false);

    }

  };



  const handleKeyPress = (e: React.KeyboardEvent) => {

    if (e.key === 'Enter' && !e.shiftKey) {

      e.preventDefault();

      handleSendMessage();

    }

  };



  const toggleCamera = async () => {

    if (!mediaPermissions.camera) {

      const granted = await requestMediaPermissions();

      if (granted) {

        setMediaEnabled(prev => ({ ...prev, camera: true }));

      }

    } else {

      setMediaEnabled(prev => ({ ...prev, camera: !prev.camera }));

    }

  };



  const toggleMicrophone = async () => {

    if (!mediaPermissions.microphone) {

      const granted = await requestMediaPermissions();

      if (granted) {

        setMediaEnabled(prev => ({ ...prev, microphone: true }));

      }

    } else {

      setMediaEnabled(prev => ({ ...prev, microphone: !prev.microphone }));

    }

  };



  const getEmotionColor = (emotion?: string) => {

    const colors = {

      happy: 'border-l-yellow-400 bg-yellow-50',

      excited: 'border-l-orange-400 bg-orange-50',

      sad: 'border-l-blue-400 bg-blue-50',

      angry: 'border-l-red-400 bg-red-50',

      worried: 'border-l-purple-400 bg-purple-50',

      neutral: 'border-l-gray-400 bg-gray-50'

    };

    return colors[emotion as keyof typeof colors] || '';

  };



  return (

    <div className={`flex flex-col h-full ${className}`}>

      {/* Header */}

      <div className="flex items-center justify-between p-4 border-b bg-white">

        <div className="flex items-center space-x-3">

          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">

            <Bot className="w-6 h-6 text-white" />

          </div>

          <div>

            <h2 className="font-semibold">EmotionAI Assistant</h2>

            <p className="text-sm text-muted-foreground">Empathetic AI Support</p>

          </div>

        </div>

        

        {/* Media Controls */}

        <div className="flex items-center space-x-2">

          <Button

            variant={mediaEnabled.camera ? "default" : "outline"}

            size="sm"

            onClick={toggleCamera}

            className="p-2"

          >

            {mediaEnabled.camera ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}

          </Button>

          <Button

            variant={mediaEnabled.microphone ? "default" : "outline"}

            size="sm"

            onClick={toggleMicrophone}

            className="p-2"

          >

            {mediaEnabled.microphone ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}

          </Button>

        </div>

      </div>



      {/* Main Chat Area */}

      <div className="flex flex-1 overflow-hidden">

        {/* Messages */}

        <div className="flex-1 flex flex-col">

          <div className="flex-1 overflow-y-auto p-4 space-y-4">

            {messages.map((message) => (

              <div

                key={message.id}

                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}

              >

                <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${message.sender === 'user' ? 'order-2' : ''}`}>

                  <Card className={`${getEmotionColor(message.emotion)} border-l-4`}>

                    <CardContent className="p-3">

                      <div className="flex items-start space-x-2">

                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${

                          message.sender === 'user' 

                            ? 'bg-blue-500 text-white' 

                            : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'

                        }`}>

                          {message.sender === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}

                        </div>

                        <div className="flex-1">

                          <p className="text-sm">{message.content}</p>

                          <div className="flex items-center justify-between mt-1">

                            <span className="text-xs text-muted-foreground">

                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}

                            </span>

                            {message.emotion && (

                              <Badge variant="secondary" className="text-xs">

                                {message.emotion}

                              </Badge>

                            )}

                          </div>

                        </div>

                      </div>

                    </CardContent>

                  </Card>

                </div>

              </div>

            ))}

            

            {/* Typing Indicator */}

            {isTyping && (

              <div className="flex justify-start">

                <Card className="border-l-4 border-l-gray-400">

                  <CardContent className="p-3">

                    <div className="flex items-center space-x-2">

                      <Bot className="w-4 h-4 text-muted-foreground" />

                      <div className="flex space-x-1">

                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>

                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>

                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>

                      </div>

                    </div>

                  </CardContent>

                </Card>

              </div>

            )}

            

            <div ref={messagesEndRef} />

          </div>



          {/* Input Area */}

          <div className="p-4 border-t bg-white">

            {error && (

              <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">

                {error}

              </div>

            )}

            

            <div className="flex items-center space-x-2">

              <Input

                value={inputValue}

                onChange={(e) => setInputValue(e.target.value)}

                onKeyPress={handleKeyPress}

                placeholder="Share how you're feeling..."

                className="flex-1"

                disabled={isAnalyzing || isTyping}

              />

              <Button 

                onClick={handleSendMessage} 

                disabled={!inputValue.trim() || isAnalyzing || isTyping}

                size="sm"

              >

                <Send className="w-4 h-4" />

              </Button>

            </div>

            

            {isAnalyzing && (

              <div className="mt-2 text-xs text-muted-foreground flex items-center">

                <div className="w-3 h-3 border border-gray-300 border-t-blue-500 rounded-full animate-spin mr-2"></div>

                Analyzing emotion...

              </div>

            )}

          </div>

        </div>



        {/* Emotion Panel */}

        <div className="w-80 border-l bg-gray-50 p-4">

          <EmotionVisualizer emotion={currentEmotion} />

          

          <div className="mt-4">

            <h3 className="text-sm font-medium text-muted-foreground mb-2">Status</h3>

            <div className="space-y-2 text-xs">

              <div className="flex items-center justify-between">

                <span>Camera</span>

                <Badge variant={mediaEnabled.camera ? "default" : "secondary"}>

                  {mediaEnabled.camera ? "Active" : "Inactive"}

                </Badge>

              </div>

              <div className="flex items-center justify-between">

                <span>Microphone</span>

                <Badge variant={mediaEnabled.microphone ? "default" : "secondary"}>

                  {mediaEnabled.microphone ? "Active" : "Inactive"}

                </Badge>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}