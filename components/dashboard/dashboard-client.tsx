
'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Brain, 
  Gamepad2, 
  MessageCircle, 
  Trophy, 
  Zap,
  Star,
  Target,
  Mic,
  Globe,
  Sparkles,
  ArrowRight,
  Play,
  User,
  Settings,
  LogOut,
  Menu,
  Home,
  Search,
  BarChart3,
  Clock,
  Flame,
  Award,
  BookOpenCheck,
  Languages,
  Crown,
  Gem,
  TrendingUp,
  Calendar,
  Headphones,
  PenTool,
  Video,
  FileText,
  Users,
  Rocket
} from 'lucide-react';
import { motion } from 'framer-motion';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

export function DashboardClient() {
  const { data: session } = useSession();
  const router = useRouter();
  const [currentStreak, setCurrentStreak] = useState(5);
  const [totalXP, setTotalXP] = useState(1250);
  const [wordsLearned, setWordsLearned] = useState(127);
  const [currentLevel, setCurrentLevel] = useState('A2');

  const mainFeatures = [
    {
      title: 'Diccionario Interactivo',
      description: 'Explora 1,100+ palabras con pronunciación y ejemplos',
      icon: BookOpenCheck,
      color: 'from-blue-500 to-cyan-500',
      href: '/dictionary',
      badge: '1,100+ palabras',
      stats: '127 aprendidas'
    },
    {
      title: 'Base de Verbos',
      description: 'Domina 1,000+ verbos con todas sus conjugaciones',
      icon: Languages,
      color: 'from-green-500 to-emerald-500',
      href: '/verbs',
      badge: '1,000+ verbos',
      stats: '45 dominados'
    },
    {
      title: 'IA Tutor Personal',
      description: 'Conversaciones inteligentes y corrección instantánea',
      icon: Brain,
      color: 'from-purple-500 to-pink-500',
      href: '/tutor',
      badge: 'Disponible 24/7',
      stats: '23 conversaciones'
    },
    {
      title: 'Juegos Educativos',
      description: 'Aprende jugando con quizzes y desafíos divertidos',
      icon: Gamepad2,
      color: 'from-orange-500 to-red-500',
      href: '/games',
      badge: '12 juegos',
      stats: '89% precisión'
    },
    {
      title: 'Clases Virtuales',
      description: 'Lecciones estructuradas desde A1 hasta C2',
      icon: Video,
      color: 'from-indigo-500 to-purple-500',
      href: '/lessons',
      badge: '6 niveles CEFR',
      stats: '3 completadas'
    },
    {
      title: 'Análisis de Progreso',
      description: 'Seguimiento detallado de tu avance y mejoras',
      icon: BarChart3,
      color: 'from-teal-500 to-blue-500',
      href: '/progress',
      badge: 'Reportes detallados',
      stats: '+15% esta semana'
    }
  ];

  const quickActions = [
    {
      title: 'Práctica de Pronunciación',
      description: 'Mejora tu speaking con IA',
      icon: Mic,
      color: 'from-purple-500 to-purple-600',
      href: '/pronunciation',
    },
    {
      title: 'Quiz Rápido',
      description: 'Test de 5 minutos',
      icon: Zap,
      color: 'from-yellow-500 to-orange-500',
      href: '/games/quick-quiz',
    },
    {
      title: 'Palabra del Día',
      description: 'Aprende algo nuevo',
      icon: Sparkles,
      color: 'from-pink-500 to-rose-500',
      href: '/dictionary/daily',
    },
    {
      title: 'Racha de Estudio',
      description: 'Mantén tu momentum',
      icon: Flame,
      color: 'from-red-500 to-orange-500',
      href: '/streak',
    }
  ];

  const recentAchievements = [
    { name: 'Primer Paso', description: 'Primera lección completada', icon: '🎯', date: 'Hace 2 días', color: 'from-blue-400 to-blue-600' },
    { name: 'Explorador de Palabras', description: '50 palabras aprendidas', icon: '📚', date: 'Hace 1 semana', color: 'from-green-400 to-green-600' },
    { name: 'Campeón de Quiz', description: 'Puntuación perfecta en 5 quizzes', icon: '🏆', date: 'Hace 2 semanas', color: 'from-yellow-400 to-yellow-600' },
    { name: 'Conversador', description: '10 chats con IA completados', icon: '💬', date: 'Hace 3 semanas', color: 'from-purple-400 to-purple-600' }
  ];

  const todayGoal = {
    target: 50,
    current: 32,
    percentage: (32 / 50) * 100,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-blue-900/20"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-400/10 via-transparent to-transparent"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-pink-500/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-500/5 to-transparent rounded-full blur-2xl"></div>

      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center space-x-4"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  English Master Pro
                </span>
                <div className="text-sm text-purple-200">Panel Principal</div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center space-x-6"
            >
              {/* XP Display */}
              <div className="flex items-center space-x-2 backdrop-blur-lg bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-4 py-2 rounded-full border border-yellow-400/20">
                <Crown className="w-5 h-5 text-yellow-400" />
                <span className="text-sm font-bold text-yellow-100">{totalXP} XP</span>
              </div>
              
              {/* Streak Display */}
              <div className="flex items-center space-x-2 backdrop-blur-lg bg-gradient-to-r from-red-500/20 to-orange-500/20 px-4 py-2 rounded-full border border-red-400/20">
                <Flame className="w-5 h-5 text-red-400" />
                <span className="text-sm font-bold text-red-100">{currentStreak} días</span>
              </div>
              
              {/* Level Badge */}
              <Badge className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-200 border border-blue-400/20 px-3 py-1">
                <Gem className="w-4 h-4 mr-1" />
                Nivel {currentLevel}
              </Badge>
              
              {/* Profile Menu */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/25">
                  <User className="w-5 h-5 text-white" />
                </div>
                <Button
                  variant="ghost"
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                ¡Bienvenido de vuelta, 
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                {session?.user?.name?.split(' ')[0] || 'Estudiante'}! 👋
              </span>
            </h1>
            <p className="text-xl text-purple-100 mb-8">¿Listo para continuar tu viaje de aprendizaje de inglés?</p>
            
            {/* Today's Goal - More Prominent */}
            <div className="max-w-2xl mx-auto backdrop-blur-lg bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="text-left">
                  <h3 className="text-2xl font-bold text-white flex items-center">
                    <Target className="w-7 h-7 mr-3 text-purple-300" />
                    Meta de Hoy
                  </h3>
                  <p className="text-purple-200 mt-2">
                    {todayGoal.current} / {todayGoal.target} XP hacia tu meta diaria
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                    {todayGoal.percentage.toFixed(0)}%
                  </div>
                  <div className="text-sm text-purple-300">Completado</div>
                </div>
              </div>
              <Progress value={todayGoal.percentage} className="h-4 mb-4" />
              <div className="text-sm text-purple-200 text-center">
                ¡Sigue así! Solo necesitas {todayGoal.target - todayGoal.current} XP más para alcanzar tu meta.
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Funcionalidades Principales
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mainFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                <Link href={feature.href}>
                  <Card className="backdrop-blur-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 group hover:scale-105 cursor-pointer h-full">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                          <feature.icon className="w-8 h-8 text-white" />
                        </div>
                        <Badge className="bg-purple-500/20 text-purple-200 border border-purple-400/30 text-xs">
                          {feature.badge}
                        </Badge>
                      </div>
                      <CardTitle className="text-white text-xl mb-2">{feature.title}</CardTitle>
                      <CardDescription className="text-purple-200 mb-4">{feature.description}</CardDescription>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-purple-300">{feature.stats}</span>
                        <ArrowRight className="w-4 h-4 text-purple-300 group-hover:text-white transition-colors" />
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6">Acciones Rápidas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                  >
                    <Link href={action.href}>
                      <Card className="backdrop-blur-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:shadow-xl group cursor-pointer">
                        <CardHeader className="pb-3">
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300`}>
                              <action.icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-white text-lg">{action.title}</CardTitle>
                              <CardDescription className="text-purple-200 text-sm">{action.description}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Study Streak */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
            >
              <Card className="backdrop-blur-lg bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-400/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center text-orange-300">
                    <Flame className="w-6 h-6 mr-3" />
                    Racha de Estudio
                  </CardTitle>
                  <CardDescription className="text-orange-200">
                    ¡Estás en llamas! Mantén el momentum.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-4xl font-bold text-orange-300 mb-1">{currentStreak}</div>
                      <div className="text-sm text-orange-400">Días consecutivos</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-semibold text-orange-300">Récord Personal: 12 días</div>
                      <div className="text-sm text-orange-400">{12 - currentStreak} días para superar tu récord</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Overview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Card className="backdrop-blur-lg bg-white/5 border border-white/10 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <BarChart3 className="w-6 h-6 mr-3 text-purple-300" />
                    Tu Progreso
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-purple-200">Palabras Aprendidas</span>
                    <span className="font-bold text-purple-300 text-lg">{wordsLearned}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-purple-200">Nivel Actual</span>
                    <Badge className="bg-purple-500/20 text-purple-200 border border-purple-400/30">{currentLevel}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-purple-200">Total XP</span>
                    <span className="font-bold text-yellow-300 text-lg">{totalXP}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-purple-200">Racha de Estudio</span>
                    <span className="font-bold text-orange-300 text-lg">{currentStreak} días</span>
                  </div>
                  <Progress value={75} className="h-3" />
                  <div className="text-center text-sm text-purple-300">
                    75% hacia el siguiente nivel
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Achievements */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <Card className="backdrop-blur-lg bg-white/5 border border-white/10 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Award className="w-6 h-6 mr-3 text-yellow-400" />
                    Logros Recientes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentAchievements.map((achievement, index) => (
                    <motion.div 
                      key={index} 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 1.0 + index * 0.1 }}
                      className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/5"
                    >
                      <div className={`w-10 h-10 bg-gradient-to-r ${achievement.color} rounded-full flex items-center justify-center text-lg shadow-lg`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-white text-sm">{achievement.name}</div>
                        <div className="text-xs text-purple-200">{achievement.description}</div>
                        <div className="text-xs text-purple-300">{achievement.date}</div>
                      </div>
                    </motion.div>
                  ))}
                  <Button 
                    className="w-full mt-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-400/30 hover:bg-purple-500/30 transition-all duration-300" 
                    size="sm"
                    onClick={() => router?.push?.('/profile')}
                  >
                    <Trophy className="w-4 h-4 mr-2" />
                    Ver Todos los Logros
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
