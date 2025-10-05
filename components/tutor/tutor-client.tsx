
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Send,
  Brain,
  MessageCircle,
  ArrowLeft,
  Bot,
  User,
  Sparkles,
  Mic,
  BookOpen,
  Target,
  Lightbulb,
  Coffee,
  Globe,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'suggestion' | 'correction' | 'explanation';
}

interface ConversationStarter {
  id: number;
  title: string;
  message: string;
  icon: any;
  color: string;
}

export function TutorClient() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversationStarters: ConversationStarter[] = [
    {
      id: 1,
      title: 'Conversación Casual',
      message: 'Hi! I\'d like to practice casual conversation. Can you help me?',
      icon: Coffee,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 2,
      title: 'Gramática y Correcciones',
      message: 'I want to improve my grammar. Can you correct my mistakes?',
      icon: BookOpen,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 3,
      title: 'Pronunciación',
      message: 'Help me practice pronunciation and speaking skills.',
      icon: Mic,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 4,
      title: 'Vocabulario Específico',
      message: 'I want to learn vocabulary about business and work.',
      icon: Target,
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 5,
      title: 'Práctica de Escritura',
      message: 'Can you help me improve my writing skills?',
      icon: Lightbulb,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 6,
      title: 'Cultura y Expresiones',
      message: 'Teach me about English culture and common expressions.',
      icon: Globe,
      color: 'from-indigo-500 to-purple-500'
    }
  ];

  const initialAIMessage: Message = {
    id: 0,
    content: "¡Hola! Soy tu tutor personal de inglés con IA. Estoy aquí para ayudarte a mejorar tu inglés de forma personalizada. Puedes preguntarme sobre gramática, vocabulario, pronunciación, o simplemente practicar conversación conmigo. ¿En qué te gustaría trabajar hoy?",
    sender: 'ai',
    timestamp: new Date(),
    type: 'explanation'
  };

  useEffect(() => {
    setMessages([initialAIMessage]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleStartConversation = (starter: ConversationStarter) => {
    const userMessage: Message = {
      id: Date.now(),
      content: starter.message,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setConversationStarted(true);
    setIsTyping(true);

    // Simular respuesta de la IA
    setTimeout(() => {
      const aiResponse: Message = {
        id: Date.now() + 1,
        content: getAIResponse(starter.title),
        sender: 'ai',
        timestamp: new Date(),
        type: 'explanation'
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const getAIResponse = (topic: string): string => {
    const responses = {
      'Conversación Casual': "¡Perfecto! Me encanta ayudar con conversaciones casuales. Empecemos hablando sobre tus hobbies. What do you like to do in your free time? I'll help you express your ideas naturally and correct any mistakes.",
      'Gramática y Correcciones': "Excellent! I'm here to help you with grammar. Feel free to write sentences or paragraphs, and I'll provide corrections with explanations. Let's start with something simple - tell me about your typical day using past tense.",
      'Pronunciación': "Great choice! Pronunciation is so important. I can help you with phonetic symbols, stress patterns, and common pronunciation mistakes. Let's start with some words that are commonly mispronounced. Try saying: 'comfortable', 'restaurant', and 'February'.",
      'Vocabulario Específico': "Wonderful! Business vocabulary is very useful. Let's explore professional terms, email phrases, and meeting expressions. Can you tell me about your job or field of study? I'll teach you relevant vocabulary.",
      'Práctica de Escritura': "Perfect! Writing skills are essential. I can help you with structure, grammar, and style. Let's start with a simple paragraph - describe your hometown in 4-5 sentences. I'll provide feedback and suggestions.",
      'Cultura y Expresiones': "Fantastic! Learning about culture makes language more interesting. Let's explore idioms, slang, and cultural contexts. Do you know what 'break the ice' means? I'll teach you expressions that native speakers use daily."
    };
    return responses[topic as keyof typeof responses] || "That's interesting! Let's explore that topic together. How can I help you practice?";
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    setConversationStarted(true);

    // Simular respuesta de la IA
    setTimeout(() => {
      const aiResponse: Message = {
        id: Date.now() + 1,
        content: "That's a great question! Let me help you with that. [Esta sería una respuesta personalizada de la IA basada en tu mensaje]",
        sender: 'ai',
        timestamp: new Date(),
        type: 'explanation'
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-blue-900/20"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-400/10 via-transparent to-transparent"></div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  IA Tutor Personal
                </h1>
                <p className="text-sm text-purple-200">Conversaciones inteligentes 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Conversation Starters Sidebar */}
          {!conversationStarted && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-1"
            >
              <Card className="backdrop-blur-lg bg-white/5 border border-white/10 shadow-xl sticky top-24">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-purple-300" />
                    Iniciar Conversación
                  </CardTitle>
                  <CardDescription className="text-purple-200">
                    Elige un tema para empezar a practicar
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {conversationStarters.map((starter) => (
                    <Button
                      key={starter.id}
                      onClick={() => handleStartConversation(starter)}
                      className="w-full justify-start text-left h-auto p-4 bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
                      variant="ghost"
                    >
                      <div className={`w-10 h-10 bg-gradient-to-r ${starter.color} rounded-lg flex items-center justify-center mr-3 flex-shrink-0`}>
                        <starter.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-white text-sm">{starter.title}</div>
                        <div className="text-xs text-purple-300 mt-1">{starter.message.slice(0, 40)}...</div>
                      </div>
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Chat Area */}
          <div className={conversationStarted ? "lg:col-span-4" : "lg:col-span-3"}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="backdrop-blur-lg bg-white/5 border border-white/10 shadow-xl h-[calc(100vh-200px)] flex flex-col">
                {/* Chat Header */}
                <CardHeader className="border-b border-white/10">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-white">English Master AI</CardTitle>
                      <CardDescription className="text-purple-200 flex items-center">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                        En línea • Responde en segundos
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages Area */}
                <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start space-x-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.sender === 'user' 
                            ? 'bg-gradient-to-br from-blue-400 to-blue-600' 
                            : 'bg-gradient-to-br from-purple-400 to-pink-500'
                        }`}>
                          {message.sender === 'user' ? (
                            <User className="w-4 h-4 text-white" />
                          ) : (
                            <Bot className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <div className={`rounded-2xl px-4 py-3 ${
                          message.sender === 'user'
                            ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/30'
                            : 'bg-white/10 border border-white/20'
                        }`}>
                          <p className="text-white text-sm leading-relaxed">{message.content}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-purple-300">
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {message.type && (
                              <Badge className="bg-purple-500/20 text-purple-200 border border-purple-400/30 text-xs">
                                {message.type}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-white/10 border border-white/20 rounded-2xl px-4 py-3">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </CardContent>

                {/* Input Area */}
                <div className="border-t border-white/10 p-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Escribe tu mensaje en inglés..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1 bg-white/10 border-white/20 text-white placeholder-purple-300"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isTyping}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Button size="sm" variant="ghost" className="text-purple-300 hover:text-white text-xs">
                      <Mic className="w-3 h-3 mr-1" />
                      Pronunciación
                    </Button>
                    <Button size="sm" variant="ghost" className="text-purple-300 hover:text-white text-xs">
                      <BookOpen className="w-3 h-3 mr-1" />
                      Gramática
                    </Button>
                    <Button size="sm" variant="ghost" className="text-purple-300 hover:text-white text-xs">
                      <Target className="w-3 h-3 mr-1" />
                      Vocabulario
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
