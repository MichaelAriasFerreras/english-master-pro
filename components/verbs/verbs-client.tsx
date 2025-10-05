
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search,
  Languages,
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
  RotateCcw,
  CheckCircle,
  Circle
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Verb {
  id: number;
  infinitive: string;
  pastSimple: string;
  pastParticiple: string;
  pronunciation: string;
  definition: string;
  translation: string;
  example: string;
  level: string;
  irregular: boolean;
  category: string;
}

interface Conjugation {
  tense: string;
  forms: {
    I: string;
    you: string;
    he_she_it: string;
    we: string;
    they: string;
  };
}

export function VerbsClient() {
  const [verbs, setVerbs] = useState<Verb[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedVerb, setSelectedVerb] = useState<Verb | null>(null);
  const [loading, setLoading] = useState(true);
  const [filteredVerbs, setFilteredVerbs] = useState<Verb[]>([]);
  const [showIrregularOnly, setShowIrregularOnly] = useState(false);

  // Mock data - en producción esto vendría de la API
  const mockVerbs: Verb[] = [
    {
      id: 1,
      infinitive: 'speak',
      pastSimple: 'spoke',
      pastParticiple: 'spoken',
      pronunciation: '/spiːk/',
      definition: 'to say words aloud; to talk to someone',
      translation: 'hablar',
      example: 'I speak English fluently.',
      level: 'A1',
      irregular: true,
      category: 'communication'
    },
    {
      id: 2,
      infinitive: 'run',
      pastSimple: 'ran',
      pastParticiple: 'run',
      pronunciation: '/rʌn/',
      definition: 'to move quickly using your legs',
      translation: 'correr',
      example: 'She runs every morning.',
      level: 'A1',
      irregular: true,
      category: 'movement'
    },
    {
      id: 3,
      infinitive: 'create',
      pastSimple: 'created',
      pastParticiple: 'created',
      pronunciation: '/kriˈeɪt/',
      definition: 'to make something new',
      translation: 'crear',
      example: 'Artists create beautiful paintings.',
      level: 'B1',
      irregular: false,
      category: 'action'
    },
    {
      id: 4,
      infinitive: 'understand',
      pastSimple: 'understood',
      pastParticiple: 'understood',
      pronunciation: '/ˌʌndərˈstænd/',
      definition: 'to know the meaning of something',
      translation: 'entender, comprender',
      example: 'Do you understand the question?',
      level: 'A2',
      irregular: true,
      category: 'mental'
    },
    {
      id: 5,
      infinitive: 'achieve',
      pastSimple: 'achieved',
      pastParticiple: 'achieved',
      pronunciation: '/əˈtʃiːv/',
      definition: 'to succeed in doing something',
      translation: 'lograr, alcanzar',
      example: 'She achieved her goals.',
      level: 'B2',
      irregular: false,
      category: 'accomplishment'
    }
  ];

  const categories = ['communication', 'movement', 'action', 'mental', 'accomplishment'];
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

  const generateConjugations = (verb: Verb): Conjugation[] => {
    // Mock conjugations - en producción esto vendría de la API
    return [
      {
        tense: 'Present Simple',
        forms: {
          I: `${verb.infinitive}`,
          you: `${verb.infinitive}`,
          he_she_it: verb.infinitive.endsWith('s') ? `${verb.infinitive}` : `${verb.infinitive}s`,
          we: `${verb.infinitive}`,
          they: `${verb.infinitive}`
        }
      },
      {
        tense: 'Past Simple',
        forms: {
          I: verb.pastSimple,
          you: verb.pastSimple,
          he_she_it: verb.pastSimple,
          we: verb.pastSimple,
          they: verb.pastSimple
        }
      },
      {
        tense: 'Present Perfect',
        forms: {
          I: `have ${verb.pastParticiple}`,
          you: `have ${verb.pastParticiple}`,
          he_she_it: `has ${verb.pastParticiple}`,
          we: `have ${verb.pastParticiple}`,
          they: `have ${verb.pastParticiple}`
        }
      },
      {
        tense: 'Future Simple',
        forms: {
          I: `will ${verb.infinitive}`,
          you: `will ${verb.infinitive}`,
          he_she_it: `will ${verb.infinitive}`,
          we: `will ${verb.infinitive}`,
          they: `will ${verb.infinitive}`
        }
      }
    ];
  };

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setVerbs(mockVerbs);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = verbs;
    
    if (searchTerm) {
      filtered = filtered.filter(verb => 
        verb.infinitive.toLowerCase().includes(searchTerm.toLowerCase()) ||
        verb.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
        verb.translation.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(verb => verb.category === selectedCategory);
    }

    if (showIrregularOnly) {
      filtered = filtered.filter(verb => verb.irregular);
    }
    
    setFilteredVerbs(filtered);
  }, [searchTerm, selectedCategory, verbs, showIrregularOnly]);

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
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/25">
                <Languages className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  Base de Verbos
                </h1>
                <p className="text-sm text-purple-200">Domina 1,000+ verbos con conjugaciones</p>
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
              <div className="flex flex-col gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 w-5 h-5" />
                  <Input
                    placeholder="Buscar verbos, definiciones o traducciones..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder-purple-300"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedCategory === 'all' ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory('all')}
                    className="transition-all duration-300"
                  >
                    Todas las Categorías
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? 'default' : 'outline'}
                      onClick={() => setSelectedCategory(category)}
                      className="transition-all duration-300 capitalize"
                    >
                      {category}
                    </Button>
                  ))}
                  <Button
                    variant={showIrregularOnly ? 'default' : 'outline'}
                    onClick={() => setShowIrregularOnly(!showIrregularOnly)}
                    className="transition-all duration-300"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Solo Irregulares
                  </Button>
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
              <div className="text-2xl font-bold text-green-300 mb-1">1,000+</div>
              <div className="text-sm text-purple-200">Verbos Totales</div>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-lg bg-white/5 border border-white/10">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-300 mb-1">45</div>
              <div className="text-sm text-purple-200">Dominados</div>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-lg bg-white/5 border border-white/10">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-300 mb-1">367</div>
              <div className="text-sm text-purple-200">Irregulares</div>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-lg bg-white/5 border border-white/10">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-300 mb-1">{filteredVerbs.length}</div>
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
            Verbo Aleatorio
          </Button>
          <Button className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-white border border-blue-400/30 hover:bg-blue-500/30 transition-all duration-300 h-16">
            <Target className="w-6 h-6 mr-3" />
            Quiz de Conjugaciones
          </Button>
          <Button className="bg-gradient-to-r from-red-500/20 to-orange-500/20 text-white border border-red-400/30 hover:bg-red-500/30 transition-all duration-300 h-16">
            <RotateCcw className="w-6 h-6 mr-3" />
            Práctica de Irregulares
          </Button>
        </motion.div>

        {/* Verbs List/Detail View */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Verbs List */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div className="space-y-4">
                {filteredVerbs.map((verb, index) => (
                  <motion.div
                    key={verb.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  >
                    <Card 
                      className={`backdrop-blur-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer ${
                        selectedVerb?.id === verb.id ? 'ring-2 ring-purple-400 bg-white/10' : ''
                      }`}
                      onClick={() => setSelectedVerb(verb)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <CardTitle className="text-white text-xl">
                                {verb.infinitive}
                              </CardTitle>
                              {verb.irregular && (
                                <Badge className="bg-gradient-to-r from-red-400 to-red-600 text-white border-0 text-xs">
                                  <RotateCcw className="w-3 h-3 mr-1" />
                                  Irregular
                                </Badge>
                              )}
                              <Badge className={`bg-gradient-to-r ${getLevelColor(verb.level)} text-white border-0 text-xs`}>
                                {verb.level}
                              </Badge>
                            </div>
                            <div className="text-purple-200 text-sm mb-2">
                              {verb.pronunciation}
                            </div>
                            <div className="text-purple-300 text-sm capitalize">
                              {verb.category}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-purple-300 hover:text-white"
                          >
                            <BookmarkPlus className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="grid grid-cols-3 gap-2 text-sm mb-3">
                          <div>
                            <div className="text-purple-400 text-xs">Infinitivo</div>
                            <div className="text-white font-medium">{verb.infinitive}</div>
                          </div>
                          <div>
                            <div className="text-purple-400 text-xs">Pasado</div>
                            <div className="text-white font-medium">{verb.pastSimple}</div>
                          </div>
                          <div>
                            <div className="text-purple-400 text-xs">Participio</div>
                            <div className="text-white font-medium">{verb.pastParticiple}</div>
                          </div>
                        </div>
                        <p className="text-purple-100 text-sm mb-2">{verb.definition}</p>
                        <p className="text-purple-300 text-sm">
                          <strong>Español:</strong> {verb.translation}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {filteredVerbs.length === 0 && !loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-white mb-2">No se encontraron verbos</h3>
                <p className="text-purple-200">Intenta con diferentes términos de búsqueda o filtros</p>
              </motion.div>
            )}
          </div>

          {/* Verb Detail Panel */}
          <div className="lg:col-span-1">
            {selectedVerb ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="backdrop-blur-lg bg-white/5 border border-white/10 shadow-xl sticky top-24">
                  <CardHeader>
                    <CardTitle className="text-white text-2xl mb-2">
                      {selectedVerb.infinitive}
                    </CardTitle>
                    <CardDescription className="text-purple-200">
                      {selectedVerb.definition}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="conjugations" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 bg-white/10">
                        <TabsTrigger value="conjugations" className="text-white">Conjugaciones</TabsTrigger>
                        <TabsTrigger value="examples" className="text-white">Ejemplos</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="conjugations" className="mt-4">
                        <div className="space-y-4">
                          {generateConjugations(selectedVerb).map((conjugation, index) => (
                            <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                              <h4 className="text-white font-medium mb-3">{conjugation.tense}</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-purple-300">I</span>
                                  <span className="text-white">{conjugation.forms.I}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-purple-300">You</span>
                                  <span className="text-white">{conjugation.forms.you}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-purple-300">He/She/It</span>
                                  <span className="text-white">{conjugation.forms.he_she_it}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-purple-300">We</span>
                                  <span className="text-white">{conjugation.forms.we}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-purple-300">They</span>
                                  <span className="text-white">{conjugation.forms.they}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="examples" className="mt-4">
                        <div className="space-y-4">
                          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                            <h4 className="text-white font-medium mb-2">Ejemplo Principal</h4>
                            <p className="text-purple-200 italic">"{selectedVerb.example}"</p>
                          </div>
                          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                            <h4 className="text-white font-medium mb-2">Traducción</h4>
                            <p className="text-purple-200">{selectedVerb.translation}</p>
                          </div>
                          <Button className="w-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-400/30 hover:bg-purple-500/30 transition-all duration-300">
                            <Brain className="w-4 h-4 mr-2" />
                            Practicar este Verbo
                          </Button>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <Card className="backdrop-blur-lg bg-white/5 border border-white/10 shadow-xl sticky top-24">
                <CardContent className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <Languages className="w-16 h-16 text-purple-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">Selecciona un Verbo</h3>
                    <p className="text-purple-200 text-sm">Haz clic en cualquier verbo para ver sus conjugaciones y ejemplos</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
