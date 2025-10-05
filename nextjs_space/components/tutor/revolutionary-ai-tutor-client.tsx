
'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { 
  Brain, 
  BookOpen, 
  Menu, 
  X,
  Home,
  Users,
  Trophy,
  Gamepad2,
  MessageCircle,
  Settings,
  LogOut,
  Bell,
  Search,
  User,
  BarChart3,
  Send,
  Mic,
  MicOff,
  Volume2,
  ArrowLeft,
  Sparkles,
  Heart,
  Zap,
  Globe,
  Star,
  Coffee,
  UserCheck,
  Bot,
  Loader2,
  RefreshCw,
  Languages,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface CorrectionData {
  hasCorrection: boolean;
  errorDetected?: string;
  correction?: string;
  correctedSentence?: string;
  explanations?: {
    spanish: {
      explanation: string;
      rule: string;
      examples: string[];
    };
    english: {
      explanation: string;
      rule: string;
      examples: string[];
    };
  };
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  tutorPersonality?: string;
  correctionData?: CorrectionData | null;
}

const tutorPersonalities = [
  {
    id: 'friendly',
    name: 'Amiga Sarah',
    description: 'Conversaciones casuales y divertidas',
    color: 'from-pink-500 to-rose-500',
    icon: Heart,
    prompt: 'Eres una amiga estadounidense muy amigable y divertida llamada Sarah. Hablas de manera casual y usas expresiones coloquiales.'
  },
  {
    id: 'professional',
    name: 'Profesor James',
    description: 'Inglés formal y académico',
    color: 'from-blue-500 to-indigo-500',
    icon: UserCheck,
    prompt: 'Eres un profesor de inglés muy profesional llamado James. Te enfocas en gramática correcta y vocabulario académico.'
  },
  {
    id: 'motivational',
    name: 'Coach Alex',
    description: 'Motivación y energía positiva',
    color: 'from-orange-500 to-red-500',
    icon: Zap,
    prompt: 'Eres un coach motivacional llamado Alex. Siempre eres muy positivo, energético y alentador.'
  },
  {
    id: 'traveler',
    name: 'Viajera Emma',
    description: 'Inglés para viajes y aventuras',
    color: 'from-green-500 to-teal-500',
    icon: Globe,
    prompt: 'Eres una viajera aventurera llamada Emma. Te encanta hablar sobre lugares, culturas y experiencias de viaje.'
  },
  {
    id: 'business',
    name: 'Ejecutivo Michael',
    description: 'Inglés de negocios y reuniones',
    color: 'from-gray-500 to-slate-600',
    icon: Star,
    prompt: 'Eres un ejecutivo experimentado llamado Michael. Te especializas en inglés de negocios, reuniones y presentaciones.'
  },
  {
    id: 'casual',
    name: 'Relajado Dave',
    description: 'Charlas informales y relajadas',
    color: 'from-yellow-500 to-amber-500',
    icon: Coffee,
    prompt: 'Eres un tipo muy relajado llamado Dave. Hablas de manera super casual, como si fueras un buen amigo tomando café.'
  }
];

const conversationStarters = [
  "¿Cuál es tu comida favorita?",
  "Háblame sobre tu ciudad",
  "¿Qué planes tienes para el fin de semana?",
  "¿Cuál es tu película favorita?",
  "Descríbeme tu trabajo ideal",
  "¿Qué te gusta hacer en tu tiempo libre?",
  "Háblame sobre tus hobbies",
  "¿Cuál es tu destino de viaje favorito?"
];

