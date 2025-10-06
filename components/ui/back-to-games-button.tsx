
'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Gamepad2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface BackToGamesButtonProps {
  onClick: () => void;
  className?: string;
}

export function BackToGamesButton({ onClick, className = '' }: BackToGamesButtonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Button
        onClick={onClick}
        variant="outline"
        className={`
          fixed top-4 left-4 z-50
          bg-gradient-to-r from-purple-600 to-blue-600 
          hover:from-purple-700 hover:to-blue-700
          text-white font-semibold
          border-2 border-white/30
          shadow-lg hover:shadow-xl
          transition-all duration-300
          backdrop-blur-sm
          ${className}
        `}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        <Gamepad2 className="w-4 h-4 mr-2" />
        Volver a Juegos
      </Button>
    </motion.div>
  );
}
