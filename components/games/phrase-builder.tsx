'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BackToGamesButton } from '@/components/ui/back-to-games-button';
import { 
  BookOpen, 
  Timer, 
  CheckCircle, 
  XCircle, 
  Trophy,
  ArrowLeft,
  RotateCcw,
  Target,
  Sparkles,
  Volume2,
  VolumeX
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Word {
  id: string;
  text: string;
  position: number;
}

interface Phrase {
  id: string;
  correctPhrase: string[];
  spanish: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface PhraseBuilderProps {
  onBack: () => void;
  onComplete: (score: number, timeSpent: number) => void;
}

export function PhraseBuilder({ onBack, onComplete }: PhraseBuilderProps) {
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [availableWords, setAvailableWords] = useState<Word[]>([]);
  const [selectedWords, setSelectedWords] = useState<Word[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [correctPhrases, setCorrectPhrases] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadPhrases();
    
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

  const loadPhrases = async () => {
    try {
      // Frases de ejemplo para el juego
      const samplePhrases: Phrase[] = [
        {
          id: '1',
          correctPhrase: ['I', 'am', 'learning', 'English'],
          spanish: 'Estoy aprendiendo inglés',
          difficulty: 'easy'
        },
        {
          id: '2',
          correctPhrase: ['She', 'likes', 'to', 'read', 'books'],
          spanish: 'A ella le gusta leer libros',
          difficulty: 'easy'
        },
        {
          id: '3',
          correctPhrase: ['We', 'are', 'going', 'to', 'the', 'park'],
          spanish: 'Vamos al parque',
          difficulty: 'easy'
        },
        {
          id: '4',
          correctPhrase: ['They', 'have', 'been', 'studying', 'all', 'day'],
          spanish: 'Han estado estudiando todo el día',
          difficulty: 'medium'
        },
        {
          id: '5',
          correctPhrase: ['If', 'I', 'had', 'known', 'I', 'would', 'have', 'helped'],
          spanish: 'Si hubiera sabido, habría ayudado',
          difficulty: 'hard'
        },
        {
          id: '6',
          correctPhrase: ['The', 'weather', 'is', 'beautiful', 'today'],
          spanish: 'El clima está hermoso hoy',
          difficulty: 'easy'
        },
        {
          id: '7',
          correctPhrase: ['My', 'brother', 'works', 'in', 'a', 'hospital'],
          spanish: 'Mi hermano trabaja en un hospital',
          difficulty: 'easy'
        },
        {
          id: '8',
          correctPhrase: ['Could', 'you', 'please', 'help', 'me', 'with', 'this'],
          spanish: '¿Podrías ayudarme con esto, por favor?',
          difficulty: 'medium'
        },
        {
          id: '9',
          correctPhrase: ['I', 'wish', 'I', 'could', 'speak', 'English', 'fluently'],
          spanish: 'Desearía poder hablar inglés con fluidez',
          difficulty: 'medium'
        },
        {
          id: '10',
          correctPhrase: ['She', 'has', 'been', 'working', 'here', 'for', 'five', 'years'],
          spanish: 'Ella ha estado trabajando aquí durante cinco años',
          difficulty: 'hard'
        }
      ];
      
      setPhrases(samplePhrases);
    } catch (error) {
      console.error('Error cargando frases:', error);
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setStartTime(Date.now());
    setScore(0);
    setCorrectPhrases(0);
    setTotalAttempts(0);
    setCurrentPhraseIndex(0);
    setTimeLeft(180);
    setFeedback(null);
    
    // Inicializar primera frase
    initializePhrase(0);
    
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

  const initializePhrase = (index: number) => {
    if (index >= phrases.length) {
      endGame();
      return;
    }

    const currentPhrase = phrases[index];
    if (!currentPhrase) return;

    // Crear palabras disponibles (desordenadas)
    const words: Word[] = currentPhrase.correctPhrase.map((text, i) => ({
      id: `word-${i}`,
      text,
      position: i
    }));

    // Mezclar las palabras
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    setAvailableWords(shuffled);
    setSelectedWords([]);
    setFeedback(null);
  };

  const selectWord = (word: Word) => {
    setSelectedWords(prev => [...prev, word]);
    setAvailableWords(prev => prev.filter(w => w.id !== word.id));
  };

  const removeWord = (word: Word) => {
    setSelectedWords(prev => prev.filter(w => w.id !== word.id));
    setAvailableWords(prev => [...prev, word]);
  };

  const checkPhrase = () => {
    const currentPhrase = phrases[currentPhraseIndex];
    if (!currentPhrase) return;

    setTotalAttempts(prev => prev + 1);

    const userPhrase = selectedWords.map(w => w.text).join(' ');
    const correctPhrase = currentPhrase.correctPhrase.join(' ');

    if (userPhrase === correctPhrase) {
      // Respuesta correcta
      setFeedback('correct');
      setCorrectPhrases(prev => prev + 1);
      
      // Calcular puntuación basada en dificultad y tiempo
      let points = 0;
      switch (currentPhrase.difficulty) {
        case 'easy':
          points = 100;
          break;
        case 'medium':
          points = 200;
          break;
        case 'hard':
          points = 300;
          break;
      }
      
      // Bonus por tiempo restante
      const timeBonus = Math.floor(timeLeft / 10);
      setScore(prev => prev + points + timeBonus);

      // Avanzar a la siguiente frase después de un breve delay
      setTimeout(() => {
        if (currentPhraseIndex < phrases.length - 1) {
          setCurrentPhraseIndex(prev => prev + 1);
          initializePhrase(currentPhraseIndex + 1);
        } else {
          endGame();
        }
      }, 1500);
    } else {
      // Respuesta incorrecta
      setFeedback('incorrect');
      
      // Reintentar después de un breve delay
      setTimeout(() => {
        setFeedback(null);
      }, 1000);
    }
  };

  const skipPhrase = () => {
    setTotalAttempts(prev => prev + 1);
    if (currentPhraseIndex < phrases.length - 1) {
      setCurrentPhraseIndex(prev => prev + 1);
      initializePhrase(currentPhraseIndex + 1);
    } else {
      endGame();
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
      const accuracy = totalAttempts > 0 ? (correctPhrases / totalAttempts) * 100 : 0;
      await fetch('/api/games/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId: 'phrase_builder',
          score,
          maxScore: 3600, // 10 frases * 300 puntos + bonus
          timeSpent,
          accuracy,
          details: { correctPhrases, totalAttempts }
        })
      });
      
      onComplete(score, timeSpent);
    } catch (error) {
      console.error('Error guardando puntaje:', error);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isPlaying) {
        speechSynthesis.cancel();
        setIsPlaying(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      
      speechSynthesis.speak(utterance);
    }
  };

  const currentPhrase = phrases[currentPhraseIndex];

  if (!gameStarted && !gameEnded) {
    return (
      <>
        <BackToGamesButton onClick={onBack} />
        <Card className="backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center text-white text-2xl">
              <BookOpen className="w-8 h-8 mr-3 text-violet-400" />
              Constructor de Frases
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-8">
              <Sparkles className="w-16 h-16 mx-auto mb-4 text-violet-400" />
              <p className="text-lg text-purple-200 mb-6">
                ¡Arrastra las palabras en el orden correcto para construir frases perfectas!
              </p>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-purple-900/30 rounded-lg p-4">
                  <Timer className="w-8 h-8 mx-auto mb-2 text-orange-400" />
                  <div className="text-2xl font-bold text-white">3:00</div>
                  <div className="text-sm text-purple-200">Tiempo</div>
                </div>
                <div className="bg-purple-900/30 rounded-lg p-4">
                  <Target className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                  <div className="text-2xl font-bold text-white">{phrases.length}</div>
                  <div className="text-sm text-purple-200">Frases</div>
                </div>
                <div className="bg-purple-900/30 rounded-lg p-4">
                  <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                  <div className="text-2xl font-bold text-white">120</div>
                  <div className="text-sm text-purple-200">XP Max</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <Button
                onClick={startGame}
                className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white text-lg px-8 py-3"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                ¡Comenzar a Construir!
              </Button>
              <br />
              <Button onClick={onBack} variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
            </div>
          </CardContent>
        </Card>
      </>
    );
  }

  if (gameEnded) {
    const accuracy = totalAttempts > 0 ? (correctPhrases / totalAttempts) * 100 : 0;
    
    return (
      <>
        <BackToGamesButton onClick={onBack} />
        <Card className="backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center text-white text-2xl">
              <Trophy className="w-8 h-8 mr-3 text-yellow-400" />
              ¡Juego Completado!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-8">
              <div className="text-6xl font-bold text-violet-400 mb-2">{score}</div>
              <div className="text-xl text-purple-200 mb-6">Puntuación Final</div>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-purple-900/30 rounded-lg p-4">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-400" />
                  <div className="text-2xl font-bold text-white">{correctPhrases}</div>
                  <div className="text-sm text-purple-200">Frases Correctas</div>
                </div>
                <div className="bg-purple-900/30 rounded-lg p-4">
                  <Target className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                  <div className="text-2xl font-bold text-white">{totalAttempts}</div>
                  <div className="text-sm text-purple-200">Intentos</div>
                </div>
                <div className="bg-purple-900/30 rounded-lg p-4">
                  <Sparkles className="w-8 h-8 mx-auto mb-2 text-pink-400" />
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
                className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 mr-3"
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
      </>
    );
  }

  return (
    <>
      <BackToGamesButton onClick={onBack} />
      <Card className="backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center text-white">
              <BookOpen className="w-6 h-6 mr-3 text-violet-400" />
              Constructor de Frases
            </CardTitle>
            <div className="flex items-center space-x-4">
              <Badge className="bg-violet-500/20 text-violet-200 border border-violet-400/30">
                Frase {currentPhraseIndex + 1}/{phrases.length}
              </Badge>
              <Badge className="bg-green-500/20 text-green-200 border border-green-400/30">
                Correctas: {correctPhrases}
              </Badge>
              <Badge className={`${timeLeft <= 30 ? 'bg-red-500/20 text-red-200 border-red-400/30 animate-pulse' : 'bg-orange-500/20 text-orange-200 border-orange-400/30'}`}>
                <Timer className="w-4 h-4 mr-1" />
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </Badge>
            </div>
          </div>
          <Progress value={(timeLeft / 180) * 100} className="h-2 mt-4" />
        </CardHeader>
        
        <CardContent className="space-y-6">
          {currentPhrase && (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPhraseIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="space-y-6"
              >
                {/* Frase en español */}
                <div className="bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-2xl p-6 border border-violet-400/30">
                  <p className="text-sm text-purple-300 mb-2">Traduce esta frase:</p>
                  <div className="flex items-center justify-center">
                    <h3 className="text-2xl font-bold text-white">{currentPhrase.spanish}</h3>
                    <Button
                      onClick={() => speakText(currentPhrase.correctPhrase.join(' '))}
                      variant="ghost"
                      size="sm"
                      className="ml-3 text-purple-300 hover:text-white"
                    >
                      {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </Button>
                  </div>
                  <Badge className="mt-3 bg-violet-500/20 text-violet-200 border border-violet-400/30">
                    {currentPhrase.difficulty === 'easy' ? 'Fácil' : currentPhrase.difficulty === 'medium' ? 'Medio' : 'Difícil'}
                  </Badge>
                </div>

                {/* Área de construcción de frase */}
                <div className={`min-h-24 bg-white/5 rounded-xl border-2 border-dashed p-4 transition-all duration-300 ${
                  feedback === 'correct' 
                    ? 'border-green-400 bg-green-500/10' 
                    : feedback === 'incorrect'
                      ? 'border-red-400 bg-red-500/10'
                      : 'border-purple-400/30'
                }`}>
                  <p className="text-sm text-purple-300 mb-3">Tu frase:</p>
                  <div className="flex flex-wrap gap-2 min-h-12">
                    {selectedWords.length === 0 ? (
                      <p className="text-purple-300/50 italic">Selecciona palabras de abajo...</p>
                    ) : (
                      selectedWords.map((word, index) => (
                        <motion.div
                          key={`selected-${word.id}`}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                        >
                          <Button
                            onClick={() => removeWord(word)}
                            className="bg-violet-500/20 hover:bg-violet-500/30 text-white border border-violet-400/50"
                          >
                            {word.text}
                            <XCircle className="w-4 h-4 ml-2" />
                          </Button>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>

                {/* Palabras disponibles */}
                <div className="bg-purple-900/20 rounded-xl p-4 border border-purple-400/20">
                  <p className="text-sm text-purple-300 mb-3">Palabras disponibles:</p>
                  <div className="flex flex-wrap gap-2">
                    {availableWords.map((word) => (
                      <motion.div
                        key={word.id}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          onClick={() => selectWord(word)}
                          className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
                        >
                          {word.text}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Feedback */}
                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-center p-4 rounded-lg ${
                      feedback === 'correct'
                        ? 'bg-green-500/20 border border-green-400/50'
                        : 'bg-red-500/20 border border-red-400/50'
                    }`}
                  >
                    {feedback === 'correct' ? (
                      <div className="flex items-center justify-center text-green-300">
                        <CheckCircle className="w-6 h-6 mr-2" />
                        <span className="text-lg font-medium">¡Correcto! Excelente trabajo</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center text-red-300">
                        <XCircle className="w-6 h-6 mr-2" />
                        <span className="text-lg font-medium">Incorrecto. ¡Inténtalo de nuevo!</span>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Botones de acción */}
                <div className="flex justify-center space-x-3">
                  <Button
                    onClick={checkPhrase}
                    disabled={selectedWords.length === 0 || feedback !== null}
                    className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Verificar Frase
                  </Button>
                  <Button
                    onClick={skipPhrase}
                    disabled={feedback !== null}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Saltar
                  </Button>
                </div>

                {/* Información de puntuación */}
                <div className="flex justify-center space-x-6 text-center">
                  <div>
                    <div className="text-2xl font-bold text-violet-400">{score}</div>
                    <div className="text-xs text-purple-200">Puntos</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-400">{correctPhrases}</div>
                    <div className="text-xs text-purple-200">Correctas</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-400">{totalAttempts}</div>
                    <div className="text-xs text-purple-200">Intentos</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </CardContent>
      </Card>
    </>
  );
}
