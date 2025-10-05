
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Bell,
  BellRing,
  Check,
  X,
  Star,
  Trophy,
  BookOpen,
  MessageCircle,
  Gift,
  Zap,
  Clock,
  AlertCircle,
  CheckCircle,
  Info,
  Trash2,
  MoreVertical
} from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'achievement' | 'reminder' | 'update' | 'system' | 'congratulation';
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
  icon?: React.ReactNode;
}

interface NotificationsClientProps {
  onClose?: () => void;
  className?: string;
}

export function NotificationsClient({ onClose, className }: NotificationsClientProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: '¡Nuevo logro desbloqueado!',
      message: 'Has completado 7 días seguidos de estudio. ¡Sigue así!',
      type: 'achievement',
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      read: false,
      actionUrl: '/profile',
      actionText: 'Ver logros',
      icon: <Trophy className="w-5 h-5 text-yellow-400" />
    },
    {
      id: '2',
      title: 'Nuevas palabras agregadas',
      message: '50 nuevas palabras de nivel B2 han sido agregadas al diccionario',
      type: 'update',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      read: false,
      actionUrl: '/dictionary',
      actionText: 'Explorar',
      icon: <BookOpen className="w-5 h-5 text-blue-400" />
    },
    {
      id: '3',
      title: 'Recordatorio de estudio',
      message: 'Es hora de tu sesión de estudio diaria. ¡No rompas tu racha!',
      type: 'reminder',
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      read: true,
      actionUrl: '/dashboard',
      actionText: 'Estudiar ahora',
      icon: <Clock className="w-5 h-5 text-purple-400" />
    },
    {
      id: '4',
      title: '¡Felicitaciones!',
      message: 'Has aprendido 250 palabras nuevas. ¡Eres increíble!',
      type: 'congratulation',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      read: true,
      actionUrl: '/profile',
      actionText: 'Ver estadísticas',
      icon: <Star className="w-5 h-5 text-pink-400" />
    },
    {
      id: '5',
      title: 'Actualización del sistema',
      message: 'Nuevas funciones de pronunciación con IA disponibles',
      type: 'system',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
      read: true,
      actionUrl: '/tutor',
      actionText: 'Probar ahora',
      icon: <MessageCircle className="w-5 h-5 text-green-400" />
    }
  ]);

  const [filter, setFilter] = useState<string>('all');

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'read') return notif.read;
    return true;
  });

  const unreadCount = notifications.filter(notif => !notif.read).length;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'achievement': return 'bg-yellow-600/20 text-yellow-300 border-yellow-500/30';
      case 'reminder': return 'bg-purple-600/20 text-purple-300 border-purple-500/30';
      case 'update': return 'bg-blue-600/20 text-blue-300 border-blue-500/30';
      case 'system': return 'bg-green-600/20 text-green-300 border-green-500/30';
      case 'congratulation': return 'bg-pink-600/20 text-pink-300 border-pink-500/30';
      default: return 'bg-gray-600/20 text-gray-300 border-gray-500/30';
    }
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Ahora mismo';
    if (minutes < 60) return `Hace ${minutes}m`;
    if (hours < 24) return `Hace ${hours}h`;
    return `Hace ${days}d`;
  };

  return (
    <div className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg shadow-2xl ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BellRing className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Notificaciones</h3>
            {unreadCount > 0 && (
              <Badge className="bg-red-600 text-white text-xs">
                {unreadCount}
              </Badge>
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
            Todas ({notifications.length})
          </Button>
          <Button
            variant={filter === 'unread' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('unread')}
            className={filter === 'unread' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}
          >
            No leídas ({unreadCount})
          </Button>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-purple-400 hover:text-purple-300 ml-auto"
            >
              <Check className="w-4 h-4 mr-1" />
              Marcar todas
            </Button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        <AnimatePresence>
          {filteredNotifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-8 text-center"
            >
              <Bell className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">
                {filter === 'unread' ? 'No hay notificaciones sin leer' : 'No hay notificaciones'}
              </p>
            </motion.div>
          ) : (
            filteredNotifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors ${
                  !notification.read ? 'bg-purple-500/5 border-l-2 border-l-purple-500' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {notification.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className={`text-sm font-medium ${!notification.read ? 'text-white' : 'text-gray-300'}`}>
                          {notification.title}
                        </h4>
                        <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge className={getTypeColor(notification.type)}>
                            {notification.type === 'achievement' && 'Logro'}
                            {notification.type === 'reminder' && 'Recordatorio'}
                            {notification.type === 'update' && 'Actualización'}
                            {notification.type === 'system' && 'Sistema'}
                            {notification.type === 'congratulation' && 'Felicitación'}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {getTimeAgo(notification.timestamp)}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-1 ml-2">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="text-purple-400 hover:text-purple-300 p-1"
                            title="Marcar como leída"
                          >
                            <Check className="w-3 h-3" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                          className="text-red-400 hover:text-red-300 p-1"
                          title="Eliminar"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Action Button */}
                    {notification.actionUrl && notification.actionText && (
                      <div className="mt-3">
                        <Button
                          size="sm"
                          onClick={() => {
                            markAsRead(notification.id);
                            window.location.href = notification.actionUrl!;
                          }}
                          className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30"
                        >
                          {notification.actionText}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      {filteredNotifications.length > 0 && (
        <div className="p-4 border-t border-white/10 text-center">
          <Button
            variant="ghost"
            size="sm"
            className="text-purple-400 hover:text-purple-300"
            onClick={() => window.location.href = '/notifications'}
          >
            Ver todas las notificaciones
          </Button>
        </div>
      )}
    </div>
  );
}

// Hook for managing notifications globally
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);

    // Show browser notification if supported
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico'
      });
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => {
        if (notif.id === id && !notif.read) {
          setUnreadCount(count => count - 1);
          return { ...notif, read: true };
        }
        return notif;
      })
    );
  };

  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    clearAll
  };
}
