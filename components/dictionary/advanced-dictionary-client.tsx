
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Simulación de datos del diccionario (en producción vendría de la API)
const mockDictionaryData = [
  {
    id: 1,
    word: "achievement",
    pronunciation: "əˈtʃiːvmənt",
    level: "B2",
    partOfSpeech: "noun",
    definition: "Something that has been accomplished successfully",
    translation: "logro, logro",
    example: "Getting a promotion was a great achievement.",
    exampleTranslation: "Conseguir un ascenso fue un gran logro.",
    frequency: "high",
    synonyms: ["accomplishment", "success", "attainment"]
  },
  {
    id: 2,
    word: "beautiful",
    pronunciation: "ˈbjuːtɪfl",
    level: "A1",
    partOfSpeech: "adjective",
    definition: "Pleasing to the senses or mind aesthetically",
    translation: "hermoso, bello",
    example: "The sunset was beautiful tonight.",
    exampleTranslation: "El atardecer estuvo hermoso esta noche.",
    frequency: "very high",
    synonyms: ["lovely", "gorgeous", "stunning"]
  },
  {
    id: 3,
    word: "challenging",
    pronunciation: "ˈtʃælɪndʒɪŋ",
    level: "B1",
    partOfSpeech: "adjective",
    definition: "Testing one's abilities; demanding",
    translation: "desafiante, difícil",
    example: "Learning English can be challenging but rewarding.",
    exampleTranslation: "Aprender inglés puede ser desafiante pero gratificante.",
    frequency: "medium",
    synonyms: ["difficult", "demanding", "tough"]
  },
  {
    id: 4,
    word: "determine",
    pronunciation: "dɪˈtɜːrmɪn",
    level: "B2",
    partOfSpeech: "verb",
    definition: "To establish exactly by research or calculation",
    translation: "determinar, establecer",
    example: "We need to determine the cause of the problem.",
    exampleTranslation: "Necesitamos determinar la causa del problema.",
    frequency: "high",
    synonyms: ["establish", "ascertain", "decide"]
  },
  {
    id: 5,
    word: "excellent",
    pronunciation: "ˈeksələnt",
    level: "A2",
    partOfSpeech: "adjective",
    definition: "Extremely good; outstanding",
    translation: "excelente",
    example: "She did an excellent job on the presentation.",
    exampleTranslation: "Ella hizo un trabajo excelente en la presentación.",
    frequency: "very high",
    synonyms: ["outstanding", "superb", "magnificent"]
  }
];

