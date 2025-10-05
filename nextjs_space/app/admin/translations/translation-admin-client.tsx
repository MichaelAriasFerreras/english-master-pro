
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Database,
  TrendingUp,
  AlertCircle,
  Play,
  Pause
} from 'lucide-react';

interface ProgressData {
  timestamp: string;
  processed: number;
  total: number;
  corrected: number;
  errors: number;
  percentage: string;
  estimatedTimeRemaining: number;
}

interface DatabaseStats {
  totalVerbs: number;
  verbsWithExamples: number;
  verbsWithSpanishExamples: number;
  recentUpdates: Array<{
    infinitive: string;
    spanishTranslation: string;
    updatedAt: string;
  }>;
}

interface TranslationSample {
  infinitive: string;
  oldTranslation: string;
  newTranslation: string;
  examples: string[];
  spanishExamples: string[];
  level: string;
  updatedAt: string;
}

export default function TranslationAdminClient() {
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [databaseStats, setDatabaseStats] = useState<DatabaseStats | null>(null);
  const [translationSamples, setTranslationSamples] = useState<TranslationSample[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);

  const fetchProgressData = async () => {
    try {
      const response = await fetch('/api/admin/translation-progress');
      if (response.ok) {
        const data = await response.json();
        setProgressData(data.progress);
        setDatabaseStats(data.stats);
        setTranslationSamples(data.samples);
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const startCorrectionProcess = async () => {
    try {
      await fetch('/api/admin/start-translation-correction', {
        method: 'POST'
      });
      alert('Proceso de corrección iniciado');
      fetchProgressData();
    } catch (error) {
      console.error('Error starting correction:', error);
      alert('Error iniciando proceso');
    }
  };

  useEffect(() => {
    fetchProgressData();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoRefresh) {
      interval = setInterval(fetchProgressData, 30000); // Refresh every 30 seconds
    }
    return () => clearInterval(interval);
  }, [isAutoRefresh]);

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date().getTime();
    const time = new Date(timestamp).getTime();
    const diffMinutes = Math.floor((now - time) / 60000);
    
    if (diffMinutes < 1) return 'ahora';
    if (diffMinutes < 60) return `hace ${diffMinutes}m`;
    const diffHours = Math.floor(diffMinutes / 60);
    return `hace ${diffHours}h ${diffMinutes % 60}m`;
  };

  const getStatusColor = () => {
    if (!progressData) return 'gray';
    if (progressData.processed >= progressData.total) return 'green';
    if (progressData.errors > progressData.corrected * 0.1) return 'red';
    return 'blue';
  };

  const getStatusText = () => {
    if (!progressData) return 'Cargando...';
    if (progressData.processed >= progressData.total) return 'Completado';
    if (progressData.errors > progressData.corrected * 0.1) return 'Con errores';
    return 'En progreso';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Cargando datos...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Control Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Badge variant={getStatusColor() as any} className="text-sm">
            {getStatusText()}
          </Badge>
          {progressData && (
            <span className="text-sm text-gray-600">
              Última actualización: {formatTimeAgo(progressData.timestamp)}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAutoRefresh(!isAutoRefresh)}
          >
            {isAutoRefresh ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isAutoRefresh ? 'Pausar' : 'Reanudar'} Auto-actualización
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={fetchProgressData}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          
          <Button
            size="sm"
            onClick={startCorrectionProcess}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Play className="w-4 h-4" />
            Iniciar Corrección
          </Button>
        </div>
      </div>

      {/* Progress Overview */}
      {progressData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Progreso Total</p>
                  <p className="text-2xl font-bold text-gray-900">{progressData.percentage}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-500" />
              </div>
              <Progress value={parseFloat(progressData.percentage)} className="mt-4" />
              <p className="text-xs text-gray-500 mt-2">
                {progressData.processed}/{progressData.total} verbos procesados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Corregidos</p>
                  <p className="text-2xl font-bold text-green-600">{progressData.corrected}</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Tasa de éxito: {progressData.processed > 0 ? ((progressData.corrected / progressData.processed) * 100).toFixed(1) : 0}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Errores</p>
                  <p className="text-2xl font-bold text-red-600">{progressData.errors}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Tasa de error: {progressData.processed > 0 ? ((progressData.errors / progressData.processed) * 100).toFixed(1) : 0}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tiempo Restante</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {Math.ceil(progressData.estimatedTimeRemaining / 60)}m
                  </p>
                </div>
                <Clock className="w-8 h-8 text-blue-500" />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Estimado para completar
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Database Statistics */}
      {databaseStats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Estadísticas de Base de Datos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">{databaseStats.totalVerbs}</p>
                <p className="text-sm text-gray-600">Total de verbos</p>
              </div>
              
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">
                  {((databaseStats.verbsWithExamples / databaseStats.totalVerbs) * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-gray-600">Con ejemplos en inglés</p>
                <p className="text-xs text-gray-500">{databaseStats.verbsWithExamples} verbos</p>
              </div>
              
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">
                  {((databaseStats.verbsWithSpanishExamples / databaseStats.totalVerbs) * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-gray-600">Con ejemplos en español</p>
                <p className="text-xs text-gray-500">{databaseStats.verbsWithSpanishExamples} verbos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Updates and Quality Samples */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Updates */}
        {databaseStats?.recentUpdates && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5" />
                Últimas Actualizaciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {databaseStats.recentUpdates.map((update, index) => (
                  <div key={index} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{update.infinitive}</p>
                      <p className="text-sm text-gray-600 truncate max-w-xs">{update.spanishTranslation}</p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatTimeAgo(update.updatedAt)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Translation Quality Samples */}
        {translationSamples.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Muestras de Calidad
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {translationSamples.slice(0, 3).map((sample, index) => (
                  <div key={index} className="border-l-4 border-green-500 pl-4">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-gray-900">{sample.infinitive}</p>
                      <Badge variant="outline" className="text-xs">{sample.level}</Badge>
                    </div>
                    
                    <div className="text-sm space-y-1">
                      <div>
                        <span className="text-gray-500">Antes:</span> 
                        <span className="text-red-600 line-through ml-1">{sample.oldTranslation}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Ahora:</span>
                        <span className="text-green-600 font-medium ml-1">{sample.newTranslation}</span>
                      </div>
                      
                      {sample.examples?.[0] && (
                        <div className="mt-2 text-xs text-gray-600">
                          <p><strong>Ejemplo:</strong> {sample.examples[0]}</p>
                          {sample.spanishExamples?.[0] && (
                            <p><strong>Español:</strong> {sample.spanishExamples[0]}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Estado del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Sistema Operativo</p>
                <p className="text-sm text-green-600">
                  El proceso de corrección está ejecutándose correctamente
                </p>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-800">
              Activo
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
