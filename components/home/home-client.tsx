
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Brain, 
  Sparkles, 
  Trophy, 
  Users,
  Play,
  ArrowRight,
  Star,
  BookOpen,
  Headphones,
  MessageCircle,
  Gamepad2,
  Zap,
  Target,
  Globe,
  Mic,
  TrendingUp,
  Award,
  Menu,
  X,
  Code
} from 'lucide-react';
import Link from 'next/link';

export function HomeClient() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [studyingNow, setStudyingNow] = useState<number | null>(null);

  // Initialize studying counter on client side only to avoid hydration issues
  useEffect(() => {
    // Base number of students + dynamic variation
    const baseStudents = 2847;
    const variation = Math.floor(Math.random() * 153); // Random variation 0-152
    setStudyingNow(baseStudents + variation);
    
    // Update every 30 seconds to show dynamic changes
    const interval = setInterval(() => {
      const newVariation = Math.floor(Math.random() * 153);
      setStudyingNow(baseStudents + newVariation);
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { name: 'Características', href: '#features', icon: Sparkles },
    { name: 'IA Tutor', href: '#ai-tutor', icon: Brain },
    { name: 'Competencias', href: '#competitions', icon: Trophy },
    { name: 'Demo', href: '#demo', icon: Play },
    { name: 'Acerca de', href: '/about', icon: Code },
  ];

  const features = [
    {
      icon: Brain,
      title: 'IA Tutor Conversacional',
      description: '6 personalidades únicas de tutores que se adaptan a tu estilo de aprendizaje',
      color: 'from-blue-500 to-pink-500'
    },
    {
      icon: Mic,
      title: 'Reconocimiento de Voz Avanzado',
      description: 'Análisis en tiempo real de pronunciación con feedback instantáneo',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Globe,
      title: 'Competencias Globales',
      description: 'Compite con estudiantes de todo el mundo en desafíos diarios',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: BookOpen,
      title: 'Diccionario Interactivo 3D',
      description: 'Más de 10,000 palabras con visualizaciones 3D y pronunciación',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Gamepad2,
      title: 'Juegos Educativos',
      description: 'Aprende jugando con quiz relámpago, memoria y emparejamiento',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: Award,
      title: 'Sistema de Logros',
      description: 'Desbloquea badges, sube de nivel y mantén tu racha de estudio',
      color: 'from-indigo-500 to-blue-500'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Palabras en Diccionario', icon: BookOpen },
    { number: '1,000+', label: 'Verbos Conjugados', icon: Zap },
    { number: '6', label: 'Tutores IA Únicos', icon: Brain },
    { number: 'A1→C2', label: 'Niveles Disponibles', icon: Target }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute floating-particle"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + i * 8}%`,
            }}
          >
            {i % 4 === 0 && <BookOpen className="h-6 w-6 text-blue-400/20" />}
            {i % 4 === 1 && <Headphones className="h-6 w-6 text-blue-400/20" />}
            {i % 4 === 2 && <MessageCircle className="h-6 w-6 text-pink-400/20" />}
            {i % 4 === 3 && <Gamepad2 className="h-6 w-6 text-green-400/20" />}
          </motion.div>
        ))}
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="fixed top-0 left-0 right-0 z-50 glass-nav"
      >
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
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.a
                      key={item.name}
                      href={item.href}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ 
                        scale: 1.05,
                        color: '#a855f7'
                      }}
                      className="text-gray-300 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </motion.a>
                  );
                })}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/auth/signin">
                <Button variant="ghost" className="text-white hover:text-blue-400">
                  Iniciar Sesión
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-gradient-to-r from-blue-600 to-pink-600 hover:from-blue-700 hover:to-pink-700 text-white shadow-lg glow-blue">
                  Comenzar Gratis
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
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

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 glass-card rounded-lg mt-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      className="text-gray-300 hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </a>
                  );
                })}
                <div className="pt-4 flex flex-col space-y-2">
                  <Link href="/auth/signin">
                    <Button variant="ghost" className="w-full text-white hover:text-blue-400">
                      Iniciar Sesión
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-pink-600 hover:from-blue-700 hover:to-pink-700 text-white">
                      Comenzar Gratis
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.nav>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center pt-16" id="hero">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Live Study Counter */}
            {studyingNow && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, type: "spring" }}
                className="mb-6"
              >
                <motion.div
                  animate={{ 
                    boxShadow: [
                      "0 0 20px rgba(59, 130, 246, 0.3)",
                      "0 0 40px rgba(59, 130, 246, 0.5)",
                      "0 0 20px rgba(59, 130, 246, 0.3)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-flex items-center space-x-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 border-2 border-blue-500/40 backdrop-blur-lg"
                >
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [1, 0.8, 1]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-green-500 rounded-full blur-md opacity-60"></div>
                    <div className="relative w-3 h-3 bg-green-400 rounded-full"></div>
                  </motion.div>
                  
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-blue-300" />
                    <motion.span 
                      key={studyingNow}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-xl font-bold bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent"
                    >
                      {studyingNow.toLocaleString()}
                    </motion.span>
                    <span className="text-blue-200 font-medium">estudiando ahora</span>
                  </div>
                  
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <TrendingUp className="h-4 w-4 text-green-400" />
                  </motion.div>
                </motion.div>
              </motion.div>
            )}

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <Badge className="bg-gradient-to-r from-blue-600/20 to-pink-600/20 text-blue-300 border-blue-500/30 px-4 py-2 text-sm">
                <Sparkles className="h-4 w-4 mr-2" />
                ¡Nueva versión con IA revolucionaria y reconocimiento de voz!
              </Badge>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
            >
              Domina el{' '}
              <span className="gradient-text">
                Inglés
              </span>{' '}
              con IA
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed"
            >
              La plataforma más avanzada para aprender inglés con 6 tutores IA únicos, 
              reconocimiento de voz en tiempo real, competencias globales y gamificación revolucionaria.
            </motion.p>

            {/* Feature highlights */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap justify-center gap-4 mb-10"
            >
              {[
                { icon: Brain, text: '6 Tutores IA Únicos' },
                { icon: Mic, text: 'Reconocimiento de Voz' },
                { icon: Globe, text: 'Competencias Globales' },
                { icon: Trophy, text: 'Sistema de Logros' }
              ].map((feature, index) => (
                <motion.div
                  key={feature.text}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center space-x-2 glass-card rounded-full px-4 py-2 hover-glow"
                >
                  <feature.icon className="h-5 w-5 text-blue-400" />
                  <span className="text-white text-sm font-medium">{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-pink-600 hover:from-blue-700 hover:to-pink-700 text-white px-8 py-6 text-lg font-semibold glow-blue hover-glow"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Comenzar Gratis Ahora
                </Button>
              </Link>
              
              <Link href="/dashboard">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/30 text-white hover:bg-white/10 glass-card px-8 py-6 text-lg font-semibold"
                >
                  <BookOpen className="h-5 w-5 mr-2" />
                  Explorar Dashboard
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ scale: 1.05 }}
                  className="glass-card rounded-xl p-6 text-center hover-glow"
                >
                  <stat.icon className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white mb-1">{stat.number}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 relative" id="features">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Funcionalidades <span className="gradient-text">Revolucionarias</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Descubre las herramientas más avanzadas para el aprendizaje de inglés, 
                potenciadas por inteligencia artificial de última generación.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <Card className="glass-card hover-glow h-full">
                    <CardContent className="p-8">
                      <div className="flex items-center mb-6">
                        <div className={`p-4 rounded-xl bg-gradient-to-r ${feature.color} shadow-lg`}>
                          <feature.icon className="h-8 w-8 text-white" />
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-white mb-4">
                        {feature.title}
                      </h3>
                      
                      <p className="text-gray-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Card className="glass-card p-12">
                <CardContent className="space-y-6">
                  <h2 className="text-4xl md:text-5xl font-bold text-white">
                    ¿Listo para <span className="gradient-text">Revolucionar</span> tu Inglés?
                  </h2>
                  
                  <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                    Únete a miles de estudiantes que ya están dominando el inglés 
                    con la tecnología más avanzada del mundo.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
                    <Link href="/auth/signup">
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-blue-600 to-pink-600 hover:from-blue-700 hover:to-pink-700 text-white px-8 py-6 text-lg font-semibold glow-blue hover-glow"
                      >
                        <Sparkles className="h-5 w-5 mr-2" />
                        Comenzar Mi Aventura
                      </Button>
                    </Link>
                    
                    <div className="flex items-center space-x-2 text-gray-400">
                      <div className="flex -space-x-2">
                        {[...Array(4)].map((_, i) => (
                          <div
                            key={i}
                            className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-pink-500 border-2 border-white/20"
                          />
                        ))}
                      </div>
                      <span className="text-sm">+10,000 estudiantes activos</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent" />
    </main>
  );
}
