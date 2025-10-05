
'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Volume2,
  Play,
  Star,
  Filter,
  Globe,
  Mic,
  Eye,
  Headphones,
  Sparkles,
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Simulación de datos de verbos (en producción vendría de la API)
const mockVerbsData = [
  {
    id: 1,
    infinitive: "be",
    pastSimple: "was/were",
    pastParticiple: "been",
    translation: "ser/estar",
    irregular: true,
    level: "A1",
    frequency: "very high",
    example: "I am happy",
    exampleTranslation: "Estoy feliz",
    conjugations: {
      present: {
        I: "am",
        you: "are",
        he: "is",
        we: "are",
        they: "are"
      },
      past: {
        I: "was",
        you: "were", 
        he: "was",
        we: "were",
        they: "were"
      }
    }
  },
  {
    id: 2,
    infinitive: "go",
    pastSimple: "went",
    pastParticiple: "gone",
    translation: "ir",
    irregular: true,
    level: "A1",
    frequency: "very high",
    example: "I go to school",
    exampleTranslation: "Voy a la escuela",
    conjugations: {
      present: {
        I: "go",
        you: "go",
        he: "goes",
        we: "go",
        they: "go"
      },
      past: {
        I: "went",
        you: "went",
        he: "went",
        we: "went",
        they: "went"
      }
    }
  },
  {
    id: 3,
    infinitive: "work",
    pastSimple: "worked",
    pastParticiple: "worked",
    translation: "trabajar",
    irregular: false,
    level: "A1",
    frequency: "high",
    example: "I work at home",
    exampleTranslation: "Trabajo en casa",
    conjugations: {
      present: {
        I: "work",
        you: "work",
        he: "works",
        we: "work",
        they: "work"
      },
      past: {
        I: "worked",
        you: "worked",
        he: "worked",
        we: "worked",
        they: "worked"
      }
    }
  },
  {
    id: 4,
    infinitive: "think",
    pastSimple: "thought",
    pastParticiple: "thought",
    translation: "pensar",
    irregular: true,
    level: "A2",
    frequency: "high",
    example: "I think it's good",
    exampleTranslation: "Creo que está bien",
    conjugations: {
      present: {
        I: "think",
        you: "think",
        he: "thinks",
        we: "think",
        they: "think"
      },
      past: {
        I: "thought",
        you: "thought",
        he: "thought",
        we: "thought",
        they: "thought"
      }
    }
  },
  {
    id: 5,
    infinitive: "achieve",
    pastSimple: "achieved",
    pastParticiple: "achieved",
    translation: "lograr",
    irregular: false,
    level: "B1",
    frequency: "medium",
    example: "She achieved her goals",
    exampleTranslation: "Ella logró sus objetivos",
    conjugations: {
      present: {
        I: "achieve",
        you: "achieve",
        he: "achieves",
        we: "achieve",
        they: "achieve"
      },
      past: {
        I: "achieved",
        you: "achieved",
        he: "achieved",
        we: "achieved",
        they: "achieved"
      }
    }
  }
];