export function RevolutionaryAITutorClient() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState(tutorPersonalities[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'spanish' | 'english'>('spanish');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const userName = session?.user?.name?.split(' ')[0] || 'Estudiante';

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Diccionario', href: '/dictionary', icon: BookOpen },
    { name: 'Verbos', href: '/verbs', icon: BarChart3 },
    { name: 'Juegos', href: '/games', icon: Gamepad2 },
    { name: 'Tutor IA', href: '/tutor', icon: MessageCircle },
    { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
  ];

  const userMenuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: User },
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Mensaje de bienvenida cuando cambia el tutor
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `¡Hola ${userName}! Soy ${selectedTutor.name}. ${getWelcomeMessage(selectedTutor.id)} ¿De qué te gustaría hablar hoy?`,
      timestamp: new Date(),
      tutorPersonality: selectedTutor.id
    };
    setMessages([welcomeMessage]);
  }, [selectedTutor, userName]);

  const getWelcomeMessage = (tutorId: string) => {
    switch (tutorId) {
      case 'friendly': return '¡Estoy super emocionada de chatear contigo!';
      case 'professional': return 'Estoy aquí para ayudarte a mejorar tu inglés de manera estructurada.';
      case 'motivational': return '¡Estoy aquí para motivarte y hacer que tu inglés sea increíble!';
      case 'traveler': return '¡Me encanta conocer gente nueva y compartir historias de viajes!';
      case 'business': return 'Estoy aquí para ayudarte con tu inglés profesional y de negocios.';
      case 'casual': return 'Hey, ¿qué tal? ¡Relajémonos y charlemos un rato!';
      default: return '¡Vamos a tener una gran conversación!';
    }
  };

  const extractCorrectionData = (content: string): { correctionData: CorrectionData | null, cleanContent: string } => {
    try {
      // Buscar JSON entre marcadores de código
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[1];
        const correctionData = JSON.parse(jsonStr) as CorrectionData;
        // Remover el JSON del contenido para mostrar solo la conversación natural
        const cleanContent = content.replace(/```json\s*[\s\S]*?\s*```/g, '').trim();
        return { correctionData, cleanContent };
      }
      return { correctionData: null, cleanContent: content };
    } catch (error) {
      console.error('Error parsing correction JSON:', error);
      return { correctionData: null, cleanContent: content };
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          tutorPersonality: selectedTutor.prompt,
          tutorName: selectedTutor.name
        }),
      });

      if (!response.ok) throw new Error('Error en la respuesta');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        tutorPersonality: selectedTutor.id
      };

      setMessages(prev => [...prev, assistantMsg]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                // Procesar correcciones cuando termine el streaming
                const { correctionData, cleanContent } = extractCorrectionData(assistantMessage);
                setMessages(prev => 
                  prev.map(msg => 
                    msg.id === assistantMsg.id 
                      ? { ...msg, content: cleanContent, correctionData }
                      : msg
                  )
                );
                break;
              }
              
              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  assistantMessage += parsed.content;
                  // Solo mostrar el contenido en tiempo real, sin procesar correcciones aún
                  setMessages(prev => 
                    prev.map(msg => 
                      msg.id === assistantMsg.id 
                        ? { ...msg, content: assistantMessage }
                        : msg
                    )
                  );
                }
              } catch (e) {
                console.error('Error parsing chunk:', e);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Lo siento, hubo un problema. ¿Podrías intentar de nuevo?',
        timestamp: new Date(),
        tutorPersonality: selectedTutor.id
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Tu navegador no soporta reconocimiento de voz');
      return;
    }

    const SpeechRecognitionConstructor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognitionConstructor();
    
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputMessage(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleTextToSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    }
  };

  const handleStarterClick = (starter: string) => {
    setInputMessage(starter);
  };

  const clearConversation = () => {
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `¡Hola ${userName}! Soy ${selectedTutor.name}. ${getWelcomeMessage(selectedTutor.id)} ¿De qué te gustaría hablar hoy?`,
      timestamp: new Date(),
      tutorPersonality: selectedTutor.id
    };
    setMessages([welcomeMessage]);
  };

  const renderBilingualCorrection = (correctionData: CorrectionData, messageId: string) => {
    if (!correctionData?.hasCorrection || !correctionData?.explanations) return null;

    const currentExplanation = correctionData.explanations[selectedLanguage];
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 p-4 glass-card rounded-lg border-l-4 border-yellow-500"
      >
        {/* Toggle de idioma */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Languages className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-medium text-yellow-400">Corrección Gramatical</span>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setSelectedLanguage(selectedLanguage === 'spanish' ? 'english' : 'spanish')}
            className="text-xs hover:bg-white/10 flex items-center space-x-2"
          >
            {selectedLanguage === 'spanish' ? (
              <>
                <ToggleLeft className="h-4 w-4" />
                <span>Ver en inglés</span>
              </>
            ) : (
              <>
                <ToggleRight className="h-4 w-4" />
                <span>Ver en español</span>
              </>
            )}
          </Button>
        </div>

        {/* Error detectado */}
        <div className="mb-3">
          <div className="flex items-center mb-1">
            <span className="text-red-400 mr-2">⚠️</span>
            <span className="text-sm font-medium text-red-400">
              {selectedLanguage === 'spanish' ? 'Error detectado:' : 'Error detected:'}
            </span>
          </div>
          <p className="text-red-300 text-sm bg-red-900/20 p-2 rounded">
            "{correctionData.errorDetected}"
          </p>
        </div>

        {/* Corrección */}
        <div className="mb-3">
          <div className="flex items-center mb-1">
            <span className="text-green-400 mr-2">✅</span>
            <span className="text-sm font-medium text-green-400">
              {selectedLanguage === 'spanish' ? 'Corrección:' : 'Correction:'}
            </span>
          </div>
          <p className="text-green-300 text-sm bg-green-900/20 p-2 rounded">
            "{correctionData.correction}"
          </p>
        </div>

        {/* Explicación */}
        <div className="mb-3">
          <div className="flex items-center mb-1">
            <span className="text-blue-400 mr-2">📚</span>
            <span className="text-sm font-medium text-blue-400">
              {selectedLanguage === 'spanish' ? 'Explicación:' : 'Explanation:'}
            </span>
          </div>
          <p className="text-blue-300 text-sm bg-blue-900/20 p-2 rounded">
            {currentExplanation?.explanation}
          </p>
        </div>

        {/* Regla */}
        <div className="mb-3">
          <div className="flex items-center mb-1">
            <span className="text-purple-400 mr-2">💡</span>
            <span className="text-sm font-medium text-purple-400">
              {selectedLanguage === 'spanish' ? 'Regla:' : 'Rule:'}
            </span>
          </div>
          <p className="text-purple-300 text-sm bg-purple-900/20 p-2 rounded">
            {currentExplanation?.rule}
          </p>
        </div>

        {/* Ejemplos */}
        <div className="mb-3">
          <div className="flex items-center mb-1">
            <span className="text-orange-400 mr-2">📖</span>
            <span className="text-sm font-medium text-orange-400">
              {selectedLanguage === 'spanish' ? 'Ejemplos:' : 'Examples:'}
            </span>
          </div>
          <div className="bg-orange-900/20 p-2 rounded">
            {currentExplanation?.examples?.map((example, index) => (
              <p key={index} className="text-orange-300 text-sm mb-1">
                • {example}
              </p>
            ))}
          </div>
        </div>

        {/* Oración corregida */}
        {correctionData.correctedSentence && (
          <div>
            <div className="flex items-center mb-1">
              <span className="text-yellow-400 mr-2">🎯</span>
              <span className="text-sm font-medium text-yellow-400">
                {selectedLanguage === 'spanish' ? 'Oración completa corregida:' : 'Complete corrected sentence:'}
              </span>
            </div>
            <p className="text-yellow-300 text-sm bg-yellow-900/20 p-2 rounded font-medium">
              "{correctionData.correctedSentence}"
            </p>
          </div>
        )}
      </motion.div>
    );
  };

  const isActive = (href: string) => pathname === href;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
            >
              <div className="relative">
                <Brain className="h-8 w-8 text-purple-400" />
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 bg-purple-400 rounded-full blur-md"
                />
              </div>
              <span className="text-xl font-bold gradient-text">
                English Master Pro
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.name} href={item.href}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                        isActive(item.href)
                          ? 'bg-purple-600 text-white'
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </motion.div>
                  </Link>
                );
              })}
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* User Menu */}
              <div className="relative group">
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 text-white hover:bg-white/10"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm">
                      {session?.user?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block text-sm font-medium">
                    {userName}
                  </span>
                </Button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full mt-2 w-48 glass-card rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-2">
                    {userMenuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link key={item.name} href={item.href}>
                          <div className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
                            <Icon className="h-4 w-4" />
                            <span>{item.name}</span>
                          </div>
                        </Link>
                      );
                    })}
                    <hr className="my-2 border-white/10" />
                    <button
                      onClick={() => signOut()}
                      className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors w-full"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Cerrar sesión</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile menu button */}
              <div className="lg:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-white"
                >
                  {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-white/10"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 glass-card rounded-lg mt-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.name} href={item.href}>
                      <div
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                          isActive(item.href)
                            ? 'bg-purple-600 text-white'
                            : 'text-gray-300 hover:text-white hover:bg-white/10'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="flex items-center mb-6">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-gray-300 hover:text-white mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center">
                <Brain className="h-8 w-8 text-purple-400 mr-3" />
                Tutores IA Conversacionales
              </h1>
              <p className="text-gray-300 mt-2">
                Conversa con 6 personalidades únicas y mejora tu inglés naturalmente
              </p>
            </div>
          </div>

          {/* Tutor Selection */}
          <Card className="glass-card mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Users className="h-5 w-5 text-purple-400 mr-2" />
                Selecciona tu Tutor IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tutorPersonalities.map((tutor) => (
                  <motion.div
                    key={tutor.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`cursor-pointer rounded-lg p-4 border transition-all ${
                      selectedTutor.id === tutor.id
                        ? 'bg-purple-600/20 border-purple-500/50'
                        : 'glass-card border-white/10 hover:border-white/20'
                    }`}
                    onClick={() => setSelectedTutor(tutor)}
                  >
                    <div className="flex items-center mb-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${tutor.color} mr-3`}>
                        <tutor.icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{tutor.name}</h3>
                        <p className="text-xs text-gray-400">{tutor.description}</p>
                      </div>
                    </div>
                    {selectedTutor.id === tutor.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center"
                      >
                        <Badge className="bg-purple-600/20 text-purple-300 border-purple-500/30">
                          <Bot className="h-3 w-3 mr-1" />
                          Activo
                        </Badge>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Chat Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Conversation Starters */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Sparkles className="h-5 w-5 text-yellow-400 mr-2" />
                  Iniciadores
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {conversationStarters.map((starter, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleStarterClick(starter)}
                    className="w-full text-left p-3 rounded-lg glass-card hover:bg-white/10 transition-colors text-sm text-gray-300 hover:text-white"
                  >
                    {starter}
                  </motion.button>
                ))}
                
                <Button
                  onClick={clearConversation}
                  variant="outline"
                  className="w-full mt-4 border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Nueva Conversación
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Chat Messages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-3"
          >
            <Card className="glass-card h-[600px] flex flex-col">
              <CardHeader className="flex-shrink-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${selectedTutor.color} mr-3`}>
                      <selectedTutor.icon className="h-5 w-5 text-white" />
                    </div>
                    Conversando con {selectedTutor.name}
                  </CardTitle>
                  <Badge className="bg-green-600/20 text-green-300 border-green-500/30">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                    En línea
                  </Badge>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto space-y-4 p-4">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                        message.role === 'user' 
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600' 
                          : 'glass-card'
                      } rounded-lg p-4`}>
                        {message.role === 'assistant' && (
                          <div className="flex items-center mb-2">
                            <div className={`p-1 rounded-full bg-gradient-to-r ${selectedTutor.color} mr-2`}>
                              <selectedTutor.icon className="h-3 w-3 text-white" />
                            </div>
                            <span className="text-xs text-gray-400">{selectedTutor.name}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleTextToSpeech(message.content)}
                              className="ml-auto h-6 w-6 p-0 text-gray-400 hover:text-white"
                            >
                              <Volume2 className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                        <p className="text-white text-sm">{message.content}</p>
                        
                        {/* Renderizar correcciones bilingües si existen */}
                        {message.role === 'assistant' && message.correctionData && (
                          renderBilingualCorrection(message.correctionData, message.id)
                        )}
                        
                        <span className="text-xs text-gray-400 mt-2 block">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="glass-card rounded-lg p-4 max-w-xs">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 text-purple-400 animate-spin" />
                        <span className="text-gray-400 text-sm">{selectedTutor.name} está escribiendo...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </CardContent>

              {/* Input */}
              <div className="flex-shrink-0 p-4 border-t border-white/10">
                <div className="flex space-x-2">
                  <div className="flex-1 relative">
                    <Textarea
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Escribe tu mensaje aquí..."
                      className="bg-white/5 border-white/10 text-white placeholder-gray-400 resize-none"
                      rows={2}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Button
                      onClick={handleVoiceInput}
                      variant="outline"
                      size="sm"
                      className={`border-white/20 ${isListening ? 'bg-red-600/20 text-red-300' : 'text-gray-300'}`}
                      disabled={isListening || isLoading}
                    >
                      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>
                    
                    <Button
                      onClick={handleSendMessage}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                      disabled={!inputMessage.trim() || isLoading}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
