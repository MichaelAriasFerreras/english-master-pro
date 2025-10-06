
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { 
  PenTool, 
  Timer, 
  CheckCircle, 
  XCircle, 
  Trophy,
  ArrowLeft,
  RotateCcw,
  Zap,
  Target,
  TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Word {
  id: string;
  english: string;
  spanish: string;
}

interface SpeedTypingProps {
  onBack: () => void;
  onComplete: (score: number, timeSpent: number) => void;
}

export function SpeedTyping({ onBack, onComplete }: SpeedTypingProps) {
  const [words, setWords] = useState<Word[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [correctWords, setCorrectWords] = useState(0);
  const [totalWords, setTotalWords] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadWords();
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (gameStarted && timeLeft <= 0) {
      endGame();
    }
  }, [timeLeft, gameStarted]);

  useEffect(() => {
    if (gameStarted && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameStarted, currentWordIndex]);

  const loadWords = async () => {
    try {
      const response = await fetch('/api/games/words?count=50');
      const data = await response.json();
      if (data.words && data.words.length > 0) {
        setWords(data.words);
      } else {
        // Palabras de respaldo
        setWords([
          { id: '1', english: 'hello', spanish: 'hola' },
          { id: '2', english: 'world', spanish: 'mundo' },
          { id: '3', english: 'friend', spanish: 'amigo' },
          { id: '4', english: 'happy', spanish: 'feliz' },
          { id: '5', english: 'water', spanish: 'agua' }
        ]);
      }
    } catch (error) {
      console.error('Error cargando palabras:', error);
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setStartTime(Date.now());
    setScore(0);
    setCorrectWords(0);
    setTotalWords(0);
    setCurrentWordIndex(0);
    setInputValue('');
    setTimeLeft(60);
    setIsCorrect(null);
    
    // Iniciar temporizador
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    const currentWord = words[currentWordIndex];
    if (!currentWord) return;
    
    // Verificar si la palabra está completa
    if (value.toLowerCase().trim() === currentWord.english.toLowerCase()) {
      handleCorrectWord();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      checkWord();
    }
  };

  const checkWord = () => {
    const currentWord = words[currentWordIndex];
    if (!currentWord) return;
    
    const isWordCorrect = inputValue.toLowerCase().trim() === currentWord.english.toLowerCase();
    
    setTotalWords(prev => prev + 1);
    
    if (isWordCorrect) {
      handleCorrectWord();
    } else {
      setIsCorrect(false);
      setTimeout(() => {
        setIsCorrect(null);
        nextWord();
      }, 500);
    }
  };

  const handleCorrectWord = () => {
    setIsCorrect(true);
    setCorrectWords(prev => prev + 1);
    setScore(prev => prev + 100);
    
    // Calcular WPM
    const timeElapsed = (Date.now() - startTime) / 1000 / 60; // en minutos
    const currentWpm = Math.round((correctWords + 1) / timeElapsed);
    setWpm(currentWpm);
    
    setTimeout(() => {
      setIsCorrect(null);
      nextWord();
    }, 300);
  };

  const nextWord = () => {
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
      setInputValue('');
    } else {
      // Reiniciar palabras si se terminan
      setCurrentWordIndex(0);
      setInputValue('');
    }
  };

  const endGame = () => {
    setGameEnded(true);
    setGameStarted(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    saveScore(timeSpent);
  };

  const saveScore = async (timeSpent: number) => {
    try {
      const accuracy = totalWords > 0 ? (correctWords / totalWords) * 100 : 0;
      await fetch('/api/games/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId: 'speed_typing',
          score,
          maxScore: 6000, // 60 segundos * 100 puntos por palabra
          timeSpent,
          accuracy,
          details: { correctWords, totalWords, wpm }
        })
      });
      
      onComplete(score, timeSpent);
    } catch (error) {
      console.error('Error guardando puntaje:', error);
    }
  };

  const currentWord = words[currentWordIndex];

  if (!gameStarted && !gameEnded) {
    return (
      <Card className="backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center text-white text-2xl">
            <PenTool className="w-8 h-8 mr-3 text-teal-400" />
            Escritura Veloz
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="mb-8">
            <Zap className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
            <p className="text-lg text-purple-200 mb-6">
              ¡Escribe palabras en inglés lo más rápido posible! Mejora tu velocidad de escritura y ortografía.
            </p>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-purple-900/30 rounded-lg p-4">
                <Timer className="w-8 h-8 mx-auto mb-2 text-orange-400" />
                <div className="text-2xl font-bold text-white">60s</div>
                <div className="text-sm text-purple-200">Tiempo</div>
              </div>
              <div className="bg-purple-900/30 rounded-lg p-4">
                <Target className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                <div className="text-2xl font-bold text-white">∞</div>
                <div className="text-sm text-purple-200">Palabras</div>
              </div>
              <div className="bg-purple-900/30 rounded-lg p-4">
                <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                <div className="text-2xl font-bold text-white">60</div>
                <div className="text-sm text-purple-200">XP Max</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <Button
              onClick={startGame}
              className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white text-lg px-8 py-3"
            >
              <PenTool className="w-5 h-5 mr-2" />
              ¡Comenzar a Escribir!
            </Button>
            <br />
            <Button onClick={onBack} variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (gameEnded) {
    const accuracy = totalWords > 0 ? (correctWords / totalWords) * 100 : 0;
    
    return (
      <Card className="backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center text-white text-2xl">
            <Trophy className="w-8 h-8 mr-3 text-yellow-400" />
            ¡Tiempo Terminado!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="mb-8">
            <div className="text-6xl font-bold text-yellow-400 mb-2">{score}</div>
            <div className="text-xl text-purple-200 mb-6">Puntuación Final</div>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-purple-900/30 rounded-lg p-4">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-400" />
                <div className="text-2xl font-bold text-white">{correctWords}</div>
                <div className="text-sm text-purple-200">Palabras Correctas</div>
              </div>
              <div className="bg-purple-900/30 rounded-lg p-4">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                <div className="text-2xl font-bold text-white">{wpm}</div>
                <div className="text-sm text-purple-200">WPM</div>
              </div>
              <div className="bg-purple-900/30 rounded-lg p-4">
                <Target className="w-8 h-8 mx-auto mb-2 text-pink-400" />
                <div className="text-2xl font-bold text-white">{Math.round(accuracy)}%</div>
                <div className="text-sm text-purple-200">Precisión</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <Button
              onClick={() => {
                setGameEnded(false);
                startGame();
              }}
              className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 mr-3"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Jugar de Nuevo
            </Button>
            <Button onClick={onBack} variant="outline" className="border-white/20 text-white hover:bg-white/10">
              Elegir Otro Juego
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center text-white">
            <PenTool className="w-6 h-6 mr-3 text-teal-400" />
            Escritura Veloz
          </CardTitle>
          <div className="flex items-center space-x-4">
            <Badge className="bg-teal-500/20 text-teal-200 border border-teal-400/30">
              Palabras: {correctWords}
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-200 border border-blue-400/30">
              WPM: {wpm}
            </Badge>
            <Badge className={`${timeLeft <= 10 ? 'bg-red-500/20 text-red-200 border-red-400/30 animate-pulse' : 'bg-orange-500/20 text-orange-200 border-orange-400/30'}`}>
              <Timer className="w-4 h-4 mr-1" />
              {timeLeft}s
            </Badge>
          </div>
        </div>
        <Progress value={(timeLeft / 60) * 100} className="h-2 mt-4" />
      </CardHeader>
      
      <CardContent className="space-y-6">
        {currentWord && (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentWordIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="text-center"
            >
              <div className={`bg-gradient-to-br rounded-2xl p-8 mb-6 border transition-all duration-300 ${
                isCorrect === true
                  ? 'from-green-500/20 to-emerald-500/20 border-green-400/50'
                  : isCorrect === false
                    ? 'from-red-500/20 to-pink-500/20 border-red-400/50'
                    : 'from-teal-500/20 to-cyan-500/20 border-teal-400/30'
              }`}>
                <p className="text-sm text-purple-300 mb-2">Escribe esta palabra:</p>
                <h3 className="text-5xl font-bold text-white mb-4">{currentWord.english}</h3>
                <p className="text-xl text-purple-200">{currentWord.spanish}</p>
              </div>
              
              <div className="max-w-md mx-auto">
                <Input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe aquí..."
                  className="text-2xl text-center h-16 bg-white/10 border-white/20 text-white placeholder:text-purple-300"
                  autoComplete="off"
                  autoFocus
                />
                <p className="text-sm text-purple-300 mt-2">
                  Presiona Enter para verificar o escribe correctamente para avanzar automáticamente
                </p>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-purple-900/30 rounded-lg p-3">
                  <div className="text-2xl font-bold text-white">{correctWords}</div>
                  <div className="text-xs text-purple-200">Correctas</div>
                </div>
                <div className="bg-purple-900/30 rounded-lg p-3">
                  <div className="text-2xl font-bold text-white">{score}</div>
                  <div className="text-xs text-purple-200">Puntos</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </CardContent>
    </Card>
  );
}