export function RevolutionaryVerbsClient() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [filteredVerbs, setFilteredVerbs] = useState(mockVerbsData);
  const [selectedVerb, setSelectedVerb] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedTense, setSelectedTense] = useState('present');
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
    let filtered = mockVerbsData;

    if (searchTerm) {
      filtered = filtered.filter(verb => 
        verb.infinitive.toLowerCase().includes(searchTerm.toLowerCase()) ||
        verb.translation.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedLevel !== 'all') {
      filtered = filtered.filter(verb => verb.level === selectedLevel);
    }

    if (selectedType !== 'all') {
      if (selectedType === 'irregular') {
        filtered = filtered.filter(verb => verb.irregular);
      } else {
        filtered = filtered.filter(verb => !verb.irregular);
      }
    }

    setFilteredVerbs(filtered);
  }, [searchTerm, selectedLevel, selectedType]);

  const handlePlayPronunciation = (word: string) => {
    setIsPlaying(true);
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      utterance.onend = () => setIsPlaying(false);
      speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsPlaying(false), 1000);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'A1': return 'bg-green-600/20 text-green-300 border-green-500/30';
      case 'A2': return 'bg-blue-600/20 text-blue-300 border-blue-500/30';
      case 'B1': return 'bg-yellow-600/20 text-yellow-300 border-yellow-500/30';
      case 'B2': return 'bg-orange-600/20 text-orange-300 border-orange-500/30';
      case 'C1': return 'bg-red-600/20 text-red-300 border-red-500/30';
      case 'C2': return 'bg-purple-600/20 text-purple-300 border-purple-500/30';
      default: return 'bg-gray-600/20 text-gray-300 border-gray-500/30';
    }
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
                <BarChart3 className="h-8 w-8 text-purple-400 mr-3" />
                Sistema de Verbos Avanzado
              </h1>
              <p className="text-gray-300 mt-2">
                Más de 1,000 verbos con conjugaciones completas y reconocimiento de patrones
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="glass-card">
              <CardContent className="p-4 text-center">
                <BarChart3 className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">1,000+</div>
                <div className="text-sm text-gray-400">Verbos</div>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="p-4 text-center">
                <XCircle className="h-6 w-6 text-red-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">300+</div>
                <div className="text-sm text-gray-400">Irregulares</div>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="p-4 text-center">
                <CheckCircle className="h-6 w-6 text-green-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">700+</div>
                <div className="text-sm text-gray-400">Regulares</div>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="p-4 text-center">
                <Clock className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">12</div>
                <div className="text-sm text-gray-400">Tiempos</div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar verbos en inglés o español..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-400"
                  />
                </div>
                
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger className="w-full md:w-40 bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/10">
                    <SelectItem value="all">Todos los Niveles</SelectItem>
                    <SelectItem value="A1">A1 - Principiante</SelectItem>
                    <SelectItem value="A2">A2 - Elemental</SelectItem>
                    <SelectItem value="B1">B1 - Intermedio</SelectItem>
                    <SelectItem value="B2">B2 - Intermedio Alto</SelectItem>
                    <SelectItem value="C1">C1 - Avanzado</SelectItem>
                    <SelectItem value="C2">C2 - Maestría</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-full md:w-40 bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/10">
                    <SelectItem value="all">Todos los Tipos</SelectItem>
                    <SelectItem value="regular">Regulares</SelectItem>
                    <SelectItem value="irregular">Irregulares</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Verbs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Verbs List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Filter className="h-5 w-5 text-purple-400 mr-2" />
                  Resultados ({filteredVerbs.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-96 overflow-y-auto">
                  {filteredVerbs.map((verb, index) => (
                    <motion.div
                      key={verb.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className={`p-4 border-b border-white/10 cursor-pointer hover:bg-white/5 transition-colors ${
                        selectedVerb?.id === verb.id ? 'bg-purple-600/20' : ''
                      }`}
                      onClick={() => setSelectedVerb(verb)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-white">{verb.infinitive}</h3>
                        <div className="flex items-center space-x-2">
                          <Badge className={getLevelColor(verb.level)}>
                            {verb.level}
                          </Badge>
                          <Badge className={verb.irregular 
                            ? 'bg-red-600/20 text-red-300 border-red-500/30'
                            : 'bg-green-600/20 text-green-300 border-green-500/30'
                          }>
                            {verb.irregular ? <XCircle className="h-3 w-3 mr-1" /> : <CheckCircle className="h-3 w-3 mr-1" />}
                            {verb.irregular ? 'Irregular' : 'Regular'}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 mb-2 text-sm">
                        <div>
                          <span className="text-gray-400">Pasado:</span>
                          <div className="text-purple-400">{verb.pastSimple}</div>
                        </div>
                        <div>
                          <span className="text-gray-400">Participio:</span>
                          <div className="text-purple-400">{verb.pastParticiple}</div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlayPronunciation(verb.infinitive);
                          }}
                          className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                        >
                          {isPlaying ? (
                            <Volume2 className="h-3 w-3" />
                          ) : (
                            <Play className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                      
                      <p className="text-gray-300 text-sm">{verb.translation}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Verb Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            {selectedVerb ? (
              <Card className="glass-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-2xl">{selectedVerb.infinitive}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge className={getLevelColor(selectedVerb.level)}>
                        {selectedVerb.level}
                      </Badge>
                      <Badge className={selectedVerb.irregular 
                        ? 'bg-red-600/20 text-red-300 border-red-500/30'
                        : 'bg-green-600/20 text-green-300 border-green-500/30'
                      }>
                        {selectedVerb.irregular ? <XCircle className="h-3 w-3 mr-1" /> : <CheckCircle className="h-3 w-3 mr-1" />}
                        {selectedVerb.irregular ? 'Irregular' : 'Regular'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-gray-300">{selectedVerb.translation}</span>
                    <Button
                      size="sm"
                      onClick={() => handlePlayPronunciation(selectedVerb.infinitive)}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    >
                      {isPlaying ? <Volume2 className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                      Pronunciar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="text-white font-semibold mb-2 flex items-center">
                      <Clock className="h-4 w-4 text-blue-400 mr-2" />
                      Formas Principales
                    </h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="glass-card p-3 rounded-lg text-center">
                        <div className="text-gray-400 text-sm mb-1">Infinitivo</div>
                        <div className="text-white font-semibold">{selectedVerb.infinitive}</div>
                      </div>
                      <div className="glass-card p-3 rounded-lg text-center">
                        <div className="text-gray-400 text-sm mb-1">Pasado Simple</div>
                        <div className="text-white font-semibold">{selectedVerb.pastSimple}</div>
                      </div>
                      <div className="glass-card p-3 rounded-lg text-center">
                        <div className="text-gray-400 text-sm mb-1">Participio Pasado</div>
                        <div className="text-white font-semibold">{selectedVerb.pastParticiple}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold mb-2 flex items-center">
                      <MessageCircle className="h-4 w-4 text-green-400 mr-2" />
                      Ejemplo
                    </h4>
                    <div className="glass-card p-4 rounded-lg">
                      <p className="text-gray-300 mb-2">"{selectedVerb.example}"</p>
                      <p className="text-gray-400 text-sm italic">"{selectedVerb.exampleTranslation}"</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold mb-2 flex items-center">
                      <Sparkles className="h-4 w-4 text-yellow-400 mr-2" />
                      Conjugaciones
                    </h4>
                    
                    <div className="mb-4">
                      <Select value={selectedTense} onValueChange={setSelectedTense}>
                        <SelectTrigger className="w-full bg-white/5 border-white/10 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-white/10">
                          <SelectItem value="present">Presente Simple</SelectItem>
                          <SelectItem value="past">Pasado Simple</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedVerb.conjugations[selectedTense] && Object.entries(selectedVerb.conjugations[selectedTense]).map(([pronoun, conjugation]) => (
                        <div key={pronoun} className="glass-card p-3 rounded-lg flex items-center justify-between">
                          <span className="text-gray-400 capitalize">{pronoun}:</span>
                          <span className="text-white font-semibold">{String(conjugation)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold mb-2 flex items-center">
                      <BarChart3 className="h-4 w-4 text-purple-400 mr-2" />
                      Información Adicional
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Frecuencia de uso:</span>
                        <span className="text-white">{selectedVerb.frequency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Nivel CEFR:</span>
                        <Badge className={getLevelColor(selectedVerb.level)}>
                          {selectedVerb.level}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Tipo:</span>
                        <Badge className={selectedVerb.irregular 
                          ? 'bg-red-600/20 text-red-300 border-red-500/30'
                          : 'bg-green-600/20 text-green-300 border-green-500/30'
                        }>
                          {selectedVerb.irregular ? 'Irregular' : 'Regular'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white">
                      <Star className="h-4 w-4 mr-2" />
                      Practicar Conjugaciones
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="glass-card">
                <CardContent className="p-12 text-center">
                  <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Selecciona un verbo
                  </h3>
                  <p className="text-gray-400">
                    Haz clic en cualquier verbo de la lista para ver sus conjugaciones completas, 
                    formas principales y ejemplos de uso.
                  </p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