export function AdvancedDictionaryClient() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedPartOfSpeech, setSelectedPartOfSpeech] = useState('all');
  const [filteredWords, setFilteredWords] = useState(mockDictionaryData);
  const [selectedWord, setSelectedWord] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
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
    let filtered = mockDictionaryData;

    if (searchTerm) {
      filtered = filtered.filter(word => 
        word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.translation.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedLevel !== 'all') {
      filtered = filtered.filter(word => word.level === selectedLevel);
    }

    if (selectedPartOfSpeech !== 'all') {
      filtered = filtered.filter(word => word.partOfSpeech === selectedPartOfSpeech);
    }

    setFilteredWords(filtered);
  }, [searchTerm, selectedLevel, selectedPartOfSpeech]);

  const handlePlayPronunciation = (word: string) => {
    setIsPlaying(true);
    // Simular reproducción de audio
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
                <BookOpen className="h-8 w-8 text-purple-400 mr-3" />
                Diccionario Interactivo 3D
              </h1>
              <p className="text-gray-300 mt-2">
                Más de 10,000 palabras con pronunciación, definiciones y ejemplos visuales
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="glass-card">
              <CardContent className="p-4 text-center">
                <BookOpen className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">10,000+</div>
                <div className="text-sm text-gray-400">Palabras</div>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="p-4 text-center">
                <Volume2 className="h-6 w-6 text-green-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">Pronunciación</div>
                <div className="text-sm text-gray-400">Audio Real</div>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="p-4 text-center">
                <Eye className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">Visuales 3D</div>
                <div className="text-sm text-gray-400">Interactivos</div>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="p-4 text-center">
                <Globe className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">A1→C2</div>
                <div className="text-sm text-gray-400">Todos los Niveles</div>
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
                    placeholder="Buscar palabras en inglés o español..."
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

                <Select value={selectedPartOfSpeech} onValueChange={setSelectedPartOfSpeech}>
                  <SelectTrigger className="w-full md:w-40 bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/10">
                    <SelectItem value="all">Todas las Clases</SelectItem>
                    <SelectItem value="noun">Sustantivos</SelectItem>
                    <SelectItem value="verb">Verbos</SelectItem>
                    <SelectItem value="adjective">Adjetivos</SelectItem>
                    <SelectItem value="adverb">Adverbios</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Dictionary Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Words List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Filter className="h-5 w-5 text-purple-400 mr-2" />
                  Resultados ({filteredWords.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-96 overflow-y-auto">
                  {filteredWords.map((word, index) => (
                    <motion.div
                      key={word.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className={`p-4 border-b border-white/10 cursor-pointer hover:bg-white/5 transition-colors ${
                        selectedWord?.id === word.id ? 'bg-purple-600/20' : ''
                      }`}
                      onClick={() => setSelectedWord(word)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-white">{word.word}</h3>
                        <Badge className={getLevelColor(word.level)}>
                          {word.level}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-purple-400 text-sm">/{word.pronunciation}/</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlayPronunciation(word.word);
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
                      
                      <p className="text-gray-400 text-sm mb-1">{word.partOfSpeech}</p>
                      <p className="text-gray-300 text-sm">{word.translation}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Word Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            {selectedWord ? (
              <Card className="glass-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-2xl">{selectedWord.word}</CardTitle>
                    <Badge className={getLevelColor(selectedWord.level)}>
                      {selectedWord.level}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-purple-400">/{selectedWord.pronunciation}/</span>
                    <Button
                      size="sm"
                      onClick={() => handlePlayPronunciation(selectedWord.word)}
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
                      <BookOpen className="h-4 w-4 text-blue-400 mr-2" />
                      Definición
                    </h4>
                    <p className="text-gray-300">{selectedWord.definition}</p>
                    <p className="text-gray-400 mt-1 italic">{selectedWord.translation}</p>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold mb-2 flex items-center">
                      <MessageCircle className="h-4 w-4 text-green-400 mr-2" />
                      Ejemplo
                    </h4>
                    <div className="glass-card p-4 rounded-lg">
                      <p className="text-gray-300 mb-2">"{selectedWord.example}"</p>
                      <p className="text-gray-400 text-sm italic">"{selectedWord.exampleTranslation}"</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold mb-2 flex items-center">
                      <Sparkles className="h-4 w-4 text-yellow-400 mr-2" />
                      Sinónimos
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedWord.synonyms?.map((synonym: string, index: number) => (
                        <Badge key={index} className="bg-yellow-600/20 text-yellow-300 border-yellow-500/30">
                          {synonym}
                        </Badge>
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
                        <span className="text-gray-400">Clase gramatical:</span>
                        <span className="text-white">{selectedWord.partOfSpeech}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Frecuencia de uso:</span>
                        <span className="text-white">{selectedWord.frequency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Nivel CEFR:</span>
                        <Badge className={getLevelColor(selectedWord.level)}>
                          {selectedWord.level}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white">
                      <Star className="h-4 w-4 mr-2" />
                      Agregar a Favoritos
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="glass-card">
                <CardContent className="p-12 text-center">
                  <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Selecciona una palabra
                  </h3>
                  <p className="text-gray-400">
                    Haz clic en cualquier palabra de la lista para ver sus detalles completos, 
                    pronunciación y ejemplos.
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
