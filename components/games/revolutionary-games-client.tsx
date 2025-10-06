'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Gamepad2,
  Trophy,
  Star,
  Zap,
  Target,
  Brain,
  Timer,
  Award,
  Crown,
  Gem,
  Flame,
  Heart,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Shuffle,
  CheckCircle,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Lightbulb,
  TrendingUp,
  BarChart3,
  Users,
  Clock,
  Rocket,
  Sparkles,
  Music,
  Headphones,
  Eye,
  PenTool,
  Mic,
  MicOff,
  Globe,
  BookOpen,
  Languages
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { PronunciationChallenge } from './pronunciation-challenge';
import { GrammarRace } from './grammar-race';
import { ListeningLabyrinth } from './listening-labyrinth';
import { SpeedTyping } from './speed-typing';
import { PhraseBuilder } from './phrase-builder';

interface GameStats {
  totalGamesPlayed: number;
  averageScore: number;
  bestScore: number;
  wordsLearned: number;
  accuracy: number;
  favoriteGame: string;
  achievements: string[];
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  timeLimit: number;
}

interface Game {
  id: string;
  title: string;
  description: string;
  category: 'vocabulary' | 'grammar' | 'pronunciation' | 'listening' | 'mixed';
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
  xpReward: number;
  icon: any;
  color: string;
  isPremium: boolean;
  popularity: number;
}

interface WordMatchGame {
  word: string;
  definition: string;
  options: string[];
  correctIndex: number;
}

interface MemoryCard {
  id: string;
  word: string;
  translation: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export function RevolutionaryGamesClient() {
  const { data: session } = useSession();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [streak, setStreak] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameStats, setGameStats] = useState<GameStats>({
    totalGamesPlayed: 47,
    averageScore: 85,
    bestScore: 98,
    wordsLearned: 234,
    accuracy: 87,
    favoriteGame: 'Word Match',
    achievements: ['Speed Demon', 'Perfect Score', 'Vocabulary Master', 'Grammar Guru']
  });

  // Memory game state
  const [memoryCards, setMemoryCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);

  // Word game state
  const [currentWordGame, setCurrentWordGame] = useState<WordMatchGame | null>(null);
  const [wordGameScore, setWordGameScore] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Available games
  const games: Game[] = [
    {
      id: 'quick_quiz',
      title: 'Quiz Relámpago',
      description: 'Responde preguntas rápidas de vocabulario y gramática',
      category: 'mixed',
      difficulty: 'medium',
      estimatedTime: '5 min',
      xpReward: 50,
      icon: Zap,
      color: 'from-yellow-500 to-orange-500',
      isPremium: false,
      popularity: 95
    },
    {
      id: 'word_match',
      title: 'Empareja Palabras',
      description: 'Conecta palabras en inglés con sus significados',
      category: 'vocabulary',
      difficulty: 'easy',
      estimatedTime: '8 min',
      xpReward: 75,
      icon: Target,
      color: 'from-blue-500 to-cyan-500',
      isPremium: false,
      popularity: 88
    },
    {
      id: 'memory_master',
      title: 'Maestro de Memoria',
      description: 'Juego de memoria con palabras y sus traducciones',
      category: 'vocabulary',
      difficulty: 'medium',
      estimatedTime: '10 min',
      xpReward: 100,
      icon: Brain,
      color: 'from-purple-500 to-pink-500',
      isPremium: false,
      popularity: 82
    },
    {
      id: 'pronunciation_challenge',
      title: 'Desafío de Pronunciación',
      description: 'Practica la pronunciación perfecta con IA',
      category: 'pronunciation',
      difficulty: 'hard',
      estimatedTime: '12 min',
      xpReward: 150,
      icon: Mic,
      color: 'from-red-500 to-pink-500',
      isPremium: true,
      popularity: 76
    },
    {
      id: 'grammar_race',
      title: 'Carrera Gramatical',
      description: 'Completa oraciones correctamente contra el tiempo',
      category: 'grammar',
      difficulty: 'medium',
      estimatedTime: '7 min',
      xpReward: 80,
      icon: Rocket,
      color: 'from-green-500 to-emerald-500',
      isPremium: false,
      popularity: 90
    },
    {
      id: 'listening_labyrinth',
      title: 'Laberinto de Escucha',
      description: 'Navega por el laberinto respondiendo preguntas de audio',
      category: 'listening',
      difficulty: 'hard',
      estimatedTime: '15 min',
      xpReward: 200,
      icon: Headphones,
      color: 'from-indigo-500 to-purple-500',
      isPremium: true,
      popularity: 68
    },
    {
      id: 'speed_typing',
      title: 'Escritura Veloz',
      description: 'Escribe palabras en inglés lo más rápido posible',
      category: 'vocabulary',
      difficulty: 'easy',
      estimatedTime: '5 min',
      xpReward: 60,
      icon: PenTool,
      color: 'from-teal-500 to-cyan-500',
      isPremium: false,
      popularity: 85
    },
    {
      id: 'phrase_builder',
      title: 'Constructor de Frases',
      description: 'Construye frases perfectas arrastrando palabras',
      category: 'grammar',
      difficulty: 'medium',
      estimatedTime: '10 min',
      xpReward: 120,
      icon: BookOpen,
      color: 'from-violet-500 to-purple-500',
      isPremium: true,
      popularity: 73
    }
  ];

