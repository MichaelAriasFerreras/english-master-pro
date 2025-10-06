
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  CheckCircle, 
  XCircle, 
  Trophy,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Shuffle,
  Volume2,
  Lightbulb,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PhraseChallenge {
  id: string;
  correctPhrase: string;
  words: string[];
  translation: string;
  hint: string;
  level: string;
}

interface PhraseBuilderProps {
  onBack: () => void;
  onComplete: (score: number, timeSpent: number) => void;
}

export function PhraseBuilder({ onBack, onComplete }: PhraseBuilderProps) {
  const [challenges, setChallenges] = useState<PhraseChallenge[]>([]);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    loadChallenges();
  }, []);

  useEffect(() => {
    if (challenges.length > 0 && gameStarted) {
      initializeCurrentChallenge();
    }
  }, [currentChallengeIndex, challenges, gameStarted]);

  const loadChallenges = () => {
    const phraseChallenges: PhraseChallenge[] = [
      {
        id: '1',
        correctPhrase: 'I am learning English',
        words: ['I', 'am', 'learning', 'English'],
        translation: 'Estoy aprendiendo inglés',
        hint: 'Subject + verb to be + verb -ing + object',
        level: 'A1'
      },
      {
        id: '2',
        correctPhrase: 'She likes to read books',
        words: ['She', 'likes', 'to', 'read', 'books'],
        translation: 'A ella le gusta leer libros',
        hint: 'Subject + verb + infinitive + object',
        level: 'A1'
      },
      {
        id: '3',
        correctPhrase: 'We are going to the park',
        words: ['We', 'are', 'going', 'to', 'the', 'park'],
        translation: 'Vamos al parque',
        hint: 'Subject + verb to be + going + preposition + article + place',
        level: 'A1'
      },
      {
        id: '4',
        correctPhrase: 'They have been studying for hours',
        words: ['They', 'have', 'been', 'studying', 'for', 'hours'],
        translation: 'Han estado estudiando por horas',
        hint: 'Present perfect continuous tense',
        level: 'B1'
      },
      {
        id: '5',
        correctPhrase: 'I would like a cup of coffee',
        words: ['I', 'would', 'like', 'a', 'cup', 'of', 'coffee'],
        translation: 'Me gustaría una taza de café',
        hint: 'Polite request with "would like"',
        level: 'A2'
      },
      {
        id: '6',
        correctPhrase: 'The cat is sleeping on the sofa',
        words: ['The', 'cat', 'is', 'sleeping', 'on', 'the', 'sofa'],
        translation: 'El gato está durmiendo en el sofá',
        hint: 'Article + subject + present continuous + preposition + article + place',
        level: 'A1'
      },
      {
        id: '7',
        correctPhrase: 'My brother plays football every weekend',
        words: ['My', 'brother', 'plays', 'football', 'every', 'weekend'],
        translation: 'Mi hermano juega fútbol cada fin de semana',
        hint: 'Possessive + subject + simple present + frequency',
        level: 'A2'
      },
      {
        id: '8',
        correctPhrase: 'If I had money I would travel',
        words: ['If', 'I', 'had', 'money', 'I', 'would', 'travel'],
        translation: 'Si tuviera dinero viajaría',
        hint: 'Second conditional sentence',
        level: 'B1'
      },
      {
        id: '9',
        correctPhrase: 'She has never been to Paris',
        words: ['She', 'has', 'never', 'been', 'to', 'Paris'],
        translation: 'Ella nunca ha estado en París',
        hint: 'Present perfect with "never"',
        level: 'A2'
      },
      {
        id: '10',
        correctPhrase: 'Could you please help me with this',
        words: ['Could', 'you', 'please', 'help', 'me', 'with', 'this'],
        translation: '¿Podrías por favor ayudarme con esto?',
        hint: 'Polite request with modal verb',
        level: 'B1'
      }
    ];
    
    setChallenges(phraseChallenges);
  };

  const initializeCurrentChallenge = () => {
    const currentChallenge = challenges[currentChallengeIndex];
    if (currentChallenge) {
      // Mezclar las palabras
      const shuffled = [...currentChallenge.words].sort(() => Math.random() - 0.5);
      setAvailableWords(shuffled);
      setSelectedWords([]);
      setShowResult(false);
      setShowHint(false);
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setStartTime(Date.now());
    setScore(0);
    setCorrectAnswers(0);
    setCurrentChallengeIndex(0);
  };

  const handleWordClick = (word: string, fromAvailable: boolean) => {
    if (showResult) return;

    if (fromAvailable) {
      // Mover de disponibles a seleccionados
      setSelectedWords([...selectedWords, word]);
      setAvailableWords(availableWords.filter(w => w !== word));
    } else {
      // Mover de seleccionados a disponibles
      setAvailableWords([...availableWords, word]);
      setSelectedWords(selectedWords.filter(w => w !== word));
    }
  };

  const checkPhrase = () => {
    const currentChallenge = challenges[currentChallengeIndex];
    const userPhrase = selectedWords.join(' ');
    const correct = userPhrase === currentChallenge.correctPhrase;
    
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      const baseScore = 120;
      const hintPenalty = showHint ? 20 : 0;
      const finalScore = baseScore - hintPenalty;
      setScore(prev => prev + finalScore);
      setCorrectAnswers(prev => prev + 1);
    }
  };

  const nextChallenge = () => {
    if (currentChallengeIndex < challenges.length - 1) {
      setCurrentChallengeIndex(prev => prev + 1);
    } else {
      endGame();
    }
  };

  const shuffleAvailable = () => {
    setAvailableWords([...availableWords].sort(() => Math.random() - 0.5));
  };

  const resetChallenge = () => {
    initializeCurrentChallenge();
  };

  const speakPhrase = (text: string) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      utterance.volume = 1;
      
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      
      speechSynthesis.speak(utterance);
    }
  };

  const endGame = () => {
    setGameEnded(true);
    setGameStarted(false);
    
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    saveScore(timeSpent);
  };

  const saveScore = async (timeSpent: number) => {
    try {
      const accuracy = (correctAnswers / challenges.length) * 100;
      await fetch('/api/games/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId: 'phrase_builder',
          score,
          maxScore: challenges.length * 120,
          timeSpent,
          accuracy,
          details: { correctAnswers, totalChallenges: challenges.length }
        })
      });
      
      onComplete(score, timeSpent);
    } catch (error) {
      console.error('Error guardando puntaje:', error);
    }
  };

  const currentChallenge = challenges[currentChallengeIndex];

  if (!gameStarted && !gameEnded) {
    return (
      <Card className="backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center text-white text-2xl">
            <BookOpen className="w-8 h-8 mr-3 text-violet-400" />
            Constructor de Frases
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="mb-8">
            <Shuffle className="w-16 h-16 mx-auto mb-4 text-purple-400" />
            <p className="text-lg text-purple-200 mb-6">
              Construye frases perfectas arrastrando y ordenando palabras. ¡Mejora tu gramática!
            </p>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-purple-900/30 rounded-lg p-4">
                <BookOpen className="w-8 h-8 mx-auto mb-2 text-violet-400" />
                <div className="text-2xl font-bold text-white">{challenges.length}</div>
                <div className="text-sm text-purple-200">Frases</div>
              </div>
              <div className="bg-purple-900/30 rounded-lg p-4">
                <Lightbulb className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                <div className="text-2xl font-bold text-white">Pistas</div>
                <div className="text-sm text-purple-200">Disponibles</div>
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
              Comenzar a Construir
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
    const accuracy = (correctAnswers / challenges.length) * 100;
    
    return (
      <Card className="backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center text-white text-2xl">
            <Trophy className="w-8 h-8 mr-3 text-yellow-400" />
            ¡Construcción Completada!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="mb-8">
            <div className="text-6xl font-bold text-yellow-400 mb-2">{score}</div>
            <div className="text-xl text-purple-200 mb-6">Puntuación Final</div>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-purple-900/30 rounded-lg p-4">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-400" />
                <div className="text-2xl font-bold text-white">{correctAnswers}</div>
                <div className="text-sm text-purple-200">Correctas</div>
              </div>
              <div className="bg-purple-900/30 rounded-lg p-4">
                <Target className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                <div className="text-2xl font-bold text-white">{Math.round(accuracy)}%</div>
                <div className="text-sm text-purple-200">Precisión</div>
              </div>
              <div className="bg-purple-900/30 rounded-lg p-4">
                <BookOpen className="w-8 h-8 mx-auto mb-2 text-violet-400" />
                <div className="text-2xl font-bold text-white">{challenges.length}</div>
                <div className="text-sm text-purple-200">Frases</div>
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
    );
  }

  return (
    <Card className="backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center text-white">
            <BookOpen className="w-6 h-6 mr-3 text-violet-400" />
            Constructor de Frases
          </CardTitle>
          <div className="flex items-center space-x-4">
            <Badge className="bg-violet-500/20 text-violet-200 border border-violet-400/30">
              {currentChallengeIndex + 1} / {challenges.length}
            </Badge>
            <Badge className="bg-yellow-500/20 text-yellow-200 border border-yellow-400/30">
              Puntos: {score}
            </Badge>
          </div>
        </div>
        <Progress value={((currentChallengeIndex + 1) / challenges.length) * 100} className="h-2 mt-4" />
      </CardHeader>
      
      <CardContent className="space-y-6">
        {currentChallenge && (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentChallengeIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-center mb-6">
                <div className="bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-2xl p-6 mb-4 border border-violet-400/30">
                  <p className="text-sm text-purple-300 mb-2">Construye esta frase:</p>
                  <h3 className="text-2xl font-bold text-white mb-2">{currentChallenge.translation}</h3>
                  <Button
                    onClick={() => speakPhrase(currentChallenge.correctPhrase)}
                    variant="ghost"
                    size="sm"
                    className="text-purple-300 hover:text-white"
                  >
                    <Volume2 className="w-4 h-4 mr-2" />
                    Escuchar frase correcta
                  </Button>
                </div>
                
                {!showHint && !showResult && (
                  <Button
                    onClick={() => setShowHint(true)}
                    variant="outline"
                    size="sm"
                    className="border-yellow-400/30 text-yellow-300 hover:bg-yellow-400/10"
                  >
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Ver Pista (-20 puntos)
                  </Button>
                )}
                
                {showHint && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-yellow-500/10 border border-yellow-400/30 rounded-lg p-3 mb-4"
                  >
                    <p className="text-yellow-200 text-sm">
                      <Lightbulb className="w-4 h-4 inline mr-2" />
                      {currentChallenge.hint}
                    </p>
                  </motion.div>
                )}
              </div>
              
              {/* Área de construcción de frase */}
              <div className="mb-6">
                <p className="text-sm text-purple-300 mb-2 text-center">Tu frase:</p>
                <div className="min-h-[80px] bg-white/5 border-2 border-dashed border-violet-400/30 rounded-lg p-4 flex flex-wrap gap-2 items-center justify-center">
                  {selectedWords.length === 0 ? (
                    <p className="text-purple-400 text-sm">Haz clic en las palabras para construir la frase</p>
                  ) : (
                    selectedWords.map((word, index) => (
                      <motion.div
                        key={`selected-${index}`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Button
                          onClick={() => handleWordClick(word, false)}
                          className="bg-violet-500/20 hover:bg-violet-500/30 text-white border border-violet-400/50"
                          disabled={showResult}
                        >
                          {word}
                        </Button>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
              
              {/* Palabras disponibles */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-purple-300">Palabras disponibles:</p>
                  <Button
                    onClick={shuffleAvailable}
                    variant="ghost"
                    size="sm"
                    className="text-purple-300 hover:text-white"
                    disabled={showResult}
                  >
                    <Shuffle className="w-4 h-4 mr-2" />
                    Mezclar
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {availableWords.map((word, index) => (
                    <motion.div
                      key={`available-${index}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      <Button
                        onClick={() => handleWordClick(word, true)}
                        className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
                        disabled={showResult}
                      >
                        {word}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* Botones de acción */}
              {!showResult && (
                <div className="flex justify-center space-x-3">
                  <Button
                    onClick={checkPhrase}
                    disabled={selectedWords.length === 0}
                    className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Verificar Frase
                  </Button>
                  <Button
                    onClick={resetChallenge}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reiniciar
                  </Button>
                </div>
              )}
              
              {/* Resultado */}
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-lg p-4 border ${
                    isCorrect
                      ? 'bg-green-500/20 border-green-400/30'
                      : 'bg-red-500/20 border-red-400/30'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-green-400 mt-1" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-400 mt-1" />
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium text-white mb-2">
                        {isCorrect ? '¡Perfecto!' : 'Incorrecto'}
                      </h4>
                      {!isCorrect && (
                        <div className="mb-2">
                          <p className="text-sm text-purple-200 mb-1">Frase correcta:</p>
                          <p className="text-white font-medium">{currentChallenge.correctPhrase}</p>
                        </div>
                      )}
                      <p className="text-sm text-purple-200">
                        {isCorrect 
                          ? `+${showHint ? 100 : 120} puntos` 
                          : 'Intenta con la siguiente frase'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <Button
                      onClick={nextChallenge}
                      className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600"
                    >
                      {currentChallengeIndex < challenges.length - 1 ? (
                        <>
                          Siguiente <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      ) : (
                        'Ver Resultados'
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </CardContent>
    </Card>
  );
}
