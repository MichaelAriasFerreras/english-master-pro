
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BackToGamesButton } from '@/components/ui/back-to-games-button';
import { 
  Headphones, 
  Volume2, 
  CheckCircle, 
  XCircle, 
  Trophy,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Play,
  Pause,
  MapPin,
  Navigation,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AudioQuestion {
  id: string;
  text: string;
  question: string;
  options: string[];
  correct: number;
  level: string;
}

interface ListeningLabyrinthProps {
  onBack: () => void;
  onComplete: (score: number, timeSpent: number) => void;
}

export function ListeningLabyrinth({ onBack, onComplete }: ListeningLabyrinthProps) {
  const [questions, setQuestions] = useState<AudioQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mazePosition, setMazePosition] = useState({ x: 0, y: 0 });
  
  const audioRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = () => {
    // Preguntas de audio expandidas para el laberinto con más variedad
    const allAudioQuestions: AudioQuestion[] = [
      {
        id: '1',
        text: 'The weather is beautiful today. The sun is shining and there are no clouds in the sky.',
        question: 'What is the weather like?',
        options: ['Rainy', 'Cloudy', 'Sunny', 'Snowy'],
        correct: 2,
        level: 'A1'
      },
      {
        id: '2',
        text: 'My name is Sarah and I am a teacher. I work at a school in the city center.',
        question: 'What is Sarah\'s profession?',
        options: ['Doctor', 'Teacher', 'Engineer', 'Artist'],
        correct: 1,
        level: 'A1'
      },
      {
        id: '3',
        text: 'I usually wake up at seven o\'clock in the morning. Then I have breakfast and go to work.',
        question: 'What time does the person wake up?',
        options: ['Six o\'clock', 'Seven o\'clock', 'Eight o\'clock', 'Nine o\'clock'],
        correct: 1,
        level: 'A1'
      },
      {
        id: '4',
        text: 'The restaurant was very crowded last night. We had to wait for thirty minutes to get a table.',
        question: 'How long did they wait?',
        options: ['15 minutes', '20 minutes', '30 minutes', '45 minutes'],
        correct: 2,
        level: 'A2'
      },
      {
        id: '5',
        text: 'She has been studying English for three years. She can now speak quite fluently.',
        question: 'How long has she been studying English?',
        options: ['One year', 'Two years', 'Three years', 'Four years'],
        correct: 2,
        level: 'A2'
      },
      {
        id: '6',
        text: 'The concert starts at eight PM. Make sure you arrive early to get good seats.',
        question: 'When does the concert start?',
        options: ['7 PM', '8 PM', '9 PM', '10 PM'],
        correct: 1,
        level: 'A1'
      },
      {
        id: '7',
        text: 'I prefer reading books to watching television. Books allow me to use my imagination more.',
        question: 'What does the person prefer?',
        options: ['Watching TV', 'Reading books', 'Playing games', 'Listening to music'],
        correct: 1,
        level: 'A2'
      },
      {
        id: '8',
        text: 'The train to London leaves every hour. The next one departs at quarter past three.',
        question: 'When does the next train leave?',
        options: ['3:00', '3:15', '3:30', '3:45'],
        correct: 1,
        level: 'B1'
      },
      {
        id: '9',
        text: 'Despite the rain, we decided to go hiking. We brought umbrellas and waterproof jackets.',
        question: 'What was the weather like?',
        options: ['Sunny', 'Rainy', 'Windy', 'Snowy'],
        correct: 1,
        level: 'B1'
      },
      {
        id: '10',
        text: 'The museum is closed on Mondays. It opens from Tuesday to Sunday, from nine to five.',
        question: 'When is the museum closed?',
        options: ['Sundays', 'Mondays', 'Tuesdays', 'Fridays'],
        correct: 1,
        level: 'A2'
      }
    ];
    
    // Mezclar las preguntas aleatoriamente usando Fisher-Yates shuffle
    const shuffled = [...allAudioQuestions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    // Tomar las primeras 10 preguntas aleatorias
    setQuestions(shuffled.slice(0, 10));
  };

  const startGame = () => {
    setGameStarted(true);
    setStartTime(Date.now());
    setScore(0);
    setCorrectAnswers(0);
    setCurrentQuestionIndex(0);
    setMazePosition({ x: 0, y: 0 });
  };

  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.volume = 1;
      utterance.pitch = 1;
      
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      
      audioRef.current = utterance;
      speechSynthesis.speak(utterance);
    }
  };

  const stopAudio = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    stopAudio();
    
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answerIndex === currentQuestion.correct;
    
    if (isCorrect) {
      setScore(prev => prev + 200);
      setCorrectAnswers(prev => prev + 1);
      // Avanzar en el laberinto
      setMazePosition(prev => ({
        x: prev.x + 1,
        y: prev.y + (Math.random() > 0.5 ? 1 : -1)
      }));
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      endGame();
    }
  };

  const endGame = () => {
    setGameEnded(true);
    setGameStarted(false);
    stopAudio();
    
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    saveScore(timeSpent);
  };

  const saveScore = async (timeSpent: number) => {
    try {
      const accuracy = (correctAnswers / questions.length) * 100;
      await fetch('/api/games/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId: 'listening_labyrinth',
          score,
          maxScore: questions.length * 200,
          timeSpent,
          accuracy,
          details: { correctAnswers, totalQuestions: questions.length }
        })
      });
      
      onComplete(score, timeSpent);
    } catch (error) {
      console.error('Error guardando puntaje:', error);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  if (!gameStarted && !gameEnded) {
    return (
      <>
        <BackToGamesButton onClick={onBack} />
        <Card className="backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center text-white text-2xl">
              <Headphones className="w-8 h-8 mr-3 text-indigo-400" />
              Laberinto de Escucha
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
          <div className="mb-8">
            <Navigation className="w-16 h-16 mx-auto mb-4 text-purple-400" />
            <p className="text-lg text-purple-200 mb-6">
              Navega por el laberinto respondiendo preguntas de audio. ¡Escucha atentamente!
            </p>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-purple-900/30 rounded-lg p-4">
                <Headphones className="w-8 h-8 mx-auto mb-2 text-indigo-400" />
                <div className="text-2xl font-bold text-white">{questions.length}</div>
                <div className="text-sm text-purple-200">Preguntas</div>
              </div>
              <div className="bg-purple-900/30 rounded-lg p-4">
                <MapPin className="w-8 h-8 mx-auto mb-2 text-pink-400" />
                <div className="text-2xl font-bold text-white">∞</div>
                <div className="text-sm text-purple-200">Laberinto</div>
              </div>
              <div className="bg-purple-900/30 rounded-lg p-4">
                <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                <div className="text-2xl font-bold text-white">200</div>
                <div className="text-sm text-purple-200">XP Max</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <Button
              onClick={startGame}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white text-lg px-8 py-3"
            >
              <Headphones className="w-5 h-5 mr-2" />
              Entrar al Laberinto
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
    const accuracy = (correctAnswers / questions.length) * 100;
    
    return (
      <>
        <BackToGamesButton onClick={onBack} />
        <Card className="backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center text-white text-2xl">
              <Trophy className="w-8 h-8 mr-3 text-yellow-400" />
              ¡Laberinto Completado!
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
                <MapPin className="w-8 h-8 mx-auto mb-2 text-pink-400" />
                <div className="text-2xl font-bold text-white">{Math.abs(mazePosition.x)}</div>
                <div className="text-sm text-purple-200">Distancia</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <Button
              onClick={() => {
                setGameEnded(false);
                startGame();
              }}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 mr-3"
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
    <>
      <BackToGamesButton onClick={onBack} />
      <Card className="backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center text-white">
              <Headphones className="w-6 h-6 mr-3 text-indigo-400" />
              Laberinto de Escucha
            </CardTitle>
            <div className="flex items-center space-x-4">
              <Badge className="bg-indigo-500/20 text-indigo-200 border border-indigo-400/30">
                {currentQuestionIndex + 1} / {questions.length}
              </Badge>
              <Badge className="bg-yellow-500/20 text-yellow-200 border border-yellow-400/30">
                Puntos: {score}
            </Badge>
            <Badge className="bg-pink-500/20 text-pink-200 border border-pink-400/30">
              <MapPin className="w-4 h-4 mr-1" />
              Pos: {Math.abs(mazePosition.x)}
            </Badge>
          </div>
        </div>
        <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} className="h-2 mt-4" />
      </CardHeader>
      
      <CardContent className="space-y-6">
        {currentQuestion && (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="text-center mb-6">
                <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl p-8 mb-6 border border-indigo-400/30">
                  <Headphones className="w-12 h-12 mx-auto mb-4 text-indigo-300" />
                  <Button
                    onClick={() => isPlaying ? stopAudio() : playAudio(currentQuestion.text)}
                    className={`mb-4 ${
                      isPlaying
                        ? 'bg-gradient-to-r from-red-500 to-pink-500'
                        : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                    }`}
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-5 h-5 mr-2" />
                        Detener Audio
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5 mr-2" />
                        Reproducir Audio
                      </>
                    )}
                  </Button>
                  <p className="text-sm text-purple-300">Escucha el audio y responde la pregunta</p>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4">
                  {currentQuestion.question}
                </h3>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {currentQuestion.options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={selectedAnswer !== null}
                    className={`p-4 text-left justify-start h-auto ${
                      selectedAnswer === null
                        ? 'bg-white/5 hover:bg-white/10 text-white border border-white/20'
                        : selectedAnswer === index
                          ? index === currentQuestion.correct
                            ? 'bg-green-500/20 border-green-400 text-green-100'
                            : 'bg-red-500/20 border-red-400 text-red-100'
                          : index === currentQuestion.correct
                            ? 'bg-green-500/20 border-green-400 text-green-100'
                            : 'bg-white/5 text-purple-200 border border-white/10'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 text-sm font-bold ${
                        selectedAnswer === null
                          ? 'bg-indigo-500/20 text-indigo-200'
                          : selectedAnswer === index
                            ? index === currentQuestion.correct
                              ? 'bg-green-500 text-white'
                              : 'bg-red-500 text-white'
                            : index === currentQuestion.correct
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
                    {selectedAnswer === currentQuestion.correct ? (
                      <CheckCircle className="w-5 h-5 text-green-400 mt-1" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400 mt-1" />
                    )}
                    <div>
                      <h4 className="font-medium text-white mb-2">
                        {selectedAnswer === currentQuestion.correct ? '¡Correcto! Avanzas en el laberinto' : 'Incorrecto'}
                      </h4>
                      <p className="text-purple-200 text-sm mb-2">Texto del audio:</p>
                      <p className="text-purple-100 italic">"{currentQuestion.text}"</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <Button
                      onClick={nextQuestion}
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                    >
                      {currentQuestionIndex < questions.length - 1 ? (
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
    </>
  );
}
