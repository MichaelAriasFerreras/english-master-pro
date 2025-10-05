
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search,
  BookOpen,
  BarChart3,
  X,
  Volume2,
  ArrowRight,
  Filter,
  Clock,
  Star,
  Loader2
} from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  type: 'word' | 'verb';
  level?: string;
  pronunciation?: string;
  definition?: string;
  url: string;
}

interface GlobalSearchClientProps {
  onClose?: () => void;
  className?: string;
  placeholder?: string;
}

export function GlobalSearchClient({ onClose, className, placeholder = "Buscar palabras, verbos..." }: GlobalSearchClientProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [filter, setFilter] = useState<'all' | 'words' | 'verbs'>('all');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Mock data - In production, this would come from API
  const mockData: SearchResult[] = [
    // Words
    { id: '1', title: 'achievement', subtitle: 'logro, realización', type: 'word', level: 'B2', pronunciation: 'əˈtʃiːvmənt', definition: 'A thing done successfully, especially with effort, skill, or courage', url: '/dictionary?search=achievement' },
    { id: '2', title: 'beautiful', subtitle: 'hermoso, bello', type: 'word', level: 'A2', pronunciation: 'ˈbjuːtɪf(ə)l', definition: 'Pleasing the senses or mind aesthetically', url: '/dictionary?search=beautiful' },
    { id: '3', title: 'challenge', subtitle: 'desafío, reto', type: 'word', level: 'B1', pronunciation: 'ˈtʃælɪn(d)ʒ', definition: 'A call to take part in a contest or competition', url: '/dictionary?search=challenge' },
    { id: '4', title: 'democracy', subtitle: 'democracia', type: 'word', level: 'C1', pronunciation: 'dɪˈmɒkrəsi', definition: 'A system of government by the whole population', url: '/dictionary?search=democracy' },
    { id: '5', title: 'environment', subtitle: 'medio ambiente', type: 'word', level: 'B2', pronunciation: 'ɪnˈvaɪrənm(ə)nt', definition: 'The surroundings or conditions in which a person, animal, or plant lives', url: '/dictionary?search=environment' },
    
    // Verbs
    { id: '6', title: 'accomplish', subtitle: 'lograr, cumplir', type: 'verb', level: 'B2', pronunciation: 'əˈkʌmplɪʃ', definition: 'To achieve or complete successfully', url: '/verbs?search=accomplish' },
    { id: '7', title: 'believe', subtitle: 'creer', type: 'verb', level: 'A2', pronunciation: 'bɪˈliːv', definition: 'To accept that something is true', url: '/verbs?search=believe' },
    { id: '8', title: 'concentrate', subtitle: 'concentrarse', type: 'verb', level: 'B1', pronunciation: 'ˈkɒns(ə)ntreɪt', definition: 'To focus attention or effort', url: '/verbs?search=concentrate' },
    { id: '9', title: 'demonstrate', subtitle: 'demostrar', type: 'verb', level: 'B2', pronunciation: 'ˈdem(ə)nstreɪt', definition: 'To clearly show the existence or truth of something', url: '/verbs?search=demonstrate' },
    { id: '10', title: 'establish', subtitle: 'establecer', type: 'verb', level: 'C1', pronunciation: 'ɪˈstæblɪʃ', definition: 'To set up on a firm or permanent basis', url: '/verbs?search=establish' },
  ];

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Search functionality
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSelectedIndex(-1);
      return;
    }

    setIsLoading(true);
    
    // Simulate API delay
    const timeoutId = setTimeout(() => {
      let filtered = mockData.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
        item.definition?.toLowerCase().includes(query.toLowerCase())
      );

      // Apply type filter
      if (filter === 'words') {
        filtered = filtered.filter(item => item.type === 'word');
      } else if (filter === 'verbs') {
        filtered = filtered.filter(item => item.type === 'verb');
      }

      // Sort by relevance (exact matches first, then starts with, then contains)
      filtered.sort((a, b) => {
        const aTitle = a.title.toLowerCase();
        const bTitle = b.title.toLowerCase();
        const searchQuery = query.toLowerCase();

        if (aTitle === searchQuery) return -1;
        if (bTitle === searchQuery) return 1;
        if (aTitle.startsWith(searchQuery) && !bTitle.startsWith(searchQuery)) return -1;
        if (bTitle.startsWith(searchQuery) && !aTitle.startsWith(searchQuery)) return 1;
        
        return aTitle.localeCompare(bTitle);
      });

      setResults(filtered.slice(0, 8)); // Limit to 8 results
      setSelectedIndex(-1);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, filter]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, -1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleResultClick(results[selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, results, onClose]);

  const handleResultClick = (result: SearchResult) => {
    // Save to recent searches
    const newRecentSearches = [result.title, ...recentSearches.filter(s => s !== result.title)].slice(0, 5);
    setRecentSearches(newRecentSearches);
    localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));

    // Navigate to result
    router.push(result.url);
    onClose?.();
  };

  const handleRecentSearchClick = (search: string) => {
    setQuery(search);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const playPronunciation = (word: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const getLevelColor = (level?: string) => {
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

  return (
    <div className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg shadow-2xl ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="pl-10 pr-4 bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-purple-500"
            />
            {isLoading && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-4 h-4 animate-spin" />
            )}
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2 mt-3">
          <Button
            variant={filter === 'all' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}
          >
            Todo
          </Button>
          <Button
            variant={filter === 'words' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('words')}
            className={filter === 'words' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}
          >
            <BookOpen className="w-3 h-3 mr-1" />
            Palabras
          </Button>
          <Button
            variant={filter === 'verbs' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('verbs')}
            className={filter === 'verbs' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}
          >
            <BarChart3 className="w-3 h-3 mr-1" />
            Verbos
          </Button>
        </div>
      </div>

      {/* Results */}
      <div ref={resultsRef} className="max-h-96 overflow-y-auto">
        <AnimatePresence>
          {query.trim() === '' && recentSearches.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4"
            >
              <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Búsquedas recientes
              </h4>
              <div className="space-y-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecentSearchClick(search)}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors flex items-center"
                  >
                    <Search className="w-3 h-3 mr-2 text-gray-500" />
                    {search}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {results.length === 0 && query.trim() !== '' && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-8 text-center"
            >
              <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No se encontraron resultados para "{query}"</p>
              <p className="text-sm text-gray-500 mt-2">Intenta con una palabra diferente</p>
            </motion.div>
          )}

          {results.map((result, index) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className={`p-4 border-b border-white/5 cursor-pointer transition-colors ${
                selectedIndex === index ? 'bg-purple-500/20' : 'hover:bg-white/5'
              }`}
              onClick={() => handleResultClick(result)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    {result.type === 'word' ? (
                      <BookOpen className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    ) : (
                      <BarChart3 className="w-4 h-4 text-green-400 flex-shrink-0" />
                    )}
                    <h4 className="text-white font-medium truncate">{result.title}</h4>
                    {result.level && (
                      <Badge className={`text-xs ${getLevelColor(result.level)}`}>
                        {result.level}
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-purple-200 text-sm mb-2">{result.subtitle}</p>
                  
                  {result.pronunciation && (
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xs text-gray-400 font-mono">/{result.pronunciation}/</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          playPronunciation(result.title);
                        }}
                        className="p-1 h-6 w-6 text-gray-400 hover:text-purple-300"
                      >
                        <Volume2 className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                  
                  {result.definition && (
                    <p className="text-sm text-gray-400 line-clamp-2">{result.definition}</p>
                  )}
                </div>

                <ArrowRight className="w-4 h-4 text-gray-500 flex-shrink-0 ml-2" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer */}
      {results.length > 0 && (
        <div className="p-3 border-t border-white/10 text-center">
          <p className="text-xs text-gray-500">
            Usa ↑↓ para navegar, Enter para seleccionar, Esc para cerrar
          </p>
        </div>
      )}
    </div>
  );
}

// Global search modal component
export function GlobalSearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.95 }}
        className="w-full max-w-2xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <GlobalSearchClient onClose={onClose} />
      </motion.div>
    </motion.div>
  );
}
