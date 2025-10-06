
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Rocket, 
  Timer, 
  CheckCircle, 
  XCircle, 
  Trophy,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Zap,
  Target,
  Flame
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Sentence {
  template: string;
  options: string[];
  correct: number;
  explanation: string;
  level: string;
}

interface GrammarRaceProps {
  onBack: () => void;
  onComplete: (score: number, timeSpent: number) => void;
}

export function GrammarRace({ onBack, onComplete }: GrammarRaceProps) {
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [streak, setStreak] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadSentences();
    
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

  const loadSentences = async () => {
    try {
      const response = await fetch('/api/games/sentences?count=15');
      const data = await response.json();
      if (data.sentences && data.sentences.length > 0) {
        setSentences(data.sentences);
      }
    } catch (error) {
      console.error('Error cargando oraciones:', error);
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setStartTime(Date.now());
    setScore(0);
    setCorrectAnswers(0);
    setStreak(0);
    setCurrentSentenceIndex(0);
    setTimeLeft(60);
    
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

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    
    const currentSentence = sentences[currentSentenceIndex];
    const isCorrect = answerIndex === currentSentence.correct;
    
    if (isCorrect) {
      const timeBonus = Math.floor(timeLeft / 2);
      const streakBonus = streak * 10;
      const questionScore = 100 + timeBonus + streakBonus;
      setScore(prev => prev + questionScore);
      setStreak(prev => prev + 1);
      setCorrectAnswers(prev => prev + 1);
    } else {
      setStreak(0);
    }
  };

  const nextSentence = () => {
    if (currentSentenceIndex < sentences.length - 1) {
      setCurrentSentenceIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
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
      const accuracy = (correctAnswers / (currentSentenceIndex + 1)) * 100;
      await fetch('/api/games/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId: 'grammar_race',
          score,
          maxScore: sentences.length * 100,
          timeSpent,
          accuracy,
          details: { correctAnswers, totalQuestions: currentSentenceIndex + 1, streak }
        })
      });
      
      onComplete(score, timeSpent);
    } catch (error) {
      console.error('Error guardando puntaje:', error);
    }
  };

  const currentSentence = sentences[currentSentenceIndex];

  if (!gameStarted && !gameEnded) {
    return (
      <Card className="backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center text-white text-2xl">
            <Rocket className="w-8 h-8 mr-3 text-green-400" />
            Carrera Gramatical
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="mb-8">
            <Zap className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
            <p className="text-lg text-purple-200 mb-6">
              ¡Completa oraciones correctamente contra el reloj! Cada respuesta correcta suma puntos y tiempo extra.
            </p>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-purple-900/30 rounded-lg p-4">
                <Timer className="w-8 h-8 mx-auto mb-2 text-orange-400" />
                <div className="text-2xl font-bold text-white">60s</div>
                <div className="text-sm text-purple-200">Tiempo</div>
              </div>
              <div className="bg-purple-900/30 rounded-lg p-4">
                <Target className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                <div className="text-2xl font-bold text-white">{sentences.length}</div>
                <div className="text-sm text-purple-200">Oraciones</div>
              </div>
              <div className="bg-purple-900/30 rounded-lg p-4">
                <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                <div className="text-2xl font-bold text-white">80</div>
                <div className="text-sm text-purple-200">XP Max</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <Button
              onClick={startGame}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-lg px-8 py-3"
            >
              <Rocket className="w-5 h-5 mr-2" />
              ¡Comenzar Carrera!
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
    const accuracy = (correctAnswers / (currentSentenceIndex + 1)) * 100;
    
    return (
      <Card className="backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center text-white text-2xl">
            <Trophy className="w-8 h-8 mr-3 text-yellow-400" />
            ¡Carrera Completada!
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
                <Flame className="w-8 h-8 mx-auto mb-2 text-orange-400" />
                <div className="text-2xl font-bold text-white">{streak}</div>
                <div className="text-sm text-purple-200">Mejor Racha</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <Button
              onClick={() => {
                setGameEnded(false);
                startGame();
              }}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 mr-3"
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
            <Rocket className="w-6 h-6 mr-3 text-green-400" />
            Carrera Gramatical
          </CardTitle>
          <div className="flex items-center space-x-4">
            <Badge className="bg-green-500/20 text-green-200 border border-green-400/30">
              {currentSentenceIndex + 1} / {sentences.length}
            </Badge>
            <Badge className="bg-yellow-500/20 text-yellow-200 border border-yellow-400/30">
              Puntos: {score}
            </Badge>
            <Badge className={`${timeLeft <= 10 ? 'bg-red-500/20 text-red-200 border-red-400/30 animate-pulse' : 'bg-orange-500/20 text-orange-200 border-orange-400/30'}`}>
              <Timer className="w-4 h-4 mr-1" />
              {timeLeft}s
            </Badge>
          </div>
        </div>
        <Progress value={((currentSentenceIndex + 1) / sentences.length) * 100} className="h-2 mt-4" />
      </CardHeader>
      
      <CardContent className="space-y-6">
        {currentSentence && (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSentenceIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-4">
                  {currentSentence.template}
                </h3>
                {streak > 0 && (
                  <Badge className="bg-orange-500/20 text-orange-200 border border-orange-400/30">
                    <Flame className="w-4 h-4 mr-1" />
                    Racha: {streak}
                  </Badge>
                )}
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {currentSentence.options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={selectedAnswer !== null}
                    className={`p-4 text-left justify-start h-auto ${
                      selectedAnswer === null
                        ? 'bg-white/5 hover:bg-white/10 text-white border border-white/20'
                        : selectedAnswer === index
                          ? index === currentSentence.correct
                            ? 'bg-green-500/20 border-green-400 text-green-100'
                            : 'bg-red-500/20 border-red-400 text-red-100'
                          : index === currentSentence.correct
                            ? 'bg-green-500/20 border-green-400 text-green-100'
                            : 'bg-white/5 text-purple-200 border border-white/10'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 text-sm font-bold ${
                        selectedAnswer === null
                          ? 'bg-green-500/20 text-green-200'
                          : selectedAnswer === index
                            ? index === currentSentence.correct
                              ? 'bg-green-500 text-white'
                              : 'bg-red-500 text-white'
                            : index === currentSentence.correct
                              ? 'bg-green-500 text-white'
                              : 'bg-white/10 text-purple-300'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="text-lg">{option}</span>
                    </div>
                  </Button>
                ))}
              </div>
              
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-purple-900/30 rounded-lg p-4 border border-purple-400/30 mt-4"
                >
                  <div className="flex items-start space-x-3">
                    {selectedAnswer === currentSentence.correct ? (
                      <CheckCircle className="w-5 h-5 text-green-400 mt-1" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400 mt-1" />
                    )}
                    <div>
                      <h4 className="font-medium text-white mb-2">
                        {selectedAnswer === currentSentence.correct ? '¡Correcto!' : 'Incorrecto'}
                      </h4>
                      <p className="text-purple-200">{currentSentence.explanation}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <Button
                      onClick={nextSentence}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                    >
                      {currentSentenceIndex < sentences.length - 1 ? (
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
