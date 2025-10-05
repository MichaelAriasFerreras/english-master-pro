
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { 
  ArrowLeft,
  User,
  Mail,
  Calendar,
  Trophy,
  Star,
  Zap,
  Target,
  Brain,
  Award,
  Crown,
  Gem,
  Flame,
  Heart,
  Save,
  Upload,
  Edit3,
  Camera,
  Settings,
  Bell,
  Shield,
  Globe,
  BarChart3,
  TrendingUp,
  CheckCircle,
  XCircle,
  Plus,
  Minus,
  RefreshCw,
  Clock,
  LogOut,
  Sparkles,
  Rocket,
  Wand2,
  ImageIcon,
  X,
  Check,
  Loader2,
  Medal,
  Users,
  BookOpen,
  CalendarDays,
  Clock3,
  Activity,
  Coffee,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Palette,
  Eye,
  EyeOff,
  Trash2,
  AlertCircle,
  Wifi,
  WifiOff
} from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  image: string;
  joinDate: string;
  level: string;
  totalXP: number;
  currentStreak: number;
  longestStreak: number;
  wordsLearned: number;
  gamesPlayed: number;
  averageScore: number;
  dailyGoal: number;
  reminderTime: string;
  preferredLanguage: string;
  achievements: Achievement[];
  studyTime: number;
  accuracy: number;
  weeklyXP: number;
  monthlyXP: number;
  perfectScores: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface FormData {
  name: string;
  email: string;
  dailyGoal: number;
  reminderTime: string;
  preferredLanguage: string;
}

interface LoadingState {
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
}

