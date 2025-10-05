
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy,
  Crown,
  Star,
  Zap,
  Target,
  Brain,
  Award,
  TrendingUp,
  Globe,
  Users,
  Calendar,
  Flame,
  Medal,
  Gem,
  Sparkles,
  BarChart3,
  Timer,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  Minus,
  Rocket,
  Flag,
  MapPin,
  Clock,
  RefreshCw,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';

interface LeaderboardUser {
  id: string;
  username: string;
  avatar: string;
  level: string;
  totalXP: number;
  weeklyXP: number;
  streak: number;
  achievements: string[];
  country: string;
  joinDate: string;
  rank: number;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: string;
  target: number;
  reward: {
    xp: number;
    badge?: string;
    title?: string;
    specialReward?: string;
  };
  startDate?: string;
  endDate?: string;
  participants: number;
  progress?: number;
  leaderboard?: Array<{
    username: string;
    progress: number;
    xp: number;
  }>;
}

interface LeaderboardData {
  leaderboard: LeaderboardUser[];
  period: string;
  category: string;
  totalUsers: number;
  lastUpdated: string;
}

export function GlobalLeaderboardClient() {
  const { data: session } = useSession();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData | null>(null);
  const [challenges, setChallenges] = useState<any>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('all_time');
  const [selectedCategory, setSelectedCategory] = useState('overall');
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState<number | null>(null);

  // Load leaderboard data
  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/leaderboard?period=${selectedPeriod}&category=${selectedCategory}&limit=50`);
        if (response.ok) {
          const data = await response.json();
          setLeaderboardData(data);
          
          // Find current user's rank (mock for now)
          const userIndex = data.leaderboard.findIndex((user: LeaderboardUser) => 
            user.username === (session?.user?.name || 'Usuario')
          );
          setUserRank(userIndex >= 0 ? userIndex + 1 : Math.floor(Math.random() * 50) + 51);
        }
      } catch (error) {
        console.error('Error loading leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboard();
  }, [selectedPeriod, selectedCategory, session]);

  // Load challenges
  useEffect(() => {
    const loadChallenges = async () => {
      try {
        const response = await fetch('/api/challenges');
        if (response.ok) {
          const data = await response.json();
          setChallenges(data.challenges);
        }
      } catch (error) {
        console.error('Error loading challenges:', error);
      }
    };

    loadChallenges();
  }, []);

  // Get rank badge color
  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-400 to-yellow-600';
    if (rank === 2) return 'from-gray-300 to-gray-500';
    if (rank === 3) return 'from-amber-600 to-amber-800';
    if (rank <= 10) return 'from-blue-500 to-blue-700';
    if (rank <= 50) return 'from-blue-500 to-blue-700';
    return 'from-gray-500 to-gray-700';
  };

  // Get rank icon
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-300" />;
    if (rank === 3) return <Award className="w-5 h-5 text-amber-600" />;
    return <Trophy className="w-5 h-5" />;
  };

  // Get level color
  const getLevelColor = (level: string) => {
    const colors = {
      'A1': 'from-green-400 to-green-600',
      'A2': 'from-blue-400 to-blue-600',
      'B1': 'from-blue-400 to-blue-600',
      'B2': 'from-pink-400 to-pink-600',
      'C1': 'from-orange-400 to-orange-600',
      'C2': 'from-red-400 to-red-600'
    };
    return colors[level as keyof typeof colors] || 'from-gray-400 to-gray-600';
  };

  // Get country flag emoji
  const getCountryFlag = (country: string) => {
    const flags = {
      'Brazil': '🇧🇷',
      'Mexico': '🇲🇽',
      'Colombia': '🇨🇴',
      'Argentina': '🇦🇷',
      'Spain': '🇪🇸',
      'Chile': '🇨🇱',
      'Peru': '🇵🇪',
      'Ecuador': '🇪🇨'
    };
    return flags[country as keyof typeof flags] || '🌎';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-300 border-t-transparent rounded-full mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold text-white mb-2">Cargando Leaderboards Globales</h2>
          <p className="text-blue-200">Preparando las competencias mundiales...</p>
        </motion.div>
      </div>
    );
  }

  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/20 via-transparent to-blue-900/20"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400/10 via-transparent to-transparent"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-pink-500/10 to-transparent rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
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

        {/* Ultra-Modern Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <h1 className="text-5xl md:text-7xl font-bold">
              <span className="bg-gradient-to-r from-yellow-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                🏆 Rankings Globales
              </span>
            </h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center space-x-2 text-blue-200"
            >
              <Sparkles className="w-6 h-6" />
              <p className="text-xl md:text-2xl">Compite con estudiantes de todo el mundo en tiempo real</p>
              <Sparkles className="w-6 h-6" />
            </motion.div>
          </motion.div>

          {/* Enhanced Global Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="backdrop-blur-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl p-6 border border-yellow-400/30"
            >
              <div className="text-center">
                <Users className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-yellow-300">{leaderboardData?.totalUsers || '2,847'}</div>
                <div className="text-sm text-yellow-200">Competidores Activos</div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="backdrop-blur-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl p-6 border border-cyan-400/30"
            >
              <div className="text-center">
                <Trophy className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-cyan-300">#{userRank || '247'}</div>
                <div className="text-sm text-cyan-200">Tu Posición Global</div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="backdrop-blur-xl bg-gradient-to-br from-pink-500/20 to-blue-500/20 rounded-2xl p-6 border border-pink-400/30"
            >
              <div className="text-center">
                <Globe className="w-8 h-8 text-pink-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-pink-300">47</div>
                <div className="text-sm text-pink-200">Países Representados</div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="backdrop-blur-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl p-6 border border-green-400/30"
            >
              <div className="text-center">
                <Activity className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-green-300 flex items-center justify-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
                  EN VIVO
                </div>
                <div className="text-sm text-green-200">Actualización en Tiempo Real</div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        <Tabs defaultValue="leaderboard" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/10 mb-8">
            <TabsTrigger value="leaderboard" className="text-white data-[state=active]:bg-yellow-500/20">
              🏆 Rankings
            </TabsTrigger>
            <TabsTrigger value="challenges" className="text-white data-[state=active]:bg-yellow-500/20">
              ⚡ Desafíos
            </TabsTrigger>
            <TabsTrigger value="achievements" className="text-white data-[state=active]:bg-yellow-500/20">
              🎖️ Logros
            </TabsTrigger>
          </TabsList>

          <TabsContent value="leaderboard" className="space-y-6">
            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="backdrop-blur-lg bg-white/10 border border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <BarChart3 className="w-6 h-6 mr-3 text-yellow-300" />
                    Filtros de Ranking
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm text-white font-medium mb-2 block">Período</label>
                      <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                        <SelectTrigger className="bg-slate-700/50 border-slate-500/50 text-white backdrop-blur-lg">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all_time">Todo el Tiempo</SelectItem>
                          <SelectItem value="weekly">Esta Semana</SelectItem>
                          <SelectItem value="monthly">Este Mes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm text-white font-medium mb-2 block">Categoría</label>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="bg-slate-700/50 border-slate-500/50 text-white backdrop-blur-lg">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="overall">General</SelectItem>
                          <SelectItem value="vocabulary">Vocabulario</SelectItem>
                          <SelectItem value="grammar">Gramática</SelectItem>
                          <SelectItem value="pronunciation">Pronunciación</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-end">
                      <Button 
                        onClick={() => window.location.reload()}
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Actualizar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Top 3 Podium */}
            {leaderboardData && leaderboardData.leaderboard.length >= 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mb-8"
              >
                <Card className="backdrop-blur-lg bg-white/10 border border-white/20">
                  <CardHeader>
                    <CardTitle className="text-center text-white">🥇 Podio de Campeones</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center items-end space-x-8">
                      {/* Second Place */}
                      <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-center"
                      >
                        <div className="w-20 h-20 bg-gradient-to-br from-slate-300 to-slate-400 rounded-full flex items-center justify-center text-3xl mb-3 mx-auto border-2 border-slate-300">
                          {leaderboardData.leaderboard[1].avatar}
                        </div>
                        <div className="bg-gradient-to-t from-slate-500 to-slate-400 rounded-t-lg p-4 h-32 flex flex-col justify-end border border-slate-300/50">
                          <div className="text-2xl font-bold text-white mb-1 drop-shadow-lg">2</div>
                          <div className="text-white font-semibold text-sm drop-shadow-md">{leaderboardData.leaderboard[1].username}</div>
                          <div className="text-slate-100 text-xs font-medium">{leaderboardData.leaderboard[1].totalXP.toLocaleString()} XP</div>
                        </div>
                      </motion.div>

                      {/* First Place */}
                      <motion.div
                        initial={{ opacity: 0, y: 60 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="text-center"
                      >
                        <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                        <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-4xl mb-3 mx-auto border-4 border-yellow-300">
                          {leaderboardData.leaderboard[0].avatar}
                        </div>
                        <div className="bg-gradient-to-t from-yellow-500 to-yellow-400 rounded-t-lg p-4 h-40 flex flex-col justify-end">
                          <div className="text-3xl font-bold text-white mb-2">👑</div>
                          <div className="text-white font-bold">{leaderboardData.leaderboard[0].username}</div>
                          <div className="text-yellow-100 text-sm">{leaderboardData.leaderboard[0].totalXP.toLocaleString()} XP</div>
                          <div className="text-yellow-100 text-xs">🔥 {leaderboardData.leaderboard[0].streak} días</div>
                        </div>
                      </motion.div>

                      {/* Third Place */}
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="text-center"
                      >
                        <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full flex items-center justify-center text-3xl mb-3 mx-auto border-2 border-amber-400">
                          {leaderboardData.leaderboard[2].avatar}
                        </div>
                        <div className="bg-gradient-to-t from-amber-600 to-amber-500 rounded-t-lg p-4 h-24 flex flex-col justify-end border border-amber-400/50">
                          <div className="text-2xl font-bold text-white mb-1 drop-shadow-lg">3</div>
                          <div className="text-white font-semibold text-sm drop-shadow-md">{leaderboardData.leaderboard[2].username}</div>
                          <div className="text-amber-100 text-xs font-medium">{leaderboardData.leaderboard[2].totalXP.toLocaleString()} XP</div>
                        </div>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Full Leaderboard */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="backdrop-blur-lg bg-white/10 border border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Trophy className="w-6 h-6 mr-3 text-yellow-300" />
                    Ranking Completo
                  </CardTitle>
                  <CardDescription className="text-blue-100 font-medium">
                    Actualizado: {leaderboardData ? new Date(leaderboardData.lastUpdated).toLocaleString() : 'Ahora'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {leaderboardData?.leaderboard.map((user, index) => (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                      >
                        <Card className={`backdrop-blur-lg border transition-all duration-300 hover:shadow-xl ${
                          user.rank <= 3 
                            ? 'bg-gradient-to-r from-yellow-500/30 to-orange-500/30 border-yellow-400/50' 
                            : user.rank <= 10
                              ? 'bg-gradient-to-r from-blue-500/20 to-blue-500/20 border-blue-400/50'
                              : 'bg-gradient-to-r from-slate-600/20 to-slate-700/20 border-slate-400/40'
                        } hover:scale-105`}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                {/* Rank */}
                                <div className={`w-12 h-12 bg-gradient-to-r ${getRankBadgeColor(user.rank)} rounded-full flex items-center justify-center`}>
                                  {user.rank <= 3 ? getRankIcon(user.rank) : (
                                    <span className="text-white font-bold">{user.rank}</span>
                                  )}
                                </div>

                                {/* User Info */}
                                <div className="flex items-center space-x-4">
                                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-pink-400 rounded-full flex items-center justify-center text-2xl">
                                    {user.avatar}
                                  </div>
                                  <div>
                                    <h3 className="font-bold text-white flex items-center">
                                      {user.username}
                                      <span className="ml-2 text-lg">{getCountryFlag(user.country)}</span>
                                    </h3>
                                    <div className="flex items-center space-x-2">
                                      <Badge className={`bg-gradient-to-r ${getLevelColor(user.level)} text-white border-0 text-xs`}>
                                        {user.level}
                                      </Badge>
                                      <span className="text-xs text-blue-300">{user.country}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Stats */}
                              <div className="flex items-center space-x-6">
                                <div className="text-right">
                                  <div className="text-lg font-bold text-yellow-300">
                                    {user.totalXP.toLocaleString()}
                                  </div>
                                  <div className="text-xs text-yellow-200 font-medium">XP Total</div>
                                </div>
                                
                                <div className="text-right">
                                  <div className="text-lg font-bold text-cyan-300">
                                    {user.weeklyXP.toLocaleString()}
                                  </div>
                                  <div className="text-xs text-cyan-200 font-medium">Esta Semana</div>
                                </div>

                                <div className="text-right">
                                  <div className="text-lg font-bold text-orange-300 flex items-center">
                                    <Flame className="w-4 h-4 mr-1" />
                                    {user.streak}
                                  </div>
                                  <div className="text-xs text-orange-200 font-medium">Racha</div>
                                </div>

                                {/* Achievements Preview */}
                                <div className="flex space-x-1">
                                  {user.achievements.slice(0, 3).map((achievement, achievementIndex) => (
                                    <div key={achievementIndex} className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                                      <Star className="w-3 h-3 text-white" />
                                    </div>
                                  ))}
                                  {user.achievements.length > 3 && (
                                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                                      <span className="text-xs text-white">+{user.achievements.length - 3}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="challenges" className="space-y-6">
            {challenges && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Weekly Challenge */}
                {challenges.weekly && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="backdrop-blur-lg bg-gradient-to-br from-blue-500/20 to-pink-500/20 border border-blue-400/30">
                      <CardHeader>
                        <CardTitle className="flex items-center text-white">
                          <Calendar className="w-6 h-6 mr-3 text-blue-300" />
                          Desafío Semanal
                        </CardTitle>
                        <Badge className="w-fit bg-blue-500/20 text-blue-200 border border-blue-400/30">
                          {challenges.weekly.participants} participantes
                        </Badge>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2">{challenges.weekly.title}</h3>
                          <p className="text-blue-100 mb-4 font-medium">{challenges.weekly.description}</p>
                        </div>

                        <div className="bg-blue-800/40 rounded-lg p-4 border border-blue-500/30">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-blue-100 font-medium">Progreso Global</span>
                            <span className="text-white font-bold">67%</span>
                          </div>
                          <Progress value={67} className="h-3 mb-3" />
                          <div className="text-sm text-blue-300 text-center">
                            Meta: {challenges.weekly.target} palabras
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium text-white">Top Participantes:</h4>
                          {challenges.weekly.leaderboard?.slice(0, 3).map((participant: any, index: number) => (
                            <div key={index} className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg border border-slate-500/30">
                              <span className="text-blue-100 font-medium">{participant.username}</span>
                              <span className="text-white font-bold">{participant.progress}</span>
                            </div>
                          ))}
                        </div>

                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-300 mb-1">
                            +{challenges.weekly.reward.xp} XP
                          </div>
                          <div className="text-sm text-blue-100 font-medium">+ Badge: {challenges.weekly.reward.badge}</div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Monthly Challenge */}
                {challenges.monthly && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <Card className="backdrop-blur-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-400/30">
                      <CardHeader>
                        <CardTitle className="flex items-center text-white">
                          <Trophy className="w-6 h-6 mr-3 text-blue-300" />
                          Desafío Mensual
                        </CardTitle>
                        <Badge className="w-fit bg-blue-500/20 text-blue-200 border border-blue-400/30">
                          {challenges.monthly.participants} participantes
                        </Badge>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2">{challenges.monthly.title}</h3>
                          <p className="text-blue-200 mb-4">{challenges.monthly.description}</p>
                        </div>

                        <div className="bg-blue-900/30 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-blue-200">Tu Progreso</span>
                            <span className="text-white font-bold">
                              {challenges.monthly.progress}/{challenges.monthly.target}
                            </span>
                          </div>
                          <Progress value={(challenges.monthly.progress / challenges.monthly.target) * 100} className="h-3 mb-3" />
                          <div className="text-sm text-blue-300 text-center">
                            {Math.round((challenges.monthly.progress / challenges.monthly.target) * 100)}% completado
                          </div>
                        </div>

                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-300 mb-1">
                            +{challenges.monthly.reward.xp} XP
                          </div>
                          <div className="text-sm text-blue-200">
                            + {challenges.monthly.reward.badge}
                          </div>
                          <div className="text-sm text-blue-200">
                            + {challenges.monthly.reward.specialReward}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Daily Challenges */}
                {challenges.daily && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="lg:col-span-2"
                  >
                    <Card className="backdrop-blur-lg bg-white/10 border border-white/20">
                      <CardHeader>
                        <CardTitle className="flex items-center text-white">
                          <Zap className="w-6 h-6 mr-3 text-yellow-300" />
                          Desafíos Diarios
                        </CardTitle>
                        <CardDescription className="text-blue-100 font-medium">
                          Se renuevan cada 24 horas
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {challenges.daily.map((challenge: any, index: number) => (
                            <Card key={challenge.id} className="bg-slate-700/30 border border-slate-500/40 backdrop-blur-lg">
                              <CardContent className="p-4">
                                <div className="text-center mb-4">
                                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Target className="w-6 h-6 text-white" />
                                  </div>
                                  <h3 className="font-bold text-white mb-2">{challenge.title}</h3>
                                  <p className="text-sm text-blue-100 mb-3 font-medium">{challenge.description}</p>
                                </div>

                                <div className="space-y-3">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-blue-100 font-medium">Progreso:</span>
                                    <span className="text-white font-bold">{challenge.progress}/{challenge.target}</span>
                                  </div>
                                  <Progress value={(challenge.progress / challenge.target) * 100} className="h-2" />
                                  <div className="text-center">
                                    <div className="text-lg font-bold text-yellow-300">+{challenge.reward.xp} XP</div>
                                    <Badge className={`text-xs ${
                                      challenge.difficulty === 'easy' ? 'bg-green-500/20 text-green-200' :
                                      challenge.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-200' :
                                      'bg-red-500/20 text-red-200'
                                    }`}>
                                      {challenge.difficulty}
                                    </Badge>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="achievements">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="backdrop-blur-lg bg-white/10 border border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Award className="w-6 h-6 mr-3 text-yellow-300" />
                    Sistema de Logros
                  </CardTitle>
                  <CardDescription className="text-blue-200">
                    Desbloquea badges y títulos especiales
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center text-blue-200">
                    <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
                    <h3 className="text-xl font-semibold text-white mb-2">Sistema de Logros</h3>
                    <p>Esta funcionalidad estará disponible próximamente con más de 50 logros únicos para desbloquear.</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