  // Debug logging
  useEffect(() => {
    console.log('🎮 RevolutionaryGamesClient mounted');
    console.log('📊 Selected game:', selectedGame);
    console.log('🎯 Games array length:', games.length);
    console.log('🎲 Games:', games.map(g => g.id));
  }, [selectedGame]);

  // Sample quiz questions
  const quizQuestions: QuizQuestion[] = [
    {
      id: '1',
      question: 'What is the past tense of "go"?',
      options: ['goed', 'went', 'gone', 'going'],
      correctAnswer: 1,
      explanation: '"Went" is the irregular past tense form of "go". For example: "I went to the store yesterday."',
      difficulty: 'easy',
      category: 'grammar',
      timeLimit: 15
    },
    {
      id: '2',
      question: 'Which word means "happy"?',
      options: ['sad', 'angry', 'joyful', 'tired'],
      correctAnswer: 2,
      explanation: '"Joyful" is a synonym for "happy", meaning feeling pleasure or contentment.',
      difficulty: 'easy',
      category: 'vocabulary',
      timeLimit: 10
    },
    {
      id: '3',
      question: 'Complete: "If I _____ rich, I would buy a yacht."',
      options: ['am', 'was', 'were', 'will be'],
      correctAnswer: 2,
      explanation: 'This is a second conditional sentence. We use "were" for all persons in hypothetical situations.',
      difficulty: 'medium',
      category: 'grammar',
      timeLimit: 20
    }
  ];

  // Sample word match data
  const wordMatchData: WordMatchGame[] = [
    {
      word: 'Serendipity',
      definition: 'Pleasant surprise or fortunate accident',
      options: ['Sadness', 'Pleasant surprise', 'Anger', 'Confusion'],
      correctIndex: 1
    },
    {
      word: 'Eloquent',
      definition: 'Fluent and persuasive in speaking',
      options: ['Silent', 'Fluent and persuasive', 'Rude', 'Confused'],
      correctIndex: 1
    },
    {
      word: 'Resilient',
      definition: 'Able to recover quickly from difficulties',
      options: ['Weak', 'Able to recover quickly', 'Slow', 'Lazy'],
      correctIndex: 1
    }
  ];

  // Memory game data
  const memoryGameWords = [
    { word: 'Beautiful', translation: 'Hermoso' },
    { word: 'Courage', translation: 'Coraje' },
    { word: 'Wisdom', translation: 'Sabiduría' },
    { word: 'Adventure', translation: 'Aventura' },
    { word: 'Friendship', translation: 'Amistad' },
    { word: 'Journey', translation: 'Viaje' }
  ];

