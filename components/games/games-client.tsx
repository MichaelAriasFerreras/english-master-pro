
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Gamepad2,
  Trophy,
  Target,
  Brain,
  ArrowLeft,
  Play,
  Star,
  Clock,
  Users,
  Zap,
  Crown,
  Shuffle,
  BookOpen,
  Mic,
  PenTool,
  Puzzle,
  Timer,
  Award
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Game {
  id: number;
  title: string;
  description: string;
  icon: any;
  color: string;
  difficulty: 'Fácil' | 'Medio' | 'Difícil';
  duration: string;
  players: number;
  xpReward: number;
  category: string;
  href: string;
  isLocked?: boolean;
  requiresLevel?: string;
}

interface GameStats {
  gamesPlayed: number;
  totalXP: number;
  averageScore: number;
  bestStreak: number;
  favoriteGame: string;
}

export function GamesClient() {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [gameStats, setGameStats] = useState<GameStats>({
    gamesPlayed: 47,
    totalXP: 1250,
    averageScore: 87,
    bestStreak: 12,
    favoriteGame: 'Vocabulary Quiz'
  });

  const gameData: Game[] = [
    {
      id: 1,
      title: 'Quiz de Vocabulario',
      description: 'Pon a prueba tu conocimiento de palabras con preguntas adaptativas',
      icon: Brain,
      color: 'from-blue-500 to-cyan-500',
      difficulty: 'Medio',
      duration: '5-10 min',
      players: 1,
      xpReward: 50,
      category: 'vocabulary',
      href: '/games/vocabulary-quiz'
    },
    {
      id: 2,
      title: 'Memorama de Palabras',
      description: 'Encuentra las parejas de palabras y sus traducciones',
      icon: Puzzle,
      color: 'from-green-500 to-emerald-500',
      difficulty: 'Fácil',
      duration: '3-5 min',
      players: 1,
      xpReward: 30,
      category: 'memory',
      href: '/games/word-memory'
    },
    {
      id: 3,
      title: 'Construcción de Frases',
      description: 'Arrastra las palabras para formar oraciones correctas',
      icon: PenTool,
      color: 'from-purple-500 to-pink-500',
      difficulty: 'Medio',
      duration: '7-12 min',
      players: 1,
      xpReward: 65,
      category: 'grammar',
      href: '/games/sentence-builder'
    },
    {
      id: 4,
      title: 'Desafío de Pronunciación',
      description: 'Practica la pronunciación con reconocimiento de voz',
      icon: Mic,
      color: 'from-orange-500 to-red-500',
      difficulty: 'Difícil',
      duration: '8-15 min',
      players: 1,
      xpReward: 80,
      category: 'pronunciation',
      href: '/games/pronunciation-challenge'
    },
    {
      id: 5,
      title: 'Carrera de Verbos',
      description: 'Conjuga verbos rápidamente antes de que se acabe el tiempo',
      icon: Timer,
      color: 'from-yellow-500 to-orange-500',
      difficulty: 'Medio',
      duration: '5-8 min',
      players: 1,
      xpReward: 55,
      category: 'verbs',
      href: '/games/verb-race'
    },
    {
      id: 6,
      title: 'Sopa de Letras',
      description: 'Encuentra palabras ocultas en la cuadrícula de letras',
      icon: Target,
      color: 'from-indigo-500 to-purple-500',
      difficulty: 'Fácil',
      duration: '10-15 min',
      players: 1,
      xpReward: 40,
      category: 'vocabulary',
      href: '/games/word-search'
    },
    {
      id: 7,
      title: 'Quiz Rápido',
      description: 'Responde preguntas de inglés en tiempo récord',
      icon: Zap,
      color: 'from-pink-500 to-rose-500',
      difficulty: 'Fácil',
      duration: '2-3 min',
      players: 1,
      xpReward: 25,
      category: 'mixed',
      href: '/games/quick-quiz'
    },
    {
      id: 8,
      title: 'Batalla de Gramática',
      description: 'Compite contra otros jugadores en tiempo real',
      icon: Crown,
      color: 'from-red-500 to-pink-500',
      difficulty: 'Difícil',
      duration: '10-20 min',
      players: 4,
      xpReward: 100,
      category: 'grammar',
      href: '/games/grammar-battle',
      isLocked: true,
      requiresLevel: 'B1'
    }
  ];

  const categories = [
    { id: 'all', name: 'Todos los Juegos' },
    { id: 'vocabulary', name: 'Vocabulario' },
    { id: 'grammar', name: 'Gramática' },
    { id: 'pronunciation', name: 'Pronunciación' },
    { id: 'memory', name: 'Memoria' },
    { id: 'verbs', name: 'Verbos' },
    { id: 'mixed', name: 'Mixto' }
  ];

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      'Fácil': 'from-green-400 to-green-600',
      'Medio': 'from-yellow-400 to-orange-500',
      'Difícil': 'from-red-400 to-red-600'
    };
    return colors[difficulty as keyof typeof colors] || 'from-gray-400 to-gray-600';
  };

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setGames(gameData);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredGames = selectedCategory === 'all' 
    ? games 
    : games.filter(game => game.category === selectedCategory);

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
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/25">
                <Gamepad2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  Juegos Educativos
                </h1>
                <p className="text-sm text-purple-200">Aprende jugando con desafíos divertidos</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8"
        >
          <Card className="backdrop-blur-lg bg-white/5 border border-white/10">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-300 mb-1">{gameStats.gamesPlayed}</div>
              <div className="text-sm text-purple-200">Juegos Jugados</div>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-lg bg-white/5 border border-white/10">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-300 mb-1">{gameStats.totalXP}</div>
              <div className="text-sm text-purple-200">XP Ganados</div>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-lg bg-white/5 border border-white/10">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-300 mb-1">{gameStats.averageScore}%</div>
              <div className="text-sm text-purple-200">Promedio</div>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-lg bg-white/5 border border-white/10">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-300 mb-1">{gameStats.bestStreak}</div>
              <div className="text-sm text-purple-200">Mejor Racha</div>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-lg bg-white/5 border border-white/10">
            <CardContent className="p-4 text-center">
              <div className="text-lg font-bold text-purple-300 mb-1">{gameStats.favoriteGame}</div>
              <div className="text-xs text-purple-200">Juego Favorito</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Categories Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <Card className="backdrop-blur-lg bg-white/5 border border-white/10 shadow-xl">
            <CardHeader>
              <CardTitle className="text-white">Categorías de Juegos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`transition-all duration-300 ${
                      selectedCategory === category.id 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                        : 'text-white border-white/20 hover:bg-white/10'
                    }`}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <Button className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-400/30 hover:bg-purple-500/30 transition-all duration-300 h-16">
            <Shuffle className="w-6 h-6 mr-3" />
            Juego Aleatorio
          </Button>
          <Button className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-white border border-blue-400/30 hover:bg-blue-500/30 transition-all duration-300 h-16">
            <Trophy className="w-6 h-6 mr-3" />
            Torneo Diario
          </Button>
          <Button className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-white border border-green-400/30 hover:bg-green-500/30 transition-all duration-300 h-16">
            <Users className="w-6 h-6 mr-3" />
            Multijugador
          </Button>
        </motion.div>

        {/* Games Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="backdrop-blur-lg bg-white/5 border border-white/10 animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-white/10 rounded mb-2"></div>
                  <div className="h-4 bg-white/10 rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-white/10 rounded mb-2"></div>
                  <div className="h-4 bg-white/10 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGames.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                <Card className={`backdrop-blur-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 group cursor-pointer h-full ${
                  game.isLocked ? 'opacity-60' : 'hover:scale-105'
                }`}>
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-16 h-16 bg-gradient-to-br ${game.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg relative`}>
                        <game.icon className="w-8 h-8 text-white" />
                        {game.isLocked && (
                          <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
                            <Crown className="w-6 h-6 text-yellow-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <Badge className={`bg-gradient-to-r ${getDifficultyColor(game.difficulty)} text-white border-0 text-xs`}>
                          {game.difficulty}
                        </Badge>
                        <Badge className="bg-yellow-500/20 text-yellow-200 border border-yellow-400/30 text-xs">
                          +{game.xpReward} XP
                        </Badge>
                      </div>
                    </div>
                    <CardTitle className="text-white text-lg mb-2 group-hover:text-purple-200 transition-colors">
                      {game.title}
                    </CardTitle>
                    <CardDescription className="text-purple-200 text-sm leading-relaxed">
                      {game.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm text-purple-300">
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          {game.duration}
                        </span>
                        <span className="flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          {game.players} jugador{game.players > 1 ? 'es' : ''}
                        </span>
                      </div>
                      
                      {game.isLocked ? (
                        <div className="text-center py-2">
                          <p className="text-sm text-yellow-300 mb-2">
                            Requiere nivel {game.requiresLevel}
                          </p>
                          <Button 
                            disabled 
                            className="w-full bg-gray-600 text-gray-400 cursor-not-allowed"
                          >
                            <Crown className="w-4 h-4 mr-2" />
                            Bloqueado
                          </Button>
                        </div>
                      ) : (
                        <Link href={game.href}>
                          <Button className="w-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-400/30 hover:bg-purple-500/30 transition-all duration-300">
                            <Play className="w-4 h-4 mr-2" />
                            Jugar Ahora
                          </Button>
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {filteredGames.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🎮</div>
            <h3 className="text-2xl font-bold text-white mb-2">No hay juegos en esta categoría</h3>
            <p className="text-purple-200">Prueba con una categoría diferente</p>
          </motion.div>
        )}

        {/* Achievement Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12"
        >
          <Card className="backdrop-blur-lg bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-400/20 shadow-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Award className="w-6 h-6 mr-3 text-yellow-400" />
                Logros Disponibles
              </CardTitle>
              <CardDescription className="text-yellow-200">
                Completa desafíos para ganar recompensas especiales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white font-medium">Maestro del Vocabulario</span>
                  </div>
                  <p className="text-purple-200 text-sm mb-2">Completa 10 quizzes de vocabulario</p>
                  <Progress value={70} className="h-2" />
                  <p className="text-xs text-purple-300 mt-1">7/10 completados</p>
                </div>
                
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center">
                      <Star className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white font-medium">Racha Perfecta</span>
                  </div>
                  <p className="text-purple-200 text-sm mb-2">Consigue 5 días jugando consecutivos</p>
                  <Progress value={80} className="h-2" />
                  <p className="text-xs text-purple-300 mt-1">4/5 días</p>
                </div>
                
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                      <Crown className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white font-medium">Campeón</span>
                  </div>
                  <p className="text-purple-200 text-sm mb-2">Gana 3 partidas multijugador</p>
                  <Progress value={33} className="h-2" />
                  <p className="text-xs text-purple-300 mt-1">1/3 victorias</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
