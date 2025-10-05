
'use client';

import { motion } from 'framer-motion';
import { 
  Brain, 
  Heart,
  Mail,
  Facebook,
  Phone,
  MapPin,
  Code,
  ExternalLink,
  Sparkles,
  Globe,
  Star,
  Zap
} from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <footer className="relative overflow-hidden">
      {/* Ultra-modern background with multiple gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-purple-900/90 to-slate-800/95" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      <div className="absolute inset-0 backdrop-blur-xl" />
      
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity
          }}
          className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 15,
            repeat: Infinity
          }}
          className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
        />
      </div>

      {/* Glassmorphism border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Enhanced Logo and Description */}
          <motion.div variants={itemVariants} className="space-y-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              animate={{
                boxShadow: [
                  "0 0 20px rgba(147, 51, 234, 0.3)",
                  "0 0 40px rgba(147, 51, 234, 0.5)",
                  "0 0 20px rgba(147, 51, 234, 0.3)"
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity
              }}
              className="flex items-center space-x-3 p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-white/10"
            >
              <div className="relative">
                <motion.div
                  animate={{ y: [-5, 5, -5] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity
                  }}
                >
                  <Brain className="h-10 w-10 text-purple-400" />
                </motion.div>
                <motion.div
                  animate={{ 
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.7, 0.3],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-lg"
                />
                <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-400 animate-pulse" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent">
                  English Master Pro
                </span>
                <div className="flex items-center space-x-1 mt-1">
                  <Star className="h-3 w-3 text-yellow-400" />
                  <span className="text-xs text-purple-300 font-medium">2025 EDITION</span>
                </div>
              </div>
            </motion.div>
            
            <motion.p 
              whileHover={{ scale: 1.02 }}
              className="text-gray-300 leading-relaxed p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
            >
              🚀 La plataforma más avanzada para aprender inglés con IA revolucionaria, 
              reconocimiento de voz y gamificación de próxima generación.
            </motion.p>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity
                }}
              >
                <Heart className="h-5 w-5 text-red-400" />
              </motion.div>
              <span className="text-gray-300 font-medium">Hecho con pasión en República Dominicana</span>
              <Globe className="h-4 w-4 text-blue-400" />
            </motion.div>
          </motion.div>

          {/* Enhanced Quick Links */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="flex items-center space-x-2">
              <Zap className="h-6 w-6 text-yellow-400" />
              <h3 className="text-white font-bold text-xl bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Enlaces Rápidos
              </h3>
            </div>
            <div className="space-y-3">
              {[
                { href: "/about", icon: Code, text: "Acerca del Desarrollador", color: "text-purple-400" },
                { href: "/dashboard", icon: Brain, text: "Dashboard Principal", color: "text-blue-400" },
                { href: "/auth/signup", icon: Sparkles, text: "Comenzar Gratis", color: "text-green-400" }
              ].map((link, index) => (
                <motion.div
                  key={link.href}
                  whileHover={{ x: 10, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    href={link.href}
                    className="group flex items-center space-x-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/30 transition-all duration-300"
                  >
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className={`p-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20`}
                    >
                      <link.icon className={`h-4 w-4 ${link.color} group-hover:text-white transition-colors`} />
                    </motion.div>
                    <span className="text-gray-300 group-hover:text-white transition-colors font-medium">
                      {link.text}
                    </span>
                    <ExternalLink className="h-3 w-3 text-gray-500 group-hover:text-purple-400 transition-colors ml-auto" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Enhanced Developer Contact */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="flex items-center space-x-2">
              <Code className="h-6 w-6 text-purple-400" />
              <h3 className="text-white font-bold text-xl bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Desarrollador
              </h3>
            </div>
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-blue-500/10 border border-white/20 backdrop-blur-sm"
            >
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    animate={{ 
                      boxShadow: [
                        "0 0 20px rgba(147, 51, 234, 0.3)",
                        "0 0 30px rgba(147, 51, 234, 0.5)",
                        "0 0 20px rgba(147, 51, 234, 0.3)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-purple-500/50"
                  >
                    <img 
                      src="/images/developer-photo.jpg" 
                      alt="Michael Eduardo Arias Ferreras"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 mix-blend-overlay" />
                  </motion.div>
                  <div>
                    <p className="font-bold text-white text-lg">Michael Eduardo Arias Ferreras</p>
                    <p className="text-sm text-purple-300 font-medium">Full Stack Developer & AI Engineer</p>
                    <div className="flex items-center space-x-2 text-purple-300 mt-1">
                      <MapPin className="h-3 w-3" />
                      <span className="text-xs font-medium">República Dominicana 🇩🇴</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { 
                      href: "mailto:aerogunz01@gmail.com", 
                      icon: Mail, 
                      text: "aerogunz01@gmail.com",
                      color: "hover:text-purple-400",
                      external: false
                    },
                    { 
                      href: "https://www.facebook.com/michael.ariasferrera.5", 
                      icon: Facebook, 
                      text: "Facebook Profile",
                      color: "hover:text-blue-400",
                      external: true
                    },
                    { 
                      href: "tel:+18492853520", 
                      icon: Phone, 
                      text: "849-285-3520",
                      color: "hover:text-green-400",
                      external: false
                    }
                  ].map((contact, index) => (
                    <motion.a
                      key={index}
                      href={contact.href}
                      target={contact.external ? "_blank" : undefined}
                      rel={contact.external ? "noopener noreferrer" : undefined}
                      whileHover={{ x: 5, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center space-x-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 ${contact.color} transition-all duration-300 group`}
                    >
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <contact.icon className="h-4 w-4" />
                      </motion.div>
                      <span className="font-medium">{contact.text}</span>
                      {contact.external && <ExternalLink className="h-3 w-3 ml-auto group-hover:text-purple-400" />}
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Enhanced Bottom Section */}
        <motion.div 
          variants={itemVariants}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 rounded-2xl blur-xl" />
          <div className="relative border-t border-white/20 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="text-center md:text-left p-4 rounded-xl bg-white/5 border border-white/10"
              >
                <p className="text-gray-300 font-medium">
                  © <span className="text-purple-400 font-bold">2025</span> English Master Pro
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Desarrollado con ❤️ por <span className="text-purple-300 font-medium">Michael Eduardo Arias Ferreras</span>
                </p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30"
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity
                  }}
                >
                  <Code className="h-5 w-5 text-purple-400" />
                </motion.div>
                <span className="font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Creador Dominicano
                </span>
                <Sparkles className="h-4 w-4 text-yellow-400 animate-pulse" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Enhanced decorative gradients */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
      <motion.div
        animate={{
          opacity: [0.5, 1, 0.5],
          scale: [1, 1.02, 1]
        }}
        transition={{
          duration: 3,
          repeat: Infinity
        }}
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 blur-sm"
      />
    </footer>
  );
}
