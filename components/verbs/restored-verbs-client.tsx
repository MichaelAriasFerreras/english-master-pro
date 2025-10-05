
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ArrowLeft,
  Search,
  Volume2,
  Play,
  Pause,
  Brain,
  Filter,
  Sparkles,
  Star,
  Menu,
  X,
  Bell,
  User,
  LogOut,
  Loader2,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Clock,
  CheckCircle,
  AlertCircle,
  Globe,
  Target,
  Zap,
  Languages,
  TrendingUp,
  Calendar,
  Award,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';

interface VerbData {
  id: string;
  infinitive: string;
  thirdPersonSingular: string;
  presentParticiple: string;
  simplePast: string;
  pastParticiple: string;
  spanishTranslation: string;
  pronunciationIPA?: string | null;
  audioUrl?: string | null;
  level: string;
  category?: string | null;
  isIrregular: boolean;
  isModal: boolean;
  isPhrasal: boolean;
  examples?: string[] | string | null;
  spanishExamples?: string[] | string | null;
}

interface VerbsResponse {
  verbs: VerbData[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface TranslationStatus {
  total: number;
  translated: number;
  pending: number;
  completion: number;
  isComplete: boolean;
}

export default function RestoredVerbsClient() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filterIrregular, setFilterIrregular] = useState('all');
  const [filterModal, setFilterModal] = useState('all');
  const [filterPhrasal, setFilterPhrasal] = useState('all');
  const [verbs, setVerbs] = useState<VerbData[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVerb, setSelectedVerb] = useState<VerbData | null>(null);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [expandedVerbs, setExpandedVerbs] = useState<Set<string>>(new Set());
  const [translationStatus, setTranslationStatus] = useState<TranslationStatus | null>(null);
  const [processingTranslations, setProcessingTranslations] = useState(false);

  const userName = session?.user?.name?.split(' ')[0] || 'Estudiante';

