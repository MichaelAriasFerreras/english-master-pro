
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
  RefreshCw,
  Zap,
  Target
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Verb {
  id: string;
  infinitive: string;
  thirdPersonSingular: string;
  presentParticiple: string;
  simplePast: string;
  pastParticiple: string;
  spanishTranslation: string;
  pronunciationIPA?: string;
  audioUrl?: string;
  level: string;
  category?: string;
  isIrregular: boolean;
  isModal: boolean;
  isPhrasal: boolean;
  examples?: string[];
  spanishExamples?: string[];
}

interface VerbsResponse {
  verbs: Verb[];
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

export default function InstantVerbsClient() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [verbs, setVerbs] = useState<Verb[]>([]);
  const [loading, setLoading] = useState(true);
  const [translationStatus, setTranslationStatus] = useState<TranslationStatus | null>(null);
  const [selectedVerb, setSelectedVerb] = useState<Verb | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [processingTranslations, setProcessingTranslations] = useState(false);

  // Cargar verbos inmediatamente
  const loadVerbs = async () => {
    try {
      const params = new URLSearchParams({
        search: searchTerm,
        level: selectedLevel,
        category: selectedCategory,
        limit: '100'
      });
      
      const response = await fetch(`/api/verbs?${params}`);
      const data: VerbsResponse = await response.json();
      setVerbs(data.verbs || []);
    } catch (error) {
      console.error('Error cargando verbos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Verificar estado de traducciones
  const checkTranslationStatus = async () => {
    try {
      const response = await fetch('/api/verbs/translate');
      const status: TranslationStatus = await response.json();
      setTranslationStatus(status);
    } catch (error) {
      console.error('Error verificando estado:', error);
    }
  };

  // Ejecutar traducción masiva
  const runMassiveTranslation = async () => {
    setProcessingTranslations(true);
    try {
      const response = await fetch('/api/verbs/translate', {
        method: 'POST'
      });
      const result = await response.json();
      
      if (result.success) {
        await checkTranslationStatus();
        await loadVerbs();
        console.log('✅ Traducción masiva completada');
      }
    } catch (error) {
      console.error('Error en traducción masiva:', error);
    } finally {
      setProcessingTranslations(false);
    }
  };

  useEffect(() => {
    checkTranslationStatus();
    loadVerbs();
  }, [searchTerm, selectedLevel, selectedCategory]);

  // Filtrar verbos por búsqueda
  const filteredVerbs = verbs.filter(verb =>
    verb.infinitive.toLowerCase().includes(searchTerm.toLowerCase()) ||
    verb.spanishTranslation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Verbos', href: '/verbs', icon: BookOpen, current: true },
    { name: 'Diccionario', href: '/dictionary', icon: Brain },
    { name: 'Juegos', href: '/games', icon: Gamepad2 },
    { name: 'Tutor IA', href: '/tutor', icon: MessageCircle },
    { name: 'Ranking', href: '/leaderboard', icon: Trophy },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Sidebar Mobile */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        <div className="fixed left-0 top-0 h-full w-64 bg-white/90 backdrop-blur-xl border-r border-gray-200/50 shadow-2xl">
          <div className="flex items-center justify-between p-4 border-b border-gray-200/50">
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              English Master Pro
            </h2>
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="p-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                  item.current
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-white/60 hover:shadow-md'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Header Sticky */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Verbos Master
              </h1>
            </div>
            
            {/* Translation Status */}
            {translationStatus && (
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  {translationStatus.translated}/{translationStatus.total} verbos
                  <span className="ml-2 text-blue-600 font-semibold">
                    {translationStatus.completion.toFixed(1)}%
                  </span>
                </div>
                {!translationStatus.isComplete && (
                  <Button
                    onClick={runMassiveTranslation}
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
                        Completar Traducciones
                      </>
                    )}
                  </Button>
                )}
              </div>
            )}

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-5 w-5" />
              </Button>
              <Avatar className="h-8 w-8">
                <AvatarImage src="" />
                <AvatarFallback>
                  {session?.user?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar verbos en inglés o español..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/80 backdrop-blur-sm border-gray-200/50"
              />
            </div>
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-full sm:w-40 bg-white/80 backdrop-blur-sm">
                <SelectValue placeholder="Nivel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los niveles</SelectItem>
                <SelectItem value="A1">A1 - Básico</SelectItem>
                <SelectItem value="A2">A2 - Elemental</SelectItem>
                <SelectItem value="B1">B1 - Intermedio</SelectItem>
                <SelectItem value="B2">B2 - Intermedio Alto</SelectItem>
                <SelectItem value="C1">C1 - Avanzado</SelectItem>
                <SelectItem value="C2">C2 - Nativo</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-40 bg-white/80 backdrop-blur-sm">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                <SelectItem value="action">Acción</SelectItem>
                <SelectItem value="movement">Movimiento</SelectItem>
                <SelectItem value="existence">Existencia</SelectItem>
                <SelectItem value="possession">Posesión</SelectItem>
                <SelectItem value="communication">Comunicación</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Verbs Grid */}
        {loading ? (
          <div className="text-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto text-blue-500 mb-4" />
            <p className="text-gray-600">Cargando verbos...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVerbs.map((verb, index) => (
              <motion.div
                key={verb.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card 
                  className="h-full bg-white/80 backdrop-blur-sm border-gray-200/50 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  onClick={() => setSelectedVerb(verb)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {verb.infinitive}
                      </CardTitle>
                      <div className="flex gap-2">
                        <Badge variant={verb.isIrregular ? 'destructive' : 'secondary'} className="text-xs">
                          {verb.level}
                        </Badge>
                        {verb.isIrregular && (
                          <Badge variant="outline" className="text-xs">
                            Irregular
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-blue-600 font-medium">
                      {verb.spanishTranslation}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-1">Conjugaciones:</h4>
                        <div className="text-xs text-gray-600 space-y-1">
                          <div><span className="font-medium">Presente:</span> {verb.thirdPersonSingular}</div>
                          <div><span className="font-medium">Pasado:</span> {verb.simplePast}</div>
                          <div><span className="font-medium">Participio:</span> {verb.pastParticiple}</div>
                        </div>
                      </div>
                      
                      {/* Mostrar ejemplos INMEDIATAMENTE sin estados de carga */}
                      {verb.examples && verb.examples.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-1">Ejemplo:</h4>
                          <div className="text-sm text-gray-600">
                            <p className="italic">"{verb.examples[0]}"</p>
                            {verb.spanishExamples && verb.spanishExamples[0] && (
                              <p className="text-blue-600 mt-1">"{verb.spanishExamples[0]}"</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {filteredVerbs.length === 0 && !loading && (
          <div className="text-center py-12">
            <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No se encontraron verbos</h3>
            <p className="text-gray-500">Intenta con diferentes términos de búsqueda o filtros</p>
          </div>
        )}
      </div>

      {/* Verb Detail Modal */}
      {selectedVerb && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">{selectedVerb.infinitive}</h2>
                  <p className="text-lg text-blue-600 font-medium">{selectedVerb.spanishTranslation}</p>
                </div>
                <Button variant="ghost" onClick={() => setSelectedVerb(null)}>
                  <X className="h-6 w-6" />
                </Button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Conjugaciones</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="font-medium">3ª persona:</span> {selectedVerb.thirdPersonSingular}</div>
                    <div><span className="font-medium">Gerundio:</span> {selectedVerb.presentParticiple}</div>
                    <div><span className="font-medium">Pasado:</span> {selectedVerb.simplePast}</div>
                    <div><span className="font-medium">Participio:</span> {selectedVerb.pastParticiple}</div>
                  </div>
                </div>

                {/* Mostrar TODOS los ejemplos inmediatamente */}
                {selectedVerb.examples && selectedVerb.examples.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Ejemplos y Traducciones</h3>
                    <div className="space-y-4">
                      {selectedVerb.examples.map((example, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-gray-900 font-medium italic">"{example}"</p>
                          {selectedVerb.spanishExamples?.[index] && (
                            <p className="text-blue-600 mt-2">"{selectedVerb.spanishExamples[index]}"</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
