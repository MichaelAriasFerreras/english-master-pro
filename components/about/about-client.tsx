
'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Code,
  Heart,
  MapPin,
  Mail,
  Facebook,
  Phone,
  Star,
  Sparkles,
  Trophy,
  ArrowLeft,
  Globe,
  User,
  Zap
} from 'lucide-react';
import Link from 'next/link';

interface AboutClientProps {
  session: any;
}

export function AboutClient({ session }: AboutClientProps) {
  const achievements = [
    {
      icon: Brain,
      title: 'Desarrollo con IA',
      description: 'Implementación de 6 tutores IA únicos con personalidades distintas',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Globe,
      title: 'Reconocimiento de Voz',
      description: 'Sistema avanzado de análisis de pronunciación en tiempo real',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Trophy,
      title: 'Gamificación Avanzada',
      description: 'Sistema completo de logros, niveles y competencias globales',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Zap,
      title: 'Rendimiento Optimizado',
      description: 'Aplicación de alta velocidad con tecnologías modernas',
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  const techStack = [
    'Next.js 14', 'React 18', 'TypeScript', 'Tailwind CSS',
    'Framer Motion', 'Prisma', 'NextAuth.js', 'OpenAI API',
    'Speech Recognition', 'Web Audio API'
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
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
              left: `${10 + i * 15}%`,
              top: `${20 + i * 10}%`,
            }}
          >
            {i % 3 === 0 && <Code className="h-6 w-6 text-purple-400/20" />}
            {i % 3 === 1 && <Heart className="h-6 w-6 text-pink-400/20" />}
            {i % 3 === 2 && <Star className="h-6 w-6 text-blue-400/20" />}
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
              <Link href="/" className="flex items-center space-x-2">
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
              </Link>
            </motion.div>

            {/* Back Button */}
            <div className="flex items-center space-x-4">
              <Link href={session ? "/dashboard" : "/"}>
                <Button variant="ghost" className="text-white hover:text-purple-400">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {session ? "Dashboard" : "Inicio"}
                </Button>
              </Link>
              
              {!session && (
                <Link href="/auth/signin">
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                    Iniciar Sesión
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      <div className="relative z-10 pt-20">
        {/* Hero Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <Badge className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-300 border-purple-500/30 px-4 py-2 text-sm mb-6">
                <Sparkles className="h-4 w-4 mr-2" />
                Desarrollador Dominicano
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Acerca de <span className="gradient-text">English Master Pro</span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Una plataforma revolucionaria para el aprendizaje de inglés, 
                creada con pasión y tecnología de vanguardia
              </p>
            </motion.div>

            {/* Developer Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="glass-card hover-glow">
                <CardContent className="p-8">
                  <div className="flex flex-col items-center text-center">
                    {/* Avatar */}
                    <div className="relative mb-6">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                        <User className="h-12 w-12 text-white" />
                      </div>
                      <motion.div
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.3, 0.7, 0.3]
                        }}
                        transition={{ 
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-lg"
                      />
                    </div>

                    {/* Developer Info */}
                    <h2 className="text-3xl font-bold text-white mb-2">
                      Michael Eduardo Arias Ferreras
                    </h2>
                    
                    <div className="flex items-center space-x-2 text-purple-300 mb-6">
                      <MapPin className="h-4 w-4" />
                      <span>República Dominicana</span>
                    </div>

                    <p className="text-gray-300 mb-8 max-w-2xl">
                      Desarrollador Full Stack apasionado por crear aplicaciones innovadoras que 
                      transforman la manera en que las personas aprenden idiomas. Con experiencia 
                      en tecnologías modernas y un enfoque en la experiencia del usuario.
                    </p>

                    {/* Contact Information */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
                      <motion.a
                        href="mailto:aerogunz01@gmail.com"
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center justify-center space-x-2 glass-card rounded-lg p-4 hover:bg-white/10 transition-colors"
                      >
                        <Mail className="h-5 w-5 text-purple-400" />
                        <span className="text-white text-sm">Email</span>
                      </motion.a>

                      <motion.a
                        href="https://www.facebook.com/michael.ariasferrera.5"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center justify-center space-x-2 glass-card rounded-lg p-4 hover:bg-white/10 transition-colors"
                      >
                        <Facebook className="h-5 w-5 text-blue-400" />
                        <span className="text-white text-sm">Facebook</span>
                      </motion.a>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center justify-center space-x-2 glass-card rounded-lg p-4"
                      >
                        <Phone className="h-5 w-5 text-green-400" />
                        <span className="text-white text-sm">849-285-3520</span>
                      </motion.div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Achievements Section */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Características <span className="gradient-text">Implementadas</span>
              </h2>
              <p className="text-gray-300 text-lg">
                Tecnologías avanzadas integradas en English Master Pro
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="glass-card hover-glow h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${achievement.color} shadow-lg flex-shrink-0`}>
                          <achievement.icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-2">
                            {achievement.title}
                          </h3>
                          <p className="text-gray-400 leading-relaxed">
                            {achievement.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <Card className="glass-card">
                <CardContent className="p-8">
                  <h2 className="text-3xl font-bold text-white mb-6">
                    Stack <span className="gradient-text">Tecnológico</span>
                  </h2>
                  
                  <p className="text-gray-300 mb-8">
                    Tecnologías modernas utilizadas en el desarrollo
                  </p>

                  <div className="flex flex-wrap justify-center gap-3">
                    {techStack.map((tech, index) => (
                      <motion.div
                        key={tech}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                        className="glass-card rounded-full px-4 py-2 hover:bg-white/10 transition-colors"
                      >
                        <span className="text-white text-sm font-medium">{tech}</span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Card className="glass-card">
                <CardContent className="p-12">
                  <Heart className="h-12 w-12 text-red-400 mx-auto mb-6" />
                  
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                    Hecho con <span className="gradient-text">Pasión</span>
                  </h2>
                  
                  <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                    English Master Pro fue desarrollado con dedicación para ayudar a miles 
                    de personas a dominar el inglés de manera divertida e innovadora.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link href={session ? "/dashboard" : "/auth/signup"}>
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg font-semibold glow-purple hover-glow"
                      >
                        <Sparkles className="h-5 w-5 mr-2" />
                        {session ? "Volver al Dashboard" : "Comenzar Ahora"}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </div>
    </main>
  );
}