  // Fetch verbs from API
  const fetchVerbs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '50',
        ...(searchTerm && { search: searchTerm }),
        ...(selectedLevel !== 'all' && { level: selectedLevel }),
        ...(selectedCategory !== 'all' && { category: selectedCategory }),
        ...(filterIrregular === 'true' && { irregular: 'true' }),
        ...(filterModal === 'true' && { modal: 'true' }),
        ...(filterPhrasal === 'true' && { phrasal: 'true' }),
      });

      const response = await fetch(`/api/verbs?${params}`);
      const data: VerbsResponse = await response.json();
      
      setVerbs(data.verbs || []);
      setPagination(data.pagination || null);
      
      // Auto-select first verb if none selected
      if (data.verbs && data.verbs.length > 0 && !selectedVerb) {
        setSelectedVerb(data.verbs[0]);
      }
    } catch (error) {
      console.error('Error fetching verbs:', error);
      setVerbs([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  // Check translation status
  const checkTranslationStatus = async () => {
    try {
      const response = await fetch('/api/verbs/translate');
      if (response.ok) {
        const status: TranslationStatus = await response.json();
        setTranslationStatus(status);
      }
    } catch (error) {
      console.error('Error checking translation status:', error);
    }
  };

  // Run mass translation (background process)
  const runMassTranslation = async () => {
    setProcessingTranslations(true);
    try {
      const response = await fetch('/api/verbs/translate', {
        method: 'POST'
      });
      
      if (response.ok) {
        await checkTranslationStatus();
        await fetchVerbs();
      }
    } catch (error) {
      console.error('Error running mass translation:', error);
    } finally {
      setProcessingTranslations(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedLevel, selectedCategory, filterIrregular, filterModal, filterPhrasal]);

  useEffect(() => {
    fetchVerbs();
  }, [currentPage, searchTerm, selectedLevel, selectedCategory, filterIrregular, filterModal, filterPhrasal]);

  useEffect(() => {
    checkTranslationStatus();
  }, []);

  // Audio functionality - RESTORED from enhanced-verbs-client.tsx
  const handlePlayPronunciation = (text: string, id: string, lang: string = 'en-US') => {
    setIsPlaying(id);
    
    if ('speechSynthesis' in window) {
      // Stop any current speech
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;
      utterance.onend = () => setIsPlaying(null);
      utterance.onerror = () => setIsPlaying(null);
      
      speechSynthesis.speak(utterance);
    } else {
      console.warn('Speech synthesis not supported');
      setTimeout(() => setIsPlaying(null), 1000);
    }
  };

  const playVerbForm = (form: string, formType: string) => {
    if (!selectedVerb) return;
    handlePlayPronunciation(form, `${selectedVerb.id}-${formType}`);
  };

  const playExample = (example: string, isSpanish: boolean = false, index: number = 0) => {
    if (!selectedVerb) return;
    const lang = isSpanish ? 'es-ES' : 'en-US';
    const id = `${selectedVerb.id}-example-${isSpanish ? 'es' : 'en'}-${index}`;
    handlePlayPronunciation(example, id, lang);
  };

  const selectVerb = (verb: VerbData) => {
    setSelectedVerb(verb);
    setIsPlaying(null); // Stop any current playback
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

  const toggleVerbExpansion = (verbId: string) => {
    const newExpanded = new Set(expandedVerbs);
    if (newExpanded.has(verbId)) {
      newExpanded.delete(verbId);
    } else {
      newExpanded.add(verbId);
    }
    setExpandedVerbs(newExpanded);
  };

  const parseExamples = (examples: string[] | string | null | undefined): string[] => {
    if (!examples) return [];
    if (Array.isArray(examples)) return examples;
    try {
      return JSON.parse(examples as string);
    } catch {
      return [examples as string];
    }
  };

  const parseSpanishExamples = (spanishExamples: string[] | string | null | undefined): string[] => {
    if (!spanishExamples) return [];
    if (Array.isArray(spanishExamples)) return spanishExamples;
    try {
      return JSON.parse(spanishExamples as string);
    } catch {
      return [spanishExamples as string];
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
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
                  <p className="text-xs text-white/60">Sistema de Verbos Avanzado</p>
                </div>
              </motion.div>
            </div>

            {/* Translation Status */}
            <div className="flex items-center space-x-4">
              {translationStatus && (
                <div className="flex items-center space-x-3">
                  <div className="text-sm text-white/70">
                    {translationStatus.translated}/{translationStatus.total} verbos
                    <span className="ml-2 text-blue-300 font-semibold">
                      {translationStatus.completion.toFixed(1)}%
                    </span>
                  </div>
                  {!translationStatus.isComplete && (
                    <Button
                      onClick={runMassTranslation}
                      disabled={processingTranslations}
                      size="sm"
                      className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                    >
                      {processingTranslations ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Procesando...
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4 mr-2" />
                          Acelerar
                        </>
                      )}
                    </Button>
                  )}
                </div>
              )}

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
        </div>
      </nav>

      {/* Main Two-Panel Layout */}
      <div className="flex h-screen pt-16">
        {/* Left Sidebar - Verbs List */}
        <div className="w-80 bg-white/5 backdrop-blur-sm border-r border-white/10 flex flex-col">
          {/* Search and Filters */}
          <div className="p-4 border-b border-white/10">
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                <Input
                  type="text"
                  placeholder="Buscar verbos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-blue-400"
                />
              </div>

              {/* Quick Filters */}
              <div className="grid grid-cols-2 gap-2">
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Nivel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="A1">A1</SelectItem>
                    <SelectItem value="A2">A2</SelectItem>
                    <SelectItem value="B1">B1</SelectItem>
                    <SelectItem value="B2">B2</SelectItem>
                    <SelectItem value="C1">C1</SelectItem>
                    <SelectItem value="C2">C2</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterIrregular} onValueChange={setFilterIrregular}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="true">Irregulares</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Statistics */}
              <div className="text-center">
                <p className="text-sm text-white/70">
                  {pagination?.total || 0} verbos encontrados
                </p>
              </div>
            </div>
          </div>

          {/* Verbs List */}
          <ScrollArea className="flex-1">
            <div className="p-2">
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
                  <span className="ml-2 text-white/70 text-sm">Cargando...</span>
                </div>
              ) : (
                <div className="space-y-1">
                  {verbs?.map((verb) => (
                    <motion.div
                      key={verb.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => selectVerb(verb)}
                      className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedVerb?.id === verb.id
                          ? 'bg-blue-600/30 border border-blue-400/50'
                          : 'bg-white/5 hover:bg-white/10 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-white truncate">
                            {verb.infinitive}
                          </h3>
                          <p className="text-sm text-blue-300 truncate">
                            {verb.spanishTranslation}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1 ml-2">
                          <Badge className={`${getLevelColor(verb.level)} text-xs px-1 py-0`}>
                            {verb.level}
                          </Badge>
                          {verb.isIrregular && (
                            <div className="w-2 h-2 bg-red-400 rounded-full" title="Irregular" />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )) || []}
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="p-4 border-t border-white/10">
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Anterior
                </Button>
                <span className="text-sm text-white/70">
                  {currentPage} / {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Verb Details */}
        <div className="flex-1 bg-white/3 overflow-auto">
          {selectedVerb ? (
            <div className="p-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Verb Header */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <h1 className="text-4xl font-bold text-white">
                        {selectedVerb.infinitive}
                      </h1>
                      <Button
                        variant="ghost"
                        size="lg"
                        onClick={() => playVerbForm(selectedVerb.infinitive, 'infinitive')}
                        className="text-blue-400 hover:text-blue-300 p-2"
                        disabled={isPlaying === `${selectedVerb.id}-infinitive`}
                      >
                        {isPlaying === `${selectedVerb.id}-infinitive` ? (
                          <Pause className="h-6 w-6" />
                        ) : (
                          <Volume2 className="h-6 w-6" />
                        )}
                      </Button>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge className={`${getLevelColor(selectedVerb.level)} border text-base px-3 py-1`}>
                        {selectedVerb.level}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-xl text-blue-300 mb-2">
                    {selectedVerb.spanishTranslation}
                  </p>

                  {selectedVerb.pronunciationIPA && (
                    <p className="text-white/60">
                      Pronunciación: /{selectedVerb.pronunciationIPA}/
                    </p>
                  )}

                  {/* Type badges */}
                  <div className="flex items-center space-x-2 mt-4">
                    {selectedVerb.isIrregular && (
                      <Badge variant="outline" className="text-red-300 border-red-500/30">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        Verbo Irregular
                      </Badge>
                    )}
                    {selectedVerb.isModal && (
                      <Badge variant="outline" className="text-yellow-300 border-yellow-500/30">
                        <Star className="h-4 w-4 mr-1" />
                        Verbo Modal
                      </Badge>
                    )}
                    {selectedVerb.isPhrasal && (
                      <Badge variant="outline" className="text-purple-300 border-purple-500/30">
                        <Globe className="h-4 w-4 mr-1" />
                        Phrasal Verb
                      </Badge>
                    )}
                    {selectedVerb.category && (
                      <Badge variant="outline" className="text-green-300 border-green-500/30">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        {selectedVerb.category}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Main Forms Cards with Audio */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-white/90">Pasado Simple</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => playVerbForm(selectedVerb.simplePast, 'past')}
                        className="text-blue-400 hover:text-blue-300 p-1"
                        disabled={isPlaying === `${selectedVerb.id}-past`}
                      >
                        <Volume2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-2xl font-bold text-green-300">
                      {selectedVerb.simplePast}
                    </p>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-white/90">Participio Pasado</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => playVerbForm(selectedVerb.pastParticiple, 'participle')}
                        className="text-blue-400 hover:text-blue-300 p-1"
                        disabled={isPlaying === `${selectedVerb.id}-participle`}
                      >
                        <Volume2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-2xl font-bold text-purple-300">
                      {selectedVerb.pastParticiple}
                    </p>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-white/90">Gerundio</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => playVerbForm(selectedVerb.presentParticiple, 'gerund')}
                        className="text-blue-400 hover:text-blue-300 p-1"
                        disabled={isPlaying === `${selectedVerb.id}-gerund`}
                      >
                        <Volume2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-2xl font-bold text-orange-300">
                      {selectedVerb.presentParticiple}
                    </p>
                  </motion.div>
                </div>

                {/* Examples Section with Audio */}
                {(() => {
                  const examples = parseExamples(selectedVerb.examples);
                  const spanishExamples = parseSpanishExamples(selectedVerb.spanishExamples);
                  
                  return examples.length > 0 && (
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                      <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                        <BookOpen className="h-5 w-5 mr-2" />
                        Ejemplos de Uso
                      </h3>
                      <div className="space-y-4">
                        {examples.slice(0, 5).map((example, idx) => (
                          <motion.div 
                            key={idx} 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-gradient-to-r from-white/5 to-white/10 rounded-lg p-4 border border-white/10 hover:border-blue-400/30 transition-all duration-300"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-white font-medium flex items-center">
                                <Globe className="h-4 w-4 mr-2 text-blue-400" />
                                Inglés:
                              </p>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => playExample(example, false, idx)}
                                className="text-blue-400 hover:text-blue-300 p-1 hover:bg-blue-400/10 rounded-full"
                                disabled={isPlaying === `${selectedVerb.id}-example-en-${idx}`}
                              >
                                <Volume2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="text-white/90 mb-3 italic font-medium text-lg">
                              "{example}"
                            </p>
                            
                            {spanishExamples[idx] && (
                              <>
                                <Separator className="my-3 bg-white/10" />
                                <div className="flex items-center justify-between mb-2">
                                  <p className="text-white font-medium flex items-center">
                                    <Languages className="h-4 w-4 mr-2 text-green-400" />
                                    Español:
                                  </p>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => playExample(spanishExamples[idx], true, idx)}
                                    className="text-green-400 hover:text-green-300 p-1 hover:bg-green-400/10 rounded-full"
                                    disabled={isPlaying === `${selectedVerb.id}-example-es-${idx}`}
                                  >
                                    <Volume2 className="h-4 w-4" />
                                  </Button>
                                </div>
                                <p className="text-green-300 italic font-medium text-lg">
                                  "{spanishExamples[idx]}"
                                </p>
                              </>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Languages className="w-16 h-16 text-white/30 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">Selecciona un Verbo</h3>
                <p className="text-white/60 text-sm">Haz clic en cualquier verbo de la lista para ver sus detalles</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