export function UserProfileClient() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados principales mejorados
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: true,
    error: null,
    isConnected: true
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Estados para animaciones mejoradas
  const [isVisible, setIsVisible] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  // Formulario
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    dailyGoal: 50,
    reminderTime: '18:00',
    preferredLanguage: 'es'
  });

  // Cargar datos del perfil con manejo mejorado de errores
  useEffect(() => {
    const loadProfile = async () => {
      // Verificar sesión primero
      if (!session?.user) {
        setLoadingState({
          isLoading: false,
          error: 'No hay sesión activa. Por favor, inicia sesión.',
          isConnected: true
        });
        return;
      }
      
      setLoadingState(prev => ({ ...prev, isLoading: true, error: null }));
      
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundo timeout
        
        const response = await fetch('/api/profile', {
          signal: controller.signal,
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (!data || typeof data !== 'object') {
          throw new Error('Datos de perfil inválidos');
        }
        
        setProfileData(data);
        setFormData({
          name: data.name || '',
          email: data.email || '',
          dailyGoal: data.dailyGoal || 50,
          reminderTime: data.reminderTime || '18:00',
          preferredLanguage: data.preferredLanguage || 'es'
        });
        
        setLoadingState({
          isLoading: false,
          error: null,
          isConnected: true
        });
        
        // Animaciones escalonadas
        setTimeout(() => setIsVisible(true), 100);
        setTimeout(() => setShowStats(true), 600);
        
      } catch (error: any) {
        console.error('Error loading profile:', error);
        
        let errorMessage = 'No se pudo cargar el perfil';
        let isConnected = true;
        
        if (error.name === 'AbortError') {
          errorMessage = 'Tiempo de carga agotado. Verifica tu conexión.';
          isConnected = false;
        } else if (error.message?.includes('401')) {
          errorMessage = 'Sesión expirada. Por favor, inicia sesión nuevamente.';
        } else if (error.message?.includes('404')) {
          errorMessage = 'Perfil no encontrado. Contacta al soporte.';
        } else if (error.message?.includes('500')) {
          errorMessage = 'Error del servidor. Intenta más tarde.';
        } else if (!navigator.onLine) {
          errorMessage = 'Sin conexión a internet.';
          isConnected = false;
        }
        
        setLoadingState({
          isLoading: false,
          error: errorMessage,
          isConnected
        });
        
        toast({
          title: "Error de Carga",
          description: errorMessage,
          variant: "destructive"
        });
      }
    };

    loadProfile();
  }, [session, toast, retryCount]);

  // Función de retry mejorada
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setLoadingState(prev => ({ ...prev, error: null }));
  };

  // Manejar upload de imagen mejorado
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validaciones mejoradas
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    
    if (file.size > maxSize) {
      toast({
        title: "Archivo muy grande",
        description: "La imagen debe ser menor a 5MB",
        variant: "destructive"
      });
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Formato no válido", 
        description: "Solo se permiten archivos JPG, PNG, WEBP",
        variant: "destructive"
      });
      return;
    }

    setIsUploadingImage(true);

    try {
      // Crear preview inmediato
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/profile-image', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setProfileData(prev => prev ? { ...prev, image: result.imageUrl } : null);
        setImagePreview(result.imageUrl);
        
        // CRÍTICO: Actualizar la sesión de Next Auth para sincronizar en toda la aplicación
        try {
          // Actualizar la sesión con la nueva imagen
          await update({
            ...session,
            user: {
              ...session?.user,
              image: result.imageUrl
            }
          });
          
          // Emitir evento personalizado para notificar a otros componentes
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('profile-image-updated', {
              detail: { imageUrl: result.imageUrl }
            }));
          }
          
          console.log('✅ Sesión actualizada correctamente con nueva imagen:', result.imageUrl);
        } catch (sessionError) {
          console.error('❌ Error actualizando sesión:', sessionError);
        }
        
        toast({
          title: "¡Imagen actualizada!",
          description: "Tu foto de perfil se ha actualizado en toda la aplicación",
        });
      } else {
        throw new Error(result.error || 'Error al subir imagen');
      }
    } catch (error: any) {
      console.error('Error uploading image:', error);
      setImagePreview(null); // Limpiar preview en caso de error
      toast({
        title: "Error de subida",
        description: error.message || "No se pudo subir la imagen",
        variant: "destructive"
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Guardar perfil mejorado
  const handleSaveProfile = async () => {
    setIsSaving(true);
    
    try {
      // Validaciones del lado cliente
      if (!formData.name.trim()) {
        toast({
          title: "Nombre requerido",
          description: "Por favor ingresa tu nombre completo",
          variant: "destructive"
        });
        return;
      }

      if (!formData.email.trim() || !formData.email.includes('@')) {
        toast({
          title: "Email inválido",
          description: "Por favor ingresa un email válido",
          variant: "destructive"
        });
        return;
      }

      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setProfileData(prev => prev ? { ...prev, ...formData } : null);
        setIsEditing(false);
        
        // Actualizar sesión
        await update();
        
        toast({
          title: "¡Perfil actualizado!",
          description: "Tus cambios se han guardado correctamente",
        });
      } else {
        throw new Error(result.error || 'Error al guardar');
      }
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error al guardar",
        description: error.message || "No se pudo guardar el perfil",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Funciones auxiliares mejoradas
  const getRarityColor = (rarity: string) => {
    const colors = {
      'common': 'from-slate-400 to-slate-600 text-slate-100 border-slate-400/30',
      'rare': 'from-blue-400 to-blue-600 text-blue-100 border-blue-400/30',
      'epic': 'from-blue-400 to-blue-600 text-blue-100 border-blue-400/30',
      'legendary': 'from-yellow-400 to-yellow-600 text-yellow-100 border-yellow-400/30'
    };
    return colors[rarity as keyof typeof colors] || colors.common;
  };

  const getLevelProgress = () => {
    if (!profileData) return 0;
    const currentLevelXP = profileData.totalXP % 1000;
    return Math.min((currentLevelXP / 1000) * 100, 100);
  };

  const getLevelColor = (level: string) => {
    const colors = {
      'A1': 'from-emerald-400 to-green-600',
      'A2': 'from-blue-400 to-indigo-600', 
      'B1': 'from-blue-400 to-violet-600',
      'B2': 'from-pink-400 to-rose-600',
      'C1': 'from-orange-400 to-red-600',
      'C2': 'from-red-400 to-crimson-600'
    };
    return colors[level as keyof typeof colors] || 'from-slate-400 to-slate-600';
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const getMotivationalMessage = () => {
    const messages = [
      "¡Sigue brillando! 🌟",
      "Tu progreso es increíble 🚀",
      "¡Cada día mejor! 💪",
      "Eres imparable 🔥",
      "¡Sigue así, campeón! 🏆"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  // Estados de carga y error ultra-modernos
  if (loadingState.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 via-transparent to-blue-900/40"></div>
          <motion.div
            animate={{ 
              scale: [1, 1.3, 1],
              rotate: [0, 180, 360],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{ duration: 15, repeat: Infinity }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl"
          />
          <motion.div
            animate={{ 
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
              opacity: [0.1, 0.25, 0.1]
            }}
            transition={{ duration: 18, repeat: Infinity }}
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-tl from-blue-500/20 to-transparent rounded-full blur-3xl"
          />
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-8"
          >
            {/* Ultra-modern loading spinner */}
            <motion.div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-20 h-20 mx-auto"
              >
                <div className="w-full h-full border-4 border-blue-500/30 border-t-blue-400 rounded-full"></div>
              </motion.div>
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2"
              >
                <div className="w-full h-full border-2 border-pink-500/40 border-b-pink-400 rounded-full"></div>
              </motion.div>
              <motion.div
                animate={{ scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-6 bg-gradient-to-br from-blue-400 to-pink-400 rounded-full opacity-30"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="space-y-4"
            >
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Cargando Perfil
              </h2>
              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-blue-200 text-lg"
              >
                Preparando tu espacio personal...
              </motion.p>
              
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, repeat: Infinity }}
                className="h-1 bg-gradient-to-r from-blue-500 to-pink-500 rounded-full max-w-xs mx-auto"
              />
            </motion.div>

            {!loadingState.isConnected && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="flex items-center justify-center space-x-2 text-red-400"
              >
                <WifiOff className="w-5 h-5" />
                <span>Verificando conexión...</span>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  // Estado de error mejorado
  if (loadingState.error || !profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-red-900/30 via-transparent to-blue-900/30"></div>
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute top-1/3 left-1/3 w-72 h-72 bg-gradient-to-br from-red-500/20 to-transparent rounded-full blur-3xl"
          />
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-8 max-w-md"
          >
            <Card className="backdrop-blur-xl bg-white/10 border border-red-400/30 hover:border-red-300/50 transition-all duration-300 shadow-2xl">
              <CardContent className="p-8 space-y-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="flex justify-center"
                >
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                      <AlertCircle className="w-8 h-8 text-white" />
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 bg-red-500/30 rounded-full"
                    />
                  </div>
                </motion.div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white">
                    {loadingState.error ? 'Error de Carga' : 'Perfil No Disponible'}
                  </h2>
                  <p className="text-red-200">
                    {loadingState.error || 'No se pudo cargar la información del perfil'}
                  </p>
                  
                  {!loadingState.isConnected && (
                    <div className="flex items-center justify-center space-x-2 text-orange-400 bg-orange-500/10 rounded-lg p-3">
                      <WifiOff className="w-5 h-5" />
                      <span className="text-sm">Sin conexión a internet</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    onClick={handleRetry}
                    className="bg-gradient-to-r from-blue-600 to-pink-600 hover:from-blue-700 hover:to-pink-700 text-white shadow-lg flex-1"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reintentar
                  </Button>
                  <Button
                    onClick={() => router.push('/dashboard')}
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm flex-1"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </div>

                {session && (
                  <Button
                    onClick={() => router.push('/auth/signin')}
                    variant="ghost"
                    className="text-blue-300 hover:text-white hover:bg-blue-500/20 w-full"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Iniciar Sesión Nuevamente
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Ultra-Modern Background Effects - Enhanced */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 via-transparent to-blue-900/40"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400/20 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-[32rem] h-[32rem] bg-gradient-to-tl from-pink-500/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-gradient-to-br from-cyan-500/15 to-transparent rounded-full blur-2xl"></div>
        
        {/* Enhanced Animated Background Elements */}
        <motion.div
          animate={{ 
            scale: [1, 1.4, 1],
            rotate: [0, 180, 360],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-500/15 to-transparent rounded-full blur-3xl"
        />
        
        <motion.div
          animate={{ 
            scale: [1.3, 1, 1.3],
            rotate: [360, 180, 0],
            opacity: [0.08, 0.25, 0.08]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 left-0 w-[28rem] h-[28rem] bg-gradient-to-tr from-blue-500/15 to-transparent rounded-full blur-3xl"
        />

        {/* Additional floating elements */}
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            x: [0, 10, 0],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 right-1/3 w-40 h-40 bg-gradient-to-br from-indigo-500/20 to-transparent rounded-full blur-2xl"
        />
        
        <motion.div
          animate={{ 
            y: [0, 15, 0],
            x: [0, -15, 0],
            opacity: [0.05, 0.15, 0.05]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/3 right-1/4 w-60 h-60 bg-gradient-to-tl from-emerald-500/15 to-transparent rounded-full blur-2xl"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Ultra-Modern Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: isVisible ? 1 : 0, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Button
            onClick={() => {
              console.log('Navegando al dashboard...');
              try {
                router.push('/dashboard');
                // Forzar navegación si hay problemas con el router de Next.js
                setTimeout(() => {
                  if (typeof window !== 'undefined' && window.location.pathname !== '/dashboard') {
                    window.location.href = '/dashboard';
                  }
                }, 100);
              } catch (error) {
                console.error('Error navegando al dashboard:', error);
                // Fallback usando window.location
                if (typeof window !== 'undefined') {
                  window.location.href = '/dashboard';
                }
              }
            }}
            variant="ghost"
            className="group relative text-white hover:bg-white/15 border border-white/30 backdrop-blur-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-pink-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1 relative z-10" />
            <span className="relative z-10">Volver al Dashboard</span>
          </Button>
        </motion.div>

        {/* Revolutionary Header with Dynamic Greeting */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: isVisible ? 1 : 0, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1, delay: 0.2, type: "spring", stiffness: 100 }}
            className="space-y-6"
          >
            <div className="relative">
              <motion.h1 
                className="text-6xl md:text-7xl lg:text-8xl font-bold"
                initial={{ letterSpacing: "0.2em" }}
                animate={{ letterSpacing: "0.05em" }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                <span className="bg-gradient-to-r from-blue-400 via-pink-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
                  {getGreeting()},
                </span>
                <br />
                <motion.span 
                  className="bg-gradient-to-r from-cyan-400 via-blue-400 to-blue-400 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                >
                  {profileData.name?.split(' ')[0]}
                </motion.span>
              </motion.h1>
              
              {/* Decorative elements */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="absolute -top-4 -right-4 text-4xl"
              >
                ✨
              </motion.div>
              <motion.div
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="absolute -bottom-4 -left-4 text-4xl"
              >
                🚀
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="flex flex-col items-center space-y-4"
            >
              <div className="flex items-center space-x-3 text-blue-200">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                </motion.div>
                <p className="text-xl md:text-2xl font-medium">Tu espacio personal de aprendizaje</p>
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-6 h-6 text-pink-400" />
                </motion.div>
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.6 }}
                className="bg-gradient-to-r from-blue-500/20 to-pink-500/20 backdrop-blur-sm rounded-full px-6 py-2 border border-blue-400/30"
              >
                <p className="text-blue-200 text-sm">{getMotivationalMessage()}</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Revolutionary Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: isVisible ? 1 : 0, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mb-16"
        >
          <Card className="relative backdrop-blur-xl bg-gradient-to-br from-white/15 via-white/10 to-white/5 border border-white/30 shadow-2xl hover:shadow-blue-500/20 transition-all duration-700 hover:border-white/40 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-pink-500/10"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_70%)]"></div>
            
            <CardContent className="relative p-8 lg:p-16">
              <div className="flex flex-col lg:flex-row items-center space-y-12 lg:space-y-0 lg:space-x-16">
                
                {/* Revolutionary Avatar Section */}
                <motion.div 
                  className="relative group"
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
                >
                  <div className="relative">
                    {/* Multi-layer animated rings */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                      className="absolute -inset-6 bg-gradient-to-r from-blue-400 via-pink-400 via-cyan-400 to-blue-400 rounded-full opacity-30 blur-md"
                    />
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute -inset-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-blue-400 rounded-full opacity-20 blur-sm"
                    />
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                      className="absolute -inset-2 bg-gradient-to-r from-pink-400 via-blue-400 to-indigo-400 rounded-full opacity-15"
                    />
                    
                    {/* Main Avatar */}
                    <motion.div
                      className="relative"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.6, duration: 0.8, type: "spring" }}
                    >
                      <Avatar className="w-48 h-48 border-4 border-white/40 relative z-10 shadow-2xl backdrop-blur-sm">
                        <AvatarImage 
                          src={imagePreview || profileData.image} 
                          alt={profileData.name} 
                          className="object-cover"
                        />
                        <AvatarFallback className="text-4xl font-bold bg-gradient-to-br from-blue-500 to-pink-500 text-white">
                          {profileData.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </motion.div>
                    
                    {/* Enhanced Upload Button */}
                    <motion.button
                      whileHover={{ scale: 1.15, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingImage}
                      className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-600 via-pink-600 to-cyan-600 hover:from-blue-700 hover:via-pink-700 hover:to-cyan-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 group-hover:shadow-blue-500/30 disabled:opacity-50 backdrop-blur-sm border border-white/20"
                    >
                      <motion.div
                        animate={isUploadingImage ? { rotate: 360 } : {}}
                        transition={{ duration: 1, repeat: isUploadingImage ? Infinity : 0, ease: "linear" }}
                      >
                        {isUploadingImage ? (
                          <Loader2 className="w-6 h-6" />
                        ) : (
                          <Camera className="w-6 h-6" />
                        )}
                      </motion.div>
                    </motion.button>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    
                    {/* Status indicator */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1, duration: 0.5 }}
                      className="absolute top-4 right-4 bg-green-500 w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center"
                    >
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Revolutionary User Info Section */}
                <div className="flex-1 text-center lg:text-left space-y-8">
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  >
                    <motion.h2 
                      className="text-5xl lg:text-6xl font-bold mb-4"
                      initial={{ letterSpacing: "0.1em" }}
                      animate={{ letterSpacing: "0.02em" }}
                      transition={{ duration: 1, delay: 0.7 }}
                    >
                      <span className="bg-gradient-to-r from-white via-blue-200 to-cyan-200 bg-clip-text text-transparent">
                        {profileData.name}
                      </span>
                    </motion.h2>
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="space-y-3"
                    >
                      <motion.p 
                        className="text-blue-200 text-lg flex items-center justify-center lg:justify-start group cursor-pointer hover:text-blue-100 transition-colors"
                        whileHover={{ x: 5 }}
                      >
                        <div className="bg-blue-500/20 p-2 rounded-lg mr-3 group-hover:bg-blue-500/30 transition-colors">
                          <Mail className="w-5 h-5" />
                        </div>
                        {profileData.email}
                      </motion.p>
                      <motion.p 
                        className="text-blue-300 flex items-center justify-center lg:justify-start group cursor-pointer hover:text-blue-200 transition-colors"
                        whileHover={{ x: 5 }}
                      >
                        <div className="bg-blue-500/20 p-2 rounded-lg mr-3 group-hover:bg-blue-500/30 transition-colors">
                          <Calendar className="w-5 h-5" />
                        </div>
                        Miembro desde {new Date(profileData.joinDate).toLocaleDateString('es-ES', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </motion.p>
                    </motion.div>
                  </motion.div>
                  
                  {/* Revolutionary Badges System */}
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="flex flex-wrap justify-center lg:justify-start gap-4"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Badge className={`bg-gradient-to-r ${getLevelColor(profileData.level)} text-white border-0 px-6 py-3 text-base font-bold shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 backdrop-blur-sm`}>
                        <Crown className="w-5 h-5 mr-2" />
                        Nivel {profileData.level}
                      </Badge>
                    </motion.div>
                    
                    <motion.div
                      whileHover={{ scale: 1.1, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Badge className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white border-0 px-6 py-3 text-base font-bold shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 backdrop-blur-sm">
                        <Zap className="w-5 h-5 mr-2" />
                        {profileData.totalXP.toLocaleString()} XP
                      </Badge>
                    </motion.div>
                    
                    <motion.div
                      whileHover={{ scale: 1.1, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Badge className="bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 text-white border-0 px-6 py-3 text-base font-bold shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 backdrop-blur-sm">
                        <Flame className="w-5 h-5 mr-2" />
                        {profileData.currentStreak} días
                      </Badge>
                    </motion.div>
                  </motion.div>

                  {/* Ultra-Modern Level Progress */}
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className="space-y-4"
                  >
                    <div className="flex justify-between items-center">
                      <motion.span 
                        className="text-blue-200 flex items-center text-lg font-medium"
                        whileHover={{ x: 5 }}
                      >
                        <Target className="w-5 h-5 mr-2" />
                        Progreso al siguiente nivel
                      </motion.span>
                      <motion.span 
                        className="text-white font-bold text-xl"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
                      >
                        {Math.round(getLevelProgress())}%
                      </motion.span>
                    </div>
                    
                    <div className="relative">
                      <div className="h-4 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/20">
                        <motion.div
                          className="h-full bg-gradient-to-r from-blue-500 via-pink-500 to-cyan-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${getLevelProgress()}%` }}
                          transition={{ delay: 1.3, duration: 1.5, ease: "easeOut" }}
                        />
                      </div>
                      
                      {/* Animated progress glow */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-blue-500/30 via-pink-500/30 to-cyan-500/30 rounded-full blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.7, 0] }}
                        transition={{ delay: 1.5, duration: 2, repeat: Infinity }}
                      />
                    </div>
                    
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2 }}
                      className="text-sm text-blue-300 italic text-center lg:text-left"
                    >
                      ¡Solo {1000 - (profileData.totalXP % 1000)} XP más para el siguiente nivel! 🎯
                    </motion.p>
                  </motion.div>
                </div>

                {/* Revolutionary Quick Stats Grid */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: showStats ? 1 : 0, scale: showStats ? 1 : 0.8 }}
                  transition={{ delay: 1.5, duration: 1, type: "spring", stiffness: 100 }}
                  className="grid grid-cols-2 gap-6"
                >
                  {[
                    { 
                      icon: BookOpen, 
                      value: profileData.wordsLearned, 
                      label: "Palabras", 
                      gradient: "from-emerald-500/30 via-green-500/20 to-teal-500/30",
                      iconColor: "text-emerald-400",
                      valueColor: "text-emerald-300",
                      labelColor: "text-emerald-200",
                      borderColor: "border-emerald-500/40",
                      hoverBorder: "hover:border-emerald-400/60",
                      shadowColor: "hover:shadow-emerald-500/20"
                    },
                    { 
                      icon: Target, 
                      value: `${profileData.averageScore}%`, 
                      label: "Precisión", 
                      gradient: "from-blue-500/30 via-cyan-500/20 to-indigo-500/30",
                      iconColor: "text-blue-400",
                      valueColor: "text-blue-300",
                      labelColor: "text-blue-200",
                      borderColor: "border-blue-500/40",
                      hoverBorder: "hover:border-blue-400/60",
                      shadowColor: "hover:shadow-blue-500/20"
                    },
                    { 
                      icon: Trophy, 
                      value: profileData.gamesPlayed, 
                      label: "Juegos", 
                      gradient: "from-blue-500/30 via-violet-500/20 to-fuchsia-500/30",
                      iconColor: "text-blue-400",
                      valueColor: "text-blue-300",
                      labelColor: "text-blue-200",
                      borderColor: "border-blue-500/40",
                      hoverBorder: "hover:border-blue-400/60",
                      shadowColor: "hover:shadow-blue-500/20"
                    },
                    { 
                      icon: Clock3, 
                      value: `${profileData.studyTime}h`, 
                      label: "Estudio", 
                      gradient: "from-orange-500/30 via-amber-500/20 to-yellow-500/30",
                      iconColor: "text-orange-400",
                      valueColor: "text-orange-300",
                      labelColor: "text-orange-200",
                      borderColor: "border-orange-500/40",
                      hoverBorder: "hover:border-orange-400/60",
                      shadowColor: "hover:shadow-orange-500/20"
                    }
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30, rotateY: -90 }}
                      animate={{ opacity: 1, y: 0, rotateY: 0 }}
                      transition={{ 
                        delay: 1.7 + index * 0.1,
                        duration: 0.8,
                        type: "spring",
                        stiffness: 150
                      }}
                      whileHover={{ 
                        scale: 1.08, 
                        y: -8,
                        rotateY: 5,
                        transition: { duration: 0.3 }
                      }}
                      className={`relative bg-gradient-to-br ${stat.gradient} backdrop-blur-xl rounded-2xl p-8 border ${stat.borderColor} ${stat.hoverBorder} transition-all duration-500 ${stat.shadowColor} shadow-xl overflow-hidden group cursor-pointer`}
                    >
                      {/* Background decoration */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50"></div>
                      <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-white/10 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <div className="relative text-center">
                        <motion.div
                          whileHover={{ rotate: 360, scale: 1.2 }}
                          transition={{ duration: 0.6 }}
                          className={`${stat.iconColor} mx-auto mb-4 p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20`}
                        >
                          <stat.icon className="w-10 h-10" />
                        </motion.div>
                        
                        <motion.div 
                          className={`text-3xl lg:text-4xl font-bold ${stat.valueColor} mb-2`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 2 + index * 0.1, duration: 0.5, type: "spring" }}
                        >
                          {stat.value}
                        </motion.div>
                        
                        <motion.div 
                          className={`text-sm font-medium ${stat.labelColor} uppercase tracking-wider`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 2.2 + index * 0.1 }}
                        >
                          {stat.label}
                        </motion.div>
                      </div>
                      
                      {/* Floating particles effect */}
                      <motion.div
                        className="absolute top-2 right-2 w-2 h-2 bg-white/40 rounded-full"
                        animate={{
                          y: [0, -10, 0],
                          opacity: [0.4, 0.8, 0.4]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: index * 0.5
                        }}
                      />
                      <motion.div
                        className="absolute bottom-4 left-4 w-1 h-1 bg-white/60 rounded-full"
                        animate={{
                          y: [0, -8, 0],
                          opacity: [0.6, 1, 0.6]
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: 0.3 + index * 0.4
                        }}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Revolutionary Tabs System */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: isVisible ? 1 : 0, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-12">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, duration: 0.8, type: "spring" }}
            >
              <TabsList className="relative grid w-full grid-cols-4 bg-gradient-to-r from-white/15 via-white/10 to-white/15 backdrop-blur-2xl border border-white/30 rounded-3xl p-3 shadow-2xl overflow-hidden">
                {/* Background glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-pink-500/10 to-cyan-500/10 rounded-3xl"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]"></div>
                
                {[
                  { value: "overview", icon: BarChart3, label: "Estadísticas", gradient: "from-blue-500 to-pink-500" },
                  { value: "profile", icon: User, label: "Perfil", gradient: "from-blue-500 to-cyan-500" },
                  { value: "achievements", icon: Trophy, label: "Logros", gradient: "from-yellow-500 to-orange-500" },
                  { value: "settings", icon: Settings, label: "Configuración", gradient: "from-green-500 to-emerald-500" }
                ].map((tab, index) => (
                  <TabsTrigger 
                    key={tab.value}
                    value={tab.value}
                    className={`relative data-[state=active]:bg-gradient-to-r data-[state=active]:${tab.gradient} data-[state=active]:text-white data-[state=active]:shadow-2xl rounded-2xl transition-all duration-500 hover:bg-white/20 hover:scale-105 group z-10 overflow-hidden`}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      whileHover={{ scale: 1.1 }}
                    />
                    <motion.div
                      className="relative flex items-center justify-center space-x-2 py-2"
                      whileHover={{ y: -2 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <tab.icon className="w-5 h-5" />
                      </motion.div>
                      <span className="font-medium text-sm lg:text-base">{tab.label}</span>
                    </motion.div>
                  </TabsTrigger>
                ))}
              </TabsList>
            </motion.div>

            {/* Overview Tab - Estadísticas Detalladas */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="backdrop-blur-xl bg-gradient-to-br from-blue-500/20 to-pink-500/20 border border-blue-400/30 hover:border-blue-300/50 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-200 text-sm font-medium">XP Semanal</p>
                          <p className="text-3xl font-bold text-white">{profileData.weeklyXP.toLocaleString()}</p>
                          <p className="text-blue-300 text-xs mt-1">+15% vs semana anterior</p>
                        </div>
                        <div className="bg-blue-500/20 p-3 rounded-2xl">
                          <TrendingUp className="w-8 h-8 text-blue-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="backdrop-blur-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-400/30 hover:border-blue-300/50 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-200 text-sm font-medium">Precisión Global</p>
                          <p className="text-3xl font-bold text-white">{profileData.accuracy}%</p>
                          <p className="text-blue-300 text-xs mt-1">Excelente nivel</p>
                        </div>
                        <div className="bg-blue-500/20 p-3 rounded-2xl">
                          <Target className="w-8 h-8 text-blue-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="backdrop-blur-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-400/30 hover:border-green-300/50 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-200 text-sm font-medium">Tiempo de Estudio</p>
                          <p className="text-3xl font-bold text-white">{profileData.studyTime}h</p>
                          <p className="text-green-300 text-xs mt-1">Este mes</p>
                        </div>
                        <div className="bg-green-500/20 p-3 rounded-2xl">
                          <Clock3 className="w-8 h-8 text-green-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="backdrop-blur-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 hover:border-yellow-300/50 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-yellow-200 text-sm font-medium">Puntuaciones Perfectas</p>
                          <p className="text-3xl font-bold text-white">{profileData.perfectScores}</p>
                          <p className="text-yellow-300 text-xs mt-1">¡Increíble!</p>
                        </div>
                        <div className="bg-yellow-500/20 p-3 rounded-2xl">
                          <Star className="w-8 h-8 text-yellow-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="backdrop-blur-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-400/30 hover:border-orange-300/50 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-orange-200 text-sm font-medium">Racha Más Larga</p>
                          <p className="text-3xl font-bold text-white">{profileData.longestStreak}</p>
                          <p className="text-orange-300 text-xs mt-1">días consecutivos</p>
                        </div>
                        <div className="bg-orange-500/20 p-3 rounded-2xl">
                          <Flame className="w-8 h-8 text-orange-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="backdrop-blur-xl bg-gradient-to-br from-pink-500/20 to-blue-500/20 border border-pink-400/30 hover:border-pink-300/50 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-pink-200 text-sm font-medium">XP Mensual</p>
                          <p className="text-3xl font-bold text-white">{profileData.monthlyXP.toLocaleString()}</p>
                          <p className="text-pink-300 text-xs mt-1">Meta: 2000 XP</p>
                        </div>
                        <div className="bg-pink-500/20 p-3 rounded-2xl">
                          <Rocket className="w-8 h-8 text-pink-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </TabsContent>

            {/* Profile Tab - Información Personal */}
            <TabsContent value="profile" className="space-y-6">
              <Card className="backdrop-blur-xl bg-white/10 border border-white/20 hover:border-white/30 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <User className="w-6 h-6 mr-3 text-blue-400" />
                    Información Personal
                  </CardTitle>
                  <CardDescription className="text-blue-200">
                    Actualiza tu información personal y de contacto
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="name" className="text-white flex items-center">
                        <User className="w-4 h-4 mr-2 text-blue-400" />
                        Nombre Completo
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        disabled={!isEditing}
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400 backdrop-blur-sm h-12 focus:border-blue-400 transition-all duration-300"
                        placeholder="Ingresa tu nombre completo"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="email" className="text-white flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-blue-400" />
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        disabled={!isEditing}
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400 backdrop-blur-sm h-12 focus:border-blue-400 transition-all duration-300"
                        placeholder="tu.email@ejemplo.com"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <AnimatePresence mode="wait">
                      {isEditing ? (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="flex space-x-3"
                        >
                          <Button
                            variant="outline"
                            onClick={() => {
                              setIsEditing(false);
                              // Reset form data
                              setFormData({
                                name: profileData.name || '',
                                email: profileData.email || '',
                                dailyGoal: profileData.dailyGoal || 50,
                                reminderTime: profileData.reminderTime || '18:00',
                                preferredLanguage: profileData.preferredLanguage || 'es'
                              });
                            }}
                            className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Cancelar
                          </Button>
                          <Button
                            onClick={handleSaveProfile}
                            disabled={isSaving}
                            className="bg-gradient-to-r from-blue-600 to-pink-600 hover:from-blue-700 hover:to-pink-700 text-white shadow-lg"
                          >
                            {isSaving ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Guardando...
                              </>
                            ) : (
                              <>
                                <Check className="w-4 h-4 mr-2" />
                                Guardar Cambios
                              </>
                            )}
                          </Button>
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                        >
                          <Button
                            onClick={() => setIsEditing(true)}
                            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg"
                          >
                            <Edit3 className="w-4 h-4 mr-2" />
                            Editar Perfil
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Achievements Tab - Logros */}
            <TabsContent value="achievements" className="space-y-6">
              <Card className="backdrop-blur-xl bg-white/10 border border-white/20 hover:border-white/30 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Trophy className="w-6 h-6 mr-3 text-yellow-400" />
                    Mis Logros ({profileData.achievements.length})
                  </CardTitle>
                  <CardDescription className="text-blue-200">
                    Logros desbloqueados en tu viaje de aprendizaje
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {profileData.achievements.map((achievement, index) => (
                      <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                      >
                        <Card className={`backdrop-blur-lg bg-gradient-to-br ${getRarityColor(achievement.rarity)} border-2 hover:shadow-lg transition-all duration-300`}>
                          <CardContent className="p-6">
                            <div className="text-center space-y-4">
                              <div className="text-4xl">{achievement.icon}</div>
                              <div>
                                <h3 className="font-bold text-white text-lg mb-2">{achievement.name}</h3>
                                <p className="text-sm text-white/90 mb-3">{achievement.description}</p>
                              </div>
                              <div className="flex items-center justify-between">
                                <Badge className={`bg-gradient-to-r ${getRarityColor(achievement.rarity)} text-white border-0 capitalize`}>
                                  {achievement.rarity}
                                </Badge>
                                <span className="text-xs text-white/70">
                                  {new Date(achievement.unlockedAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                    
                    {/* Add some placeholder achievements */}
                    {[...Array(3)].map((_, index) => (
                      <motion.div
                        key={`placeholder-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: (profileData.achievements.length + index) * 0.1 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                      >
                        <Card className="backdrop-blur-lg bg-gradient-to-br from-gray-500/20 to-gray-600/20 border-2 border-gray-500/30 hover:shadow-lg transition-all duration-300">
                          <CardContent className="p-6">
                            <div className="text-center space-y-4">
                              <div className="text-4xl opacity-50">🔒</div>
                              <div>
                                <h3 className="font-bold text-gray-300 text-lg mb-2">Logro Bloqueado</h3>
                                <p className="text-sm text-gray-400 mb-3">Sigue estudiando para desbloquear</p>
                              </div>
                              <Badge className="bg-gradient-to-r from-gray-400 to-gray-600 text-gray-100 border-0">
                                ???
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab - Configuración Ultra-Moderna */}
            <TabsContent value="settings" className="space-y-6">
              <Card className="backdrop-blur-xl bg-white/10 border border-white/20 hover:border-white/30 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Settings className="w-6 h-6 mr-3 text-green-400" />
                    Configuración de Aprendizaje
                  </CardTitle>
                  <CardDescription className="text-blue-200">
                    Personaliza tu experiencia de aprendizaje y preferencias
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="dailyGoal" className="text-white flex items-center">
                        <Target className="w-4 h-4 mr-2 text-green-400" />
                        Meta Diaria (XP)
                      </Label>
                      <Input
                        id="dailyGoal"
                        type="number"
                        value={formData.dailyGoal}
                        onChange={(e) => setFormData(prev => ({ ...prev, dailyGoal: parseInt(e.target.value) || 0 }))}
                        disabled={!isEditing}
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400 backdrop-blur-sm h-12 focus:border-green-400 transition-all duration-300"
                        placeholder="50"
                        min="10"
                        max="500"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="reminderTime" className="text-white flex items-center">
                        <Bell className="w-4 h-4 mr-2 text-green-400" />
                        Hora de Recordatorio
                      </Label>
                      <Input
                        id="reminderTime"
                        type="time"
                        value={formData.reminderTime}
                        onChange={(e) => setFormData(prev => ({ ...prev, reminderTime: e.target.value }))}
                        disabled={!isEditing}
                        className="bg-white/10 border-white/20 text-white backdrop-blur-sm h-12 focus:border-green-400 transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center justify-between p-6 backdrop-blur-lg bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl border border-blue-400/30 hover:border-blue-300/50 transition-all duration-300"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="bg-blue-500/20 p-3 rounded-xl">
                          <Bell className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-white font-medium">Notificaciones Push</h3>
                          <p className="text-blue-200 text-sm">Recibir recordatorios de estudio diarios</p>
                        </div>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant="default"
                          size="sm"
                          disabled={!isEditing}
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 shadow-lg"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Activado
                        </Button>
                      </motion.div>
                    </motion.div>

                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center justify-between p-6 backdrop-blur-lg bg-gradient-to-r from-blue-500/20 to-pink-500/20 rounded-xl border border-blue-400/30 hover:border-blue-300/50 transition-all duration-300"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="bg-blue-500/20 p-3 rounded-xl">
                          <Volume2 className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-white font-medium">Efectos de Sonido</h3>
                          <p className="text-blue-200 text-sm">Sonidos de interfaz y pronunciación</p>
                        </div>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant="default"
                          size="sm"
                          disabled={!isEditing}
                          className="bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white border-0 shadow-lg"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Activado
                        </Button>
                      </motion.div>
                    </motion.div>

                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center justify-between p-6 backdrop-blur-lg bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-xl border border-orange-400/30 hover:border-orange-300/50 transition-all duration-300"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="bg-orange-500/20 p-3 rounded-xl">
                          <Globe className="w-6 h-6 text-orange-400" />
                        </div>
                        <div>
                          <h3 className="text-white font-medium">Idioma de Interfaz</h3>
                          <p className="text-orange-200 text-sm">Español (por defecto)</p>
                        </div>
                      </div>
                      <Badge className="bg-gradient-to-r from-orange-400 to-yellow-400 text-white border-0">
                        Español
                      </Badge>
                    </motion.div>
                  </div>

                  {/* Zona de Seguridad */}
                  <div className="pt-8 border-t border-white/20">
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-lg rounded-xl p-6 border border-red-400/30 hover:border-red-300/50 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="bg-red-500/20 p-3 rounded-xl">
                            <Shield className="w-6 h-6 text-red-400" />
                          </div>
                          <div>
                            <h3 className="text-white font-medium mb-1">Zona de Seguridad</h3>
                            <p className="text-red-200 text-sm">Cerrar sesión en todos los dispositivos</p>
                          </div>
                        </div>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                            variant="destructive"
                            className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-lg"
                          >
                            <LogOut className="w-4 h-4 mr-2" />
                            Cerrar Sesión
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Save Button for Settings */}
                  <div className="flex justify-end pt-6">
                    <AnimatePresence mode="wait">
                      {isEditing ? (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="flex space-x-3"
                        >
                          <Button
                            variant="outline"
                            onClick={() => {
                              setIsEditing(false);
                              // Reset form data
                              setFormData({
                                name: profileData.name || '',
                                email: profileData.email || '',
                                dailyGoal: profileData.dailyGoal || 50,
                                reminderTime: profileData.reminderTime || '18:00',
                                preferredLanguage: profileData.preferredLanguage || 'es'
                              });
                            }}
                            className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Cancelar
                          </Button>
                          <Button
                            onClick={handleSaveProfile}
                            disabled={isSaving}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
                          >
                            {isSaving ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Guardando...
                              </>
                            ) : (
                              <>
                                <Check className="w-4 h-4 mr-2" />
                                Guardar Configuración
                              </>
                            )}
                          </Button>
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                        >
                          <Button
                            onClick={() => setIsEditing(true)}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
                          >
                            <Settings className="w-4 h-4 mr-2" />
                            Editar Configuración
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
