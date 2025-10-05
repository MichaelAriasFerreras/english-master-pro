
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
  ArrowLeft,
  Search,
  Volume2,
  Play,
  Pause,
  BookOpen,
  Filter,
  Globe,
  Sparkles,
  Eye,
  Star,
  Menu,
  X,
  Bell,
  User,
  LogOut,
  Loader2,
  ChevronDown,
  ChevronUp,
  Brain
} from 'lucide-react';
import Link from 'next/link';

interface WordData {
  id: string;
  english: string;
  spanish: string;
  level: string;
  pronunciation?: string | null;
  partOfSpeech?: string | null;
  definition?: string | null;
  examples?: string | null;
  difficulty: number;
  category?: string | null;
}

interface WordsResponse {
  words: WordData[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export function EnhancedDictionaryClient() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPartOfSpeech, setSelectedPartOfSpeech] = useState('all');
  const [words, setWords] = useState<WordData[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedWord, setSelectedWord] = useState<WordData | null>(null);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [expandedWords, setExpandedWords] = useState<Set<string>>(new Set());

  const userName = session?.user?.name?.split(' ')[0] || 'Estudiante';

  // Fetch words from API
  const fetchWords = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        ...(searchTerm && { search: searchTerm }),
        ...(selectedLevel !== 'all' && { level: selectedLevel }),
        ...(selectedCategory !== 'all' && { category: selectedCategory }),
        ...(selectedPartOfSpeech !== 'all' && { partOfSpeech: selectedPartOfSpeech }),
      });

      const response = await fetch(`/api/words?${params}`);
      const data: WordsResponse = await response.json();
      
      setWords(data.words);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching words:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedLevel, selectedCategory, selectedPartOfSpeech]);

  useEffect(() => {
    fetchWords();
  }, [currentPage, searchTerm, selectedLevel, selectedCategory, selectedPartOfSpeech]);

  const handlePlayPronunciation = (word: string, wordId: string) => {
    setIsPlaying(wordId);
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      utterance.onend = () => setIsPlaying(null);
      utterance.onerror = () => setIsPlaying(null);
      speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsPlaying(null), 1000);
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

  const toggleWordExpansion = (wordId: string) => {
    const newExpanded = new Set(expandedWords);
    if (newExpanded.has(wordId)) {
      newExpanded.delete(wordId);
    } else {
      newExpanded.add(wordId);
    }
    setExpandedWords(newExpanded);
  };

  const parseExamples = (examples: string | null | undefined): string[] => {
    if (!examples) return [];
    try {
      return JSON.parse(examples);
    } catch {
      return [examples];
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Back Button */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/dashboard')}
                className="text-white/80 hover:text-white hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Dashboard
              </Button>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2"
              >
                <div className="relative">
                  <Brain className="h-8 w-8 text-blue-400" />
                  <Sparkles className="h-3 w-3 text-yellow-400 absolute -top-1 -right-1" />
                </div>
                <div className="text-white">
                  <h1 className="text-xl font-bold">English Master Pro</h1>
                  <p className="text-xs text-white/60">Diccionario Avanzado</p>
                </div>
              </motion.div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/80 hover:text-white relative"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                </Button>
              </div>
              
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 text-white/80 hover:text-white"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={(session?.user as any)?.image || ''} />
                    <AvatarFallback className="bg-blue-600 text-white text-xs">
                      {userName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline">{userName}</span>
                  <Menu className="h-4 w-4" />
                </Button>

                {isMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 shadow-xl z-50"
                  >
                    <div className="py-2">
                      <Link href="/profile" className="flex items-center px-4 py-2 text-white/80 hover:text-white hover:bg-white/10">
                        <User className="h-4 w-4 mr-2" />
                        Mi Perfil
                      </Link>
                      <button
                        onClick={() => signOut()}
                        className="flex items-center w-full px-4 py-2 text-white/80 hover:text-white hover:bg-white/10"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Cerrar Sesión
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Diccionario Interactivo
          </h1>
          <p className="text-xl text-white/80 mb-6">
            Explora {pagination?.total || 0} palabras organizadas por niveles CEFR
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
              <Input
                type="text"
                placeholder="Buscar palabras..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-blue-400"
              />
            </div>

            {/* Level Filter */}
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Nivel CEFR" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los niveles</SelectItem>
                <SelectItem value="A1">A1 - Principiante</SelectItem>
                <SelectItem value="A2">A2 - Elemental</SelectItem>
                <SelectItem value="B1">B1 - Intermedio</SelectItem>
                <SelectItem value="B2">B2 - Intermedio Alto</SelectItem>
                <SelectItem value="C1">C1 - Avanzado</SelectItem>
                <SelectItem value="C2">C2 - Maestría</SelectItem>
              </SelectContent>
            </Select>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="travel">Viajes</SelectItem>
                <SelectItem value="business">Negocios</SelectItem>
                <SelectItem value="academic">Académico</SelectItem>
                <SelectItem value="daily_life">Vida Diaria</SelectItem>
                <SelectItem value="technology">Tecnología</SelectItem>
              </SelectContent>
            </Select>

            {/* Part of Speech Filter */}
            <Select value={selectedPartOfSpeech} onValueChange={setSelectedPartOfSpeech}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Tipo de palabra" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="noun">Sustantivo</SelectItem>
                <SelectItem value="verb">Verbo</SelectItem>
                <SelectItem value="adjective">Adjetivo</SelectItem>
                <SelectItem value="adverb">Adverbio</SelectItem>
                <SelectItem value="preposition">Preposición</SelectItem>
                <SelectItem value="conjunction">Conjunción</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Words Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
            <span className="ml-2 text-white">Cargando palabras...</span>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          >
            {words.map((word, index) => {
              const isExpanded = expandedWords.has(word.id);
              const examples = parseExamples(word.examples);
              
              return (
                <motion.div
                  key={word.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-xl font-bold text-white">{word.english}</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePlayPronunciation(word.english || '', word.id)}
                          className="text-blue-400 hover:text-blue-300 p-1"
                          disabled={isPlaying === word.id}
                        >
                          {isPlaying === word.id ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Volume2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <Badge className={`${getLevelColor(word.level)} border`}>
                        {word.level}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-lg text-blue-300">{word.spanish}</p>
                      <div className="flex items-center space-x-2">
                        {word.partOfSpeech && (
                          <Badge variant="outline" className="text-white/70 border-white/30">
                            {word.partOfSpeech}
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleWordExpansion(word.id)}
                          className="text-white/60 hover:text-white p-1"
                        >
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {word.pronunciation && (
                      <p className="text-sm text-white/60">/{word.pronunciation}/</p>
                    )}
                  </CardHeader>

                  <CardContent className="pt-0">
                    {word.definition && (
                      <p className="text-white/80 mb-3">{word.definition}</p>
                    )}

                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3"
                      >
                        {examples.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-white/90 mb-2">Ejemplos:</h4>
                            {examples.map((example, idx) => (
                              <div key={idx} className="bg-white/5 rounded-lg p-3 mb-2">
                                <p className="text-white/80 text-sm italic">{example}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between text-xs text-white/60">
                          {word.category && (
                            <span>Categoría: {word.category}</span>
                          )}
                          <div className="flex items-center">
                            <Star className="h-3 w-3 mr-1" />
                            <span>Dificultad: {word.difficulty}/5</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center space-x-2 mt-8"
          >
            <Button
              variant="outline"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Anterior
            </Button>
            
            <div className="flex items-center space-x-2">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const page = i + Math.max(1, currentPage - 2);
                if (page <= pagination.totalPages) {
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      onClick={() => setCurrentPage(page)}
                      className={
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                      }
                    >
                      {page}
                    </Button>
                  );
                }
                return null;
              })}
            </div>

            <Button
              variant="outline"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === pagination.totalPages}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Siguiente
            </Button>
          </motion.div>
        )}

        {/* Statistics */}
        {pagination && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-white/60 mt-6"
          >
            <p>
              Mostrando {(currentPage - 1) * pagination.limit + 1} - {Math.min(currentPage * pagination.limit, pagination.total)} 
              {' '}de {pagination.total} palabras
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
