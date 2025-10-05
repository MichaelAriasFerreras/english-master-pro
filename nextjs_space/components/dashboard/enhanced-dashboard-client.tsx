
'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { NotificationsClient } from '@/components/notifications/notifications-client';
import { GlobalSearchModal } from '@/components/search/global-search-client';
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
  Calendar,
  Settings,
  LogOut,
  Bell,
  BellRing,
  Search,
  Mic,
  User,
  BarChart3,
  Zap,
  Target,
  TrendingUp,
  Clock,
  Star,
  Play,
  Award,
  Globe,
  Database,
  ChevronRight,
  Flame,
  Crown
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function EnhancedDashboardClient() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [currentProfileImage, setCurrentProfileImage] = useState<string>("");
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  // Initialize date on client side only to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Global search keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 🔄 Sincronización de imagen de perfil en tiempo real
  useEffect(() => {
    // Inicializar con la imagen actual de la sesión
    if ((session?.user as any)?.image) {
      setCurrentProfileImage((session?.user as any)?.image);
    }

    // Escuchar evento personalizado de actualización de imagen de perfil
    const handleProfileImageUpdate = (event: CustomEvent) => {
      const { imageUrl } = event.detail;
      console.log('🔄 Dashboard recibió actualización de imagen de perfil:', imageUrl);
      setCurrentProfileImage(imageUrl);
      
      // Opcional: Forzar actualización de la sesión en el dashboard también
      update();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('profile-image-updated', handleProfileImageUpdate as EventListener);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('profile-image-updated', handleProfileImageUpdate as EventListener);
      }
    };
  }, [(session?.user as any)?.image, update]);

  const userName = session?.user?.name?.split(' ')[0] || 'Estudiante';
  
  // Estado para el saludo para evitar errores de hidratación
  const [greeting, setGreeting] = useState('Hola');
  
  // UseEffect para actualizar el saludo después de la hidratación
  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) {
        setGreeting('Buenos días');
      } else if (hour < 18) {
        setGreeting('Buenas tardes');
      } else {
        setGreeting('Buenas noches');
      }
    };
    
    updateGreeting();
  }, []);

  // Memoize date formatting to avoid recalculation on every render
  const todayDate = currentTime ? currentTime.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : '';

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Diccionario', href: '/dictionary', icon: BookOpen },
    { name: 'Verbos', href: '/verbs', icon: BarChart3 },
    { name: 'Juegos', href: '/games', icon: Gamepad2 },
    { name: 'Tutor IA', href: '/tutor', icon: MessageCircle },
    { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
    { name: 'Acerca de', href: '/about', icon: User },
    { name: 'Admin Traducciones', href: '/admin/translations', icon: Database },
  ];

  const userMenuItems = [
    { name: 'Mi Perfil', href: '/profile', icon: User },
    { name: 'Dashboard', href: '/dashboard', icon: Home },
  ];

  const quickActions = [
    {
      icon: Brain,
      title: 'Chat con IA Tutor',
      description: '6 personalidades únicas',
      href: '/tutor',
      color: 'from-blue-500 to-cyan-500',
      badge: 'Nuevo'
    },
    {
      icon: BookOpen,
      title: 'Diccionario 3D',
      description: '10K+ palabras interactivas',
      href: '/dictionary',
      color: 'from-blue-500 to-cyan-500',
      badge: null
    },
    {
      icon: Gamepad2,
      title: 'Juegos Educativos',
      description: 'Aprende mientras juegas',
      href: '/games',
      color: 'from-green-500 to-emerald-500',
      badge: 'Popular'
    },
    {
      icon: Globe,
      title: 'Competencias Globales',
      description: 'Ranking mundial',
      href: '/leaderboard',
      color: 'from-yellow-500 to-orange-500',
      badge: 'En vivo'
    }
  ];

  const achievements = [
    { icon: Flame, title: 'Racha de 7 días', color: 'text-orange-400' },
    { icon: Star, title: 'Nivel B1 alcanzado', color: 'text-yellow-400' },
    { icon: Trophy, title: 'Top 100 Global', color: 'text-blue-400' },
    { icon: Crown, title: 'Primer lugar local', color: 'text-pink-400' }
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-black">
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
                <Brain className="h-8 w-8 text-blue-400" />
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
                  className="absolute inset-0 bg-blue-400 rounded-full blur-md"
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
                      whileHover={{ 
                        scale: 1.05,
                        y: -2
                      }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 ease-out flex items-center space-x-2 relative overflow-hidden group ${
                        isActive(item.href)
                          ? 'bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                          : 'text-gray-300 hover:text-white hover:shadow-lg hover:shadow-cyan-500/20'
                      }`}
                    >
                      {/* Gradient hover effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-cyan-500/20 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"></div>
                      
                      {/* Animated background glow */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                      
                      <Icon className="h-4 w-4 relative z-10 group-hover:text-cyan-300 transition-colors duration-300" />
                      <span className="relative z-10 group-hover:text-white transition-colors duration-300">{item.name}</span>
                    </motion.div>
                  </Link>
                );
              })}
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-300 hover:text-white hidden md:flex"
                onClick={() => setIsSearchOpen(true)}
                title="Buscar palabras y verbos (Ctrl+K)"
              >
                <Search className="h-4 w-4" />
              </Button>

              {/* Notifications */}
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-300 hover:text-white relative"
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                >
                  <BellRing className="h-4 w-4" />
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                    <span className="text-xs text-white font-bold">3</span>
                  </div>
                </Button>

                {/* Notifications Dropdown */}
                {isNotificationsOpen && (
                  <div className="absolute right-0 top-full mt-2 w-96 z-50">
                    <NotificationsClient 
                      onClose={() => setIsNotificationsOpen(false)}
                    />
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="relative group">
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 text-white hover:bg-white/10"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <Avatar className="h-8 w-8 border-2 border-blue-400/50">
                    <AvatarImage 
                      src={currentProfileImage || (session?.user as any)?.image || ""} 
                      alt={session?.user?.name || 'Usuario'} 
                      key={currentProfileImage || (session?.user as any)?.image || "default"}
                    />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm">
                      {session?.user?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block text-sm font-medium">
                    {userName}
                  </span>
                </Button>

                {/* Dropdown Menu */}
                <div className={`absolute right-0 top-full mt-2 w-52 glass-card rounded-xl shadow-2xl transition-all duration-300 z-50 border border-white/10 ${isUserMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                  <div className="p-3">
                    {userMenuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link key={item.name} href={item.href}>
                          <motion.div 
                            whileHover={{ x: 4 }}
                            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm text-gray-300 transition-all duration-300 ease-out relative overflow-hidden group/item hover:shadow-lg hover:shadow-cyan-500/10"
                          >
                            {/* Gradient background on hover */}
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-cyan-500/15 to-blue-500/10 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
                            
                            {/* Shimmer effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/item:translate-x-full transition-transform duration-500"></div>
                            
                            <Icon className="h-4 w-4 relative z-10 group-hover/item:text-cyan-300 transition-colors duration-300" />
                            <span className="relative z-10 group-hover/item:text-white font-medium transition-colors duration-300">{item.name}</span>
                            
                            {/* Highlight for "Mi Perfil" */}
                            {item.name === 'Mi Perfil' && (
                              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
                              </div>
                            )}
                          </motion.div>
                        </Link>
                      );
                    })}
                    <hr className="my-3 border-white/10" />
                    <motion.button
                      whileHover={{ x: 4 }}
                      onClick={() => signOut()}
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm text-red-400 transition-all duration-300 ease-out w-full relative overflow-hidden group/logout hover:shadow-lg hover:shadow-red-500/10"
                    >
                      {/* Red gradient background on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-red-400/15 to-red-500/10 opacity-0 group-hover/logout:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Red shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-300/10 to-transparent -translate-x-full group-hover/logout:translate-x-full transition-transform duration-500"></div>
                      
                      <LogOut className="h-4 w-4 relative z-10 group-hover/logout:text-red-300 transition-colors duration-300" />
                      <span className="relative z-10 group-hover/logout:text-red-200 font-medium transition-colors duration-300">Cerrar sesión</span>
                    </motion.button>
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
              <div className="px-2 pt-2 pb-3 space-y-1 glass-card rounded-xl mt-2 border border-white/5">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.name} href={item.href}>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ x: 8 }}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ease-out relative overflow-hidden group ${
                          isActive(item.href)
                            ? 'bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                            : 'text-gray-300 hover:text-white hover:shadow-lg hover:shadow-cyan-500/15'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {/* Gradient hover effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-cyan-500/20 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"></div>
                        
                        {/* Animated background glow */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                        
                        <Icon className="h-5 w-5 relative z-10 group-hover:text-cyan-300 transition-colors duration-300" />
                        <span className="relative z-10 group-hover:text-white transition-colors duration-300">{item.name}</span>
                        
                        {/* Accent dot for active state */}
                        {isActive(item.href) && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <div className="w-2 h-2 rounded-full bg-white/80"></div>
                          </div>
                        )}
                      </motion.div>
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
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-slate-900/40 to-blue-900/40 glass-card overflow-hidden relative">
            <CardContent className="p-8">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full blur-3xl"></div>
              </div>
              
              <div className="relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="mb-6 lg:mb-0">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      {isMounted && currentTime && (
                        <Badge className="mb-4 bg-white/10 text-blue-300 border-blue-500/30" suppressHydrationWarning>
                          <Calendar className="h-3 w-3 mr-1" />
                          {todayDate}
                        </Badge>
                      )}
                      
                      <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2" suppressHydrationWarning>
                        {greeting}, {userName}! 👋
                      </h1>
                      
                      <p className="text-xl text-gray-300 mb-4">
                        ¿Listo para continuar tu aventura de aprendizaje con IA?
                      </p>

                      <div className="flex flex-wrap gap-3">
                        <Badge className="bg-green-600/20 text-green-300 border-green-500/30">
                          <Zap className="h-3 w-3 mr-1" />
                          Racha: 7 días
                        </Badge>
                        <Badge className="bg-blue-600/20 text-blue-300 border-blue-500/30">
                          <Target className="h-3 w-3 mr-1" />
                          Nivel: B1
                        </Badge>
                        <Badge className="bg-yellow-600/20 text-yellow-300 border-yellow-500/30">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          +250 XP esta semana
                        </Badge>
                      </div>
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-center lg:text-right"
                  >
                    <div className="glass-card rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Meta Diaria
                      </h3>
                      <div className="flex items-center justify-center lg:justify-end space-x-2 mb-3">
                        <Clock className="h-5 w-5 text-blue-400" />
                        <span className="text-2xl font-bold text-white">12</span>
                        <span className="text-gray-300">/ 15 min</span>
                      </div>
                      <Progress value={80} className="mb-3" />
                      <p className="text-sm text-gray-400">
                        Solo 3 minutos más para completar tu meta! 🎯
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Zap className="h-6 w-6 text-blue-400 mr-2" />
            Acciones Rápidas
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <Link href={action.href}>
                  <Card className="glass-card hover-glow cursor-pointer h-full group">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${action.color} shadow-lg group-hover:scale-110 transition-transform`}>
                          <action.icon className="h-6 w-6 text-white" />
                        </div>
                        {action.badge && (
                          <Badge className="bg-blue-600/20 text-blue-300 border-blue-500/30 text-xs">
                            {action.badge}
                          </Badge>
                        )}
                      </div>
                      
                      <h3 className="font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">
                        {action.title}
                      </h3>
                      
                      <p className="text-gray-400 text-sm mb-4">
                        {action.description}
                      </p>

                      <motion.div
                        className="flex items-center text-blue-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                        whileHover={{ x: 5 }}
                      >
                        Explorar
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </motion.div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats and Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Progress Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="lg:col-span-2"
          >
            <Card className="glass-card h-full">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <BarChart3 className="h-5 w-5 text-blue-400 mr-2" />
                  Progreso de Aprendizaje
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300">Vocabulario</span>
                      <span className="text-white font-semibold">850/1000</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300">Gramática</span>
                      <span className="text-white font-semibold">720/1000</span>
                    </div>
                    <Progress value={72} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300">Pronunciación</span>
                      <span className="text-white font-semibold">650/1000</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300">Comprensión Auditiva</span>
                      <span className="text-white font-semibold">780/1000</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
          >
            <Card className="glass-card h-full">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <Trophy className="h-5 w-5 text-blue-400 mr-2" />
                  Logros Recientes
                </h3>
                
                <div className="space-y-4">
                  {achievements.map((achievement, index) => (
                    <motion.div
                      key={achievement.title}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.6 + index * 0.1 }}
                      className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 border border-white/10"
                    >
                      <achievement.icon className={`h-5 w-5 ${achievement.color}`} />
                      <span className="text-gray-300 text-sm">{achievement.title}</span>
                    </motion.div>
                  ))}
                  
                  <Button 
                    variant="outline" 
                    className="w-full mt-4 border-blue-500/30 text-blue-300 hover:bg-blue-500/10"
                    onClick={() => router?.push?.('/profile')}
                  >
                    Ver Todos los Logros
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
        >
          <Card className="glass-card">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Brain className="h-5 w-5 text-blue-400 mr-2" />
                Insights de IA Personalizado
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-semibold text-white mb-2">Fortaleza Detectada</h4>
                  <p className="text-gray-400 text-sm">Tu vocabulario ha mejorado un 15% esta semana. ¡Excelente progreso!</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-semibold text-white mb-2">Área de Mejora</h4>
                  <p className="text-gray-400 text-sm">Enfócate en los verbos irregulares. Te recomendamos 10 min diarios.</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Star className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-semibold text-white mb-2">Próximo Objetivo</h4>
                  <p className="text-gray-400 text-sm">¡Estás a solo 150 XP de alcanzar el nivel B2! Sigue así.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Global Search Modal */}
      <GlobalSearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </div>
  );
}