  // Start quiz game
  const startQuizGame = () => {
    setGameStarted(true);
    setGameEnded(false);
    setCurrentQuestion(0);
    setScore(0);
    setStreak(0);
    setTimeLeft(quizQuestions[0]?.timeLimit || 30);
    
    // Start timer
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Handle quiz answer
  const handleQuizAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    const isCorrect = answerIndex === quizQuestions[currentQuestion].correctAnswer;
    
    if (isCorrect) {
      const timeBonus = Math.floor(timeLeft / 2);
      const questionScore = 100 + timeBonus;
      setScore(prev => prev + questionScore);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
  };

  // Move to next question
  const nextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setTimeLeft(quizQuestions[currentQuestion + 1]?.timeLimit || 30);
      
      // Restart timer
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      endGame();
    }
  };

  // Handle time up
  const handleTimeUp = () => {
    if (selectedAnswer === null) {
      setSelectedAnswer(-1); // Indicate time ran out
      setShowExplanation(true);
      setStreak(0);
    }
  };

  // End game
  const endGame = () => {
    setGameEnded(true);
    setGameStarted(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Update stats
    setGameStats(prev => ({
      ...prev,
      totalGamesPlayed: prev.totalGamesPlayed + 1,
      averageScore: Math.round((prev.averageScore + score) / 2)
    }));
  };

  // Initialize memory game
  const initMemoryGame = () => {
    const cards: MemoryCard[] = [];
    memoryGameWords.forEach((wordPair, index) => {
      cards.push({
        id: `word-${index}`,
        word: wordPair.word,
        translation: '',
        isFlipped: false,
        isMatched: false
      });
      cards.push({
        id: `translation-${index}`,
        word: wordPair.translation,
        translation: '',
        isFlipped: false,
        isMatched: false
      });
    });
    
    // Shuffle cards
    const shuffled = cards.sort(() => Math.random() - 0.5);
    setMemoryCards(shuffled);
    setFlippedCards([]);
    setMatchedPairs(0);
  };

  // Handle memory card flip
  const flipCard = (cardId: string) => {
    if (flippedCards.length === 2) return;
    if (flippedCards.includes(cardId)) return;
    
    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);
    
    // Update card state
    setMemoryCards(prev => 
      prev.map(card => 
        card.id === cardId ? { ...card, isFlipped: true } : card
      )
    );
    
    // Check for match
    if (newFlippedCards.length === 2) {
      setTimeout(() => {
        checkMemoryMatch(newFlippedCards);
      }, 1000);
    }
  };

  // Check memory match
  const checkMemoryMatch = (flippedCardIds: string[]) => {
    const [firstCardId, secondCardId] = flippedCardIds;
    const firstCard = memoryCards.find(card => card.id === firstCardId);
    const secondCard = memoryCards.find(card => card.id === secondCardId);
    
    if (!firstCard || !secondCard) return;
    
    // Check if cards match (word and translation pair)
    const firstIndex = firstCardId.split('-')[1];
    const secondIndex = secondCardId.split('-')[1];
    const isMatch = firstIndex === secondIndex;
    
    if (isMatch) {
      // Mark as matched
      setMemoryCards(prev => 
        prev.map(card => 
          flippedCardIds.includes(card.id) 
            ? { ...card, isMatched: true } 
            : card
        )
      );
      setMatchedPairs(prev => prev + 1);
    } else {
      // Flip back
      setMemoryCards(prev => 
        prev.map(card => 
          flippedCardIds.includes(card.id) 
            ? { ...card, isFlipped: false } 
            : card
        )
      );
    }
    
    setFlippedCards([]);
  };

  // Initialize word match game
  const initWordMatchGame = () => {
    const randomGame = wordMatchData[Math.floor(Math.random() * wordMatchData.length)];
    setCurrentWordGame(randomGame);
    setWordGameScore(0);
  };

  // Handle word match answer
  const handleWordMatchAnswer = (selectedIndex: number) => {
    if (!currentWordGame) return;
    
    const isCorrect = selectedIndex === currentWordGame.correctIndex;
    
    if (isCorrect) {
      setWordGameScore(prev => prev + 100);
      // Load next word
      setTimeout(() => {
        initWordMatchGame();
      }, 1500);
    }
  };

  // Text-to-Speech
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isPlaying) {
        speechSynthesis.cancel();
        setIsPlaying(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      utterance.volume = 0.8;
      
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      
      speechSynthesis.speak(utterance);
    }
  };

  // Cleanup timer
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Initialize games
  useEffect(() => {
    if (selectedGame === 'memory_master') {
      initMemoryGame();
    } else if (selectedGame === 'word_match') {
      initWordMatchGame();
    }
  }, [selectedGame]);

  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-blue-900/20"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-400/10 via-transparent to-transparent"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-pink-500/10 to-transparent rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        {!selectedGame && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <Button
              onClick={() => router.push('/dashboard')}
              variant="ghost"
              className="text-white hover:bg-white/10 border border-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Dashboard
            </Button>
          </motion.div>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              🎮 Juegos Revolucionarios
            </span>
          </h1>
          <p className="text-xl text-purple-100 mb-6">
            Aprende inglés jugando con IA, competencias en tiempo real y efectos 3D
          </p>

          {/* Stats Overview */}
          <div className="flex justify-center items-center space-x-8 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-300">{gameStats.totalGamesPlayed}</div>
              <div className="text-sm text-purple-200">Juegos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-300">{gameStats.averageScore}%</div>
              <div className="text-sm text-purple-200">Promedio</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-300">{gameStats.wordsLearned}</div>
              <div className="text-sm text-purple-200">Palabras</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-300">{gameStats.accuracy}%</div>
              <div className="text-sm text-purple-200">Precisión</div>
            </div>
          </div>
        </motion.div>

        {/* Game Selection */}
        {!selectedGame && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <Card className="backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Gamepad2 className="w-6 h-6 mr-3 text-yellow-300" />
                  Selecciona tu Juego
                </CardTitle>
                <CardDescription className="text-purple-200">
                  Cada juego está diseñado para mejorar diferentes habilidades
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(() => {
                    console.log('🎴 Rendering game cards, total games:', games.length);
                    return games.map((game, index) => (
                    <motion.div
                      key={game.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                    >
                      <Card 
                        className="backdrop-blur-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:shadow-xl group cursor-pointer hover:scale-105 relative"
                        onClick={() => setSelectedGame(game.id)}
                      >
                        {game.isPremium && (
                          <div className="absolute top-2 right-2">
                            <Crown className="w-5 h-5 text-yellow-400" />
                          </div>
                        )}
                        
                        <CardContent className="p-6 text-center">
                          <div className={`w-16 h-16 bg-gradient-to-br ${game.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                            <game.icon className="w-8 h-8 text-white" />
                          </div>
                          
                          <h3 className="text-lg font-bold text-white mb-2">{game.title}</h3>
                          <p className="text-sm text-purple-200 mb-4">{game.description}</p>
                          
                          <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-purple-300">Tiempo:</span>
                              <span className="text-white">{game.estimatedTime}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-purple-300">XP:</span>
                              <span className="text-yellow-300 font-bold">+{game.xpReward}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-purple-300">Popularidad:</span>
                              <div className="flex items-center space-x-1">
                                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                <span className="text-white">{game.popularity}%</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <Badge className={`bg-gradient-to-r ${game.color} text-white border-0`}>
                              {game.category.charAt(0).toUpperCase() + game.category.slice(1)}
                            </Badge>
                            <Badge className="ml-2 bg-white/10 text-purple-200 border border-purple-400/30">
                              {game.difficulty.charAt(0).toUpperCase() + game.difficulty.slice(1)}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                    ));
                  })()}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Quiz Game Interface */}
        {selectedGame === 'quick_quiz' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            {!gameStarted && !gameEnded && (
              <Card className="backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center text-white text-2xl">
                    <Zap className="w-8 h-8 mr-3 text-yellow-400" />
                    Quiz Relámpago
                  </CardTitle>
                  <CardDescription className="text-purple-200 text-lg">
                    ¿Listo para el desafío? ¡Responde {quizQuestions.length} preguntas lo más rápido posible!
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="mb-8">
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="bg-purple-900/30 rounded-lg p-4">
                        <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                        <div className="text-2xl font-bold text-white">{quizQuestions.length}</div>
                        <div className="text-sm text-purple-200">Preguntas</div>
                      </div>
                      <div className="bg-purple-900/30 rounded-lg p-4">
                        <Timer className="w-8 h-8 mx-auto mb-2 text-orange-400" />
                        <div className="text-2xl font-bold text-white">15-30s</div>
                        <div className="text-sm text-purple-200">Por pregunta</div>
                      </div>
                      <div className="bg-purple-900/30 rounded-lg p-4">
                        <Star className="w-8 h-8 mx-auto mb-2 text-green-400" />
                        <div className="text-2xl font-bold text-white">50 XP</div>
                        <div className="text-sm text-purple-200">Recompensa</div>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    onClick={startQuizGame}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white text-lg px-8 py-3"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Comenzar Quiz
                  </Button>
                </CardContent>
              </Card>
            )}

            {gameStarted && !gameEnded && (
              <Card className="backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <Badge className="bg-purple-500/20 text-purple-200 border border-purple-400/30">
                        Pregunta {currentQuestion + 1} de {quizQuestions.length}
                      </Badge>
                      <Badge className="bg-green-500/20 text-green-200 border border-green-400/30">
                        Puntuación: {score}
                      </Badge>
                      <Badge className="bg-orange-500/20 text-orange-200 border border-orange-400/30">
                        Racha: {streak}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Timer className="w-5 h-5 text-red-400" />
                      <span className={`text-xl font-bold ${timeLeft <= 5 ? 'text-red-400' : 'text-white'}`}>
                        {timeLeft}s
                      </span>
                    </div>
                  </div>
                  
                  <Progress value={(timeLeft / (quizQuestions[currentQuestion]?.timeLimit || 30)) * 100} className="h-2 mt-4" />
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {quizQuestions[currentQuestion] && (
                    <>
                      <div className="text-center">
                        <h3 className="text-2xl font-bold text-white mb-4 flex items-center justify-center">
                          {quizQuestions[currentQuestion].question}
                          <Button
                            onClick={() => speakText(quizQuestions[currentQuestion].question)}
                            variant="ghost"
                            size="sm"
                            className="ml-3 text-purple-300 hover:text-white"
                          >
                            {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                          </Button>
                        </h3>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4">
                        {quizQuestions[currentQuestion].options.map((option, index) => (
                          <Button
                            key={index}
                            onClick={() => handleQuizAnswer(index)}
                            disabled={selectedAnswer !== null}
                            className={`p-4 text-left justify-start h-auto ${
                              selectedAnswer === null
                                ? 'bg-white/5 hover:bg-white/10 text-white border border-white/20'
                                : selectedAnswer === index
                                  ? index === quizQuestions[currentQuestion].correctAnswer
                                    ? 'bg-green-500/20 border-green-400 text-green-100'
                                    : 'bg-red-500/20 border-red-400 text-red-100'
                                  : index === quizQuestions[currentQuestion].correctAnswer
                                    ? 'bg-green-500/20 border-green-400 text-green-100'
                                    : 'bg-white/5 text-purple-200 border border-white/10'
                            }`}
                          >
                            <div className="flex items-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 text-sm font-bold ${
                                selectedAnswer === null
                                  ? 'bg-purple-500/20 text-purple-200'
                                  : selectedAnswer === index
                                    ? index === quizQuestions[currentQuestion].correctAnswer
                                      ? 'bg-green-500 text-white'
                                      : 'bg-red-500 text-white'
                                    : index === quizQuestions[currentQuestion].correctAnswer
                                      ? 'bg-green-500 text-white'
                                      : 'bg-white/10 text-purple-300'
                              }`}>
                                {String.fromCharCode(65 + index)}
                              </div>
                              <span className="text-lg">{option}</span>
                            </div>
                          </Button>
                        ))}
                      </div>
                      
                      {showExplanation && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-purple-900/30 rounded-lg p-4 border border-purple-400/30"
                        >
                          <div className="flex items-start space-x-3">
                            <Lightbulb className="w-5 h-5 text-yellow-400 mt-1" />
                            <div>
                              <h4 className="font-medium text-white mb-2">Explicación:</h4>
                              <p className="text-purple-200">{quizQuestions[currentQuestion].explanation}</p>
                            </div>
                          </div>
                          
                          <div className="mt-4 text-center">
                            <Button
                              onClick={nextQuestion}
                              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                            >
                              {currentQuestion < quizQuestions.length - 1 ? (
                                <>
                                  Siguiente <ArrowRight className="w-4 h-4 ml-2" />
                                </>
                              ) : (
                                'Ver Resultados'
                              )}
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {gameEnded && (
              <Card className="backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center text-white text-2xl">
                    <Trophy className="w-8 h-8 mr-3 text-yellow-400" />
                    ¡Quiz Completado!
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="mb-8">
                    <div className="text-6xl font-bold text-yellow-400 mb-2">{score}</div>
                    <div className="text-xl text-purple-200 mb-6">Puntuación Final</div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="bg-purple-900/30 rounded-lg p-4">
                        <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-400" />
                        <div className="text-2xl font-bold text-white">
                          {quizQuestions.filter((_, index) => index <= currentQuestion).length}
                        </div>
                        <div className="text-sm text-purple-200">Respondidas</div>
                      </div>
                      <div className="bg-purple-900/30 rounded-lg p-4">
                        <Flame className="w-8 h-8 mx-auto mb-2 text-orange-400" />
                        <div className="text-2xl font-bold text-white">{streak}</div>
                        <div className="text-sm text-purple-200">Mejor Racha</div>
                      </div>
                      <div className="bg-purple-900/30 rounded-lg p-4">
                        <Star className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                        <div className="text-2xl font-bold text-white">+50</div>
                        <div className="text-sm text-purple-200">XP Ganados</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Button
                      onClick={() => {
                        setGameEnded(false);
                        startQuizGame();
                      }}
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 mr-3"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Jugar de Nuevo
                    </Button>
                    <Button
                      onClick={() => setSelectedGame(null)}
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      Elegir Otro Juego
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}

        {/* Memory Game Interface */}
        {selectedGame === 'memory_master' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center text-white">
                    <Brain className="w-6 h-6 mr-3 text-purple-400" />
                    Maestro de Memoria
                  </CardTitle>
                  <div className="flex items-center space-x-4">
                    <Badge className="bg-purple-500/20 text-purple-200 border border-purple-400/30">
                      Pares: {matchedPairs}/{memoryGameWords.length}
                    </Badge>
                    <Button
                      onClick={() => setSelectedGame(null)}
                      variant="ghost"
                      className="text-purple-300 hover:text-white"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Volver
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {memoryCards.map((card) => (
                    <motion.div
                      key={card.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Card
                        className={`aspect-square cursor-pointer transition-all duration-300 ${
                          card.isFlipped || card.isMatched
                            ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                            : 'bg-white/10 hover:bg-white/20'
                        } border border-white/20`}
                        onClick={() => !card.isMatched && flipCard(card.id)}
                      >
                        <CardContent className="p-4 h-full flex items-center justify-center">
                          <div className="text-center">
                            {card.isFlipped || card.isMatched ? (
                              <span className="text-white font-medium text-sm">
                                {card.word}
                              </span>
                            ) : (
                              <div className="w-8 h-8 bg-purple-300 rounded-full"></div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
                
                {matchedPairs === memoryGameWords.length && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center bg-purple-900/30 rounded-lg p-6"
                  >
                    <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
                    <h3 className="text-2xl font-bold text-white mb-2">¡Felicitaciones!</h3>
                    <p className="text-purple-200 mb-4">Has completado el juego de memoria</p>
                    <div className="space-y-3">
                      <Button
                        onClick={initMemoryGame}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 mr-3"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Jugar de Nuevo
                      </Button>
                      <Button
                        onClick={() => setSelectedGame(null)}
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        Elegir Otro Juego
                      </Button>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Pronunciation Challenge Game */}
        {selectedGame === 'pronunciation_challenge' && (
          <PronunciationChallenge
            onBack={() => setSelectedGame(null)}
            onComplete={(score, timeSpent) => {
              setGameStats(prev => ({
                ...prev,
                totalGamesPlayed: prev.totalGamesPlayed + 1
              }));
            }}
          />
        )}

        {/* Grammar Race Game */}
        {selectedGame === 'grammar_race' && (
          <GrammarRace
            onBack={() => setSelectedGame(null)}
            onComplete={(score, timeSpent) => {
              setGameStats(prev => ({
                ...prev,
                totalGamesPlayed: prev.totalGamesPlayed + 1
              }));
            }}
          />
        )}

        {/* Listening Labyrinth Game */}
        {selectedGame === 'listening_labyrinth' && (
          <ListeningLabyrinth
            onBack={() => setSelectedGame(null)}
            onComplete={(score, timeSpent) => {
              setGameStats(prev => ({
                ...prev,
                totalGamesPlayed: prev.totalGamesPlayed + 1
              }));
            }}
          />
        )}

        {/* Speed Typing Game */}
        {selectedGame === 'speed_typing' && (
          <SpeedTyping
            onBack={() => setSelectedGame(null)}
            onComplete={(score, timeSpent) => {
              setGameStats(prev => ({
                ...prev,
                totalGamesPlayed: prev.totalGamesPlayed + 1
              }));
            }}
          />
        )}

        {/* Phrase Builder Game */}
        {selectedGame === 'phrase_builder' && (
          <PhraseBuilder
            onBack={() => setSelectedGame(null)}
            onComplete={(score, timeSpent) => {
              setGameStats(prev => ({
                ...prev,
                totalGamesPlayed: prev.totalGamesPlayed + 1
              }));
            }}
          />
        )}

        {/* Word Match Game Interface */}
        {selectedGame === 'word_match' && currentWordGame && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center text-white">
                    <Target className="w-6 h-6 mr-3 text-blue-400" />
                    Empareja Palabras
                  </CardTitle>
                  <div className="flex items-center space-x-4">
                    <Badge className="bg-blue-500/20 text-blue-200 border border-blue-400/30">
                      Puntuación: {wordGameScore}
                    </Badge>
                    <Button
                      onClick={() => setSelectedGame(null)}
                      variant="ghost"
                      className="text-purple-300 hover:text-white"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Volver
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-white mb-4 flex items-center justify-center">
                    {currentWordGame.word}
                    <Button
                      onClick={() => speakText(currentWordGame.word)}
                      variant="ghost"
                      size="sm"
                      className="ml-3 text-purple-300 hover:text-white"
                    >
                      {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </Button>
                  </h3>
                  <p className="text-purple-200 mb-6">Selecciona el significado correcto:</p>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {currentWordGame.options.map((option, index) => (
                    <Button
                      key={index}
                      onClick={() => handleWordMatchAnswer(index)}
                      className="p-4 text-left justify-start h-auto bg-white/5 hover:bg-white/10 text-white border border-white/20"
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-4 text-sm font-bold text-blue-200">
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="text-lg">{option}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Back to Games Button */}
        {selectedGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center mt-8"
          >
            <Button
              onClick={() => setSelectedGame(null)}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Juegos
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
