
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BackToGamesButton } from '@/components/ui/back-to-games-button';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  CheckCircle, 
  XCircle, 
  Trophy,
  ArrowRight,
  Target,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Word {
  id: string;
  english: string;
  spanish: string;
  pronunciation?: string;
  audioUrl?: string;
}

interface PronunciationChallengeProps {
  onBack: () => void;
  onComplete: (score: number, timeSpent: number) => void;
}

export function PronunciationChallenge({ onBack, onComplete }: PronunciationChallengeProps) {
  const [words, setWords] = useState<Word[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState<{ word: string; success: boolean; accuracy: number }[]>([]);
  const [feedback, setFeedback] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [recognitionSupported, setRecognitionSupported] = useState(true);
  
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    // Verificar soporte de reconocimiento de voz
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setRecognitionSupported(false);
    }
    
    loadWords();
  }, []);

  const loadWords = async () => {
    try {
      // Solicitar 30 palabras aleatorias de la base de datos
      const response = await fetch('/api/games/words?count=30&random=true');
      const data = await response.json();
      if (data.words && data.words.length > 0) {
        setWords(data.words);
      } else {
        // Palabras de respaldo
        setWords([
          { id: '1', english: 'Hello', spanish: 'Hola', pronunciation: '/həˈloʊ/' },
          { id: '2', english: 'Beautiful', spanish: 'Hermoso', pronunciation: '/ˈbjuːtɪfəl/' },
          { id: '3', english: 'Friend', spanish: 'Amigo', pronunciation: '/frend/' },
          { id: '4', english: 'Happy', spanish: 'Feliz', pronunciation: '/ˈhæpi/' },
          { id: '5', english: 'Water', spanish: 'Agua', pronunciation: '/ˈwɔːtər/' },
          { id: '6', english: 'Thank you', spanish: 'Gracias', pronunciation: '/θæŋk juː/' },
          { id: '7', english: 'Good morning', spanish: 'Buenos días', pronunciation: '/ɡʊd ˈmɔːrnɪŋ/' },
          { id: '8', english: 'Please', spanish: 'Por favor', pronunciation: '/pliːz/' },
          { id: '9', english: 'Wonderful', spanish: 'Maravilloso', pronunciation: '/ˈwʌndərfəl/' },
          { id: '10', english: 'Family', spanish: 'Familia', pronunciation: '/ˈfæməli/' }
        ]);
      }
    } catch (error) {
      console.error('Error cargando palabras:', error);
      // Usar palabras de respaldo en caso de error
      setWords([
        { id: '1', english: 'Hello', spanish: 'Hola', pronunciation: '/həˈloʊ/' },
        { id: '2', english: 'Beautiful', spanish: 'Hermoso', pronunciation: '/ˈbjuːtɪfəl/' },
        { id: '3', english: 'Friend', spanish: 'Amigo', pronunciation: '/frend/' }
      ]);
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setStartTime(Date.now());
    setScore(0);
    setAttempts([]);
    setCurrentWordIndex(0);
  };

  const speakWord = (text: string) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      utterance.volume = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const startRecording = async () => {
    if (!recognitionSupported) {
      setFeedback('Tu navegador no soporta reconocimiento de voz. Intenta con Chrome o Edge.');
      return;
    }

    setIsRecording(true);
    setFeedback('🎤 Escuchando... Habla ahora');
    setIsProcessing(false);

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      // Configuración mejorada para mejor precisión
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 3; // Obtener múltiples alternativas
      
      // Configuraciones adicionales para mejor reconocimiento
      if ('grammars' in recognition) {
        recognition.grammars = null;
      }

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase().trim();
        const confidence = event.results[0][0].confidence;
        checkPronunciation(transcript, confidence);
      };

      recognition.onerror = (event: any) => {
        console.error('Error de reconocimiento:', event.error);
        setIsRecording(false);
        
        let errorMessage = 'No se pudo capturar el audio. Intenta de nuevo.';
        if (event.error === 'no-speech') {
          errorMessage = 'No se detectó voz. Habla más cerca del micrófono.';
        } else if (event.error === 'audio-capture') {
          errorMessage = 'No se pudo acceder al micrófono. Verifica los permisos.';
        } else if (event.error === 'not-allowed') {
          errorMessage = 'Permiso de micrófono denegado. Habilítalo en la configuración.';
        }
        
        setFeedback(errorMessage);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (error) {
      console.error('Error iniciando reconocimiento:', error);
      setIsRecording(false);
      setFeedback('Error al iniciar el reconocimiento de voz.');
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const checkPronunciation = (transcript: string, confidence: number) => {
    setIsProcessing(true);
    const currentWord = words[currentWordIndex];
    const targetWord = currentWord.english.toLowerCase().trim();
    
    // Normalizar ambas cadenas para comparación
    const normalizedTranscript = transcript.replace(/[.,!?]/g, '').toLowerCase();
    const normalizedTarget = targetWord.replace(/[.,!?]/g, '').toLowerCase();
    
    // Calcular similitud
    const similarity = calculateSimilarity(normalizedTranscript, normalizedTarget);
    const accuracyScore = Math.round(similarity * confidence * 100);
    
    const isCorrect = similarity > 0.7 && confidence > 0.5;
    
    if (isCorrect) {
      setScore(prev => prev + accuracyScore);
      setFeedback(`¡Excelente! Precisión: ${accuracyScore}%`);
    } else {
      setFeedback(`Intenta de nuevo. Escuchamos: "${transcript}"`);
    }
    
    setAttempts(prev => [...prev, {
      word: currentWord.english,
      success: isCorrect,
      accuracy: accuracyScore
    }]);
    
    setTimeout(() => {
      setIsProcessing(false);
      if (isCorrect) {
        nextWord();
      }
    }, 2000);
  };

  const calculateSimilarity = (str1: string, str2: string): number => {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  };

  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix: number[][] = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  };

  const nextWord = () => {
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
      setFeedback('');
    } else {
      endGame();
    }
  };

  const skipWord = () => {
    setAttempts(prev => [...prev, {
      word: words[currentWordIndex].english,
      success: false,
      accuracy: 0
    }]);
    nextWord();
  };

  const endGame = () => {
    setGameEnded(true);
    setGameStarted(false);
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    
    // Guardar puntaje
    saveScore(timeSpent);
  };

  const saveScore = async (timeSpent: number) => {
    try {
      const accuracy = attempts.filter(a => a.success).length / attempts.length * 100;
      await fetch('/api/games/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId: 'pronunciation_challenge',
          score,
          maxScore: words.length * 100,
          timeSpent,
          accuracy,
          details: { attempts }
        })
      });
      
      onComplete(score, timeSpent);
    } catch (error) {
      console.error('Error guardando puntaje:', error);
    }
  };

  const currentWord = words[currentWordIndex];

  if (!recognitionSupported) {
    return (
      <>
        <BackToGamesButton onClick={onBack} />
        <Card className="backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Mic className="w-6 h-6 mr-3 text-red-400" />
              Desafío de Pronunciación
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <XCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
            <h3 className="text-xl font-bold text-white mb-4">
              Navegador no compatible
            </h3>
            <p className="text-purple-200 mb-6">
              Este juego requiere reconocimiento de voz. Por favor, usa Chrome, Edge o Safari.
            </p>
          </CardContent>
        </Card>
      </>
    );
  }

  if (!gameStarted && !gameEnded) {
    return (
      <>
        <BackToGamesButton onClick={onBack} />
        <Card className="backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center text-white text-2xl">
              <Mic className="w-8 h-8 mr-3 text-red-400" />
              Desafío de Pronunciación
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-8">
              <Sparkles className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
              <p className="text-lg text-purple-200 mb-6">
                Practica tu pronunciación en inglés con IA. Di cada palabra correctamente para ganar puntos.
              </p>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-purple-900/30 rounded-lg p-4">
                  <Mic className="w-8 h-8 mx-auto mb-2 text-red-400" />
                  <div className="text-2xl font-bold text-white">{words.length}</div>
                  <div className="text-sm text-purple-200">Palabras</div>
                </div>
                <div className="bg-purple-900/30 rounded-lg p-4">
                  <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                  <div className="text-2xl font-bold text-white">150</div>
                  <div className="text-sm text-purple-200">XP Max</div>
                </div>
                <div className="bg-purple-900/30 rounded-lg p-4">
                  <Sparkles className="w-8 h-8 mx-auto mb-2 text-pink-400" />
                  <div className="text-2xl font-bold text-white">IA</div>
                  <div className="text-sm text-purple-200">Análisis</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <Button
                onClick={startGame}
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white text-lg px-8 py-3"
              >
                <Mic className="w-5 h-5 mr-2" />
                Comenzar Desafío
              </Button>
            </div>
          </CardContent>
        </Card>
      </>
    );
  }

  if (gameEnded) {
    const successfulAttempts = attempts.filter(a => a.success).length;
    const accuracy = (successfulAttempts / attempts.length) * 100;
    
    return (
      <>
        <BackToGamesButton onClick={onBack} />
        <Card className="backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center text-white text-2xl">
              <Trophy className="w-8 h-8 mr-3 text-yellow-400" />
              ¡Desafío Completado!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-8">
              <div className="text-6xl font-bold text-yellow-400 mb-2">{score}</div>
              <div className="text-xl text-purple-200 mb-6">Puntuación Final</div>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-purple-900/30 rounded-lg p-4">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-400" />
                  <div className="text-2xl font-bold text-white">{successfulAttempts}</div>
                  <div className="text-sm text-purple-200">Correctas</div>
                </div>
                <div className="bg-purple-900/30 rounded-lg p-4">
                  <Target className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                  <div className="text-2xl font-bold text-white">{Math.round(accuracy)}%</div>
                  <div className="text-sm text-purple-200">Precisión</div>
                </div>
                <div className="bg-purple-900/30 rounded-lg p-4">
                  <Sparkles className="w-8 h-8 mx-auto mb-2 text-pink-400" />
                  <div className="text-2xl font-bold text-white">+{Math.floor(score / 10)}</div>
                  <div className="text-sm text-purple-200">XP Ganados</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <Button
                onClick={() => {
                  setGameEnded(false);
                  startGame();
                }}
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 mr-3"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Jugar de Nuevo
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
              <Mic className="w-6 h-6 mr-3 text-red-400" />
              Desafío de Pronunciación
            </CardTitle>
            <div className="flex items-center space-x-4">
              <Badge className="bg-red-500/20 text-red-200 border border-red-400/30">
                {currentWordIndex + 1} / {words.length}
              </Badge>
              <Badge className="bg-yellow-500/20 text-yellow-200 border border-yellow-400/30">
                Puntos: {score}
              </Badge>
            </div>
          </div>
          <Progress value={((currentWordIndex + 1) / words.length) * 100} className="h-2 mt-4" />
        </CardHeader>
        
        <CardContent className="space-y-6">
          {currentWord && (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentWordIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center"
              >
                <div className="bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-2xl p-8 mb-6 border border-red-400/30">
                  <h3 className="text-4xl font-bold text-white mb-2">{currentWord.english}</h3>
                  {currentWord.pronunciation && (
                    <p className="text-lg text-purple-200 mb-2">{currentWord.pronunciation}</p>
                  )}
                  <p className="text-xl text-purple-300 mb-4">{currentWord.spanish}</p>
                  
                  <Button
                    onClick={() => speakWord(currentWord.english)}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <Volume2 className="w-4 h-4 mr-2" />
                    Escuchar
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <Button
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={isProcessing}
                    className={`
                      w-full py-8 text-xl font-bold
                      transition-all duration-300 transform
                      ${isRecording
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 animate-pulse scale-105 shadow-2xl shadow-green-500/50'
                        : isProcessing
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-600 cursor-not-allowed'
                        : 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 hover:scale-105 shadow-xl shadow-red-500/50'
                      }
                      text-white border-2 border-white/30
                    `}
                  >
                    {isRecording ? (
                      <>
                        <MicOff className="w-8 h-8 mr-3" />
                        🎤 Escuchando... Detener
                      </>
                    ) : isProcessing ? (
                      <>
                        <Sparkles className="w-8 h-8 mr-3 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <Mic className="w-8 h-8 mr-3" />
                        🎙️ Presiona para Hablar
                      </>
                    )}
                  </Button>
                  
                  {feedback && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`p-4 rounded-lg text-lg font-semibold ${
                        feedback.includes('Excelente') || feedback.includes('🎤')
                          ? 'bg-green-500/20 border-2 border-green-400/50 text-green-100'
                          : feedback.includes('Error') || feedback.includes('No se')
                          ? 'bg-red-500/20 border-2 border-red-400/50 text-red-100'
                          : 'bg-orange-500/20 border-2 border-orange-400/50 text-orange-100'
                      }`}
                    >
                      <p>{feedback}</p>
                    </motion.div>
                  )}
                  
                  <Button
                    onClick={skipWord}
                    variant="ghost"
                    className="text-purple-300 hover:text-white hover:bg-purple-500/20"
                  >
                    Saltar Palabra <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </CardContent>
      </Card>
    </>
  );
}
