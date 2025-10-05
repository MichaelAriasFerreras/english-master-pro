
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search,
  BookOpen,
  Volume2,
  Star,
  Filter,
  ArrowLeft,
  Play,
  BookmarkPlus,
  Trophy,
  Target,
  Clock,
  Brain,
  Shuffle,
  Headphones
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Word {
  id: number;
  word: string;
  pronunciation: string;
  partOfSpeech: string;
  definition: string;
  translation: string;
  level: string;
  example?: string;
  audioUrl?: string;
}

export function DictionaryClient() {
  const [words, setWords] = useState<Word[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [filteredWords, setFilteredWords] = useState<Word[]>([]);

  // Mock data - en producción esto vendría de la API
  const mockWords: Word[] = [
    {
      id: 1,
      word: 'beautiful',
      pronunciation: '/ˈbjuːtɪfəl/',
      partOfSpeech: 'adjective',
      definition: 'pleasing the senses or mind aesthetically',
      translation: 'hermoso, bello',
      level: 'A2',
      example: 'She has a beautiful smile.',
      audioUrl: '/audio/beautiful.mp3'
    },
    {
      id: 2,
      word: 'adventure',
      pronunciation: '/ədˈventʃər/',
      partOfSpeech: 'noun',
      definition: 'an unusual and exciting experience or activity',
      translation: 'aventura',
      level: 'B1',
      example: 'Their trip to the mountains was a great adventure.',
      audioUrl: '/audio/adventure.mp3'
    },
    {
      id: 3,
      word: 'sophisticated',
      pronunciation: '/səˈfɪstɪkeɪtɪd/',
      partOfSpeech: 'adjective',
      definition: 'having great knowledge or experience of the world',
      translation: 'sofisticado',
      level: 'C1',
      example: 'She has very sophisticated tastes in art.',
      audioUrl: '/audio/sophisticated.mp3'
    },
    {
      id: 4,
      word: 'extraordinary',
      pronunciation: '/ɪkˈstrɔːrdəneri/',
      partOfSpeech: 'adjective',
      definition: 'very unusual or remarkable',
      translation: 'extraordinario',
      level: 'B2',
      example: 'It was an extraordinary performance.',
      audioUrl: '/audio/extraordinary.mp3'
    },
    {
      id: 5,
      word: 'wonderful',
      pronunciation: '/ˈwʌndərfəl/',
      partOfSpeech: 'adjective',
      definition: 'inspiring delight, pleasure, or admiration',
      translation: 'maravilloso',
      level: 'A2',
      example: 'We had a wonderful time at the party.',
      audioUrl: '/audio/wonderful.mp3'
    }
  ];

  const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  const getLevelColor = (level: string) => {
    const colors = {
      'A1': 'from-green-400 to-green-600',
      'A2': 'from-blue-400 to-blue-600',
      'B1': 'from-yellow-400 to-yellow-600',
      'B2': 'from-orange-400 to-orange-600',
      'C1': 'from-red-400 to-red-600',
      'C2': 'from-purple-400 to-purple-600'
    };
    return colors[level as keyof typeof colors] || 'from-gray-400 to-gray-600';
  };

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setWords(mockWords);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = words;
    
    if (searchTerm) {
      filtered = filtered.filter(word => 
        word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.translation.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(word => word.level === selectedLevel);
    }
    
    setFilteredWords(filtered);
  }, [searchTerm, selectedLevel, words]);

  const playPronunciation = (audioUrl?: string) => {
    if (audioUrl) {
      // En producción aquí se reproduciría el audio
      console.log(`Playing audio: ${audioUrl}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-blue-900/20"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-400/10 via-transparent to-transparent"></div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  Diccionario Interactivo
                </h1>
                <p className="text-sm text-purple-200">Explora 1,100+ palabras con pronunciación</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Card className="backdrop-blur-lg bg-white/5 border border-white/10 shadow-xl">
            <CardHeader>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 w-5 h-5" />
                  <Input
                    placeholder="Buscar palabras, definiciones o traducciones..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder-purple-300"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={selectedLevel === 'all' ? 'default' : 'outline'}
                    onClick={() => setSelectedLevel('all')}
                    className="transition-all duration-300"
                  >
                    Todos
                  </Button>
                  {levels.map((level) => (
                    <Button
                      key={level}
                      variant={selectedLevel === level ? 'default' : 'outline'}
                      onClick={() => setSelectedLevel(level)}
                      className={`transition-all duration-300 ${
                        selectedLevel === level 
                          ? `bg-gradient-to-r ${getLevelColor(level)} text-white` 
                          : 'text-white border-white/20 hover:bg-white/10'
                      }`}
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <Card className="backdrop-blur-lg bg-white/5 border border-white/10">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-300 mb-1">1,100+</div>
              <div className="text-sm text-purple-200">Palabras Totales</div>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-lg bg-white/5 border border-white/10">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-300 mb-1">127</div>
              <div className="text-sm text-purple-200">Aprendidas</div>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-lg bg-white/5 border border-white/10">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-300 mb-1">23</div>
              <div className="text-sm text-purple-200">Favoritas</div>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-lg bg-white/5 border border-white/10">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-300 mb-1">{filteredWords.length}</div>
              <div className="text-sm text-purple-200">Resultados</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <Button className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-400/30 hover:bg-purple-500/30 transition-all duration-300 h-16">
            <Shuffle className="w-6 h-6 mr-3" />
            Palabra Aleatoria
          </Button>
          <Button className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-white border border-blue-400/30 hover:bg-blue-500/30 transition-all duration-300 h-16">
            <Target className="w-6 h-6 mr-3" />
            Quiz de Vocabulario
          </Button>
          <Button className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-white border border-green-400/30 hover:bg-green-500/30 transition-all duration-300 h-16">
            <Clock className="w-6 h-6 mr-3" />
            Palabra del Día
          </Button>
        </motion.div>

        {/* Words Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="backdrop-blur-lg bg-white/5 border border-white/10 animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-white/10 rounded mb-2"></div>
                  <div className="h-4 bg-white/10 rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-white/10 rounded mb-2"></div>
                  <div className="h-4 bg-white/10 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWords.map((word, index) => (
              <motion.div
                key={word.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                <Card className="backdrop-blur-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 group">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-white text-xl mb-2 group-hover:text-purple-200 transition-colors">
                          {word.word}
                        </CardTitle>
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className={`bg-gradient-to-r ${getLevelColor(word.level)} text-white border-0`}>
                            {word.level}
                          </Badge>
                          <Badge variant="outline" className="text-purple-300 border-purple-400/30">
                            {word.partOfSpeech}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2 text-purple-200 text-sm">
                          <span>{word.pronunciation}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => playPronunciation(word.audioUrl)}
                            className="p-1 h-auto text-purple-300 hover:text-white"
                          >
                            <Volume2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-purple-300 hover:text-white p-1"
                      >
                        <BookmarkPlus className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-purple-100 mb-3">{word.definition}</p>
                    <p className="text-purple-300 text-sm mb-3">
                      <strong>Español:</strong> {word.translation}
                    </p>
                    {word.example && (
                      <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                        <p className="text-purple-200 text-sm italic">
                          "{word.example}"
                        </p>
                      </div>
                    )}
                    <div className="flex justify-between items-center mt-4">
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-200 border border-purple-400/30 hover:bg-purple-500/30"
                      >
                        <Brain className="w-4 h-4 mr-2" />
                        Practicar
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => playPronunciation(word.audioUrl)}
                        className="text-purple-300 hover:text-white"
                      >
                        <Headphones className="w-4 h-4 mr-2" />
                        Escuchar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {filteredWords.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-2">No se encontraron palabras</h3>
            <p className="text-purple-200">Intenta con diferentes términos de búsqueda o filtros</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
